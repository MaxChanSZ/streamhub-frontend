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

    const buttonTextFormat =
        "text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl 5xl:text-5xl" + // Adjust text size
        "mx-4 " +
        "px-2 py-1 xl:px-3 xl:py-1.5 2xl:px-12 2xl:py-2 3xl:px-30 3xl:py-2.5 4xl:px-6 4xl:py-3 5xl:px-30 5xl:py-3.5 " + // Adjust padding
        "bg-black text-white " +
        "hover:bg-white hover:text-black transition-colors";

  return (
    // The navbar component is a container for the navigation menu and user information.
      <div
          className="h-[10.5vh] sm:h-[10.5vh] md:h-[11vh] lg:h-[11vh] xl:h-[11vh] 2xl:h-[11vh] 3xl:h-[12vh] 4xl:h-[12vh] 5xl:h-[12vh] bg-black flex items-center px-4 mt-3 pb-4">
          {/* Logo */}
          <div
              className="
                flex-shrink-0
                ml-8 mr-4       /* Base */
                sm:ml-8 sm:mr-4 /* ≥ 640px */
                md:ml-10 md:mr-6 /* ≥ 768px */
                lg:ml-14 lg:mr-10 /* ≥ 1024px */
                xl:ml-16 xl:mr-12 /* ≥ 1280px */
                2xl:ml-18 2xl:mr-14 /* ≥ 1536px */
                3xl:ml-20 3xl:mr-16 /* ≥ 1600px */
                4xl:ml-22 4xl:mr-18 /* ≥ 1920px */
                5xl:ml-24 5xl:mr-20 /* ≥ 2560px">

              <Link to={`/`}>
                  <img
                      src={logo}
                      alt="StreamHub Logo"
                      className="w-[8rem] sm:w-[10rem] md:w-[12rem] lg:w-[14rem] xl:w-[16rem] 2xl:w-[18rem] 3xl:w-[20rem] 4xl:w-[22rem]
                       h-auto object-contain" // Responsive width and auto height with proper scaling
                  />
              </Link>
          </div>


          {/* Centered Navigation Menu */}
          <div className="flex-grow flex justify-center">
              <NavigationMenu className="font-alatsi text-white">
                  <NavigationMenuList className="py-4 flex items-center space-x-0">

                      {/* Watch Party */}
                      <NavigationMenuItem className="relative">
                          <Button variant="ghost" className={buttonTextFormat} asChild>
                              <Link to={`/watch-party`}>Join Watch Party</Link>
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


          {/* Search Bar */}
          <div className="flex items-center space-x-1 pl-1 ml-auto">
              <Input
                  type="search"
                  placeholder="Search"
                  className="bg-black text-white placeholder-white
            w-[10rem]
            lg:w-[10rem]
            xl:w-[14rem]
            2xl:w-[18rem]"
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
    {title: "Category 6", href: "/category6"},
]
