import { SearchByCategory, searchProducts } from "@/api/products";
import type { PaginatedResponse } from "@/api/products";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ui/ProductCard";
import SkeletonGrid from "../components/ui/SkeletonGrid";
import Pagination from "../components/ui/Pagination";
import { Button } from "@/components/ui/button";

const SearchResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<PaginatedResponse>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"relevance" | "price_asc" | "price_desc">(
    "relevance"
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search") || "";
    const categorySlug = params.get("category") || "";
    const currentFilter = searchQuery || categorySlug;

    const p = parseInt(params.get("page") || "1", 10);
    const currentPage = isNaN(p) ? 1 : Math.max(1, p);
    setPage(currentPage);
    setActiveFilter(currentFilter);

    if (!currentFilter) {
      setData({ count: 0, next: null, previous: null, results: [] });
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        let res: PaginatedResponse;

        if (searchQuery) {
          res = await searchProducts(searchQuery, currentPage);
        } else if (categorySlug) {
          res = await SearchByCategory(categorySlug);
        } else {
          return;
        }

        setData(res);
      } catch (e) {
        setError("Failed to fetch results.");
        setData({ count: 0, next: null, previous: null, results: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [location.search]);

  const sortedResults = useMemo(() => {
    const arr = [...data.results];
    if (sort === "price_asc") {
      return arr.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }
    if (sort === "price_desc") {
      return arr.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    return arr;
  }, [data.results, sort]);

  const onPageChange = (newPage: number) => {
    const params = new URLSearchParams(location.search);
    params.set("page", String(newPage));
    navigate({ search: params.toString() }, { replace: false });
  };

  const titleText = useMemo(() => {
    if (loading) return "Searching...";
    if (activeFilter) {
      const type = location.search.includes("search=") ? "Search" : "Category";
      return `${type} results for "${activeFilter}"`;
    }
    return "Browse Products";
  }, [loading, activeFilter, location.search]);

  return (
    <div className="min-h-screen px-4 md:px-6 lg:px-8 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {titleText}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {data.results.length} of {data.count} results
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600" htmlFor="sort">
            Sort by
          </label>
          <select
            id="sort"
            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
          >
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading && <SkeletonGrid />}

      {!loading && error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
          <Link to="/">
            <Button>Home</Button>
          </Link>
        </div>
      )}

      {!loading && !error && data.results.length === 0 && activeFilter && (
        <div className="flex flex-col gap-3 items-center justify-center py-16 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <h2 className="text-xl font-semibold">
            No results found for "{activeFilter}"
          </h2>
          <p className="text-gray-600 mt-2 max-w-md">
            Try adjusting your query or selecting a different category.
          </p>
          <Link to="/">
            <Button>Home</Button>
          </Link>
        </div>
      )}

      {!loading && !error && data.results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sortedResults.map((product) => (
            <>
              <ProductCard key={product.id} product={product} />
            </>
          ))}
        </div>
      )}

      {!loading && data.count > 0 && (
        <div className="mt-10">
          <Pagination
            total={data.count}
            page={page}
            pageSize={data.results.length || 1}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default SearchResultPage;
