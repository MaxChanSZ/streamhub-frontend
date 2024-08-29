import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import profileIcon from "/profileicon.svg";
import profileIconBg from "/profileiconbg.svg";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "./shadcn/ui/use-toast";
import { Button } from "@/components/shadcn/ui/button.tsx";

const NavbarProfile = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const { setIsLoggedIn, user, setUser } = useAppContext();

    const handleLogout = () => {
        try {
            setUser(null);
            setIsLoggedIn(false);
            toast({
                title: "Logged out",
            });
            setIsMenuOpen(false); // Close the menu after logout
        } catch (error) {
            console.error(`Error during logout: ${error}`);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(prevState => !prevState);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            menuRef.current && !menuRef.current.contains(event.target as Node) &&
            iconRef.current && !iconRef.current.contains(event.target as Node)
        ) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative flex items-center pl-2 pr-2 sm:pl-6 sm:pr-6">
            <div
                ref={iconRef}
                style={{ width: '50px', height: '50px' }}
                onClick={toggleMenu}
                className="relative cursor-pointer"
            >
                <img
                    src={profileIcon}
                    alt="Profile Icon"
                    style={{ width: '50px', height: '50px' }}
                    className="absolute top-0 left-0"
                />
                <img
                    src={profileIconBg}
                    alt="Profile Icon Background"
                    style={{ width: '50px', height: '50px' }}
                    className="absolute top-0 left-0"
                />
            </div>

            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className="absolute mt-2 w-48 bg-black text-white shadow-lg rounded-md z-50"
                    style={{ top: '100%', right: 0, transform: 'translateX(0%)', backgroundColor: 'rgb(2, 8, 23)' }}
                >
                    <p className="text-white font-alatsi font-semibold text-lg px-4 py-2 border-b border-gray-600">
                        Hello {user?.username}
                    </p>
                    <Button variant="ghost" asChild className="w-full text-left px-4 py-2 text-white">
                        <Link to={`/update-profile`} onClick={() => setIsMenuOpen(false)}>Update Profile</Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full text-left px-4 py-2 text-white">
                        <Link to={`/contact`} onClick={() => setIsMenuOpen(false)}>TestButton</Link>
                    </Button>
                    <Button variant="destructive" onClick={handleLogout} className="w-full text-left px-4 py-2 text-white">
                        Logout
                    </Button>
                </div>
            )}
        </div>
    );
};

export default NavbarProfile;
