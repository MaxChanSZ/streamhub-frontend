import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious2,
    CarouselNext2
} from '@/components/shadcn/ui/carousel.tsx';
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
    const nextButtonRef = useRef<HTMLButtonElement | null>(null);
    const prevButtonRef = useRef<HTMLButtonElement | null>(null);
    const carouselApiRef = useRef<any>(null);
    const intervalRef = useRef<number | null>(null); // Ref to store the interval ID

    const handleClick = (seriesId: number) => {
        const correctSeriesId = seriesId - 999;
        navigate(`/watch/${correctSeriesId}/`);
    };

    const startAutoScroll = () => {
        if (intervalRef.current) clearInterval(intervalRef.current as number);

        intervalRef.current = window.setInterval(() => {
            if (nextButtonRef.current) {
                if ("click" in nextButtonRef.current) {
                    nextButtonRef.current.click();
                }
            }
        }, 4000); // Auto-scroll every 4 seconds
    };

    const resetAutoScroll = () => {
        startAutoScroll(); // Reset the autoscroll timer
    };

    useEffect(() => {
        startAutoScroll(); // Start the autoscroll when the component mounts

        const handlePreviousClick = () => {
            resetAutoScroll();
        };

        const handleNextClick = () => {
            resetAutoScroll();
        };

        const prevButton = prevButtonRef.current;
        const nextButton = nextButtonRef.current;

        if (prevButton && nextButton) {
            prevButton.addEventListener('click', handlePreviousClick);
            nextButton.addEventListener('click', handleNextClick);
        }

        return () => {
            if (prevButton && nextButton) {
                prevButton.removeEventListener('click', handlePreviousClick);
                nextButton.removeEventListener('click', handleNextClick);
            }
            if (intervalRef.current) clearInterval(intervalRef.current as number); // Clean up the interval on unmount
        };
    }, []);

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
        <Carousel
            className="w-full max-w-XL"
            opts={{ loop: true }} // Ensure loop option is set
            ref={(el) => {
                if (el) {
                    carouselApiRef.current = el;
                }
            }}
        >
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
            <CarouselPrevious2
                ref={prevButtonRef}
                className="absolute left-4 z-20 flex h-16 w-16"
            />
            <CarouselNext2
                ref={nextButtonRef}
                className="absolute right-4 z-20 flex h-16 w-16"
            />
        </Carousel>
    );
};

export default TopRatedSeriesCarousel;
