import apiFetch from "./fetchClient";

export const getCartData = async () => {
  try {
    await apiFetch("api/");
  } catch (error) {}
};
