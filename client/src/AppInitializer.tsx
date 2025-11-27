import { useEffect } from "react";
import { useCartStore } from "./store/cartStore";

export const AppInitializer = () => {
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  return null;
};
