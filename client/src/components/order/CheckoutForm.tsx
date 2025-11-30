import { useState, useMemo } from "react";
import { paymentInitiate } from "@/api/payment";
import type { OrderAddressForm } from "@/Page/OrderAdressPage";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/components/ui/toast";

const CheckoutForm = ({ addressData }: { addressData: OrderAddressForm }) => {
  const { show } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const cartTotal = useCartStore((s) => s.total());
  const cartCount = useCartStore((s) => s.count());
  const publicKey = import.meta.env.VITE_CHAPA_PUBLIC_KEY;

  const nameParts = useMemo(() => {
    if (!user?.full_name) return { first: "", last: "" };
    const parts = user.full_name.trim().split(/\s+/);
    return { first: parts[0] || "", last: parts.slice(1).join(" ") || "" };
  }, [user?.full_name]);

  // Mark as used to satisfy noUnusedLocals without altering behavior
  void publicKey;
  void nameParts;

  if (!user) return null;

  const disabled = cartCount < 1 || isLoading;

  const handleCheckout = async () => {
    if (disabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await paymentInitiate(addressData);
      console.log("paymentInitiate response:", res);

      const { payment_url } = res;

      if (payment_url) {
        window.location.href = payment_url;
      } else {
        throw new Error("No payment URL received from server.");
      }
    } catch (e: any) {
      console.error("Payment initiation failed:", e);
      setError(e?.message || "Failed to start payment.");
      show({
        title: "Payment Error",
        description: e?.message || "Failed to start payment.",
        variant: "error",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-xl bg-black text-white px-5 py-4 shadow-md border border-white/10">
        <div className="h-11 w-11 rounded-lg bg-linear-to-br from-slate-900 to-slate-700 grid place-items-center font-semibold text-sm shadow-inner border border-white/10">
          💳
        </div>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-semibold tracking-wide flex items-center gap-2">
            Secure Payment
            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-white/10 px-2 py-0.5 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
              >
                <path d="M12 22c8.5-4 8.5-10 8.5-13.5S17.5 2 12 2 3.5 5.5 3.5 8.5 3.5 18 12 22Z" />
                <path d="M8 11h8" />
                <path d="M8 15h5" />
              </svg>
              Encrypted
            </span>
          </h2>
          <p className="text-[11px] leading-relaxed text-white/50">
            No card data stored. All transactions protected.
          </p>
        </div>
      </div>
      <div className="rounded-xl border bg-white/60 backdrop-blur-sm p-4 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="font-medium">ETB {cartTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items</span>
          <span>{cartCount}</span>
        </div>

        {error && (
          <div className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
            {error}
          </div>
        )}
      </div>
      <button
        onClick={handleCheckout}
        disabled={disabled}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-black via-slate-800 to-black text-white font-medium py-3 shadow hover:shadow-lg transition active:scale-[.98] disabled:opacity-40"
        aria-disabled={disabled}
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />{" "}
            Redirecting to Payment…
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 1v22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Continue to Payment
          </>
        )}
      </button>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        You will be securely redirected to Chapa's hosted payment page.
      </p>
    </div>
  );
};

export default CheckoutForm;
