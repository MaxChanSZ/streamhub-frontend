import * as React from "react";
import videojs from "video.js";
import * as QualityLevels from "videojs-contrib-quality-levels";

// Styles
import "video.js/dist/video-js.css";

interface IVideoPlayerProps {
  options: videojs.PlayerOptions;
}

const initialOptions: videojs.PlayerOptions = {
  controls: true,
  aspectRatio: "16:9",
  controlBar: {
    volumePanel: {
      inline: false
    }
  }
};

const VideoJS: React.FC<IVideoPlayerProps> = ({ options }) => {
  const videoNode = React.useRef<HTMLVideoElement>(null);
  const player = React.useRef<videojs.Player>();
  console.log(options);

  React.useEffect(() => {
    console.log("Initializing Video.js player");
    console.log("Video node:", videoNode.current);
    player.current = videojs(videoNode.current, {
      ...initialOptions,
      ...options
    }).ready(function() {
      console.log('onPlayerReady', this);
      //console.log(player.current.qualityLevels());
      if (player.current) {
        console.log(player.current.duration());
      } else {
        console.log("Player is null");
      }
    });

    if (player.current) {
        console.log(player.current.duration);
    } else {
        console.log("Player is null");
    }

    return () => {
      if (player.current) {
        console.log("Disposing player");
        player.current.dispose();
      }
    };
  }, [options, videoNode]);


  const changeVideo = () => {
    console.log("Changing Video")
    //options.src = "http://localhost:8080/hls/test/output.m3u8";
    const newOptions = options;
    newOptions.src = "http://localhost:8080/hls/test/output.m3u8";

    options = newOptions;
  } 

  return (
    <>
        <video ref={videoNode} className="video-js vjs-big-play-centered" />
        <button onClick={ changeVideo }>
            Change Video
        </button>
    </>
  );
};

export default VideoJS;