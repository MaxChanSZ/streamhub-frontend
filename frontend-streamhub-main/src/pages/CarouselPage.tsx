import * as React from "react";

import { Card, CardContent } from "@/components/shadcn/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/shadcn/ui/carousel";

const CarouselPage = () => {
  return (
    <Carousel
      opts={{
        align: "center",
      }}
      className="w-full"
    >
      <CarouselContent>
        {Array.from({ length: 10 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="basis-full md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6"
          >
            <div className="w-52">
              <Card>
                <CardContent className="flex aspect-video items-center justify-center">
                  <img src="" alt="steamboatwillie_001" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CarouselPage;
