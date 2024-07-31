import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";

import RootRun from "@/pages/RootRun.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootRun></RootRun>
  </React.StrictMode>,
);
