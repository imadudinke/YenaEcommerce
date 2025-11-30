import React from "react";
// Assuming these imports are correct:
import { BannerCarousel } from "./BannerCarousel";
import { type Category } from "./CategoryGrid";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface HomeHeroProps {
  banners: {
    id: number;
    title: string;
    image: string;
    url?: string;
    order?: number;
  }[];
  categories: Category[];
  className?: string;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  banners,
  categories,
  className,
}) => {
  return (
    <section className={cn("grid gap-6   md:grid-cols-12", className)}>
      <div className="w-[90vw] sm:w-[95vw] md:w-full md:col-span-9">
        <BannerCarousel
          banners={banners}
          autoPlayMs={6000}
          className="h-full rounded-xl overflow-hidden shadow-lg"
        />
      </div>

      <aside className="md:col-span-3 hidden md:flex flex-col gap-4">
        <div className="rounded-xl border bg-white p-4 flex-1 flex flex-col shadow-md">
          <h3 className="text-md font-semibold mb-3 text-gray-800">
            Quick Categories
          </h3>
          <div className="grid grid-cols-2 gap-2 overflow-y-auto">
            {categories.slice(0, 8).map((c) => (
              <Link
                key={c.id}
                className="group flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium hover:bg-gray-50 transition duration-150 shadow-sm"
                to={`/search?category=${c.slug}`}
              >
                <div className="size-8 rounded-md bg-muted overflow-hidden shrink-0">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid place-content-center h-full w-full text-[10px] text-gray-400">
                      N/A
                    </div>
                  )}
                </div>
                <span
                  className="line-clamp-2 leading-tight text-gray-700 group-hover:text-blue-600 transition"
                  title={c.name}
                >
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white flex flex-col justify-between shadow-lg">
          <div>
            <h3 className="text-lg font-bold tracking-tight">Join & Save</h3>
            <p className="text-xs opacity-90 mt-1">
              Unlock member-only discounts & priority access.
            </p>
          </div>
          <Link
            to="/register"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-white text-blue-600 text-sm font-bold px-4 py-2.5 hover:bg-gray-100 transition duration-150 shadow-md"
          >
            Create Account
          </Link>
        </div>
      </aside>
    </section>
  );
};
