import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "@/utils/root";
import ErrorPage from "@/pages/ErrorPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import SeriesPage from "@/pages/SeriesPage.tsx";
import WatchPage from "@/pages/WatchPage.tsx";
import WatchPartyPage from "@/pages/WatchPartyPage.tsx";
import CreateWatchPartyPage from "@/pages/CreateWatchPartyPage.tsx";
import UpdateProfilePage from "@/pages/UpdateProfilePage.tsx";
import SearchPage from "@/pages/SearchPage";
import RegisterPage from "@/pages/RegisterPage";
import ContactPage from "@/pages/ContactPage.tsx";
import TestPage from "@/pages/TestPage";
import JoinWatchPartyPage from "@/pages/JoinWatchPartyPage";
import { useAppContext } from "@/contexts/AppContext";
import LandingPage from "@/pages/LandingPage";
import { login } from "@/utils/api-client";

interface ReactDOMRunProps {
}

const ReactDOMRun: React.FC<ReactDOMRunProps> = () => {
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
          element: <WatchPage videoSource="" />,
        },
        {
          path: "watch-party/:sessionId",
          element: <WatchPartyPage />,
        },
        {
          path: "create-watch-party",
          element: <CreateWatchPartyPage />,
        },
        {
          path: "join-watch-party",
          element: <JoinWatchPartyPage />,
        },
        {
          path: "update-profile",
          element: <UpdateProfilePage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "search",
          element: <SearchPage />,
        },
      ],
    },
    { path: "test", element: <TestPage /> },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};





export default ReactDOMRun;
