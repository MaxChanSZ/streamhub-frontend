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
import { Input } from "@/components/shadcn/ui/input.tsx"
import { Link } from "react-router-dom";
import profileIcon from "/profileicon.svg";
import profileIconBg from "/profileiconbg.svg";
import logo from "/streamhub-logo.svg";


const Navbar = () => {
  const buttonTextFormat = "text-base mx-4";

  return (
      <div className="h-[12.5vh] bg-black flex">
        <NavigationMenu className="font-alatsi text-white">
          <div className="pl-20 pr-0 max-w-64 mr-4">
            <Link to={`/`}>
              <img src={logo} alt="StreamHub Logo"/>
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
                <Link to={`/contact`}>Contact</Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center space-x-8">
          <Input
              type="search"
              placeholder="Search"
              className="w-full max-w-md bg-black text-white placeholder-white "
              style={{ width: '300px' }} />
          <div className="relative flex items-center pl-8 pr-20">
            <div style={{width: '50px', height: '50px'}} className="relative">
              <img src={profileIcon} alt="Profile Icon Background" style={{width: '50px', height: '50px'}}
                   className="absolute top-0 left-0"/>
              <img src={profileIconBg} alt="Profile Icon" style={{width: '50px', height: '50px'}}
                   className="absolute top-0 left-0"/>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Navbar;
