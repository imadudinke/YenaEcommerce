import React, { useEffect, useState, memo, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Menu, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { CategoryListData, type CategoryProps } from "@/api/products";

const cn = (...classes: (string | boolean | undefined | null)[]) =>
  classes.filter(Boolean).join(" ");

const CartButton: React.FC = memo(() => (
  <button
    aria-label="View shopping cart"
    className="p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition shrink-0"
  >
    🛒
  </button>
));
CartButton.displayName = "CartButton";

// Removed unused ButtonProps interface

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryList, setCategoryList] = useState<CategoryProps[]>([]);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (query.trim()) {
      navigate(`/search?search=${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const fetchCategory = async () => {
      setIsLoading(true);
      const data = await CategoryListData();
      if (data && Array.isArray(data)) {
        setCategoryList(data);
      } else {
        setCategoryList([]);
      }
      setIsLoading(false);
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md supports-backdrop-filter:bg-white/80 bg-white/95 border-b shadow-md",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col gap-3 py-3">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden shrink-0"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Logo */}
          <Link
            className="text-lg sm:text-xl font-extrabold tracking-tight shrink-0"
            to="/"
          >
            Yena<span className="text-blue-600">Shop</span>
          </Link>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex flex-1 max-w-lg mx-8"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </form>

          <CartButton />

          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild>
              <a href="/login">Sign In</a>
            </Button>
            <Button size="sm" asChild>
              <a href="/register">Register</a>
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearchSubmit} className="sm:hidden flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="flex-1 min-w-0 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            aria-label="Submit search"
            className="inline-flex items-center justify-center rounded-md bg-black text-white px-3 py-2 text-sm hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <Search />
          </button>
        </form>

        {/* Categories Scroller */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar text-sm font-medium pb-1 whitespace-nowrap">
          {isLoading ? (
            <div className="flex gap-3 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 w-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : (
            categoryList.map((cat) => (
              <Link
                key={cat.id}
                to={`/search?category=${encodeURIComponent(
                  cat.slug || cat.name
                )}`}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-700 transition duration-150 ease-in-out shadow-sm"
              >
                {cat.name}
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Mobile Menu Portal */}
      {isMounted && isMenuOpen
        ? createPortal(
            <div className="lg:hidden">
              {/* Overlay Backdrop */}
              <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
              />
              {/* Sidebar Menu Panel */}
              <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white border-r shadow-2xl flex flex-col overflow-y-auto">
                {/* Menu Header and Close Button */}
                <div className="flex items-center justify-between px-4 py-4 border-b sticky top-0 bg-white">
                  <span className="text-lg font-semibold">Browse</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Search Bar in Menu */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="px-4 pt-4 flex gap-2"
                >
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    aria-label="Search products"
                    className="flex-1 min-w-0 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="inline-flex items-center justify-center rounded-md bg-black text-white px-3 py-2 text-sm hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    <Search />
                  </button>
                </form>

                <div className="px-4 py-4">
                  <div className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wide">
                    Categories
                  </div>
                  <div className="px-4 py-4 flex-1">
                    <div className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wide">
                      Product Categories
                    </div>
                    <div className="flex flex-col divide-y border rounded-lg overflow-hidden bg-white">
                      {categoryList.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/search?category=${encodeURIComponent(
                            cat.slug || cat.name
                          )}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="px-4 py-3 text-sm font-medium hover:bg-gray-100 text-gray-700"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Account Section in Menu Footer */}
                <div className="mt-auto px-4 pb-4 pt-4 border-t sticky bottom-0 bg-white">
                  <div className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wide">
                    Account
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1"
                    >
                      <a href="/login">Sign In</a>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1"
                    >
                      <a href="/register">Register</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </header>
  );
};
