import React, {
  useEffect,
  useState,
  memo,
  forwardRef,
  type FormEventHandler,
  type EventHandler,
  type FormEvent,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { Menu, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

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

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "icon";
  asChild?: boolean;
}

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("hee");
    console.log(query);
    if (query.trim()) {
      navigate(`/search?search=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  const navLinks = [
    { label: "Deals", href: "/deals" },
    { label: "Featured", href: "/featured" },
    { label: "New", href: "/new" },
  ];
  const categories = [
    "Electronics",
    "Fashion",
    "Home",
    "Beauty",
    "Sports",
    "Books",
    "Toys",
    "Grocery",
    "Hardware",
    "Furniture",
  ];

  useEffect(() => {
    setIsMounted(true);
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
          <a
            href="/"
            className="text-lg sm:text-xl font-extrabold tracking-tight shrink-0"
          >
            Yena<span className="text-blue-600">Shop</span>
          </a>

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

          <nav className="hidden lg:flex items-center gap-3 shrink-0">
            {navLinks.map((link) => (
              <Button key={link.href} variant="ghost" size="sm" asChild>
                <a href={link.href}>{link.label}</a>
              </Button>
            ))}
          </nav>

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 4.254 12.015l4.74 4.74a.75.75 0 1 0 1.06-1.06l-4.74-4.74A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </form>

        {/* Categories Scroller */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar text-sm font-medium pb-1">
          {categories.map((cat) => (
            <a
              key={cat}
              href={`/search?category=${encodeURIComponent(cat)}`}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 whitespace-nowrap transition duration-150 ease-in-out shadow-sm"
            >
              {cat}
            </a>
          ))}
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

                <nav className="flex flex-col gap-1 px-4 py-4 border-b">
                  {navLinks.map((link) => (
                    <Button
                      key={link.href}
                      variant="ghost"
                      className="justify-start text-base font-medium"
                      asChild
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <a href={link.href}>{link.label}</a>
                    </Button>
                  ))}
                </nav>

                {/* Categories in Menu */}
                <div className="px-4 py-4">
                  <div className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wide">
                    Categories
                  </div>
                  <div className="flex flex-col divide-y border rounded-lg overflow-hidden bg-white">
                    {categories.map((cat) => (
                      <a
                        key={cat}
                        href={`/search?category=${encodeURIComponent(cat)}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="px-4 py-3 text-sm font-medium hover:bg-gray-100 text-gray-700"
                      >
                        {cat}
                      </a>
                    ))}
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
