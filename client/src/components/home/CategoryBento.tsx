import React from "react";
import { type Category } from "./CategoryGrid";
import { cn } from "@/lib/utils";

interface CategoryBentoProps {
  categories: Category[];
  className?: string;
}

export const CategoryBento: React.FC<CategoryBentoProps> = ({
  categories,
  className,
}) => {
  if (!categories.length) return null;
  const primary = categories[0];
  const rest = categories.slice(1, 10);
  return (
    <div className={cn("bento-grid", className)}>
      {/* Primary feature tile */}
      <a
        href={`/category/${primary.slug}`}
        className="span-6 md:span-6 lg:span-6 relative rounded-xl overflow-hidden glass soft-shadow group flex flex-col justify-end p-5 aspect-[4/3]"
      >
        {primary.image && (
          <img
            src={primary.image}
            alt={primary.name}
            className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:opacity-70 transition-opacity"
          />
        )}
        <div className="relative z-10">
          <h3 className="text-xl md:text-2xl font-bold mb-1 drop-shadow-sm">
            {primary.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            Explore top picks & new arrivals
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </a>
      {rest.map((c, i) => (
        <a
          key={c.id}
          href={`/category/${c.slug}`}
          className={cn(
            "relative rounded-xl glass overflow-hidden group flex flex-col justify-end p-4 aspect-square",
            i % 3 === 0 ? "span-3" : "span-2"
          )}
        >
          {c.image && (
            <img
              src={c.image}
              alt={c.name}
              className="absolute inset-0 h-full w-full object-cover opacity-55 group-hover:opacity-65 transition-opacity"
            />
          )}
          <div className="relative z-10">
            <h4 className="text-sm font-semibold leading-tight line-clamp-2">
              {c.name}
            </h4>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        </a>
      ))}
    </div>
  );
};
