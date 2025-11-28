import { useAuthStore } from "@/store/authStore";
import apiFetch from "./fetchClient";

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

    useAuthStore.getState().setUser(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getCurrentUser = async (): Promise<ApiUser | null> => {
  try {
    const data = await apiFetch<ApiUser>("api/auth/user/");
    return data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export default loginAuth;
