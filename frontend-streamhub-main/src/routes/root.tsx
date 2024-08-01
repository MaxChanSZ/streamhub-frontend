import { Outlet } from "react-router-dom";
import Navbar from "@/pages/Navbar.tsx";
import React from "react";



const Footer = () => {
    return (
        <div className="h-[7.5vh] bg-black flex justify-center items-center">
            <p className="text-white">Footer Mock</p>
        </div>
    )
}

const Root = () => {
    return (
        <div className="bg-gradient-to-b from-indigo-900 to-neutral-900">
            <Navbar></Navbar>
            <div className="min-h-[80vh] mx-20 my-4 border-2">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Root;