import { useEffect } from "react";
import { useCartStore } from "./store/cartStore";
import { useAuthStore } from "./store/authStore";

export const AppInitializer = () => {
  const fetchCart = useCartStore((state) => state.fetchCart);
  const checkAuthStatus = useAuthStore((s) => s.checkAuthStatus);
  useEffect(() => {
    checkAuthStatus();
    fetchCart();
  }, [fetchCart]);
  return null;
};
