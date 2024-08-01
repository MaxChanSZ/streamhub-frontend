import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";

import ReactDOMRun from "@/pages/ReactDOMRun.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReactDOMRun></ReactDOMRun>
  </React.StrictMode>
);
