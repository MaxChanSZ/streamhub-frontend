import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/shadcn/ui/navigation-menu.tsx";
import { Button } from "@/components/shadcn/ui/button.tsx";
import { Input } from "@/components/shadcn/ui/input.tsx";
import { Link } from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import logo from "/streamhub-logo.svg";
import NavbarProfile from "@/components/NavbarProfile.tsx";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
    const menuButtonRef = useRef<HTMLButtonElement>(null as unknown as HTMLButtonElement);

    const buttonTextFormat =
        "text-xl xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl 5xl:text-5xl " + // Text size
        "mx-2 sm:mx-3 md:mx-4 " + // Margin X
        "px-0.5 py-6 sm:px-4 sm:py-6 md:px-6 md:py-6 lg:px-1 lg:py-6 xl:px-4 xl:py-7 2xl:px-6 2xl:py-7 3xl:px-8 3xl:py-8 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-8 " + // Padding
        "bg-black text-white " + // Background and text color
        "hover:bg-white hover:text-black transition-colors" // Hover and transition effects

    const toggleMenu = () => {
        setMenuOpen(prevState => !prevState);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) &&
            menuButtonRef.current && !menuButtonRef.current.contains(event.target as Node)
        ) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        // The navbar component is a container for the navigation menu and user information.
        <div className="h-[10.5vh] sm:h-[10.5vh] md:h-[10.5vh] lg:h-[11vh] xl:h-[11vh] 2xl:h-[11vh] 3xl:h-[12vh] 4xl:h-[12vh] 5xl:h-[12vh] bg-black flex items-center px-4 mt-3 pb-4">
            {/* Logo */}
            <div
                className="
                flex-shrink-0
                ml-2 mr-2       /* Base */
                sm:ml-10 sm:mr-6 /* ≥ 640px */
                md:ml-10 md:mr-6 /* ≥ 768px */
                lg:ml-14 lg:mr-10 /* ≥ 1024px */
                xl:ml-16 xl:mr-12 /* ≥ 1280px */
                2xl:ml-18 2xl:mr-14 /* ≥ 1536px */
                3xl:ml-20 3xl:mr-16 /* ≥ 1600px */
                4xl:ml-22 4xl:mr-18 /* ≥ 1920px */
                5xl:ml-24 5xl:mr-20 /* ≥ 2560px */
              "
            >
                <Link to={`/`}>
                    <img
                        src={logo}
                        alt="StreamHub Logo"
                        className="w-[8rem] sm:w-[12rem] md:w-[12rem] lg:w-[12rem] xl:w-[14rem] 2xl:w-[16rem] 3xl:w-[18rem] 4xl:w-[20rem] 5xl:w-[24rem]
                       h-auto object-contain" // Responsive width and auto height with proper scaling
                    />
                </Link>
            </div>

            {/* Centered Navigation Menu */}
            <div className="hidden lg:flex flex-grow justify-start">
                <NavigationMenu className="font-alatsi text-white">
                    <NavigationMenuList className="py-4 flex items-center space-x-0">
                        {/* Watch Party */}
                        <NavigationMenuItem>
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

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex-grow">
                <Button
                    ref={menuButtonRef}
                    variant="ghost"
                    className={`${buttonTextFormat} text-white justify-start`}
                    onClick={toggleMenu}
                >
                    Menu
                </Button>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="lg:hidden absolute top-[10.5vh] left-0 w-full bg-black z-20"
                >
                    <ul className="flex flex-col items-center p-4 space-y-2">
                        <li>
                            <Button
                                variant="ghost"
                                className={`${buttonTextFormat} text-white`}
                                asChild
                            >
                                <Link
                                    to={`/watch-party`}
                                    className="block py-2"
                                    onClick={() => setMenuOpen(false)} // Add this line
                                >
                                    Join Watch Party
                                </Link>
                            </Button>
                        </li>
                        <li>
                            <Button
                                variant="ghost"
                                className={`${buttonTextFormat} text-white`}
                                asChild
                            >
                                <Link
                                    to={`/contact`}
                                    className="block py-2"
                                    onClick={() => setMenuOpen(false)} // Add this line
                                >
                                    Contact
                                </Link>
                            </Button>
                        </li>
                        {/* Category Menu */}
                        <li>
                            <NavigationMenu>
                                <NavigationMenuItem className="relative">
                                    <Button
                                        variant="ghost"
                                        className={`${buttonTextFormat} text-white`}
                                        asChild
                                    >
                                        <NavigationMenuTrigger className="relative z-10">Category</NavigationMenuTrigger>
                                    </Button>
                                    <NavigationMenuContent className="bg-black">
                                        <ul className="grid w-full gap-2 p-2">
                                            {categories.map((category) => (
                                                <li key={category.title}>
                                                    <Button
                                                        variant="ghost"
                                                        className={`${buttonTextFormat} text-white`}
                                                        asChild
                                                    >
                                                        <Link
                                                            to={category.href}
                                                            className="text-white hover:underline block py-2 px-4"
                                                            onClick={() => setMenuOpen(false)} // Add this line
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
                            </NavigationMenu>
                        </li>
                    </ul>
                </div>
            )}


            {/* Search Bar */}
            <div className="flex items-center space-x-1 pl-1 ml-auto lg:ml-0">
                <Input
                    type="search"
                    placeholder="Search"
                    className="
            bg-black text-white placeholder-white
            w-[8rem] h-[2.5rem]
            sm:w-[10rem] sm:h-[3rem]
            md:w-[10rem] md:h-[3rem]
            lg:w-[10rem] lg:h-[3rem]
            xl:w-[14rem] xl:h-[3.5rem]
            2xl:w-[18rem] 2xl:h-[4rem]
            3xl:w-[20rem] 3xl:h-[4.5rem]
            4xl:w-[22rem] 4xl:h-[4.5rem]
            5xl:w-[24rem] 5xl:h-[4.5rem]
            text-base
            sm:text-xl
            md:text-xl
            lg:text-xl
            xl:text-2xl
            2xl:text-3xl
            3xl:text-4xl
            4xl:text-4xl
            5xl:text-4xl
        "
                />
                <NavbarProfile />
            </div>
        </div>
    );
};

export default Navbar;

const categories: { title: string; href: string }[] = [
    { title: "Category 1", href: "/watch/1/1" },
    { title: "Category 2", href: "/category2" },
    { title: "Category 3", href: "/category3" },
    { title: "Category 4", href: "/category4" },
    { title: "Category 5", href: "/category5" },
    { title: "Category 6", href: "/category6" },
];
