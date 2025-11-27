import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface CartButtonProps {
  className?: string;
}
export const CartButton: React.FC<CartButtonProps> = ({ className }) => {
  const count = useCartStore((s) => s.count());
  return (
    <Link
      to="/cart"
      className={cn("relative inline-flex items-center", className)}
      aria-label="Cart"
    >
      <button
        aria-label="View shopping cart"
        className="p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition shrink-0"
      >
        🛒
      </button>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-destructive text-[10px] font-bold text-white grid place-content-center">
          {count}
        </span>
      )}
    </Link>
  );
};
