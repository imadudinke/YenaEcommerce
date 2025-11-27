import apiFetch from "./fetchClient";

interface CartProduct {
  id: number;
  name: string;
  price: string;
  image: string | null;
}

export interface CartItem {
  id: number;
  product: CartProduct;
  quantity: number;
}

export interface CartData {
  items: CartItem[];
  total_items: number;
  total_price: string;
}

interface dataProps {
  product_id: string;
  quantity: string;
}

export const getCartData = async (): Promise<CartData | null> => {
  try {
    const data: CartData = await apiFetch("api/cart/");
    console.log(data, ":::::::::::::::");
    return data;
  } catch (error) {
    console.error("Error loading the Cart:", error);
    return null;
  }
};

export const IncreaseOrDecreaseQuantity = async (data: dataProps) => {
  try {
    console.log(data);
    await apiFetch("api/cart/quantity/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Failed to update cart quantity:", error);
    throw new Error("Could not update item quantity.");
  }
};
/* {product_id: '6', quantity: '1'} */
