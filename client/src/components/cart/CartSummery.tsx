import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useCartStore } from "@/store/cartStore";
import { useMemo } from "react";
import { formatCurrency } from "@/helpers";

const CartSummery = () => {
  const totalCartValue = useCartStore((state) => state.total());
  const cartItems = useCartStore((state) => state.items);
  const count = useCartStore((state) => state.count);
  const items = cartItems ?? [];

  const computed = useMemo(() => {
    const subtotal = totalCartValue;
    const totalItems = count;
    const discount = 0;
    const shipping = 0;
    const tax = 0;
    const total = totalCartValue - discount + shipping + tax;
    return { subtotal, totalItems, discount, shipping, tax, total };
  }, [items]);
  return (
    <aside className="lg:col-span-4 lg:sticky top-6 h-fit">
      <div className="rounded-lg border p-6 space-y-5 soft-shadow">
        <h2 className="text-lg font-semibold">Order Summary</h2>

        {/* Free shipping progress */}
        {(() => {
          const threshold = 2;
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
            <span>{computed.totalItems()}</span>
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
        <Link to="/order">
          <Button className="w-full h-11 md:h-12 text-base">
            Proceed to Checkout
          </Button>
        </Link>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>

        <Separator />
        <div className="text-xs text-muted-foreground">
          <p>Secure checkout. We accept major cards.</p>
        </div>
      </div>
    </aside>
  );
};

export default CartSummery;
