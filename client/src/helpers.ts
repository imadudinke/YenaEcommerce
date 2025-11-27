import { addToCart, type CartPayLoad } from "./api/Cart";
import type { Product } from "./components/home/ProductCard";

export type AddToCartStateFunction = (
  productDetails: {
    id: number;
    name: string;
    price: number;
    image: string | null | undefined;
  },
  qty: number
) => void;
export const handleAddToCart = async (
  product: Product,
  qty: number,
  addStateFunction: AddToCartStateFunction,
  inStock = true
) => {
  if (!product || !inStock) return;
  addStateFunction(
    {
      id: Number(product.id),
      name: product.name,
      price: parseFloat(String(product.price)),
      image: product.image ?? null,
    },
    qty
  );
  const data: CartPayLoad = {
    product_id: String(product.id),
    quantity: String(qty),
  };
  try {
    await addToCart(data);
    console.log("Item added to cart successfully.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to add item to cart in handler:", error.message);
    } else {
      console.error("Failed to add item to cart in handler:", error);
    }
  }
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
