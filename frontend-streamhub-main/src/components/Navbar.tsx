import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/shadcn/ui/navigation-menu.tsx";
import { Button } from "@/components/shadcn/ui/button.tsx";
import { Link } from "react-router-dom";
import logo from "/streamhub-logo.svg";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "./shadcn/ui/use-toast";

const Navbar = () => {
  const buttonTextFormat = "text-base mx-4";
  const { setIsLoggedIn, user, setUser } = useAppContext();

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
    });
  };

  return (
    <div className="h-[12.5vh] bg-black flex items-center">
      <NavigationMenu className="font-alatsi text-white">
        <div className="pl-20 pr-0 max-w-64 mr-4">
          <Link to={`/`}>
            <img src={logo} alt="StreamHub Logo" />
          </Link>
        </div>

        <NavigationMenuList className="py-4 flex justify-center">
          <NavigationMenuItem>
            <Button variant="ghost" className={buttonTextFormat} asChild>
              <Link to={`/watch-party/1456`}>Create a Watch Party</Link>
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant="ghost" className={buttonTextFormat} asChild>
              <Link to={`/update-profile`}>Update Profile</Link>
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant="ghost" className={buttonTextFormat} asChild>
              <Link to={`/register`}>Register Account</Link>
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button
              variant="destructive"
              className={buttonTextFormat}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <span className="">
        <p className="text-white font-alatsi text-semibold text-lg">
          Hello {user?.username}
        </p>
      </span>
    </div>
  );
};

export default Navbar;
