import { Button } from "@/components/shadcn/ui/button.tsx";
import logo from "/streamhub-logo.svg";
import React from "react";

interface LandingPageProps {
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const LandingPage: React.FC<LandingPageProps> = ({ login, setLogin }) => {
  const div =
    "bg-[#08081d] h-screen w-screen flex flex-col items-center justify-center";
  const buttonTextFormat = "text-base mx-2 px-4 py-1 font-alatsi";
  return (
    <div className={div}>
      <img src={logo} alt="StreamHub Logo" className="py-2" />
      <div className="text-white">
        <div className="py-4">
          <Button
            onClick={() => setLogin(true)}
            variant="ghost"
            className={buttonTextFormat}
          >
            Login
          </Button>
          <Button variant="ghost" className={buttonTextFormat}>
            Register
          </Button>
          <Button variant="ghost" className={buttonTextFormat}>
            Join a Watch Party
          </Button>
          {/* TODO: Add button routing  */}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
