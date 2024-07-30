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

const Navbar = () => {
  const isLoggedIn = false; // verify with backend later

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
      return <p className="text-white">Not Logged In</p>;
    }
  };

  return (
    <NavigationMenu className="">
      <NavigationMenuList className="px-2 py-4 flex justify-center">
        <NavigationMenuItem>
          <Button variant="secondary" asChild>
            <Link to={`/register`}>Register</Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button variant="secondary" asChild>
            <Link to={`/login`}>Login</Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button variant="secondary" asChild>
            <Link to={`/watch-party/one-piece/456`}>Join a Watch Party</Link>
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
      <p className="text-white">Footer Mock</p>
    </div>
  );
};

const Root = () => {
  return (
    <div className="bg-gradient-to-b from-indigo-900 to-neutral-900">
      <Navbar />
      <div className="min-h-[80vh] mx-20 my-4 border-2">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Root;
