import React from "react";
import { ProductCard, type Product } from "./ProductCard";
import { HorizontalScroller } from "./HorizontalScroller";
// import { Button } from "@/components/ui/button"; // removed unused import
import { cn } from "@/lib/utils";

interface ProductSectionProps {
  title: string;
  products: Product[];
  layout?: "grid" | "scroller";
  actionHref?: string;
  className?: string;
  onAddToCart?: (product: Product) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  layout = "grid",
  // actionHref,
  className,
  onAddToCart,
}) => {
  if (!products.length) return null;
  const content =
    layout === "scroller" ? (
      <HorizontalScroller className="mt-2">
        {products.map((p) => (
          <div key={p.id} className="snap-start w-44 shrink-0">
            <ProductCard product={p} onAddToCart={onAddToCart} />
          </div>
        ))}
      </HorizontalScroller>
    ) : (
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
        ))}
      </div>
    );
  return (
    <section className={cn("py-6", className)}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
          {title}
        </h2>
      </div>
      {content}
    </section>
  );
};
