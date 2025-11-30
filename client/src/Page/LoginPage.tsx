import { GalleryVerticalEnd } from "lucide-react";
import { Link } from "react-router-dom";
import { LoginForm } from "@/components/login-form";

const LoginPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_60%)]" />
      <div className="pointer-events-none absolute -left-10 top-20 h-40 w-40 rounded-full bg-blue-100 blur-2xl opacity-50" />
      <div className="pointer-events-none absolute -right-10 top-40 h-40 w-40 rounded-full bg-indigo-100 blur-2xl opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="w-full max-w-md mx-auto flex flex-col gap-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-bold text-xl"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                <GalleryVerticalEnd className="h-5 w-5" />
              </span>
              <span>
                Yena<span className="text-blue-600">Shop</span>
              </span>
            </Link>

            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-8">
              <LoginForm />
            </div>
          </div>

          <div className="relative hidden lg:block h-[560px] rounded-3xl overflow-hidden border bg-gray-100 shadow-2xl">
            <img
              src="/YenaShopLogo2.jpg"
              alt="Showcase"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 h-full w-full p-10 flex flex-col justify-end text-white">
              <h2 className="text-3xl font-bold leading-tight">
                Welcome back to better shopping
              </h2>
              <p className="mt-2 text-sm text-gray-100/90 max-w-md">
                Access your orders, wishlists, and personalized deals—fast and
                secure.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />{" "}
                  Secure checkout & order history
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-300" /> Save
                  items to wishlist
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />{" "}
                  Member-only offers
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
