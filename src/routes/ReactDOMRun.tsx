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
import PollResultPage from "@/pages/PollResultPage.tsx";
import SendEmailPage from "@/pages/SendEmailPage.tsx";
import { ProtectedRoute } from "./ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import { useAppContext } from "@/contexts/AppContext";
import JoinWatchPartyPage from "@/pages/JoinWatchPartyPage";

interface ReactDOMRunProps {}

const ReactDOMRun: React.FC<ReactDOMRunProps> = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

// const { isLoggedIn, setIsLoggedIn } = useAppContext();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "watch/:seriesId",
        element: (
          <ProtectedRoute>
            <SeriesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "watch/:seriesId/:episodeId",
        element: <WatchPage videoSource="" />,
      },
      {
        path: "watch-party/:sessionId",
        element: (
          <ProtectedRoute>
            <WatchPartyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-watch-party",
        element: (
          <ProtectedRoute>
            <CreateWatchPartyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "send-email",
        element: (
          <ProtectedRoute>
            <SendEmailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "update-profile",
        element: (
          <ProtectedRoute>
            <UpdateProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "pollResults",
        element: (
          <ProtectedRoute>
            <PollResultPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "contact",
        element: (
          <ProtectedRoute>
            <ContactPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "join-watch-party",
        element: <JoinWatchPartyPage />,
      },
    ],
  },
  {
    path: "*",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
]);

export default ReactDOMRun;
