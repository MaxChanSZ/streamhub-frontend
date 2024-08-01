import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "@/routes/root.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import SeriesPage from "@/pages/SeriesPage.tsx";
import WatchPage from "@/pages/WatchPage.tsx";
import WatchPartyPage from "@/pages/WatchPartyPage.tsx";
// import Dashboard from "@/pages/Dashboard.tsx";
import UpdateProfilePage from "@/pages/UpdateProfilePage.tsx";
import LandingPage from "../pages/LandingPage";
import RegisterPage from "@/pages/RegisterPage";

interface ReactDOMRunProps {
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReactDOMRun: React.FC<ReactDOMRunProps> = ({ login, setLogin }) => {
  if (login) {
    return (
      <>
        <RouterProvider router={router} />
      </>
    );
  } else {
    return (
      <>
        <LandingPage login={login} setLogin={setLogin} />
      </>
    );
  }
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "watch/:seriesId",
        element: <SeriesPage />,
      },
      {
        path: "watch/:seriesId/:episodeId",
        element: <WatchPage />,
      },
      {
        path: "watch-party/:sessionId",
        element: <WatchPartyPage />,
      },
      {
        path: "update-profile",
        element: <UpdateProfilePage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
]);

export default ReactDOMRun;
