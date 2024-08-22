import LiveChat from "@/components/LiveChat";

interface Message {
  content: string;
  sender: string;
}

const TestPage = () => {
  return <LiveChat />;
};

export default TestPage;
