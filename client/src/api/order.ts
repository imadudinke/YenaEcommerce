import apiFetch from "./fetchClient";

export const TrackOrder = async () => {
  try {
    return await apiFetch("api/orderList/");
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
