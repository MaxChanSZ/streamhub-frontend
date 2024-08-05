import VideoJS from "@/components/VideoJS";
import VideoPlayer from "@/components/VideoPlayer";

interface WatchPageProps {
  videoSource: string;
}

type videoOptions = {
  url: string
};

const WatchPage = ( {videoSource} : WatchPageProps ) => {

  const videoJsOptions = {
    sources: [
      {
        // replace src with videoSource once that functionality has been created
        src: "http://localhost:8080/encoded/steamboatwillie_001/master.m3u8",
        type: "application/x-mpegURL"
      }
    ]
  };

  return (
    <>
      <h3>Watch Video</h3>
    <VideoJS options={videoJsOptions} />
    </>
  );
};

export default WatchPage;
