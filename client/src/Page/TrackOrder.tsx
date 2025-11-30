import { useEffect, useState, useMemo } from "react";
import apiFetch from "@/api/fetchClient";

// Define the Order type matching our Django model structure
type Order = {
  id: number;
  user: number;
  address: number;
  total_price: string; // string from API
  is_paid: boolean;
  status: string;
  transaction_reference: string;
  created_at: string; // ISO timestamp
};

// Status mapping for consistent badging
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  processing: { label: "Processing", color: "bg-sky-100 text-sky-700" },
  shipped: { label: "Shipped", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  default: { label: "Unknown", color: "bg-gray-200 text-gray-700" },
};

// Utility function to calculate time ago
function timeAgo(ts: string) {
  const date = new Date(ts);
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

const TrackOrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [copyId, setCopyId] = useState<number | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ensure your backend URL is correct here (e.g., http://localhost:8000/api/orderList/)
      const data = await apiFetch<Order[]>("api/orderList/");
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setOrders(sorted);
    } catch (e: any) {
      setError(e?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchQuery =
        !query ||
        o.transaction_reference.toLowerCase().includes(query.toLowerCase()) ||
        String(o.id).includes(query);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [orders, query, statusFilter]);

  const handleCopy = (order: Order) => {
    navigator.clipboard.writeText(order.transaction_reference).catch(() => {});
    setCopyId(order.id);
    setTimeout(() => setCopyId(null), 1800);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
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
                <path d="M3 9h18" />
                <path d="M3 15h18" />
                <path d="M9 3v6" />
                <path d="M9 15v6" />
              </svg>
            </span>
            Order Tracking
          </h1>
          <p className="text-sm text-gray-600">
            Review your recent orders, statuses and payment references.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID or reference..."
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/90 backdrop-blur"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/90 backdrop-blur"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 active:scale-[.97] disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 space-y-3"
            >
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center justify-between">
          <div className="text-sm text-red-700">{error}</div>
          <button
            onClick={fetchOrders}
            className="text-sm font-medium px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-gray-500"
            >
              <path d="M3 3h18v4H3z" />
              <path d="M3 7v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V7" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold">No orders found</h2>
          <p className="text-xs text-gray-600">
            Try adjusting your search or refresh the list.
          </p>
        </div>
      )}

      {/* Orders grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o) => {
            const statusCfg = STATUS_MAP[o.status] || STATUS_MAP.default;
            const paidBadge = o.is_paid ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[11px] font-medium">
                Paid
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-[11px] font-medium">
                Unpaid
              </span>
            );

            return (
              <div
                key={o.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition duration-150 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${statusCfg.color}`}
                  >
                    {statusCfg.label}
                  </div>
                  <span className="text-xs text-gray-500">
                    {timeAgo(o.created_at)}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-lg font-bold text-gray-800">
                    ETB {parseFloat(o.total_price).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    Order ID:{" "}
                    <span className="font-mono text-gray-700">{o.id}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {paidBadge}
                    <p className="text-xs text-gray-500">
                      Ref: {o.transaction_reference.substring(0, 15)}...
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(o)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-90 transition duration-150"
                    aria-label="Copy transaction reference"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-gray-600"
                    >
                      {copyId === o.id ? (
                        <path d="M20 6 9 17l-5-5" />
                      ) : (
                        <>
                          <rect
                            width="14"
                            height="14"
                            x="8"
                            y="8"
                            rx="2"
                            ry="2"
                          />
                          <path d="M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
