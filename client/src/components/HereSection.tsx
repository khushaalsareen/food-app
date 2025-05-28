// import { useState } from "react";
// import { Input } from "./ui/input";
// import { Search } from "lucide-react";
// import { Button } from "./ui/button";
// import HereImage from "@/assets/hero_pizza.png";
// import { useNavigate } from "react-router-dom";

// const HereSection = () => {
//   const [searchText, setSearchText] = useState<string>("");
//   const navigate = useNavigate();
//   return (
//     <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:p-10 rounded-lg items-center justify-center m-4 gap-20">
//       <div className="flex flex-col gap-10 md:w-[40%]">
//         <div className="flex flex-col gap-5">
//           <h1 className="font-bold md:font-extrabold md:text-5xl text-4xl">
//             Order Food anytime & anywhere
//           </h1>
//           <p className="text-gray-500">
//             Hey! Our Delicios food is waiting for you, we are always near to
//             you.
//           </p>
//         </div>
//         <div className="relative flex items-center gap-2">
          // <Input
          //   type="text"
          //   value={searchText}
          //   placeholder="Search restaurant by name, city & country"
          //   onChange={(e) => setSearchText(e.target.value)}
          //   className="pl-10 shadow-lg"
          // />
          // <Search className="text-gray-500 absolute inset-y-2 left-2" />
          // <Button onClick={() => navigate(`/search/${searchText}`)} className="bg-orange hover:bg-hoverOrange">Search</Button>
//         </div>
//       </div>
//       <div>
//         <img 
//         src={HereImage} 
//         alt="" 
//         className="object-cover w-full max-h-[500px]"
//         />
//       </div>
//     </div>
//   );
// };

// export default HereSection;


// HeroSection.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HereImage from "@/assets/hero_pizza.png";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";

const HereSection = () => {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/search/${encodeURIComponent(searchText.trim())}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto p-4 md:p-10 gap-10">
      <div className="flex flex-col gap-6 md:w-1/2">
        <h1 className="text-4xl md:text-5xl font-bold">
          Order Food Anytime & Anywhere
        </h1>
        <p className="text-gray-600">
          Our delicious food is waiting for you. We are always near you!
        </p>
        <div className="flex flex-col sm:flex-row gap-2 items-stretch relative">
          {/* <div className="relative flex-1"> */}
            {/* <input
              type="text"
              value={searchText}
              placeholder="Search by name or cuisines..."
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
          </div>
          <button
            onClick={handleSearch}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg shadow-md transition duration-300"
          >
            Search
          </button> */}

          <Input
            type="text"
            value={searchText}
            placeholder="Search by name or cuisines..."
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 shadow-lg"
          />
          <Search className="text-gray-500 absolute inset-y-2 left-2" />
          <Button onClick={handleSearch} className="bg-orange hover:bg-hoverOrange">Search</Button>


        </div>
      </div>
      <div className="w-full md:w-1/2 max-h-[500px]">
        <img
          src={HereImage}
          alt="Hero Pizza"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default HereSection;
