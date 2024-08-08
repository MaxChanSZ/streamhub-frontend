import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/shadcn/ui/navigation-menu.tsx";
import { Button } from "@/components/shadcn/ui/button.tsx";
import { Input } from "@/components/shadcn/ui/input.tsx"
import { Link } from "react-router-dom";
import profileIcon from "/profileicon.svg";
import profileIconBg from "/profileiconbg.svg";
import logo from "/streamhub-logo.svg";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "./shadcn/ui/use-toast";


const Navbar = () => {
  // const buttonTextFormat = "text-base mx-4";
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

  const buttonTextFormat = "text-base mx-4 bg-black text-white hover:bg-white hover:text-black transition-colors";

  return (
    // The navbar component is a container for the navigation menu and user information.
      <div className="h-[12.5vh] bg-black flex items-center px-4 mt-3 pb-4"> {/*Change navbar margin/padding here*/}
          {/* Logo */}
          <div className="flex-shrink-0 ml-14 pr-8" >
              <Link to={`/`}>
                  <img src={logo} alt="StreamHub Logo" width="300" height="300"/>
              </Link>
          </div>

          {/* Centered Navigation Menu */}
          <div className="flex-grow flex justify-center">
              <NavigationMenu className="font-alatsi text-white">
                  <NavigationMenuList className="py-4 flex items-center space-x-0">

                      {/* Watch Party */}
                      <NavigationMenuItem>
                          <NavigationMenuItem className="relative">
                              <Button variant="ghost" className={buttonTextFormat} asChild>
                                  <NavigationMenuTrigger className="relative z-10">Watch Party</NavigationMenuTrigger>
                              </Button>
                              <NavigationMenuContent className="bg-black">
                                  <ul className="grid w-full gap-2 p-2">
                                      {watchpartydetails.map((wp) => (
                                          <li key={wp.title}>
                                              <Button variant="ghost" className={buttonTextFormat} asChild>
                                                  <Link
                                                      to={wp.href}
                                                      className="text-white hover:underline block py-2 px-4"
                                                  >
                                                      <div>
                                                          <h3 className="font-bold">{wp.title}</h3>
                                                      </div>
                                                  </Link>
                                              </Button>
                                          </li>
                                      ))}
                                  </ul>
                              </NavigationMenuContent>
                          </NavigationMenuItem>
                      </NavigationMenuItem>

                      {/* Rest of Buttons */}
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
                      <NavigationMenuItem>
                          <Button variant="ghost" className={buttonTextFormat} asChild>
                              <Link to={`/contact`}>Contact</Link>
                          </Button>
                      </NavigationMenuItem>

                      {/* Category */}
                      <NavigationMenuItem className="relative">
                          <Button variant="ghost" className={buttonTextFormat} asChild>
                              <NavigationMenuTrigger className="relative z-10">Category</NavigationMenuTrigger>
                          </Button>
                          <NavigationMenuContent className="bg-black">
                              <ul className="grid w-full gap-2 p-2">
                                  {categories.map((category) => (
                                      <li key={category.title}>
                                          <Button variant="ghost" className={buttonTextFormat} asChild>
                                              <Link
                                                  to={category.href}
                                                  className="text-white hover:underline block py-2 px-4"
                                              >
                                                  <div>
                                                      <h3 className="font-bold">{category.title}</h3>
                                                  </div>
                                              </Link>
                                          </Button>
                                      </li>
                                  ))}
                              </ul>
                          </NavigationMenuContent>
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
          </div>

          {/* Display the username of the logged-in user. */}
              <span className="flex justify-center items-center">
                  <p className="text-white font-alatsi font-semibold text-lg px-4">
                  {/* The username is retrieved from the user context. */}
                      Hello {user?.username}
                  </p>
              </span>

          {/* Search Bar and Profile Icon */}
          <div className="flex items-center space-x-4 pl-8 ml-auto">
              <Input
                  type="search"
                  placeholder="Search"
                  className="bg-black text-white placeholder-white"
                  style={{ width: '300px' }}
              />
              <div className="relative flex items-center pl-8 pr-14">
                  <Link to={`/update-profile`}>
                      <div style={{width: '50px', height: '50px'}} className="relative">
                          <img
                              src={profileIcon}
                              alt="Profile Icon"
                              style={{width: '50px', height: '50px'}}
                              className="absolute top-0 left-0"
                          />
                          <img
                              src={profileIconBg}
                              alt="Profile Icon Background"
                              style={{width: '50px', height: '50px'}}
                              className="absolute top-0 left-0"
                          />
                      </div>
                  </Link>
              </div>
          </div>
      </div>
  );
};


export default Navbar;

const categories: { title: string; href: string; }[] = [
    { title: "Category 1", href: "/category1" },
    { title: "Category 2", href: "/category2" },
    { title: "Category 3", href: "/category3" },
    { title: "Category 4", href: "/category4" },
    { title: "Category 5", href: "/category5" },
    { title: "Category 6", href: "/category6" },
]

const watchpartydetails: { title: string; href: string; }[] = [
    { title: "Create a Watch Party", href: "/watch-party" },
    { title: "Join Watch Party", href: "/join-watch-party" },
]