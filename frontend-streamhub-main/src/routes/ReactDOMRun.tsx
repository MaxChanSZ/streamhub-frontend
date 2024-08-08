import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "@/utils/root";
import ErrorPage from "@/pages/ErrorPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import SeriesPage from "@/pages/SeriesPage.tsx";
import WatchPage from "@/pages/WatchPage.tsx";
import WatchPartyPage from "@/pages/WatchPartyPage.tsx";
import UpdateProfilePage from "@/pages/UpdateProfilePage.tsx";

import RegisterPage from "@/pages/RegisterPage";

interface ReactDOMRunProps {}

const ReactDOMRun: React.FC<ReactDOMRunProps> = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
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
        element: <WatchPage videoSource=""/>,
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
