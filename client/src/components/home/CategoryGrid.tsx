import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
}

interface CategoryGridProps {
  categories: Category[];
  className?: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  className,
}) => {
  if (!categories.length) return null;
  return (
    <div
      className={cn(
        "grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
        className
      )}
    >
      {categories.map((c) => (
        <Link
          key={c.id}
          className="group rounded-lg border bg-card p-3 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          to={`/search?category=${c.slug}`}
        >
          <div className="size-20 rounded-md overflow-hidden bg-muted mb-2 relative">
            {c.image ? (
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="grid place-content-center h-full w-full text-xs text-muted-foreground">
                No Image
              </div>
            )}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <span className="text-sm font-medium line-clamp-2">{c.name}</span>
        </Link>
      ))}
    </div>
  );
};
