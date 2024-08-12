import * as React from "react";
import videojs from "video.js";
import "videojs-contrib-quality-levels";
import "videojs-http-source-selector";

// Styles
import "video.js/dist/video-js.css";

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

const VideoJS: React.FC<IVideoPlayerProps> = ({ options }) => {
  const videoNode = React.useRef<HTMLVideoElement>(null);
  const playerRef = React.useRef<any>();
  let player: any;

  const playVideo = () => {
    if (player) {
      player.play();
    } else {
      console.log('Player is not ready yet.');
    }
  };

  React.useEffect(() => {
    console.log("Initializing Video.js player");
    console.log("Video node:", videoNode.current);
    if (!playerRef.current) {
      player = playerRef.current = videojs(videoNode.current ? videoNode.current : "", {
        ...initialOptions,
        ...options
      }).ready(function() {
        console.log('onPlayerReady', this);
        console.log('my players', videojs.getPlayers());
        //console.log(player.current.qualityLevels());
        playerRef.current = this;
        player = this;
      
        player.on('play', () => {
          console.log("Player is played at " + player.currentTime());
        });
      
        player.on('pause', () => {
          console.log("Player is paused at " + player.currentTime());
        });

        player.on('seeked', () => {
          console.log("Player seeked");
        });
      });
    }

    return () => {
      if (player) {
        console.log("Disposing player");
        //player.dispose();
      }
    };
  }, [options]);


  return (
    <div>
        <video ref={videoNode} className="video-js vjs-big-play-centered" />
        <button onClick={playVideo}>Play</button>
    </div>
  );
};

export default VideoJS;