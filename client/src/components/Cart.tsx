// import { Minus, Plus } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Button } from "./ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "./ui/table";
// import { useState } from "react";
// import CheckoutConfirmPage from "./CheckoutConfirmPage";
// // import { createCartStore } from "@/store/createCartStore";
// // import { CartItem } from "@/types/cartType";

// import { useCartStore } from "@/context/CartProvider"; // import from new context provider
// import { CartItem } from "@/types/cartType";
// const Cart = () => {
//   const [open, setOpen] = useState<boolean>(false);
//   const {
//     cart,
//     decrementQuantity,
//     incrementQuantity,
//     removeFromTheCart,
//     clearCart,
//   } = useCartStore();

//   let totalAmount = cart.reduce((acc, ele) => {
//     return acc + ele.price * ele.quantity;
//   }, 0);
//   return (
//     <div className="flex flex-col max-w-7xl mx-auto my-10">
//       <div className="flex justify-end">
//         <Button variant="link" onClick={clearCart}>
//           Clear All
//         </Button>
//       </div>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Items</TableHead>
//             <TableHead>Title</TableHead>
//             <TableHead>Price</TableHead>
//             <TableHead>Quantity</TableHead>
//             <TableHead>Total</TableHead>
//             <TableHead className="text-right">Remove</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {cart.map((item: CartItem) => (
//             <TableRow>
//               <TableCell>
//                 <Avatar>
//                   <AvatarImage src={item.image} alt="" />
//                   <AvatarFallback>CN</AvatarFallback>
//                 </Avatar>
//               </TableCell>
//               <TableCell> {item.name}</TableCell>
//               <TableCell> {item.price}</TableCell>
//               <TableCell>
//                 <div className="w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-md">
//                   <Button
//                     onClick={() => decrementQuantity(item._id)}
//                     size={"icon"}
//                     variant={"outline"}
//                     className="rounded-full bg-gray-200"
//                   >
//                     <Minus />
//                   </Button>
//                   <Button
//                     size={"icon"}
//                     className="font-bold border-none"
//                     disabled
//                     variant={"outline"}
//                   >
//                     {item.quantity}
//                   </Button>
//                   <Button
//                     onClick={() => incrementQuantity(item._id)}
//                     size={"icon"}
//                     className="rounded-full bg-orange hover:bg-hoverOrange"
//                     variant={"outline"}
//                   >
//                     <Plus />
//                   </Button>
//                 </div>
//               </TableCell>
//               <TableCell>{item.price * item.quantity}</TableCell>
//               <TableCell className="text-right">
//                 <Button
//                   size={"sm"}
//                   className="bg-orange hover:bg-hoverOrange"
//                   onClick={() => removeFromTheCart(item._id)}
//                 >
//                   Remove
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//         <TableFooter>
//           <TableRow className="text-2xl font-bold">
//             <TableCell colSpan={5}>Total</TableCell>
//             <TableCell className="text-right">{totalAmount}</TableCell>
//           </TableRow>
//         </TableFooter>
//       </Table>
//       <div className="flex justify-end my-5">
//         <Button
//           onClick={() => setOpen(true)}
//           className="bg-orange hover:bg-hoverOrange"
//         >
//           Proceed To Checkout
//         </Button>
//       </div>
//       <CheckoutConfirmPage open={open} setOpen={setOpen} />
//     </div>
//   );
// };

// export default Cart;

import { Minus, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useEffect, useState } from "react";
import CheckoutConfirmPage from "./CheckoutConfirmPage";
import { useCartStore } from "@/context/CartProvider";
import { CartItem } from "@/types/cartType";

const Cart = () => {
  const [openCartId, setOpenCartId] = useState<string | null>(null);
  const {
    cart,
    // decrementQuantity,
    // incrementQuantity,
    removeFromTheCart,
    clearCart,
    addToCart,
    getCart,
  } = useCartStore();

  // Group cart items by restaurantId
  const groupedCart = cart.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.restaurant]) acc[item.restaurant] = [];
    acc[item.restaurant].push(item);
    return acc;
  }, {});

  const handleOpen = (restaurantId: string) => {
    setOpenCartId(restaurantId);
  };

  useEffect(() => {
    // get cart
    getCart();
  }, []);

  return (
    <div className="flex flex-col max-w-7xl mx-auto my-10 gap-10">
      {Object.entries(groupedCart).map(([restaurantId, items]) => {
        const totalAmount = items.reduce(
          (acc, ele) => acc + ele.price * ele.quantity,
          0
        );

        return (
          <div key={restaurantId} className="border p-4 rounded-lg shadow-md">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">
                {items[0].restName || "Unknown"}
              </h2>
              <Button variant="link" onClick={() => clearCart(restaurantId)}>
                Clear Cart
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Items</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Remove</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={item.image} alt="" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      <div className="w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-md">
                        <Button
                          onClick={() =>
                            removeFromTheCart(
                              item._id,
                              item.restaurant,
                              item.quantity - 1
                            )
                          }
                          size="icon"
                          variant="outline"
                          className="rounded-full bg-gray-200"
                        >
                          <Minus />
                        </Button>
                        <Button
                          size="icon"
                          className="font-bold border-none"
                          disabled
                          variant="outline"
                        >
                          {item.quantity}
                        </Button>
                        <Button
                          onClick={() => addToCart(item, restaurantId)}
                          size="icon"
                          className="rounded-full bg-orange hover:bg-hoverOrange"
                          variant="outline"
                        >
                          <Plus />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{item.price * item.quantity}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="bg-orange hover:bg-hoverOrange"
                        onClick={() =>
                          removeFromTheCart(item._id, restaurantId, 0)
                        }
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="text-2xl font-bold">
                  <TableCell colSpan={5}>Total</TableCell>
                  <TableCell className="text-right">{totalAmount}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>

            <div className="flex justify-end my-5">
              <Button
                onClick={() => handleOpen(restaurantId)}
                className="bg-orange hover:bg-hoverOrange"
              >
                Proceed To Checkout
              </Button>
            </div>

            {/* Checkout Modal */}
            <CheckoutConfirmPage
              open={openCartId === restaurantId}
              setOpen={(open) => {
                setOpenCartId(open ? restaurantId : null);
              }}
              restaurantId={items[0].restaurant}
              cartItems={items}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Cart;
