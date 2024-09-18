import LiveChat from "@/components/LiveChat";
import { useState } from "react";

const TestPage = () => {
  const [roomID, setRoomID] = useState("");
  return <LiveChat roomID={roomID} setRoomID={setRoomID} />;
};

export default TestPage;
