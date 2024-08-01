import VideoJS from "@/components/VideoJS";

interface WatchPageProps {
  videoSource: string;
}

const WatchPage = ( {videoSource} : WatchPageProps ) => {

  const videoJsOptions = {
    sources: [
      {
        // replace src with videoSource once that functionality has been created
        src: "http://localhost:8080/hls/test2/output.m3u8",
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
