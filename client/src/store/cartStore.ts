import { getCartData } from "@/api/Cart";
import { create } from "zustand";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image?: string | null;
}
interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
  fetchCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  add: (item, qty = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + qty } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, qty }] };
    }),
  remove: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
  count: () => get().items.reduce((s, i) => s + i.qty, 0),
  total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getCartData();
      if (data) {
        const normalizedItems: CartItem[] = data.items.map((apiItem) => ({
          id: apiItem.product.id,
          name: apiItem.product.name,
          price: parseFloat(apiItem.product.price),
          image: apiItem.product.image,
          qty: apiItem.quantity,
        }));
        set({ items: normalizedItems, isLoading: false });
      } else {
        set({ isLoading: false, items: [] });
      }
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
      set({ isLoading: false, error: "Failed to load cart data." });
    }
  },
}));
