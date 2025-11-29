import type { OrderAddressForm } from "@/Page/OrderAdressPage";
import apiFetch from "./fetchClient";

export const paymentInitiate = async (addressData: OrderAddressForm) => {
  try {
    return await apiFetch("api/payment/initiate/", {
      method: "POST",
      body: JSON.stringify(addressData),
    });
  } catch (error) {
    console.error(error);
    alert("Failed to start the payment process.");
  }
};
