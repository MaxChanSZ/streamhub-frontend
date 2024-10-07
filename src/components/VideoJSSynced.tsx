import * as React from "react";
import videojs from "video.js";
import "videojs-contrib-quality-levels";
import "videojs-http-source-selector";

// Styles
import "video.js/dist/video-js.css";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";

interface IVideoPlayerProps {
  options: videojs.PlayerOptions;
  roomID: string;
  isHost: boolean;
  setRoomID: (roomID: string) => void;
  blockDisposePlayer?: boolean;
}

const initialOptions: any = {
  controls: true,
  aspectRatio: "16:9",
  controlBar: {
    volumePanel: {
      inline: false,
    },
  },
  plugins: {
    httpSourceSelector: { default: "low" },
  },
};

export interface VideoSyncAction {
  actionType: string;
  actionTime: number;
  videoTime: number;
  sessionId: string;
  sender: string;
}

const VideoJSSynced: React.FC<IVideoPlayerProps> = ({
  options,
  roomID,
  isHost,
  setRoomID,
  blockDisposePlayer
}) => {
  const videoNode = React.useRef<HTMLVideoElement>(null);
  const playerRef = React.useRef<any>();
  let player: any;
  let isReceived: boolean = false;
  const sender = Date.now().toString();


  // this stomp client will later be accessed by the
  //const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const sessionId = roomID;
  let stompClient: null | CompatClient = null;

  const playVideo = () => {
    if (player) {
      player.play();
    } else {
      console.log("Player is not ready yet.");
    }
  };

  React.useEffect(() => {
    if (!playerRef.current) {
      console.log(`RoomID is ${roomID}`);
      player = playerRef.current = videojs(
        videoNode.current ? videoNode.current : "",
        {
          ...initialOptions,
          ...options,
        }
      ).ready(function () {
        //console.log('onPlayerReady', this);
        //console.log('my players', videojs.getPlayers());
        //console.log(player.current.qualityLevels());
        playerRef.current = this;
        player = this;
        //player.autoplay(true);

        player.on("play", () => {
          // if this action was one that was received from the websocket, we do not need to broadcast it
          // simply change the value of isReceived back to false
          // else, this is a locally performed action, and needs to be broadcast to the websocket
          if (isReceived) {
            console.log("This was a received play command. Will not broadcast");
            isReceived = false;
          } else {
            const videoTime = player.currentTime();
            const actionTime = Date.now();
            const action: VideoSyncAction = {
              actionType: "Play",
              actionTime: actionTime,
              videoTime: videoTime,
              sessionId: sessionId,
              sender: sender,
            };
            sendVideoActionMessage(action);
          }
        });

        player.on("pause", () => {
          // if this action was one that was received from the websocket, we do not need to broadcast it
          // simply change the value of isReceived back to false
          // else, this is a locally performed action, and needs to be broadcast to the websocket
          if (isReceived) {
            console.log(
              "This was a received pause command. Will not broadcast"
            );
            isReceived = false;
          } else {
            const videoTime = player.currentTime();
            const actionTime = Date.now();
            const action: VideoSyncAction = {
              actionType: "Pause",
              actionTime: actionTime,
              videoTime: videoTime,
              sessionId: sessionId,
              sender: sender,
            };
            sendVideoActionMessage(action);
          }
        });

        player.on("seeked", () => {
          console.log("Player seeked");
        });
      });
    }

    return () => {
      if (player && !blockDisposePlayer) {
        console.log("Disposing player");
        player.dispose();
        playerRef.current = null;
        //videoNode.current = null;
      }
    };
  }, [options, roomID]);

  // Create a web socket connection with the server for video player synchronization
  React.useEffect(() => {
    const userToken = localStorage.getItem("watchparty-token");
    
    let token = userToken?.substring(1, userToken.length - 1);
    const socket = new SockJS(`http://localhost:8080/video-sync?token=${token}&roomID=${roomID}`);
    const client = Stomp.over(socket);

    // console.log(stompClient);
    

    client.connect(
      { Authorization: `Bearer ${userToken}` }, 
      () => {
      // subscribe to room id 1234 for now. will need to modify this based on watchparty session eventually
      const topic = `/topic/video/${roomID}`;
      client.subscribe(topic, (videoSyncAction) => {
        const receivedAction: VideoSyncAction = JSON.parse(
          videoSyncAction.body
        );
        console.log("Received a message");

        // if this message was actually sent by the current user, we do not need to perform any sync actions
        if (receivedAction.sender === sender) {
          console.log("No need to act as this was my own action");
        } else if (receivedAction.actionType === "Play") {
          // Start playing the local player from the correct time
          isReceived = true;
          playVideoFromAction(
            receivedAction.actionTime,
            receivedAction.videoTime
          );
        } else if (receivedAction.actionType === "Pause") {
          // Pause the local player and ensure that it is synced to the host
          isReceived = true;
          pauseVideoFromAction(
            receivedAction.actionTime,
            receivedAction.videoTime
          );
        }
      });

      // set the stompClient variable of the component to the client we have just created
      //setStompClient(client);
      stompClient = client;
    });

    return () => {
      client.disconnect();
    };
  }, [roomID]);

  // function to send message to server when user plays, pauses, or forwards the video
  const sendVideoActionMessage = (action: VideoSyncAction) => {
    // only send video actions if the individual is a host
    // change this condition to 'isHost'
    if (true) {
      console.log("Host is sending message to server");
      stompClient?.send("/app/video", {}, JSON.stringify(action));
    }
  };

  const playVideoFromAction = (actionTime: number, videoTime: number) => {
    console.log("Playing video from sync message");
    const currentTime = Date.now();
    // the delay between when the host performed the action, and when the client receives the action
    // convert milliseconds to seconds
    const timeDeltaToHostAction = (currentTime - actionTime) / 1000;
    // move player to match host
    const syncedVideoTime = videoTime + timeDeltaToHostAction;
    player.currentTime(syncedVideoTime);
    player.play();
  };

  const pauseVideoFromAction = (actionTime: number, videoTime: number) => {
    console.log("Pausing video from sync message");
    player.pause();
    player.currentTime(videoTime + (Date.now() - actionTime) / 1000);
  };

  return (
    <div className=" w-full ">
      <video ref={videoNode} className="video-js vjs-big-play-centered min-h-96" />
    </div>
  );
};

export default VideoJSSynced;
