import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/shadcn/ui/navigation-menu.tsx";
import { Button } from "@/components/shadcn/ui/button.tsx";
import { Link } from "react-router-dom";
import logo from "/streamhub-logo.svg";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "./shadcn/ui/use-toast";

const Navbar = () => {
  const buttonTextFormat = "text-base mx-4";
  const { setIsLoggedIn, user, setUser } = useAppContext();

  /**
   * Handles the logout functionality.
   *
   * Sets the user and isLoggedIn state to null and false respectively.
   * Displays a toast notification with the title "Logged out".
   * If any error occurs during the logout process, it is caught and logged to the console.
   *
   * @return {void}
   */
  const handleLogout = () => {
    try {
      // Set user state to null
      setUser(null);
      // Set isLoggedIn state to false
      setIsLoggedIn(false);
      // Display a toast notification with the title "Logged out"
      toast({
        title: "Logged out",
      });
    } catch (error) {
      // Log the error that occurred during the logout process
      console.error(`Error during logout: ${error}`);
      // Additional error handling logic can be added here
    }
  };

  return (
    // The navbar component is a container for the navigation menu and user information.
    <div className="h-[12.5vh] bg-black flex items-center">
      {/* The navigation menu is a component that displays a list of navigation items. */}
      <NavigationMenu className="font-alatsi text-white">
        {/* The logo is a link that navigates to the home page. */}
        <div className="pl-20 pr-0 max-w-64 mr-4">
          <Link to={`/`}>
            <img src={logo} alt="StreamHub Logo" />
          </Link>
        </div>

        {/* The list of navigation items is displayed within the navigation menu. */}
        <NavigationMenuList className="py-4 flex justify-center">
          {/* The "Create a Watch Party" button is a link that navigates to the watch party creation page. */}
          <NavigationMenuItem>
            <Button
              variant="ghost"
              className={buttonTextFormat}
              asChild
              aria-label="Create a Watch Party"
            >
              <Link to={`/watch-party/1456`}>Create a Watch Party</Link>
            </Button>
          </NavigationMenuItem>
          {/* The "Update Profile" button is a link that navigates to the profile update page. */}
          <NavigationMenuItem>
            <Button
              variant="ghost"
              className={buttonTextFormat}
              asChild
              aria-label="Update Profile"
            >
              <Link to={`/update-profile`}>Update Profile</Link>
            </Button>
          </NavigationMenuItem>

          {/* The "Logout" button triggers the logout functionality when clicked. */}
          <NavigationMenuItem>
            <Button
              variant="destructive"
              className={buttonTextFormat}
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Display the username of the logged-in user. */}
      <span className="">
        <p className="text-white font-alatsi text-semibold text-lg">
          {/* The username is retrieved from the user context. */}
          Hello {user?.username}
        </p>
      </span>
    </div>
  );
};

export default Navbar;
