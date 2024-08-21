import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { IFrame, Stomp } from "@stomp/stompjs";
import { Button } from "@/components/shadcn/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import LiveChat from "@/components/LiveChat";

interface Message {
  content: string;
  sender: string;
}

const TestPage = () => {
  return <LiveChat />;
};

export default TestPage;
