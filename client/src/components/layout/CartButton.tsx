import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

interface CartButtonProps {
  className?: string;
}
export const CartButton: React.FC<CartButtonProps> = ({ className }) => {
  const count = useCartStore((s) => s.count());
  return (
    <a
      href="/cart"
      className={cn("relative inline-flex items-center", className)}
      aria-label="Cart"
    >
      <ShoppingCart className="size-6" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-destructive text-[10px] font-bold text-white grid place-content-center">
          {count}
        </span>
      )}
    </a>
  );
};
