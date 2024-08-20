import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious2, CarouselNext2 } from '@/components/shadcn/ui/carousel.tsx';
import { Card, CardContent } from '@/components/shadcn/ui/card.tsx';

interface Series {
    id: number;
    seriesTitle: string;
    description: string;
    thumbnailURL: string;
}

const TopRatedSeriesCarousel = () => {
    const [series, setSeries] = useState<Series[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleClick = (seriesId: number) => {
        const correctSeriesId = seriesId - 999;
        navigate(`/watch/${correctSeriesId}/`);
    };

    useEffect(() => {
        fetch('http://localhost:8080/api/series/top-rated')
            .then(response => response.json())
            .then(data => {
                const shuffledSeries = data.sort(() => 0.5 - Math.random());
                setSeries(shuffledSeries.slice(0, 5));
            })
            .catch(error => console.error('Error fetching series:', error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Display a loading state or spinner
    }

    return (
        <Carousel className="w-full max-w-XL">
            <CarouselContent>
                {series.map((item) => (
                    <CarouselItem
                        key={item.id}
                        className="relative group"
                        onClick={() => handleClick(item.id)}
                    >
                        <div className="p-0">
                            <Card className="rounded-lg overflow-hidden border-none">
                                <CardContent className="relative flex aspect-video items-center justify-center p-0 rounded-lg overflow-hidden">
                                    <img
                                        src={item.thumbnailURL}
                                        alt={item.seriesTitle}
                                        className="w-full h-full object-cover transition-opacity duration-300"
                                    />
                                    <div className="absolute inset-0 flex items-end justify-start text-white bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                                        <div>
                                            <h3 className="text-3xl font-bold">
                                                {item.seriesTitle}
                                            </h3>
                                            <p>{item.description}</p>
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
    );
};

export default TopRatedSeriesCarousel;
