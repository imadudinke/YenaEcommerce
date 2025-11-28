import {
  type CartData,
  getCartData,
  IncreaseOrDecreaseQuantity,
  removeFromCart,
} from "@/api/Cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import CartLoading from "@/components/layout/CartLoading";
import EmptyCart from "@/components/cart/EmptyCart";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/components/home/ProductCard";

import CartSummery from "@/components/cart/CartSummery";
import { formatCurrency } from "@/helpers";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:8000";

const CartAndCheckout = () => {
  const [_, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const cartItems = useCartStore((state) => state.items);
  const add = useCartStore((s) => s.add);
  const remove = useCartStore((s) => s.remove);

  const count = useCartStore((state) => state.count);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCartData();
        setCartData(data);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const items = cartItems ?? [];

  const updateQuantity = async (product: Product, delta: number) => {
    const current = items.find((it) => it.id === product.id);
    const newQty = Math.max(1, (current?.qty || 1) + delta);
    add(
      {
        id: Number(product.id),
        name: product.name,
        price: parseFloat(String(product.price)),
        image: product.image ?? null,
      },
      delta
    );
    try {
      await IncreaseOrDecreaseQuantity({
        product_id: String(product.id),
        quantity: String(newQty),
      });
    } catch (error) {
      console.error("Failed to update quantity; reverting", error);
    }
  };

  const removeItem = async (productId: number) => {
    remove(productId);
    try {
      await removeFromCart({
        product_id: String(productId),
      });
    } catch (error) {
      console.error("Failed to remove item; refreshing cart", error);
      try {
        const data = await getCartData();
        if (data) setCartData(data);
      } catch (e) {}
    }
  };

  if (loading) {
    return <CartLoading />;
  }

  if (!cartItems || cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mb-8 rounded-lg border bg-secondary/50 backdrop-blur-sm px-5 md:px-8 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-md border bg-background grid place-items-center text-lg">
            🛒
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Shopping Cart
            </h1>
            <div className="text-xs text-muted-foreground mt-0.5">
              Review your items before checkout
            </div>
          </div>
          <span className="ml-auto md:ml-2 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">
            {count()} item{count() !== 1 && "s"}
          </span>
        </div>
        <div className="flex items-center gap-3 justify-between md:justify-end">
          {/* simple stepper */}
          <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="size-6 rounded-full border bg-primary text-primary-foreground grid place-items-center text-[11px] font-medium">
                1
              </span>
              <span className="font-medium text-foreground">Cart</span>
            </div>
            <span className="opacity-40">→</span>
            <div className="flex items-center gap-1.5">
              <span className="size-6 rounded-full border bg-muted grid place-items-center text-[11px] font-medium">
                2
              </span>
              <span>Details</span>
            </div>
            <span className="opacity-40">→</span>
            <div className="flex items-center gap-1.5">
              <span className="size-6 rounded-full border bg-muted grid place-items-center text-[11px] font-medium">
                3
              </span>
              <span>Payment</span>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/" aria-label="Back to homepage">
              Home
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
          <div className="hidden md:grid grid-cols-12 px-2 text-xs uppercase tracking-wide text-muted-foreground">
            <div className="col-span-6">Product</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-1 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          <Separator className="hidden md:block" />

          {items.map((item) => {
            const price = +item.price;
            const lineTotal = price * item.qty;
            const imgSrc = item.image
              ? new URL(item.image, API_BASE).toString()
              : "/placeholder-product.svg";
            return (
              <div
                key={item.id}
                className="grid grid-cols-12 items-center gap-4 rounded-lg border p-4"
              >
                {/* product */}
                <div className="col-span-12 md:col-span-6 flex items-center gap-4 min-w-0">
                  <img
                    src={imgSrc}
                    alt={item.name}
                    className="size-20 rounded-md object-cover bg-muted"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/placeholder-product.svg";
                    }}
                  />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(price)} each
                    </p>
                    <button
                      className="mt-2 text-xs text-destructive hover:underline"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* quantity */}
                <div className="col-span-6 md:col-span-3 flex md:justify-center">
                  <div className="inline-flex items-center gap-2 border rounded-md p-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item, -1)}
                      disabled={item.qty <= 1}
                    >
                      −
                    </Button>
                    <div className="w-10 text-center text-sm font-medium tabular-nums">
                      {item.qty}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item, 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* unit price */}
                <div className="col-span-3 md:col-span-1 text-right font-medium">
                  {formatCurrency(price)}
                </div>

                {/* line total */}
                <div className="col-span-3 md:col-span-2 text-right font-semibold">
                  {formatCurrency(lineTotal)}
                </div>
              </div>
            );
          })}
        </div>

        <CartSummery />
      </div>
    </section>
  );
};

export default CartAndCheckout;
