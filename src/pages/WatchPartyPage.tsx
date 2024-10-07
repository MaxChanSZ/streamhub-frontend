import LiveChat from "@/components/LiveChat";
import VideoJSSynced from "@/components/VideoJSSynced";
import { useState } from "react";
import { useLocation, useParams } from "react-router";

const WatchPartyPage = () => {
  const params = useParams();

  let location = useLocation();
  const data = location.state;
  const isHost = data.isHost;
  console.log("User is host: " + isHost);
  console.log("Video url is: " + data.videoSource);

  const sessionId = params.sessionId ? params.sessionId.toString() : "1";

  const videoJsOptions = {
    sources: [
      {
        src: data.videoSource,
        type: "application/x-mpegURL",
      },
    ],
  };

  const [roomID, setRoomID] = useState(sessionId);

  return (
    <div className="grid grid-cols-1 gap-y-2 md:grid-cols-4 md:gap-x-4 ">
      <div className="col-span-3 min-h-80">
        <VideoJSSynced
          options={videoJsOptions}
          roomID={roomID}
          setRoomID={setRoomID}
          isHost={isHost}
        />
      </div>
      <div className="col-span-1">
        <LiveChat roomID={roomID} />
      </div>
    </div>
  );
};

export default WatchPartyPage;


