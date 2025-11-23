import { useAuthStore } from "@/store/authStore";
import apiFetch from "./fetchClient";

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

export default loginAuth;
