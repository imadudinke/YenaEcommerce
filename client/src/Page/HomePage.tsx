import { useEffect, useState } from "react";
// Imports for data fetching and components remain the same
import { getHomeData } from "../api/home";
import { ProductSection } from "@/components/home/ProductSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CategoryBento } from "@/components/home/CategoryBento";
import { HomeHero } from "@/components/home/HomeHero";
import { DealsScroller } from "@/components/home/DealsScroller";
import { TrustBar } from "@/components/layout/TrustBar";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NormalizedHomeData {
  banners: any[];
  featured: any[];
  best_sellers: any[];
  new_arrivals: any[];
  categories: any[];
}

export const HomePage = () => {
  const [data, setData] = useState<NormalizedHomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const add = useCartStore((s) => s.add);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await getHomeData();
        if (!active) return;
        if (!raw) {
          setError("Failed to load");
        } else {
          setData(raw);
        }
      } catch (e) {
        setError("Failed to load");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      // Responsive loading state optimized for different screen sizes
      <div className="p-4 md:p-8 grid gap-6 animate-pulse mx-auto max-w-7xl">
        <div className="h-64 rounded-xl bg-gray-200" />
        <div className="h-6 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 flex flex-col items-center gap-4 mx-auto max-w-7xl">
        <p className="text-red-500">{error ?? "Unknown error"}</p>
        <Button onClick={() => location.reload()}>Retry</Button>
      </div>
    );
  }

  const { banners, featured, best_sellers, new_arrivals, categories } = data;

  return (
    <main className={cn("mx-auto max-w-7xl space-y-12 pb-24 pt-4")}>
      <div className="px-4  md:px-6">
        <HomeHero banners={banners} categories={categories} />
      </div>

      <div className="px-4 md:px-6">
        <DealsScroller
          title="Flash Deals"
          products={featured}
          endsInSeconds={3600}
        />
      </div>

      <TrustBar />

      {/* Best Sellers */}
      <div className="px-4 md:px-6">
        <ProductSection
          title="Best Sellers"
          products={best_sellers}
          layout="scroller"
          actionHref="/best-sellers"
          onAddToCart={(p: any) =>
            add(
              {
                id: p.id,
                name: p.name,
                price: parseFloat(String(p.price)),
                image: p.image,
              },
              1
            )
          }
        />
      </div>

      <div className="px-4 md:px-6">
        <ProductSection
          title="New Arrivals"
          products={new_arrivals}
          layout="grid"
          actionHref="/new"
          onAddToCart={(p: any) =>
            add(
              {
                id: p.id,
                name: p.name,
                price: parseFloat(String(p.price)),
                image: p.image,
              },
              1
            )
          }
        />
      </div>

      <div className="px-4 md:px-6">
        <section className="py-6 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
              Discover More
            </h2>
            <Button variant="link" size="sm" asChild>
              <a href="/categories">Browse All</a>
            </Button>
          </div>
          {/* CategoryBento handles complex responsive layout */}
          <CategoryBento categories={categories} />
          {/* Fallback simple grid on very small screens */}
          <div className="sm:hidden">
            <CategoryGrid categories={categories} />
          </div>
        </section>
      </div>

      {/* Newsletter & Membership CTA (Fully responsive stacking/horizontal layout) */}
      <div className="px-4 md:px-6">
        <section className="rounded-xl border bg-white shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl font-bold tracking-tight">
              Stay in the Loop
            </h3>
            <p className="text-sm text-gray-500">
              Weekly curated picks, lightning deals & early access delivered
              straight to your inbox.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const email = fd.get("email");
              alert(`Subscribed: ${email}`);
              e.currentTarget.reset();
            }}
            className="flex w-full flex-wrap justify-center max-w-sm gap-3"
          >
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              // Refined input styling for better UX
              className="flex-1 rounded-lg border border-gray-300 bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              aria-label="Email Newsletter Subscription"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </section>
      </div>
    </main>
  );
};
