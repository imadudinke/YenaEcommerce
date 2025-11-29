import { useState } from "react";

import EmptyCart from "@/components/cart/EmptyCart";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import CheckoutForm from "@/components/order/CheckoutForm.jsx";

// ---------------------
// FORM TYPE
// ---------------------
export interface OrderAddressForm {
  full_name: string;
  phone: string;
  city: string;
  sub_city: string;
  street: string;
  house_no: string;
}

const OrderAddressPage = () => {
  const { user, isLoading } = useAuthStore();
  const cartCount = useCartStore((s) => s.count());
  const cartLoading = useCartStore((s) => s.isLoading);

  // ---------------------
  // FORM STATE
  // ---------------------
  const [form, setForm] = useState<OrderAddressForm>({
    full_name: user?.full_name || "",
    phone: "",
    city: "",
    sub_city: "",
    street: "",
    house_no: "",
  });

  const [showPayment, setShowPayment] = useState(false);

  // ---------------------
  // HANDLE INPUT CHANGE
  // ---------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = Object.values(form).every((v) => v.trim().length > 0);
  const firstInvalid = Object.entries(form).find(([_, v]) => !v.trim());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowPayment(true);
  };

  // ---------------------
  // AUTH & CART CHECKS
  // ---------------------
  if (isLoading || cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-lg text-gray-600 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-sm p-4 md:p-8 text-center py-16">
          <div className="mx-auto mb-6 size-12 grid place-items-center rounded-xl text-blue-600">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-semibold mb-2 text-gray-900">
            Sign In to Continue
          </h1>

          <p className="text-gray-500 mb-8">
            Log in to enter your shipping address and complete your order.
          </p>

          <Button asChild>
            <Link to="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cartCount < 1) {
    return <EmptyCart />;
  }

  // ---------------------
  // UI
  // ---------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-100 py-10 px-4">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] border border-slate-200 p-8 relative">
        <div className="absolute -top-6 left-6 h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center shadow-md">
          <span className="font-bold text-lg">📦</span>
        </div>
        <div className="mb-10 pt-2">
          <h2 className="text-center text-3xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Shipping Details
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your delivery information to proceed to secure payment.
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {[
            {
              id: "full_name",
              label: "Full Name",
              type: "text",
              placeholder: "e.g. Sara Worku",
            },
            {
              id: "phone",
              label: "Phone Number",
              type: "tel",
              placeholder: "+2519...",
            },
            {
              id: "city",
              label: "City",
              type: "text",
              placeholder: "Addis Ababa",
            },
            {
              id: "sub_city",
              label: "Sub City",
              type: "text",
              placeholder: "Bole",
            },
            {
              id: "street",
              label: "Street",
              type: "text",
              placeholder: "Wollo Sefer",
            },
            {
              id: "house_no",
              label: "House No.",
              type: "text",
              placeholder: "14/23",
            },
          ].map((field) => {
            const value = form[field.id as keyof OrderAddressForm];
            const showError =
              !value.trim() && firstInvalid && firstInvalid[0] === field.id;
            return (
              <div key={field.id} className="group">
                <label
                  htmlFor={field.id}
                  className="block text-xs font-medium uppercase tracking-wide text-slate-600 mb-1"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  value={value}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                  required
                />
                {showError && (
                  <p className="mt-1 text-xs text-red-600">
                    {field.label} is required
                  </p>
                )}
              </div>
            );
          })}
          <button
            type="submit"
            disabled={showPayment || !isValid}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-black text-white font-medium py-3 shadow hover:shadow-lg transition active:scale-[.98] disabled:opacity-40"
          >
            {showPayment ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />{" "}
                Opening Secure Payment…
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  className="h-5 w-5"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M5 12m0 2a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v4" />
                  <path d="M8 10v-3a4 4 0 0 1 8 0v3" />
                </svg>
                Continue to Secure Payment
              </>
            )}
          </button>
        </form>
        <div className="mt-6 flex justify-center">
          <Link to="/cart" className="text-xs text-blue-600 hover:underline">
            ← Back to Cart
          </Link>
        </div>
      </div>
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowPayment(false)}
          />
          <div className="relative w-full max-w-xl mx-auto rounded-3xl shadow-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b bg-linear-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-white/20 grid place-items-center text-sm font-semibold">
                  💳
                </div>
                <h3 className="text-sm font-medium tracking-wide">
                  Secure Payment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPayment(false)}
                className="rounded-md px-2 py-1 text-white/80 hover:text-white hover:bg-white/10"
                aria-label="Close payment modal"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <CheckoutForm addressData={form} />
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t flex items-center justify-between text-[11px] text-slate-600">
              <span className="flex items-center gap-1">
                🔐 End‑to‑end encrypted
              </span>
              <button
                type="button"
                onClick={() => setShowPayment(false)}
                className="text-blue-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderAddressPage;
