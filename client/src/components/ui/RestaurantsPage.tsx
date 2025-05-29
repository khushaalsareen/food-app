// import { useEffect, useState } from "react";
// import axios from "axios";
// // import { Card, CardContent } from "@/components/ui/card";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
// import { Globe, MapPin, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Link, useParams } from "react-router-dom";

// const RestaurantsPage = () => {
//   const [restaurants, setRestaurants] = useState([]);

//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/restaurant/all");
//         // console.log(ans)
//         setRestaurants(res.data.restaurants); // ensure your API returns `{ restaurants: [...] }`
//       } catch (err) {
//         console.error("Error fetching restaurants:", err);
//       }
//     };

//     fetchRestaurants();
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">All Restaurants</h1>
//       <div className="grid md:grid-cols-3 gap-4">
//         {restaurants.map((rest) => (
//          <Card
//                     key={rest._id}
//                     className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
//                   >
//                     <div className="relative">
//                       <AspectRatio ratio={16 / 6}>
//                         <img
//                           src={rest.imageUrl}
//                           alt={rest.restaurantName}
//                           className="w-full h-full object-cover"
//                         />
//                       </AspectRatio>
//                       <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-75 rounded-lg px-3 py-1">
//                         <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                           Featured
//                         </span>
//                       </div>
//                     </div>
//                     <CardContent className="p-4">
//                       {/* <div className="flex justify-between items-start gap-4 flex-wrap">
//                          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 ">
//                         {rest.restaurantName}
//                       </h1>
//                       {rest?.rating > 0 && (
//     <div className="text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1 lg:gap-2 flex-shrink-0 text-base lg:text-lg xl:text-xl">
//       <span>{rest?.rating.toFixed(1)}</span>

//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 fill-current"
//         viewBox="0 0 20 20"
//         fill="currentColor"
//       >
//         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.92-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.285-3.95a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.148a1 1 0 00.951-.69l1.285-3.95z" />
//       </svg>
//       <span>({rest?.noOfRatings})</span>
//     </div>
//   )}
//                       </div> */}
//                       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
//   <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 break-words">
//     {rest.restaurantName}
//   </h1>

//   {rest?.rating > 0 && (
//     <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-semibold text-base md:text-lg xl:text-xl">
//       <span>{rest?.rating.toFixed(1)}</span>
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-5 w-5 md:h-6 md:w-6 xl:h-7 xl:w-7 fill-current"
//         viewBox="0 0 20 20"
//         fill="currentColor"
//       >
//         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.92-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.285-3.95a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.148a1 1 0 00.951-.69l1.285-3.95z" />
//       </svg>
//       <span className="text-sm md:text-base xl:text-lg">({rest?.noOfRatings})</span>
//     </div>
//   )}
// </div>

//                       <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
//                         <MapPin size={16} />
//                         <p className="text-sm">
//                           City: <span className="font-medium">{rest.city}</span>
//                         </p>
//                       </div>
//                       <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
//                         <Globe size={16} />
//                         <p className="text-sm">
//                           Country:{" "}
//                           <span className="font-medium">{rest.country}</span>
//                         </p>
//                       </div>
//                       <div className="flex gap-2 mt-4 flex-wrap">
//                         {rest.cuisines.map((cuisine: string, idx: number) => (
//                           <Badge
//                             key={idx}
//                             className="font-medium px-2 py-1 rounded-full shadow-sm"
//                           >
//                             {cuisine}
//                           </Badge>
//                         ))}
//                       </div>
//                     </CardContent>
//                     {/* <CardContent className="p-4 flex flex-wrap items-center justify-between gap-2">
//   <h1 className="text-xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-gray-100 flex-shrink-0">
//     {rest.restaurantName}
//   </h1>
//   {rest?.rating > 0 && (
//     <div className="text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1 lg:gap-2 flex-shrink-0 text-base lg:text-lg xl:text-xl">
//       <span>{rest?.rating.toFixed(1)}</span>
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 fill-current"
//         viewBox="0 0 20 20"
//         fill="currentColor"
//       >
//         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.92-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.285-3.95a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.148a1 1 0 00.951-.69l1.285-3.95z" />
//       </svg>
//     </div>
//   )}
// </CardContent> */}

