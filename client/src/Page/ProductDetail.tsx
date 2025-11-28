import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProductDetail } from "@/api/products";
import type { ProductSearchResult } from "@/api/products";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { handleAddToCart } from "@/helpers";
import ReviewSection from "@/components/review/ReviewSection";

const StarRating = ({ rating, count }: { rating: number; count: number }) => {
  const fullStars = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span
        key={i}
        className={i < fullStars ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">{stars}</div>
      <span className="text-sm text-gray-600">
        {count > 0 ? `(${count} reviews)` : "No reviews yet"}
      </span>
    </div>
  );
};

const formatPrice = (p: string | number) => {
  const n = typeof p === "number" ? p : parseFloat(p);
  if (Number.isNaN(n)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
};

const ProductDetails = () => {
  const { id } = useParams();
  const add = useCartStore((s) => s.add);
  const [product, setProduct] = useState<ProductSearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    (async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await ProductDetail(id);
        if (!active) return;
        if (!data) {
          setError("Product not found");
        } else {
          const normalized: ProductSearchResult = {
            ...data,
            image: data?.images?.[0]?.image || null,
          };
          setProduct(normalized);
          setActiveImage(normalized.image || null);
          setQty(1);
        }
      } catch {
        if (active) setError("Failed to load product");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const inStock = (product?.stock ?? 0) > 0;
  const reviewSummary = useMemo(() => {
    const reviews = product?.reviews || [];
    if (!reviews.length) return { avg: 0, count: 0 };
    type Review = { rating?: number };
    const ratings = (reviews as Review[])
      .map((r) => Number(r?.rating) || 0)
      .filter((n: number) => n > 0);
    if (!ratings.length) return { avg: 0, count: reviews.length };
    const avg =
      ratings.reduce((s: number, n: number) => s + n, 0) / ratings.length;
    return { avg, count: reviews.length };
  }, [product]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square rounded-xl bg-gray-100" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-gray-100 rounded" />
            <div className="h-6 w-40 bg-gray-100 rounded" />
            <div className="h-5 w-24 bg-gray-100 rounded" />
            <div className="h-24 bg-gray-100 rounded" />
            <div className="h-10 w-full bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-16 text-center">
        <div className="text-5xl mb-3">🛍️</div>
        <h1 className="text-2xl font-semibold mb-2">
          {error || "Product not found"}
        </h1>
        <p className="text-gray-500 mb-6">
          Try going back or exploring our latest collections.
        </p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [];

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-12">
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link className="hover:text-gray-700 transition" to="/">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              className="hover:text-gray-700 transition"
              to={`/search?category=${encodeURIComponent(
                product.category?.slug || ""
              )}`}
            >
              {product.category?.name || "Category"}
            </Link>
          </li>
          <li>/</li>
          <li
            className="text-gray-900 font-medium line-clamp-1"
            aria-current="page"
          >
            {product.name}
          </li>
        </ol>
      </nav>

      <section className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-12">
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-lg border bg-white">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-contain p-4"
              />
            ) : (
              <div className="grid h-full place-content-center text-gray-400">
                No image
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.image)}
                  className={`relative aspect-square rounded-lg overflow-hidden border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    activeImage === img.image
                      ? "ring-2 ring-blue-500 border-blue-500"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  aria-label={`Select image ${img.id}`}
                >
                  <img
                    src={img.image}
                    alt={`${product.name} thumbnail`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <StarRating
                rating={reviewSummary.avg}
                count={reviewSummary.count}
              />
              <span className="text-sm text-gray-500">
                • SKU: #{product.id}
              </span>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          <div className="flex items-baseline gap-4">
            <div className="text-4xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>
            <span
              className={`text-sm font-semibold rounded-full px-3 py-1 ${
                inStock
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {inStock ? "In Stock" : "Out of stock"}
            </span>
          </div>

          <p className="text-base text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <Separator className="bg-gray-200" />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <button
                className="px-4 py-2 text-xl text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={!inStock || qty <= 1}
              >
                −
              </button>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={Math.max(1, product.stock || 1)}
                value={qty}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!Number.isNaN(value) && value >= 1) {
                    setQty(Math.min(value, Math.max(1, product.stock || 1)));
                  } else if (e.target.value === "") {
                    setQty(1);
                  }
                }}
                className="w-16 text-center border-l border-r border-gray-300 focus:outline-none focus:ring-0"
                aria-label="Product quantity"
                disabled={!inStock}
              />
              <button
                className="px-4 py-2 text-xl text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
                aria-label="Increase quantity"
                onClick={() =>
                  setQty((q) =>
                    Math.min(Math.max(1, product.stock || 1), q + 1)
                  )
                }
                disabled={!inStock || qty >= (product.stock || 0)}
              >
                +
              </button>
            </div>

            <Button
              onClick={() => {
                handleAddToCart(product, qty, add);
                navigate("/");
              }}
              disabled={!inStock}
              className="flex-1 text-lg py-3 rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </section>

      <ReviewSection reviews={product?.reviews} />
    </main>
  );
};

export default ProductDetails;
