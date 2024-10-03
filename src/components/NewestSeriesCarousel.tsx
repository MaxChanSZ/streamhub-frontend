import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext2,
  CarouselPrevious2,
  CarouselNext3,
  CarouselPrevious3,
} from "@/components/shadcn/ui/carousel.tsx";
import { Card, CardContent } from "@/components/shadcn/ui/card.tsx";
import { fetchNewestSeries } from "@/utils/api-client.tsx";

interface Series {
  id: number;
  seriesTitle: string;
  description: string;
  thumbnailURL: string;
}

const NewestSeriesCarousel = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const navigate = useNavigate();

  const handleClick = (seriesId: number) => {
    const correctSeriesId = seriesId - 999;
    // navigate(`/watch/${correctSeriesId}/`); // uncomment when we have actual videos
    navigate("/watch/1/1");
  };

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const data = await fetchNewestSeries();
        setSeries(data);
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };

    loadSeries();
  }, []);

  const limitedSeries = series.slice(0, 8);

  return (
    <Carousel
      opts={{
        align: "center",
      }}
      className="w-full"
    >
      <CarouselContent>
        {limitedSeries.map((item) => (
          <CarouselItem
            key={item.id}
            className="relative flex md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6 justify-center items-center overflow-visible transform transition-transform duration-200 hover:scale-105 hover:z-10"
            onClick={() => handleClick(item.id)}
          >
            <div className="relative w-full">
              <Card className="rounded-lg overflow-hidden border-none">
                <CardContent className="relative flex aspect-video items-center justify-center p-0 rounded-lg overflow-hidden">
                  <img
                    src={item.thumbnailURL}
                    alt={item.seriesTitle}
                    className="max-h-35 w-full object-cover rounded-lg cursor-pointer"
                    style={{ objectFit: "cover", transform: "scale(1.05)" }}
                  />
                  <div className="absolute inset-0 flex items-end justify-start text-white bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 p-0">
                    <div className="p-4">
                      <h3 className="text-2xl font-bold">{item.seriesTitle}</h3>
                      <p className="text-sm">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* Render these components on screens smaller than 768px. CarouselPrevious2/Next2 do single scroll*/}
      <div className="block md:hidden">
        <CarouselPrevious2 className="absolute left-4 z-20 flex h-10 w-10" />
        <CarouselNext2 className="absolute right-4 z-20 flex h-10 w-10" />
      </div>

      {/* Render these components on screens 768px and larger. CarouselPrevious3/Next3 do 3 scrolls */}
      <div className="hidden md:block">
        <CarouselPrevious3 className="absolute left-4 z-20 flex h-10 w-10" />
        <CarouselNext3 className="absolute right-4 z-20 flex h-10 w-10" />
      </div>
    </Carousel>
  );
};

export default NewestSeriesCarousel;
