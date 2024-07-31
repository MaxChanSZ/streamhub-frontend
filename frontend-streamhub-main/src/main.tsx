import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@/index.css";
import Root from "@/routes/root";
import ErrorPage from "@/pages/ErrorPage";
import HomePage from "@/pages/HomePage";
import SeriesPage from "@/pages/SeriesPage";
import WatchPage from "@/pages/WatchPage";
import WatchPartyPage from "@/pages/WatchPartyPage";
import RootRun from "@/pages/RootRun.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootRun></RootRun>
  </React.StrictMode>,
);
