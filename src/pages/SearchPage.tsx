import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as apiClient from "@/utils/api-client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ThumbnailsView } from "@/components/ThumbnailsView";
import pic1 from "/pic1.jpeg";

type SearchResult = {
  id: number;
  seriesTitle: string;
  description: string;
  cast: string;
  rating: string;
  thumbnailURL: string;
  releaseDate: [number];
};

const SearchPage = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const title = urlParams.get(`title`);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<[SearchResult]>();
  const navigate = useNavigate();
  useEffect(() => {
    if (title !== null && title !== "") {
      console.log("Start fetching");
      console.log(title);
      apiClient
        .searchSeries(title)
        .then((response) => {
          setSearchResults(response.data);
          setIsLoading(false);
          console.log(searchResults);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("Empty Search Value");
      navigate("/");
    }
  }, [isLoading]);

  return (
    <div>
      {isLoading === true && searchResults !== undefined ? (
        <div className="flex min-h-[75svh] justify-center items-center">
          <LoadingSpinner size={64} />{" "}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 pt-10">
          {searchResults?.map((searchResult, i) => (
            <ThumbnailsView
              source={searchResult.thumbnailURL}
              title={searchResult.seriesTitle}
              desc={searchResult.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
