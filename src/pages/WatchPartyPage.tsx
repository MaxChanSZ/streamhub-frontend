import LiveChat from "@/components/LiveChat";
import { useState } from "react";

const WatchPartyPage = () => {
  const [roomID, setRoomID] = useState("");
  return (
    <div className="flex">
      <LiveChat roomID={roomID} setRoomID={setRoomID} />
    </div>
  );
};

export default WatchPartyPage;
