import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/shadcn/ui/navigation-menu.tsx";
import { Button } from "@/components/shadcn/ui/button.tsx";
import { Input } from "@/components/shadcn/ui/input.tsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, FormEvent } from "react";
import logo from "/streamhub-logo.svg";
import NavbarProfile from "@/components/NavbarProfile.tsx";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(
    null as unknown as HTMLDivElement
  );
  const menuButtonRef = useRef<HTMLButtonElement>(
    null as unknown as HTMLButtonElement
  );
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const navigate = useNavigate();

  const buttonTextFormat =
    "text-xl xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl 5xl:text-4xl " + // Text size
    "mx-2 sm:mx-3 md:mx-4 " + // Margin X
    "px-0.5 py-6 sm:px-4 sm:py-6 md:px-6 md:py-6 lg:px-1 lg:py-6 xl:px-4 xl:py-7 2xl:px-6 2xl:py-7 3xl:px-8 3xl:py-8 4xl:px-10 4xl:py-8 5xl:px-10 5xl:py-8 " + // Padding
    "bg-black text-white " + // Background and text color
    "hover:bg-white hover:text-black transition-colors"; // Hover and transition effects

  const categoryButtonFormat =
    "text-xl xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl 5xl:text-4xl " + // Text size
    "mx-1" + // Margin X
    "px-5 py-5 lg:px-5 lg:py-5 xl:px-5 xl:py-5 2xl:px-7 2xl:py-5 3xl:px-8 3xl:py-6 4xl:px-9 4xl:py-8 5xl:px-10 5xl:py-8 " + // Padding
    "bg-black text-white " + // Background and text color
    "hover:bg-white hover:text-black transition-colors"; // Hover and transition effects

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      menuButtonRef.current &&
      !menuButtonRef.current.contains(event.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // console.log(searchValue);
    if (searchValue == null) {
      console.log("Empty Search Value");
      return;
    } else {
      navigate(`/search?title=${searchValue}`);
    }
  };

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
            {/*Watch Party*/}
            <NavigationMenuItem className="relative">
              <Button variant="ghost" className={buttonTextFormat} asChild>
                <NavigationMenuTrigger className="relative z-10">
                  Watch Party
                </NavigationMenuTrigger>
              </Button>
              <NavigationMenuContent className="bg-black w-fit">
                <ul className="flex flex-col items-center w-full p-2 space-y-2">
                  {wpCategories.map((category) => (
                    <li key={category.title} className="w-full">
                      <Button
                        variant="ghost"
                        className={categoryButtonFormat}
                        asChild
                      >
                        <Link
                          to={category.href}
                          className="text-white hover:underline block w-full py-2 px-4 text-center"
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

            {/* Category */}
            <NavigationMenuItem className="relative">
              <Button variant="ghost" className={buttonTextFormat} asChild>
                <NavigationMenuTrigger className="relative z-10">
                  Category
                </NavigationMenuTrigger>
              </Button>
              <NavigationMenuContent className="bg-black w-fit">
                <ul className="flex flex-col items-center w-full p-2 space-y-2">
                  {categories.map((category) => (
                    <li key={category.title} className="w-full">
                      <Button
                        variant="ghost"
                        className={categoryButtonFormat}
                        asChild
                      >
                        <Link
                          to={category.href}
                          className="text-white hover:underline block w-full py-2 px-4 text-center"
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
            {/* Rest of Buttons */}
            <NavigationMenuItem>
              <Button variant="ghost" className={buttonTextFormat} asChild>
                <Link to={`/pollResults`}>Poll Results</Link>
              </Button>
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
            {/* Mobile Category Menu */}
            <li>
              <NavigationMenu>
                <NavigationMenuItem className="relative">
                  <Button
                    variant="ghost"
                    className={`${buttonTextFormat} text-white`}
                    asChild
                  >
                    <NavigationMenuTrigger className="relative z-10">
                      Category
                    </NavigationMenuTrigger>
                  </Button>
                  <NavigationMenuContent className="bg-black w-fit">
                    <ul className="flex flex-col items-center w-full gap-2 p-2">
                      {categories.map((category) => (
                        <li key={category.title} className="w-full">
                          <Button
                            variant="ghost"
                            className={`${categoryButtonFormat} text-white`}
                            asChild
                          >
                            <Link
                              to={category.href}
                              className="text-white hover:underline block w-full py-2 px-4 text-center"
                              onClick={() => setMenuOpen(false)} // Add this line
                            >
                              <h3 className="font-bold">{category.title}</h3>
                            </Link>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem className="relative">
                  <Button
                    variant="ghost"
                    className={`${buttonTextFormat} text-white`}
                    asChild
                  >
                    <NavigationMenuTrigger className="relative z-10">
                      Watch Party
                    </NavigationMenuTrigger>
                  </Button>
                  <NavigationMenuContent className="bg-black w-fit">
                    <ul className="flex flex-col items-center w-full gap-2 p-2">
                      {wpCategories.map((category) => (
                        <li key={category.title} className="w-full">
                          <Button
                            variant="ghost"
                            className={`${categoryButtonFormat} text-white`}
                            asChild
                          >
                            <Link
                              to={category.href}
                              className="text-white hover:underline block w-full py-2 px-4 text-center"
                              onClick={() => setMenuOpen(false)} // Add this line
                            >
                              <h3 className="font-bold">{category.title}</h3>
                            </Link>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <Button
                  variant="ghost"
                  className={`${buttonTextFormat} text-white`}
                  asChild
                >
                  <Link
                    to={`/pollResults`}
                    className="block py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Poll Results
                  </Link>
                </Button>
              </NavigationMenu>
            </li>
          </ul>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center space-x-1 pl-1 ml-auto lg:ml-0">
        <div>
          <form id="search" onSubmit={(e) => handleSubmit(e)}>
            <Input
              type="search"
              placeholder="Search"
              className="
                        bg-black text-white placeholder-white
                        w-[8rem] h-[2rem]
                        sm:w-[10rem] sm:h-[2.5rem]
                        md:w-[10rem] md:h-[2.5rem]
                        lg:w-[10rem] lg:h-[2.5rem]
                        xl:w-[14rem] xl:h-[2.5rem]
                        2xl:w-[16rem] 2xl:h-[2.5rem]
                        3xl:w-[18rem] 3xl:h-[2.5rem]
                        4xl:w-[20rem] 4xl:h-[3rem]
                        5xl:w-[20rem] 5xl:h-[3rem]
                        text-base
                        sm:text-xl
                        md:text-xl
                        lg:text-xl
                        xl:text-2xl
                        2xl:text-2xl
                        3xl:text-2xl
                        4xl:text-3xl
                        5xl:text-3xl
                        "
              onChangeCapture={(e) => setSearchValue(e.currentTarget.value)}
            />
          </form>
        </div>
        <NavbarProfile />
      </div>
    </div>
  );
};

export default Navbar;

const categories: { title: string; href: string }[] = [
  { title: "Category 1", href: "/watch/1/1" },
<<<<<<< HEAD
  { title: "Category 2", href: "/category2" },
  { title: "Category 3", href: "/category3" },
  { title: "Category 4", href: "/category4" },
  { title: "Category 5", href: "/category5" },
  { title: "Category 6", href: "/category6" },
=======
  { title: "Category 2", href: "/watch/1/1" },
  { title: "Category 3", href: "/watch/1/1" },
  { title: "Category 4", href: "/watch/1/1" },
  { title: "Category 5", href: "/watch/1/1" },
  { title: "Category 6", href: "/watch/1/1" },
>>>>>>> main
];

const wpCategories: { title: string; href: string }[] = [
  { title: "Join Watch Party", href: "/join-watch-party" },
  { title: "Create Watch Party", href: "/create-watch-party" },
  { title: "Send Invitation", href: "/send-email" },
];

const watchPartyActions: { title: string; href: string }[] = [
  { title: "Create a Watch Party", href: "/create-watch-party" },
  { title: "Join Watch Party", href: "/join-watch-party" },
];
