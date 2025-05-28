import { Link, useParams } from "react-router-dom";
import FilterPage from "./FilterPage";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Globe, MapPin, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Restaurant } from "@/types/restaurantType";

const SearchPage = () => {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"restaurants" | "dishes">("restaurants");

  const {
    loading,
    searchedRestaurant,
    searchRestaurant,
    setAppliedFilter,
    appliedFilter,
  } = useRestaurantStore();

  // Initial and filter update searches
  useEffect(() => {
    if (params.text) {
      searchRestaurant(params.text, searchQuery, appliedFilter);
    }
  }, [params.text, appliedFilter]);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        <FilterPage />
        <div className="flex-1">
          {/* Search Input Field */}
          <div className="flex items-center gap-2 mb-4">
            <Input
              type="text"
              value={searchQuery}
              placeholder="Search by restaurant & cuisines"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              onClick={() =>
                params.text &&
                searchRestaurant(params.text, searchQuery, appliedFilter)
              }
              className="bg-orange hover:bg-hoverOrange"
            >
              Search
            </Button>
          </div>

          {/* Tabs: Restaurants / Dishes */}
          <div className="flex gap-4 mb-6">
            <Button
              variant={activeTab === "restaurants" ? "default" : "outline"}
              onClick={() => setActiveTab("restaurants")}
            >
              Restaurants
            </Button>
            <Button
              variant={activeTab === "dishes" ? "default" : "outline"}
              onClick={() => setActiveTab("dishes")}
            >
              Dishes
            </Button>
          </div>

          {/* Applied Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {appliedFilter.map((filter, idx) => (
              <div key={idx} className="relative inline-flex items-center max-w-full">
                <Badge
                  className="text-[#D19254] rounded-md hover:cursor-pointer pr-6 whitespace-nowrap"
                  variant="outline"
                >
                  {filter}
                </Badge>
                <X
                  onClick={() => setAppliedFilter(filter)}
                  size={16}
                  className="absolute text-[#D19254] right-1 hover:cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Results: Restaurants or Dishes */}
          <div className="grid md:grid-cols-3 gap-4">
            {loading ? (
              <SearchPageSkeleton />
            ) : activeTab === "restaurants" ? (
              searchedRestaurant?.restaurant.length === 0 ? (
                <NoResultFound searchText={params.text || ""} />
              ) : (
                searchedRestaurant?.restaurant.map((rest: Restaurant) => (
                  <Card
                    key={rest._id}
                    className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="relative">
                      <AspectRatio ratio={16 / 6}>
                        <img
                          src={rest.imageUrl}
                          alt={rest.restaurantName}
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                      <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-75 rounded-lg px-3 py-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Featured
                        </span>
                      </div>
                    </div>
                    {/* <CardContent className="p-4">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {rest.restaurantName}
                      </h1>
                      <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                        <MapPin size={16} />
                        <p className="text-sm">
                          City: <span className="font-medium">{rest.city}</span>
                        </p>
                      </div>
                      <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                        <Globe size={16} />
                        <p className="text-sm">
                          Country: <span className="font-medium">{rest.country}</span>
                        </p>
                      </div>
                      <div className="flex gap-2 mt-4 flex-wrap">
                        {rest.cuisines.map((cuisine: string, idx: number) => (
                          <Badge
                            key={idx}
                            className="font-medium px-2 py-1 rounded-full shadow-sm"
                          >
                            {cuisine}
                          </Badge>
                        ))}
                      </div>
                    </CardContent> */}
                    <CardContent className="p-4 flex flex-wrap items-center justify-between gap-2">
  <h1 className="text-xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-gray-100 flex-shrink-0">
    {rest.restaurantName}
  </h1>
  {rest?.rating > 0 && (
    <div className="text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1 lg:gap-2 flex-shrink-0 text-base lg:text-lg xl:text-xl">
      <span>{rest?.rating.toFixed(1)}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 fill-current"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.92-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.285-3.95a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.148a1 1 0 00.951-.69l1.285-3.95z" />
      </svg>
    </div>
  )}
</CardContent>

                    <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 text-white flex justify-end">
                      <Link to={`/restaurant/${rest._id}`}>
                        <Button className="bg-orange hover:bg-hoverOrange font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200">
                          View Menus
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              )
            ) : (
              // Dishes tab content
              searchedRestaurant?.dishes.length === 0 ? (
                <NoResultFound searchText={params.text || ""} />
              ) : (
                searchedRestaurant?.dishes.map((dish: any) => (
                  <Card
                    key={dish._id}
                    className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="relative">
                      <AspectRatio ratio={16 / 6}>
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                    <CardContent className="p-4">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {dish.name}
                      </h1>
                      <p className="mt-2 text-gray-700 dark:text-gray-300">
                        {dish.description}
                      </p>
                      <p className="mt-2 font-semibold text-orange-600 dark:text-orange-400">
                        ₹{dish.price}
                      </p>
                      {/* Show related restaurant info */}
                      {dish.restaurant && (
                        <div className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                          <p>
                            Restaurant:{" "}
                            <span className="font-medium">
                              {dish.restaurant.restaurantName}
                            </span>
                          </p>
                          <p>
                            City: <span className="font-medium">{dish.restaurant.city}</span>
                          </p>
                          <p>
                            Country: <span className="font-medium">{dish.restaurant.country}</span>
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 flex justify-end">
                      <Link to={`/restaurant/${dish.restaurant._id}`}>
                        <Button className="bg-orange hover:bg-hoverOrange font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200">
                          View Restaurant
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

// Skeleton & No Results UI remain the same as before

const SearchPageSkeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <Card
          key={index}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden"
        >
          <div className="relative">
            <AspectRatio ratio={16 / 6}>
              <Skeleton className="w-full h-full" />
            </AspectRatio>
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="mt-2 flex gap-1 items-center text-gray-600 dark:text-gray-400">
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
          <CardFooter className="p-4  dark:bg-gray-900 flex justify-end">
            <Skeleton className="h-10 w-24 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

const NoResultFound = ({ searchText }: { searchText: string }) => {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
        No results found
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        We couldn't find any results for "{searchText}". <br /> Try searching
        with a different term.
      </p>
      <Link to="/">
        <Button className="mt-4 bg-orange hover:bg-orangeHover">
          Go Back to Home
        </Button>
      </Link>
    </div>
  );
};
