import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccessPage: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };
  return (
    <section className="container mx-auto min-h-screen px-4 py-10 flex items-center justify-center">
      <div className="mx-auto max-w-2xl rounded-2xl border bg-white shadow-sm p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="size-12 rounded-full bg-green-100 text-green-700 grid place-items-center">
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Payment Successful
            </h1>
            <p className="text-sm text-muted-foreground">
              Thank you! Your order has been placed and is being processed.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-secondary/50 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Order number</p>
                <p className="font-medium">#YYYY-XXXX</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total paid</p>
                <p className="font-semibold">ETB —</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              A confirmation email has been sent to your inbox. You can track
              the order from your account.
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/orders/track"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90"
              aria-label="View order details"
            >
              View Order Details
            </Link>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 font-medium"
              aria-label="View receipt"
            >
              View Receipt
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 font-medium"
              aria-label="Continue shopping"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccessPage;
