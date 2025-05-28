import React, { createContext, useContext, useMemo } from "react";
import { createCartStore } from "@/store/createCartStore"; // adjust path
import { CartState } from "@/types/cartType";

const CartContext = createContext<ReturnType<ReturnType<typeof createCartStore>> | null>(null);

export const CartProvider = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) => {
  const store = useMemo(() => createCartStore(userId), [userId]);

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
};

export const useCartStore = (): CartState => {
  const store = useContext(CartContext);
  if (!store) throw new Error("useCartStore must be used within a CartProvider");
  return store();
};
