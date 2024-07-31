import React, {useState} from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "@/routes/root.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import SeriesPage from "@/pages/SeriesPage.tsx";
import WatchPage from "@/pages/WatchPage.tsx";
import WatchPartyPage from "@/pages/WatchPartyPage.tsx";
// import Dashboard from "@/pages/Dashboard.tsx";
// import UpdateProfilePage from "@/pages/UpdateProfilePage.tsx";

const RootRun = () => {
    const [login, setLogin] = useState(false);
    if (login) {
        return (
            <div>
                {/*<Navbar></Navbar>*/}
                <RouterProvider router={router} />
            </div>
        )
    } else {
        return (
            <div>
                <p>username:</p><input/>
                <p>password:</p><input/>
                <button onClick={event => setLogin(true)}>Login</button>
            </div>
        )
    }
}
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
            // {
            //     path: "dashboard",
            //     element: <Dashboard />,
            // },
        ],
    },
]);

export default RootRun;