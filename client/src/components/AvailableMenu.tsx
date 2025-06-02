import { MenuItem } from "@/types/restaurantType";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useCartStore } from "@/context/CartProvider"; // Use the hook here
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";

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
            <img src={menu.image} alt="" className="w-full h-40 object-cover" />
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {menu.name}
              </h2>
              <p className="text-sm text-gray-600 mt-2">{menu.description}</p>
              <h3 className="text-lg font-semibold mt-4">
                Price: <span className="text-[#D19254]">₹{menu.price}</span>
              </h3>
            </CardContent>
            {user?.role === "user" && (
              <CardFooter className="p-4">
                <Button
                  onClick={() => {
                    addToCart(menu, restName);
                    toast.success("Added to cart", {
                      description: `${menu.name} has been added.`,
                    });
                  }}
                  className="w-full bg-orange hover:bg-hoverOrange"
                >
                  Add to Cart
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableMenu;
