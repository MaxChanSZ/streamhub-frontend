import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import {CarouselItem} from "@/components/shadcn/ui/carousel.tsx";

const NewestSeriesCarousel = () => {
    const [series, setSeries] = useState([]);
    const navigate = useNavigate();
    const handleClick = (seriesId) => {
        const correctSeriesId = seriesId - 999;
        navigate(`/watch/${correctSeriesId}/`);
    };
    const limitedSeries = series.slice(0, 8);

    useEffect(() => {
        fetch('http://localhost:8080/api/series/newest')
            .then(response => response.json())
            .then(data => setSeries(data))
            .catch(error => console.error('Error fetching series:', error));
    }, []);

    return (
        <>
            {limitedSeries.map((item) => (
                <CarouselItem
                    key={item.id}
                    className="relative flex md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6 justify-center items-center transform transition-transform duration-200 hover:scale-105 hover:z-10 overflow-visible"
                >
                    <img
                        src={item.thumbnailURL}
                        alt={item.seriesTitle}
                        className="max-h-40 w-full object-cover rounded-lg cursor-pointer"
                        onClick={() => handleClick(item.id)}
                    />
                </CarouselItem>
            ))}
        </>
    );
};

export default NewestSeriesCarousel;