//                     <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 text-white flex justify-end">
//                       <Link to={`/restaurant/${rest._id}`}>
//                         <Button className="bg-orange hover:bg-hoverOrange font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200">
//                           View Menus
//                         </Button>
//                       </Link>
//                     </CardFooter>
//                   </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RestaurantsPage;

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
// import { Globe, MapPin } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Link } from "react-router-dom";

// const RestaurantsPage = () => {
//   const [restaurants, setRestaurants] = useState([]);

//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/restaurant/all");
//         setRestaurants(res.data.restaurants);
//       } catch (err) {
//         console.error("Error fetching restaurants:", err);
//       }
//     };
//     fetchRestaurants();
//   }, []);

//   // Function to toggle block/unblock status of a restaurant
//   const toggleStatus = async (rest) => {
//     try {
//       if (rest.currentStatus === "active") {
//         // block account
//         await axios.post("http://localhost:8000/api/v1/restaurant/block-account", {
//           emailId: rest.emailId,
//         });
//         // update local state
//         setRestaurants((prev) =>
//           prev.map((r) =>
//             r._id === rest._id ? { ...r, currentStatus: "blocked" } : r
//           )
//         );
//       } else if (rest.currentStatus === "blocked") {
//         // unblock account
//         await axios.post("http://localhost:8000/api/v1/restaurant/unblock-account", {
//           emailId: rest.emailId,
//         });
//         // update local state
//         setRestaurants((prev) =>
//           prev.map((r) =>
//             r._id === rest._id ? { ...r, currentStatus: "active" } : r
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error toggling status:", error);
//       alert("Failed to update account status. Try again.");
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">All Restaurants</h1>
//       <div className="grid md:grid-cols-3 gap-4">
//         {restaurants.map((rest) => (
//           <Card
//             key={rest._id}
//             className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
//           >
//             <div className="relative">
//               <AspectRatio ratio={16 / 6}>
//                 <img
//                   src={rest.imageUrl}
//                   alt={rest.restaurantName}
//                   className="w-full h-full object-cover"
//                 />
//               </AspectRatio>
//               <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-75 rounded-lg px-3 py-1">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Featured
//                 </span>
//               </div>
//             </div>
//             <CardContent className="p-4">
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
//                 <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 break-words">
//                   {rest.restaurantName}
//                 </h1>

//                 {rest?.rating > 0 && (
//                   <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-semibold text-base md:text-lg xl:text-xl">
//                     <span>{rest?.rating.toFixed(1)}</span>
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 md:h-6 md:w-6 xl:h-7 xl:w-7 fill-current"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.92-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.285-3.95a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.148a1 1 0 00.951-.69l1.285-3.95z" />
//                     </svg>
//                     <span className="text-sm md:text-base xl:text-lg">({rest?.noOfRatings})</span>
//                   </div>
//                 )}
//               </div>

//               <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
//                 <MapPin size={16} />
//                 <p className="text-sm">
//                   City: <span className="font-medium">{rest.city}</span>
//                 </p>
//               </div>
//               <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
//                 <Globe size={16} />
//                 <p className="text-sm">
//                   Country: <span className="font-medium">{rest.country}</span>
//                 </p>
//               </div>
//               <div className="flex gap-2 mt-4 flex-wrap">
//                 {rest.cuisines.map((cuisine, idx) => (
//                   <Badge key={idx} className="font-medium px-2 py-1 rounded-full shadow-sm">
//                     {cuisine}
//                   </Badge>
//                 ))}
//               </div>
//             </CardContent>

//             <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 flex justify-between items-center">
//               <Link to={`/restaurant/${rest._id}`}>
//                 <Button className="bg-orange hover:bg-hoverOrange font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200">
//                   View Menus
//                 </Button>
//               </Link>

