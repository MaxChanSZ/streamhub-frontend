import { Card, CardContent } from "@/components/shadcn/ui/card";

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
        <Carousel className="w-full max-w-XL">
          <CarouselContent>
            {imageDetails.map((imageDetail, index) => (
              <CarouselItem key={index} className="relative group">
                <div className="p-0">
                  <Card className="rounded-lg overflow-hidden border-none">
                    <CardContent className="relative flex aspect-video items-center justify-center p-0 rounded-lg overflow-hidden">
                      <img
                        src={imageDetail.src}
                        alt={`Carousel image ${index + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 flex items-end justify-start text-white bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                        <div>
                          <h3 className="text-3xl font-bold">
                            {imageDetail.title}
                          </h3>
                          <p>{imageDetail.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious2 className="absolute left-4 z-20 flex h-16 w-16" />
          <CarouselNext2 className="absolute right-4 z-20 flex h-16 w-16" />
        </Carousel>
      </div>
      <div className="pt-16">
        <h1 className="text-2xl text-white px-4 font-bold pb-5">Discover</h1>
        <Carousel
            opts={{
              align: "center",
            }}
            className="w-full"
        >
          <CarouselContent>
            <NewestSeriesCarousel />
          </CarouselContent>
          <CarouselPrevious3 className="absolute left-4 z-20 flex h-10 w-10" />
          <CarouselNext3 className="absolute right-4 z-20 flex h-10 w-10" />
        </Carousel>
      </div>
    </div>
  );
};

export default CarouselPage;
