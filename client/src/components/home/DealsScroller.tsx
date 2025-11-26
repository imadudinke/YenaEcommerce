import React from "react";
import { HorizontalScroller } from "./HorizontalScroller";
import { ProductCard, type Product } from "./ProductCard";
import { cn } from "@/lib/utils";

interface DealsScrollerProps {
  title: string;
  products: Product[];
  endsInSeconds?: number;
  className?: string;
}

export const DealsScroller: React.FC<DealsScrollerProps> = ({
  title,
  products,
  endsInSeconds,
  className,
}) => {
  const [remaining, setRemaining] = React.useState(endsInSeconds || 0);

  React.useEffect(() => {
    if (!endsInSeconds) return;
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [endsInSeconds]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  if (!products.length) return null;

  return (
    <section
      className={cn("py-6 bg-white shadow-sm border-t border-b", className)}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-3 flex-wrap">
          <span>{title}</span>
          {endsInSeconds && remaining > 0 && (
            <span className="text-xs font-mono bg-red-500 text-white px-2.5 py-1.5 rounded-lg shadow-md">
              Ends in {formatTime(remaining)}
            </span>
          )}
        </h2>
        <a
          href="/deals"
          className="text-sm font-medium text-blue-600 hover:underline whitespace-nowrap"
        >
          All Deals
        </a>
      </div>
      <HorizontalScroller>
        {products.map((p) => (
          <div key={p.id} className="snap-start w-48 shrink-0 pr-4 first:pl-0">
            <ProductCard product={p} />
          </div>
        ))}
      </HorizontalScroller>
    </section>
  );
};
