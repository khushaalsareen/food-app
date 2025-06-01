import { MenuItem } from "@/types/restaurantType";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useCartStore } from "@/context/CartProvider";
import { useUserStore } from "@/store/useUserStore";
import { Plus, Star, Clock, Utensils } from "lucide-react";
import { Badge } from "./ui/badge";

const AvailableMenu = ({
  menus,
  restName,
}: {
  menus: MenuItem[];
  restName: string;
}) => {
  const { addToCart } = useCartStore();
  const { user } = useUserStore();

  return (
    <div className="md:p-4">
      <h1 className="text-xl md:text-2xl font-extrabold mb-6">
        Available Menus
      </h1>
      <div className="grid md:grid-cols-3 gap-4">
        {menus.map((menu: MenuItem) => (
          <Card
            key={menu._id}
            className="w-full shadow-lg rounded-lg overflow-hidden"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden">
              <img
                src={menu.image}
                alt={menu.name}
                className="w-full h-48 sm:h-52 lg:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Badge */}
            </div>

            <CardContent className="p-4 lg:p-5 space-y-3">
              {/* Menu Name */}
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-orange-500 transition-colors">
                {menu.name}
              </h2>

              {/* Description */}
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                {menu.description ||
                  "Delicious and freshly prepared with premium ingredients"}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>15-20 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>4.5</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl lg:text-3xl font-bold text-orange-500">
                    ₹{menu.price}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    per item
                  </span>
                </div>
              </div>
            </CardContent>

            {/* Add to Cart Button */}
            {user?.role === "user" && (
              <CardFooter className="p-4 lg:p-5 pt-0">
                <Button
                  onClick={() => addToCart(menu, restName)}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 lg:py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {menus.length === 0 && (
        <div className="text-center py-12 lg:py-16">
          <Utensils className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl lg:text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            No menus available
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Check back later for delicious options!
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailableMenu;