//               <Button
//                 variant={rest.currentStatus === "active" ? "destructive" : "default"}
//                 onClick={() => toggleStatus(rest)}
//                 className="font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200"
//               >
//                 {rest.currentStatus === "active" ? "Block" : "Activate"}
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RestaurantsPage;

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { Restaurant } from "@/types/restaurantType";

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [tab, setTab] = useState("active"); // 'active' or 'blocked'
  const { user } = useUserStore();
  const currentUserRole = user?.role;

  useEffect(() => {
    if (tab == "active") {
      const fetchRestaurants = async () => {
        try {
          const res = await axios.get(
            "http://localhost:8000/api/v1/restaurant/all"
          );
          setRestaurants(res.data.restaurants);
        } catch (err) {
          console.error("Error fetching restaurants:", err);
        }
      };
      fetchRestaurants();
    } else {
      const fetchBlockedRestaurants = async () => {
        try {
          const res = await axios.get(
            "http://localhost:8000/api/v1/restaurant/blocked"
          );
          setRestaurants(res.data.restaurants);
        } catch (err) {
          console.error("Error fetching blocked restaurants:", err);
        }
      };
      fetchBlockedRestaurants();
    }
  }, [tab]);

  // Function to toggle block/unblock status of a restaurant
  const toggleStatus = async (rest: Restaurant) => {
    try {
      const id = rest._id;
      if (rest.currentStatus === "active") {
        await axios.post(
          "http://localhost:8000/api/v1/restaurant/block-account",
          { id }
        );
        setRestaurants((prev) =>
          prev.map((r: Restaurant) =>
            r._id === rest._id ? { ...r, currentStatus: "blocked" } : r
          )
        );
      } else if (rest.currentStatus === "blocked") {
        await axios.post(
          "http://localhost:8000/api/v1/restaurant/unblock-account",
          { id }
        );
        setRestaurants((prev) =>
          prev.map((r) =>
            r._id === rest._id ? { ...r, currentStatus: "active" } : r
          )
        );
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update account status. Try again.");
    }
  };

  // Filter restaurants based on selected tab
  const filteredRestaurants = restaurants.filter(
    (r: Restaurant) => r.currentStatus === tab
  );

  const isSuperadmin = currentUserRole === "superadmin";

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Restaurants</h1>

      {isSuperadmin && (
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setTab("active")}
            className={`px-4 py-2 rounded ${
              tab === "active"
                ? "bg-orange text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setTab("blocked")}
            className={`px-4 py-2 rounded ${
              tab === "blocked"
                ? "bg-orange text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Blocked
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {(isSuperadmin ? filteredRestaurants : restaurants).map(
          (rest: Restaurant) => (
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
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 break-words">
                    {rest.restaurantName}
                  </h1>

                  {rest.rating > 0 && (
                    <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-semibold text-base md:text-lg xl:text-xl">
                      <span>{rest.rating.toFixed(1)}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 md:h-6 md:w-6 xl:h-7 xl:w-7 fill-current"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.92-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.285-3.95a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.148a1 1 0 00.951-.69l1.285-3.95z" />
                      </svg>
                      <span className="text-sm md:text-base xl:text-lg">
                        ({rest.noOfRatings})
                      </span>
                    </div>
                  )}
                </div>

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
                  {rest.cuisines.map((cuisine, idx) => (
                    <Badge
                      key={idx}
                      className="font-medium px-2 py-1 rounded-full shadow-sm"
                    >
                      {cuisine}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              {isSuperadmin && (
                <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 flex justify-between items-center">
                  <Link to={`/restaurant/${rest._id}`}>
                    <Button className="bg-orange hover:bg-hoverOrange font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200">
                      View Menus
                    </Button>
                  </Link>

                  <Button
                    variant={
                      rest.currentStatus === "active"
                        ? "destructive"
                        : "default"
                    }
                    onClick={() => toggleStatus(rest)}
                    className="font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200"
                  >
                    {rest.currentStatus === "active" ? "Block" : "Activate"}
                  </Button>
                </CardFooter>
              )}

              {!isSuperadmin && (
                <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100">
                  <Link to={`/restaurant/${rest._id}`}>
                    <Button className="bg-orange hover:bg-hoverOrange font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200">
                      View Menus
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;
