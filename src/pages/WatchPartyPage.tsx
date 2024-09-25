import LiveChat from "@/components/LiveChat";
import VideoJSSynced from "@/components/VideoJSSynced";
import { useState } from "react";
import { useParams } from "react-router";

const WatchPartyPage = () => {
  const params = useParams();

  // console.log(params.sessionId);

  const sessionId = params.sessionId ? params.sessionId.toString() : "1";

  const videoJsOptions = {
    sources: [
      {
        // replace src with videoSource once that functionality has been created
        src: "http://localhost:8080/encoded/steamboatwillie_001/master.m3u8",
        type: "application/x-mpegURL",
      },
    ],
  };

  const [roomID, setRoomID] = useState(sessionId);

  const changeRoomID = (newRoomID: string) => {
    if (newRoomID !== roomID) {
      // Clear previous messages
      setRoomID(newRoomID);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {/* roomID input for development only */}
      {/* <form
          className="flex text-center justify-center items-center"
          onSubmit={(event) => {
            event.preventDefault();
            changeRoomID(roomID);
          }}
        >
          <label className="text-xs font-bold">Enter Room ID:</label>
          <input
            type="text"
            value={roomID}
            onChange={(event) => setRoomID(event.target.value.toString())}
            className="text-black text-center mx-4 py-2 px-1 font-semibold grow-0 border-none"
          ></input>

          <Button type="submit" variant="secondary">
            Enter
          </Button>
      </form> */}

      <div className="col-span-3">
        <VideoJSSynced
          options={videoJsOptions}
          roomID={roomID}
          setRoomID={setRoomID}
        />
      </div>

      <LiveChat roomID={roomID} setRoomID={setRoomID} />
    </div>
  );
};

export default WatchPartyPage;


