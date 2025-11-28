import { getCurrentUser } from "@/api/auth";
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
  isLoading: Boolean;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  isAuthenticated: Boolean;
}

export const useAuthStore = create<AuthProps>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),
  isLoading: true,
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  checkAuthStatus: async () => {
    set({ isLoading: true });
    try {
      const currentUser = await getCurrentUser();

      if (currentUser) {
        set({
          user: currentUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
