import {
  type CartData,
  getCartData,
  IncreaseOrDecreaseQuantity,
} from "@/api/Cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useState } from "react";
import CartLoading from "@/components/cart/CartLoading";
import EmptyCart from "@/components/cart/EmptyCart";

const API_BASE = "http://localhost:8000"; // used to render absolute media URLs

const CartAndCheckout = () => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);

  const toNum = (s: string | null | undefined) => {
    const n = typeof s === "string" ? parseFloat(s) : 0;
    return Number.isFinite(n) ? n : 0;
  };
  const safeNumber = (v: unknown) => {
    const n =
      typeof v === "number" ? v : typeof v === "string" ? parseFloat(v) : 0;
    return Number.isFinite(n) ? n : 0;
  };

  const computed = useMemo(() => {
    const subtotal = safeNumber(cartData?.total_price);
    const totalItems = safeNumber(cartData?.total_items);
    const discount = 0;
    const shipping = 0;
    const tax = 0;
    const total = subtotal - discount + shipping + tax;
    return { subtotal, totalItems, discount, shipping, tax, total };
  }, [cartData]);

  const updateQuantity = async (id: number, delta: number) => {
    try {
      const data = {
        product_id: String(id),
        quantity: String(delta),
      };
      await IncreaseOrDecreaseQuantity(data);
      setCartData((prev) => {
        if (!prev) return prev;
        const nextItems = prev.items.map((it) =>
          it.id === id
            ? { ...it, quantity: Math.max(1, it.quantity + delta) }
            : it
        );

        return { ...prev, items: nextItems };
      });
    } catch (error) {}
  };

  const removeItem = (id: number) => {
    setCartData((prev) =>
      prev ? { ...prev, items: prev.items.filter((it) => it.id !== id) } : prev
    );
  };

  if (loading) {
    return <CartLoading />;
  }

  if (!cartData || cartData.items.length === 0) {
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
            {computed.totalItems} item{computed.totalItems !== 1 && "s"}
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
            <a href="/" aria-label="Back to homepage">
              Home
            </a>
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

          {cartData.items.map((item) => {
            const price = toNum(item.product.price);
            const lineTotal = price * item.quantity;
            const imgSrc = item.product.image
              ? new URL(item.product.image, API_BASE).toString()
              : "/placeholder-product.svg";
            return (
              <div
                key={item.product.id}
                className="grid grid-cols-12 items-center gap-4 rounded-lg border p-4"
              >
                {/* product */}
                <div className="col-span-12 md:col-span-6 flex items-center gap-4 min-w-0">
                  <img
                    src={imgSrc}
                    alt={item.product.name}
                    className="size-20 rounded-md object-cover bg-muted"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/placeholder-product.svg";
                    }}
                  />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(price)} each
                    </p>
                    <button
                      className="mt-2 text-xs text-destructive hover:underline"
                      onClick={() => removeItem(item.product.id)}
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
                      onClick={() => updateQuantity(item.product.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </Button>
                    <div className="w-10 text-center text-sm font-medium tabular-nums">
                      {item.quantity}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.product.id, 1)}
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

        <aside className="lg:col-span-4 lg:sticky top-6 h-fit">
          <div className="rounded-lg border p-6 space-y-5 soft-shadow">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            {/* Free shipping progress */}
            {(() => {
              const threshold = 100;
              const remaining = Math.max(0, threshold - computed.subtotal);
              const pct = Math.min(100, (computed.subtotal / threshold) * 100);
              return (
                <div className="rounded-md border p-3 bg-accent">
                  <p className="text-xs font-medium mb-2">
                    {remaining > 0
                      ? `You're ${formatCurrency(
                          remaining
                        )} away from free shipping!`
                      : "You qualified for free shipping!"}
                  </p>
                  <div className="h-2 rounded bg-muted">
                    <div
                      className="h-2 rounded bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Promo code */}
            <div className="flex gap-2">
              <Input placeholder="Promo code" aria-label="Promo code" />
              <Button variant="outline">Apply</Button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{computed?.totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(computed.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-{formatCurrency(computed.discount)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(computed.total)}</span>
              </div>
            </div>

            <Button className="w-full h-11 md:h-12 text-base">
              Proceed to Checkout
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <a href="/">Continue Shopping</a>
            </Button>

            <Separator />
            <div className="text-xs text-muted-foreground">
              <p>Secure checkout. We accept major cards.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CartAndCheckout;
