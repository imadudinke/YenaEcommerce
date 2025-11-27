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

export interface CartPayLoad {
  product_id: string;
  quantity?: string;
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

export const IncreaseOrDecreaseQuantity = async (data: CartPayLoad) => {
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

export const removeFromCart = async (data: CartPayLoad) => {
  try {
    await apiFetch("api/cart/remove/", {
      method: "DELETE",
      body: JSON.stringify(data),
    });
    return { message: "Successfully Removed" };
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    throw new Error("Failed to remove item from cart.");
  }
};

export const addToCart = async (data: CartPayLoad) => {
  try {
    await apiFetch("api/cart/add/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    throw new Error("Could not add item to cart.");
  }
};
