import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext3,
    CarouselPrevious3
} from '@/components/shadcn/ui/carousel.tsx';
import { Card, CardContent } from '@/components/shadcn/ui/card.tsx';

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
        navigate(`/watch/${correctSeriesId}/`);
    };

    useEffect(() => {
        fetch('http://localhost:8080/api/series/newest')
            .then(response => response.json())
            .then(data => setSeries(data))
            .catch(error => console.error('Error fetching series:', error));
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
                                    className="max-h-40 w-full object-cover rounded-lg cursor-pointer"
                                    />
                                    <div className="absolute inset-0 flex items-end justify-start text-white bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 p-4">
                                        <div>
                                            <h3 className="text-2xl font-bold">
                                                {item.seriesTitle}
                                            </h3>
                                            <p className="text-sm">{item.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious3 className="absolute left-4 z-20 flex h-10 w-10" />
            <CarouselNext3 className="absolute right-4 z-20 flex h-10 w-10" />
        </Carousel>
    );
};

export default NewestSeriesCarousel;
