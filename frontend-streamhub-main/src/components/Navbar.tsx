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
import TestApiButton from "@/components/TestApiButton";

const Navbar = () => {
  const buttonTextFormat = "text-base";

  return (
    <div className="h-[12.5vh] bg-black flex">
      <NavigationMenu className="font-alatsi text-white">
        <div className="pl-20 pr-0 max-w-64">
          <Link to={`/`}>
            <img src={logo} alt="StreamHub Logo" />
          </Link>
        </div>
        <TestApiButton />

        <NavigationMenuList className="px-2 py-4 flex justify-center">
          <NavigationMenuItem>
            <Button variant="ghost" className={buttonTextFormat} asChild>
              <Link to={`/watch-party/1456`}>Join a Watch Party</Link>
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant="ghost" className={buttonTextFormat} asChild>
              <Link to={`/update-profile`}>Update Profile</Link>
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Navbar;
