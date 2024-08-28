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
import logo from "/streamhub-logo.svg";
import NavbarProfile from "@/components/NavbarProfile.tsx";


const Navbar = () => {

  const buttonTextFormat = "text-base mx-4 bg-black text-white hover:bg-white hover:text-black transition-colors";

  return (
    // The navbar component is a container for the navigation menu and user information.
      <div className="h-[12.5vh] bg-black flex items-center px-4 mt-3 pb-4"> {/*Change navbar margin/padding here*/}
          {/* Logo */}
          <div className="flex-shrink-0 ml-14 pr-8">
              <Link to={`/`}>
                  <img src={logo} alt="StreamHub Logo" width="300" height="300"/>
              </Link>
          </div>

          {/* Centered Navigation Menu */}
          <div className="flex-grow flex justify-center">
              <NavigationMenu className="font-alatsi text-white">
                  <NavigationMenuList className="py-4 flex items-center space-x-0">

                      {/* Watch Party */}
                      <NavigationMenuItem className="relative">
                          <Button variant="ghost" className={buttonTextFormat} asChild>
                              <Link to={`/watch-party`}>Join a Watch Party</Link>
                          </Button>
                      </NavigationMenuItem>

                      {/* Rest of Buttons */}
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

                  </NavigationMenuList>
              </NavigationMenu>
          </div>


          {/* Search Bar and Profile Icon */}
          <div className="flex items-center space-x-4 pl-8 ml-auto">
              <Input
                  type="search"
                  placeholder="Search"
                  className="bg-black text-white placeholder-white"
                  style={{width: '300px'}}
              />
              <NavbarProfile/>
          </div>
      </div>
  );
};


export default Navbar;

const categories: { title: string; href: string; }[] = [
    {title: "Category 1", href: "/watch/1/1"},
    {title: "Category 2", href: "/category2"},
    {title: "Category 3", href: "/category3"},
    {title: "Category 4", href: "/category4"},
    {title: "Category 5", href: "/category5"},
    {title: "Category 6", href: "/category6" },
]

const watchpartydetails: { title: string; href: string; }[] = [
    { title: "Create a Watch Party", href: "/watch-party" },
    { title: "Join Watch Party", href: "/join-watch-party" },
]