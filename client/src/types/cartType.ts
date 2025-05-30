import { MenuItem } from "./restaurantType";

export interface CartItem extends MenuItem {
    quantity: number;
    _id: string; // Assuming MenuItem has an _id field
    restName?: string; // Optional, if you want to store the restaurant name in the cart item
}
export type CartState = {
    cart: CartItem[];
    getCart: () => Promise<void>;
    addToCart: (item: MenuItem, restName: string) => void;
    clearCart: (restaurantId: string) => void;
    removeFromTheCart: (id: string, restId: string, quantity: number) => void;
}