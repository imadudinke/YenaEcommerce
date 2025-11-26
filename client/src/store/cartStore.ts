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
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
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
}));
