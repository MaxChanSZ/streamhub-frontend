import React from 'react';
import ReactDOMRun from "../routes/ReactDOMRun";
import LandingPage from "@/pages/LandingPage";
import { useAppContext } from "@/contexts/AppContext";

const App: React.FC = () => {
  const { isLoggedIn } = useAppContext();

  if (isLoggedIn) {
    return (
      <div>
        <ReactDOMRun />
      </div>
    );
  } else {
    return <LandingPage />;
  }
};

export default App;



