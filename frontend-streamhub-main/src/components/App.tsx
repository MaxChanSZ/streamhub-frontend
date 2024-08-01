import React, { useState } from "react";
import ReactDOMRun from "./ReactDOMRun";
import LandingPage from "@/pages/LandingPage";

const App = () => {
  const [login, setLogin] = useState(false);
  if (login) {
    return (
      <div>
        <ReactDOMRun login={login} setLogin={setLogin} />
      </div>
    );
  } else {
    return <LandingPage login={login} setLogin={setLogin} />;
  }
};

export default App;
