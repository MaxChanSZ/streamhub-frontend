import { Button } from "@/components/shadcn/ui/button.tsx";
import logo from "/streamhub-logo.svg";
import React, { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import WatchPartyPage from "./WatchPartyPage";

interface LandingPageProps {
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const LandingPage: React.FC<LandingPageProps> = () => {
  const [optionSelected, setOptionSelected] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const div =
    "bg-[#08081d] h-screen w-screen flex flex-col items-center justify-center";
  const buttonTextFormat = "text-base mx-2 px-4 py-1 font-alatsi";
  const handleButtonClick = (option: string) => {
    if (optionSelected === option) return; // Avoid re-selecting the same option
    setTransitioning(true);
    setTimeout(() => {
      setOptionSelected(option);
      setTransitioning(false);
    }, 300); // Match the timeout with the transition duration
  };

  const renderContent = () => {
    switch (optionSelected) {
      case "login":
        return <LoginPage />;
      case "register":
        return <RegisterPage />;
      case "watch":
        return <WatchPartyPage />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className={div}>
        <img src={logo} alt="StreamHub Logo" className="py-2" />
        <div
          className={`text-white transition-all duration-300 ${transitioning ? "" : "opacity-100"}`}
        >
          <div className="py-4">
            <Button
              onClick={() => handleButtonClick("login")}
              variant="ghost"
              className={buttonTextFormat}
            >
              Login
            </Button>
            <Button
              variant="ghost"
              className={buttonTextFormat}
              onClick={() => handleButtonClick("register")}
            >
              Register
            </Button>
            <Button
              variant="ghost"
              className={buttonTextFormat}
              onClick={() => handleButtonClick("watch")}
            >
              Join a Watch Party
            </Button>
          </div>
        </div>
        <div
          className={`flex items-center justify-center transition-opacity duration-300 ${
            transitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {renderContent()}
        </div>
      </div>
      <p className="text-white text-center">{optionSelected}</p>
    </>
  );
};

export default LandingPage;
