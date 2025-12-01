import { useAuthStore } from "@/store/authStore";
import apiFetch from "./fetchClient";
import { useCartStore } from "@/store/cartStore";
const BASE_URL: string =
  (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:8000/";
console.log(BASE_URL);
interface NewUserProps {
  email: string;
  password: string;
  password2: string;
  full_name: string;
}
export interface ApiUser {
  id: string;
  email: string;
  full_name: string;
  avatar?: string;
}

const loginAuth = async (email: string, password: string) => {
  try {
    const data = await apiFetch("api/token/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    useAuthStore.getState().setUser(data.user);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const logoutAuth = async () => {
  try {
    await apiFetch("api/auth/logout/", {
      method: "POST",
    });
    useAuthStore.getState().logout();
    useCartStore.getState().clear();
  } catch (error) {
    console.error("Error during logout:", error);
    useAuthStore.getState().logout();
    useCartStore.getState().clear();
  }
};

export const getCurrentUser = async (): Promise<ApiUser | null> => {
  try {
    const data = await apiFetch<ApiUser>("api/auth/user/");
    return data;
  } catch (error) {
    return null;
  }
};

export const createUser = async (newUser: NewUserProps) => {
  try {
    const data = await apiFetch("api/auth/user/create/", {
      method: "POST",
      body: JSON.stringify(newUser),
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default loginAuth;

export const forgotPassword = async (email: string) => {
  try {
    const res = await fetch(BASE_URL + "api/password_rest/", {
      method: "POST",
      headers: {
        // THIS IS THE CRUCIAL PART:
        "Content-Type": "application/json",
        // Include CSRF token if necessary for security
      },
      body: JSON.stringify({ email: email }),
    });
    return res.json();
  } catch (error) {
    console.error(error);
  }
};
