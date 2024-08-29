import NewestSeriesCarousel from "@/components/NewestSeriesCarousel.tsx";
import TopRatedSeriesCarousel from "@/components/TopRatedSeriesCarousel.tsx";

const CarouselPage = () => {
  return (
      <div className="flex justify-center items-center flex-col">
          <div
              className="aspect-video max-w-2xl xl:max-w-3xl 2xl:max-w-4xl 3xl:max-w-5xl 4xl:max-w-6xl 5xl:max-w-6xl">
              <h1 className="text-2xl text-white px-4 font-bold pb-5">
                  Top Movies/Series of the Month
              </h1>
              <TopRatedSeriesCarousel/>
          </div>
          <div className="pt-16">
              <h1 className="text-2xl text-white px-4 font-bold pb-5">
                  Discover New Series
              </h1>
              <NewestSeriesCarousel/>
      </div>
    </div>
  );
};

export default CarouselPage;
