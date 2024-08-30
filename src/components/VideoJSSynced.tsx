import * as React from "react";
import videojs from "video.js";
import "videojs-contrib-quality-levels";
import "videojs-http-source-selector";

// Styles
import "video.js/dist/video-js.css";
import { useState } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { useAppContext } from "@/contexts/AppContext";

interface IVideoPlayerProps {
  options: videojs.PlayerOptions;
}

const initialOptions: any = {
  controls: true,
  aspectRatio: "16:9",
  controlBar: {
    volumePanel: {
      inline: false
    }
  },
  plugins: {
    httpSourceSelector: { default: "low" }
  }
};

export interface VideoSyncAction {
  actionType: string;
  actionTime: number;
  videoTime: number;
  sessionId: string;
  sender: string;
}

const VideoJS: React.FC<IVideoPlayerProps> = ({ options }) => {
  const videoNode = React.useRef<HTMLVideoElement>(null);
  const playerRef = React.useRef<any>();
  let player: any;
  let isReceived: boolean = false;
  const { user } = useAppContext();

  // this stomp client will later be accessed by the 
  //const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const sessionId = "1234";
  let stompClient : null | CompatClient = null;

  const playVideo = () => {
    if (player) {
      player.play();
    } else {
      console.log('Player is not ready yet.');
    }
  };


  React.useEffect(() => {
    if (!playerRef.current) {
      player = playerRef.current = videojs(videoNode.current ? videoNode.current : "", {
        ...initialOptions,
        ...options
      }).ready(function() {
        //console.log('onPlayerReady', this);
        //console.log('my players', videojs.getPlayers());
        //console.log(player.current.qualityLevels());
        playerRef.current = this;
        player = this;
        player.autoplay(true);
      
        player.on('play', () => {
          // if this action was one that was received from the websocket, we do not need to broadcast it
          // simply change the value of isReceived back to false
          // else, this is a locally performed action, and needs to be broadcast to the websocket
          if ( isReceived ) {
            console.log("This was a received play command. Now setting isReceived to false");
            isReceived = false;
          } else {
            console.log("Player is played at " + player.currentTime());
            const videoTime = player.currentTime();
            const actionTime = Date.now();
            const action : VideoSyncAction = {
              actionType: "Play",
              actionTime: actionTime,
              videoTime: videoTime,
              sessionId: sessionId,
              sender: user?.username || "anon"
            };
            sendVideoActionMessage(action);
          }
        });
      
        player.on('pause', () => {
          // if this action was one that was received from the websocket, we do not need to broadcast it
          // simply change the value of isReceived back to false
          // else, this is a locally performed action, and needs to be broadcast to the websocket
          if ( isReceived ) {
            console.log("This was a received pause command. Now setting isReceived to false");
            isReceived = false;
          } else {
              console.log("Player is paused at " + player.currentTime());
              const videoTime = player.currentTime();
              const actionTime = Date.now();
              const action : VideoSyncAction = {
                actionType: "Pause",
                actionTime: actionTime,
                videoTime: videoTime,
                sessionId: sessionId,
                sender: user?.username || "anon"
              };
            sendVideoActionMessage(action);
          }
        });

        player.on('seeked', () => {
          console.log("Player seeked");
        });
      });
    }

    return () => {
      if (player) {
        console.log("Disposing player");
        player.dispose();
      }
    };
  }, [options]);

  // Create a web socket connection with the server for video player synchronization
  React.useEffect(() => {
    const socket = new SockJS('http://localhost:8080/video-sync');
    const client = Stomp.over(socket);
    
    // console.log(stompClient);

    client.connect({}, () => {
      // subscribe to room id 1234 for now. will need to modify this based on watchparty session eventually
      const topic = "/topic/video/1234"
      client.subscribe(topic, (videoSyncAction) => {
        const receivedAction : VideoSyncAction = JSON.parse(videoSyncAction.body);
        console.log("Received a message");

        // if this message was actually sent by the current user, we do not need to perform any sync actions
        if (receivedAction.sender === user?.username) {
          console.log("No action needed as this is the sender")
        } else if ( receivedAction.actionType === "Play" ) {
          // Start playing the local player from the correct time
          isReceived = true;
          playVideoFromAction(receivedAction.actionTime, receivedAction.videoTime);
        } else if ( receivedAction.actionType === "Pause" ) {
          // Pause the local player and ensure that it is synced to the host
          isReceived = true;
          pauseVideoFromAction(receivedAction.actionTime, receivedAction.videoTime);
        }
        
      });
      
      // set the stompClient variable of the component to the client we have just created
      //setStompClient(client);
      stompClient = client;
    });

    

    return () => {
      client.disconnect();
    }
  }, []);

  // function to send message to server when user plays, pauses, or forwards the video
  const sendVideoActionMessage = (action: VideoSyncAction) => {
    if ( true ) {
      console.log("Sending message to server");
      stompClient?.send("/app/video", {}, JSON.stringify(action));
    }
  }

  const playVideoFromAction = (actionTime : number, videoTime : number) => {
    const currentTime = Date.now();
    // the delay between when the host performed the action, and when the client receives the action
    // convert milliseconds to seconds
    const timeDeltaToHostAction = ( currentTime - actionTime ) / 1000;

    console.log("Time delta is: " + timeDeltaToHostAction);
    // move player to match host
    const syncedVideoTime = videoTime + timeDeltaToHostAction;
    console.log("synced time is: " +  syncedVideoTime);
    player.currentTime(syncedVideoTime);
    player.play();
  }

  const pauseVideoFromAction = (actionTime : number, videoTime : number) => {
    player.pause();
    player.currentTime(videoTime + ((Date.now() - actionTime) / 1000));
  }



  return (
    <div>
        <video ref={videoNode} className="video-js vjs-big-play-centered" />
        <button onClick={playVideo}>Play</button>
    </div>
  );
};

export default VideoJS;