import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRestaurantStore } from "@/store/useRestaurantStore";

const Orders = () => {
  const { restaurantOrder, getRestaurantOrders, updateRestaurantOrder } =
    useRestaurantStore();

  useEffect(() => {
    getRestaurantOrders();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await updateRestaurantOrder(id, status);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-10">
        Restaurant Orders Overview
      </h1>

      <div className="space-y-8">
        {restaurantOrder.map((order) => (
          <div
            key={order._id}
            className="flex flex-col gap-6 md:flex-row justify-between bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            {/* Left: Order & Customer Details */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {order.deliveryDetails?.name || order.user?.fullname}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-semibold">Email:</span>{" "}
                {order.deliveryDetails?.email || order.user?.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-semibold">Address:</span>{" "}
                {order.deliveryDetails?.address}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-semibold">Total Amount:</span> ₹
                {order.totalAmount || 0}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-semibold">Order Placed At:</span>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <div className="mt-4 flex gap-4 flex-wrap">
                {order.cartItems?.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col items-center border rounded-lg p-2 w-28 shadow-sm bg-gray-50 dark:bg-gray-700"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md mb-2"
                    />
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Status Dropdown */}
            <div className="w-full md:w-1/3 flex flex-col justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order Status
                </Label>
                <Select
                  onValueChange={(newStatus) =>
                    handleStatusChange(order._id, newStatus)
                  }
                  defaultValue={order.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {[
                        "Pending",
                        "Confirmed",
                        "Preparing",
                        "Done"
                      ].map((status, index) => (
                        <SelectItem key={index} value={status.toLowerCase()}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
