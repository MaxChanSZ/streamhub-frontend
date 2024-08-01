import React, { useState } from "react";

interface LandingPageProps {
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const LandingPage: React.FC<LandingPageProps> = ({ login, setLogin }) => {
  const div = "bg-[#08081d] size-full";
  return (
    <div>
      <p>Landing Page</p>
      <div>
        <p>username:</p>
        <input />
        <p>password:</p>
        <input />
        <button onClick={() => setLogin(true)}>Login</button>
      </div>
    </div>
  );
};

export default LandingPage;
