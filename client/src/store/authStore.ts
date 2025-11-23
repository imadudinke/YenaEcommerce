import { create } from "zustand";

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar?: string;
}

interface AuthProps {
  user: User | null;
  setUser: (user: User) => void;
  isAuthenticated: Boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthProps>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
