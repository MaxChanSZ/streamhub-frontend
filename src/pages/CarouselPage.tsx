import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious2,
  CarouselNext2,
  CarouselPrevious3,
  CarouselNext3,
} from "@/components/shadcn/ui/carousel";

import pic1 from "/pic1.jpeg";
import pic2 from "/pic2.jpeg";
import pic3 from "/pic3.jpeg";
import NewestSeriesCarousel from "@/components/NewestSeriesCarousel.tsx";
import TopRatedSeriesCarousel from "@/components/TopRatedSeriesCarousel.tsx";
const imageDetails = [
  {
    src: pic1,
    title: "Trolley Troubles, 1931 starring Oswald the Lucky Rabbit",
    description: "Description for image 1.",
  },
  {
    src: pic2,
    title: "Steamboat Willie, 1928 starring Mickey Mouse",
    description: "Description for image 2.",
  },
  {
    src: pic3,
    title: "Cartoon: Cinderella (Laugh-O-Gram), 1922",
    description:
      "The Laugh-O-Gram Studio (also called Laugh-O-Gram Studios) was an animation studio located on the second floor of the McConahay Building at 1127 East 31st in Kansas City, Missouri, that operated from June 28, 1921, to October 16, 1923.",
  },
];
const CarouselPage = () => {
  /**
   * Navigation hook for routing.
   */
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/watch/:seriesId/:episodeId");
  };
  return (
      <div className="flex justify-center items-center flex-col">
        <div className="aspect-video max-w-3xl">
          <h1 className="text-2xl text-white px-4 font-bold pb-5">
            Top Movies/Series of the Month
          </h1>
          <TopRatedSeriesCarousel/>
        </div>
      <div className="pt-16">
        <h1 className="text-2xl text-white px-4 font-bold pb-5">Discover</h1>

            <NewestSeriesCarousel/>

      </div>
    </div>
  );
};

export default CarouselPage;
