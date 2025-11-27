import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { handleAddToCart } from "@/helpers";
import { useCartStore } from "@/store/cartStore";

export interface Product {
  id: number;
  name: string;
  price: string | number;
  image?: string | null;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  onAddToCart,
}) => {
  const add = useCartStore((s) => s.add);
  const price =
    typeof product.price === "number"
      ? product.price.toFixed(2)
      : product.price;
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card/70 backdrop-blur-sm soft-shadow hover-rise transition-all",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform will-change-transform"
          />
        ) : (
          <img
            src="/placeholder-product.svg"
            alt={product.name + " placeholder"}
            className="h-full w-full object-contain p-6 opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Quick actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            aria-label="Add to wishlist"
            className="size-9 rounded-full bg-white/80 backdrop-blur hover:bg-white shadow-sm grid place-content-center"
          >
            <Heart className="size-4" />
          </button>
          <button
            aria-label="Quick view"
            className="size-9 rounded-full bg-white/80 backdrop-blur hover:bg-white shadow-sm grid place-content-center"
          >
            <Link to={`/product/${product.id}`}>
              <Eye className="size-4" />
            </Link>
          </button>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-1">
        <h3
          className="text-[13px] sm:text-sm font-semibold line-clamp-2 min-h-10"
          title={product.name}
        >
          {product.name}
        </h3>
        <p className="text-sm sm:text-base font-bold tracking-tight">
          ${price}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-1 w-full"
          onClick={() => handleAddToCart(product, 1, add)}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};
