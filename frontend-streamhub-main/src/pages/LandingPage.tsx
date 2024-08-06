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
  const { setLogin, setUser } = useAppContext();
  const [optionSelected, setOptionSelected] = useState("none");

  const div =
    "bg-[#08081d] h-screen w-screen flex flex-col items-center justify-center";
  const buttonTextFormat = "text-base mx-2 px-4 py-1 font-alatsi";
  const buttonClick = (option: string) => {
    setOptionSelected(option);
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

  const handleLogin = () => {
    // Simulate login process
    const userData = {
      id: 12345,
      username: "may_lwin",
      email: "john_doe@example.com",
    };
    // TODO: add request to backend
    setOptionSelected("login");
    setUser(userData);
    setLogin(true);
  };

  return (
    <>
      <div className={div}>
        <img src={logo} alt="StreamHub Logo" className="py-2" />
        <div className="text-white">
          <div className="py-4">
            <Button
              onClick={() => buttonClick("login")}
              variant="ghost"
              className={buttonTextFormat}
            >
              Login
            </Button>
            <Button
              variant="ghost"
              className={buttonTextFormat}
              onClick={() => buttonClick("register")}
            >
              Register
            </Button>
            <Button
              variant="ghost"
              className={buttonTextFormat}
              onClick={() => buttonClick("watch")}
            >
              Join a Watch Party
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {renderContent()}
        </div>
      </div>
      <p className="text-white text-center">{optionSelected}</p>
    </>
  );
};

export default LandingPage;
