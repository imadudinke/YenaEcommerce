import React from "react";
import { Input } from "@/components/ui/input";
import { searchProducts, type ProductSearchResult } from "@/api/products";
import { cn } from "@/lib/utils";
import { Loader2, Search } from "lucide-react";

interface SearchBarProps {
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const [q, setQ] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<ProductSearchResult[]>([]);
  const [open, setOpen] = React.useState(false);
  const controller = React.useRef<AbortController | null>(null);
  const debounceRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!q) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      if (controller.current) controller.current.abort();
      controller.current = new AbortController();
      setLoading(true);
      const data = await searchProducts(q);
      setResults(data.slice(0, 8));
      setOpen(true);
      setLoading(false);
    }, 350);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [q]);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="pl-8 h-10 bg-muted/40"
            aria-label="Search products"
          />
        </div>
        {loading && (
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-lg border bg-popover shadow-lg z-40 overflow-hidden">
          <ul className="max-h-80 overflow-auto divide-y">
            {results.map((r) => (
              <li key={r.id}>
                <a
                  href={`/product/${r.id}`}
                  className="flex gap-3 p-3 hover:bg-accent/40 items-center"
                >
                  <div className="size-12 rounded-md bg-muted overflow-hidden">
                    {r.image ? (
                      <img
                        src={r.image}
                        alt={r.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid place-content-center h-full w-full text-[10px] text-muted-foreground">
                        No Img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{r.name}</p>
                    <p className="text-xs text-muted-foreground">${r.price}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {open && !loading && results.length === 0 && q && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-md border bg-popover shadow-sm p-4 text-sm text-muted-foreground">
          No results
        </div>
      )}
    </div>
  );
};
