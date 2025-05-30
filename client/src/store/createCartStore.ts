// import { CartState } from "@/types/cartType";
// import { MenuItem } from "@/types/restaurantType";
// import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";


// export const createCartStore = create<CartState>()(persist((set) => ({
//     cart: [],
//     addToCart: (item: MenuItem) => {
//         set((state) => {
//             const exisitingItem = state.cart.find((cartItem) => cartItem._id === item._id);
//             if (exisitingItem) {
//                 // already added in cart then inc qty
//                 return {
//                     cart: state?.cart.map((cartItem) => cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
//                     )
//                 };
//             } else {
//                 // add cart
//                 return {
//                     cart: [...state.cart, { ...item, quantity: 1 }]
//                 }
//             }
//         })
//     },
//     clearCart: () => {
//         set({ cart: [] });
//     },
//     removeFromTheCart: (id: string) => {
//         set((state) => ({
//             cart: state.cart.filter((item) => item._id !== id)
//         }))
//     },
//     incrementQuantity: (id: string) => {
//         set((state) => ({
//             cart: state.cart.map((item) => item._id === id ? { ...item, quantity: item.quantity + 1 } : item)
//         }))
//     },
//     decrementQuantity: (id: string) => {
//         set((state) => ({
//             cart: state.cart.map((item) => item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)
//         }))
//     }
// }),
//     {
//         name: 'cart-name',
//         storage: createJSONStorage(() => localStorage)
//     }
// ))

// hooks/useUserCartStore.ts
import { CartState } from "@/types/cartType";
import { MenuItem } from "@/types/restaurantType";
import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
const API_END_POINT = "http://localhost:8000/api/v1/order"

export const createCartStore = (userId: string) => create<CartState>()(
  persist(
    (set) => ({
      cart: [],

      getCart: async () => {
        try {
          const response = await axios.get(`${API_END_POINT}/getcart`, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true, // If you're using cookies for auth
          });

          if (response.data.success) {
            // Flatten the cart structure to match your CartState
            const flattenedCart = response.data.cart.flatMap((cartGroup: any) =>
              cartGroup.cartItems.map((item: any) => ({
                _id: item.menuId,
                name: item.name,
                description: "", // Add if available in response
                price: item.price,
                image: item.image,
                restaurant: cartGroup.restaurantId,
                quantity: item.quantity,
                restName: cartGroup.restaurantName
              }))
            );

            set({ cart: flattenedCart });
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
          set({ cart: [] });
        }
      },
      addToCart: async (item: MenuItem) => {
        const response = await axios.post(`${API_END_POINT}/addtocart`, {
          userId,
          restaurantId: item.restaurant,
          menuId: item._id,
          quantity: item.quantity || 1,
        })
        if (response.data.success) {
          // add pop up
          set((state) => {
            const existing = state.cart.find((c) => c._id === item._id);
            if (existing) {
              return {
                cart: state.cart.map((c) =>
                  c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
                ),
              };
            }
            return { cart: [...state.cart, { ...item, quantity: 1 }] };
          });
        }
      },

      clearCart: (restaurantId: string) => {
        const response = axios.post(`${API_END_POINT}/clearCart`, {
          userId,
          restaurantId,
        });
        response.then((res) => {
          if (res.data.success) {
            set({ cart: [] });
          }
        }).catch((error) => {
          console.error("Error clearing cart:", error);
        });
      },
      removeFromTheCart: (id: string, restId: string, quantity: number) => {
        const response = axios.post(`${API_END_POINT}/removeItemFromCart`, {
          userId,
          menuId: id,
          restaurantId: restId,
          quantity,
        });
        response.then((res) => {
          if (res.data.success) {

            set((state) => ({
              cart: state.cart.filter((item) => item._id !== id || item.restaurant !== restId || item.quantity > 1)
                .map((item) =>
                  item._id === id && item.restaurant === restId
                    ? { ...item, quantity: quantity > 1 ? item.quantity - 1 : 0 }
                    : item
                ),
            }));
            if (quantity <= 1) {
              // If quantity is 0, remove the item from the cart
              set((state) => ({
                cart: state.cart.filter((item) => item._id !== id || item.restaurant !== restId)
              }));
            }
          }
        }).catch((error) => {
          console.error("Error removing item from cart:", error);
        });
      }
    }),
    {
      name: `cart-${userId}`,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
