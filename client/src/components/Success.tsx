import { IndianRupee } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";
import { CartItem } from "@/types/cartType";

const Success = () => {
  const { orders, getOrderDetails } = useOrderStore();

  useEffect(() => {
    getOrderDetails();
  }, [getOrderDetails]);

  if (orders.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
          Order not found!
        </h1>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {orders.map((order, orderIndex) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
          >
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Order #{orderIndex + 1} Status:{" "}
                <span className="text-[#FF5A5A]">{order.status}</span>
              </h1>
            </div>

            {/* Restaurant Info */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Restaurant: {order.restaurant?.restaurantName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {order.restaurant?.city}, {order.restaurant?.country}
              </p>
            </div>

            {/* Cart Items */}
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Ordered Items
              </h3>
              {order.cartItems.map((item: CartItem, index) => (
                <div className="mb-4" key={item._id}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-md object-cover"
                      />
                      <h3 className="ml-4 text-gray-800 dark:text-gray-200 font-medium">
                        {item.name} × {item.quantity}
                      </h3>
                    </div>
                    <div className="text-gray-800 dark:text-gray-200 flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      <span className="text-lg font-medium ml-1">
                        {item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                  <Separator className="my-3" />
                </div>
              ))}
            </div>

            {/* Total Amount */}
            {order.totalAmount && (
              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Total Amount:
                </span>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                  <IndianRupee className="w-5 h-5" />
                  {order.totalAmount}
                </span>
              </div>
            )}

            <div className="mt-6">
              <Link to="/cart">
                <Button className="bg-orange hover:bg-hoverOrange w-full py-3 rounded-md shadow-lg">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Success;
