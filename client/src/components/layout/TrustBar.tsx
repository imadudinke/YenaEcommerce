import React from "react";
import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

export const TrustBar: React.FC = () => {
  const items = [
    { icon: Truck, title: "Free & Fast Shipping", desc: "On selected items" },
    { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
    { icon: ShieldCheck, title: "Secure Payments", desc: "Protected checkout" },
    { icon: Headphones, title: "24/7 Support", desc: "We’re here to help" },
  ];
  return (
    <section className="px-3 md:px-6">
      <div className="mx-auto max-w-7xl grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-center gap-3 rounded-lg border bg-card p-3"
          >
            <span className="size-10 rounded-md bg-muted grid place-content-center">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
