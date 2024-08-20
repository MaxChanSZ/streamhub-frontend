import { useNavigate } from "react-router-dom";
import NewestSeriesCarousel from "@/components/NewestSeriesCarousel.tsx";
import TopRatedSeriesCarousel from "@/components/TopRatedSeriesCarousel.tsx";

const CarouselPage = () => {
  return (
      <div className="flex justify-center items-center flex-col">
        <div className="aspect-video max-w-3xl">
          <h1 className="text-2xl text-white px-4 font-bold pb-5">
            Top Movies/Series of the Month
          </h1>
          <TopRatedSeriesCarousel/>
        </div>
      <div className="pt-16">
        <h1 className="text-2xl text-white px-4 font-bold pb-5">
          Discover
        </h1>
        <NewestSeriesCarousel/>
      </div>
    </div>
  );
};

export default CarouselPage;
