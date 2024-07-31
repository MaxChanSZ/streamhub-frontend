import { Outlet, Link } from "react-router-dom";
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
import { Button } from "@/components/shadcn/ui/button";
import logo from "/public/streamhub-logo.svg";

const Navbar = () => {
  const isLoggedIn = false; // verify with backend later

  const buttonTextFormat = "text-base";

  const conditionalComponent = () => {
    if (isLoggedIn) {
      return (
        <NavigationMenuItem>
          <Button variant="secondary" asChild>
            <Link to={`/watch/one-piece`}>View Series</Link>
          </Button>
        </NavigationMenuItem>
      );
    } else {
      return <p className="text-slate-400 underline italic">Not Logged In</p>;
    }
  };

  return (
    <NavigationMenu className="font-alatsi text-white">
      <div className="pl-20 pr-0 max-w-64">
        <img src={logo} alt="StreamHub Logo" />
      </div>

      <NavigationMenuList className="px-2 py-4 flex justify-center">
        <NavigationMenuItem>
          <Button variant="ghost" className={buttonTextFormat} asChild>
            <Link to={`/register`}>Register</Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button variant="ghost" className={buttonTextFormat} asChild>
            <Link to={`/login`}>Login</Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button variant="ghost" className={buttonTextFormat} asChild>
            <Link to={`/watch-party/one-piece/456`}>Join a Watch Party</Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button variant="ghost" className={buttonTextFormat} asChild>
            <Link to={`/update-profile`}>Update Profile</Link>
          </Button>
        </NavigationMenuItem>
        {conditionalComponent()}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const Footer = () => {
  return (
    <div className="h-[7.5vh] bg-black flex justify-center items-center">
      <p className="text-white">© 2024 StreamHub</p>
    </div>
  );
};

const Root = () => {
  return (
    <div className="bg-[#08081d]">
      <Navbar />
      <div className="min-h-[80vh] mx-20 my-4">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Root;
