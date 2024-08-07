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

  const div = `bg-[#08081d] h-screen w-screen flex flex-col items-center justify-center transition-all duration-300 `;
  const buttonTextFormat = "text-base mx-2 px-4 py-1 font-alatsi";
  const TRANSITION_DURATION = 300;

  /**
   * Handles the button click event.
   *
   * @param {string} option - The option selected by the user.
   * @return {void}
   */
  const handleButtonClick = (option: string) => {
    // If the same option is selected, do nothing
    if (optionSelected === option) return;

    // Set the transitioning state to true to indicate that a transition is in progress
    setTransitioning(true);

    try {
      // After a delay of the transition duration, update the selected option and reset the transitioning state
      setTimeout(() => {
        setOptionSelected(option);
        setTransitioning(false);
      }, TRANSITION_DURATION);
    } catch (error) {
      // Log and handle any errors that occur during the transition
      console.error(`Error in handleButtonClick: ${error}`);
      setTransitioning(false);
    }
  };

  /**
   * Renders the content based on the selected option.
   *
   * @return {JSX.Element | null} The rendered content or null if no option is selected.
   */
  const renderContent = () => {
    // Using a switch statement to render different components based on the selected option.
    // Returns null if no option is selected.
    switch (optionSelected) {
      case "login":
        // Render the LoginPage component if the option is "login".
        return <LoginPage />;
      case "register":
        // Render the RegisterPage component if the option is "register".
        return <RegisterPage />;
      case "watch":
        // Render the WatchPartyPage component if the option is "watch".
        return <WatchPartyPage />;
      default:
        // Return null if no option is selected.
        return null;
    }
  };

  return (
    <div className={div}>
      <div
        className={`flex flex-col transition-all duration-300 ${optionSelected === null ? " " : " "}`}
      >
        <img src={logo} alt="StreamHub Logo" className={`py-2 `} />
        <div className={`text-white `}>
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
      </div>

      <div
        className={`w-7/12 items-center justify-center transition-opacity duration-300 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default LandingPage;
