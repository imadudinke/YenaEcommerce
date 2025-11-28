import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastVariant = "default" | "success" | "error" | "warning";

export type ToastMessage = {
  id?: number;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms
};

type ToastContextValue = {
  show: (msg: ToastMessage) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <Toaster />");
  return ctx;
};

export const ToastProvider: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const idRef = useRef(1);

  const show = (msg: ToastMessage) => {
    const id = idRef.current++;
    const duration = msg.duration ?? 3500;
    const next = { ...msg, id };
    setToasts((t) => [...t, next]);
    window.clearTimeout((show as any)._timer);
    const timer = window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
    (show as any)._timer = timer;
  };

  useEffect(() => () => window.clearTimeout((show as any)._timer), []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {/* Render a fixed stack in bottom-right */}
      <div
        className={
          "fixed bottom-4 right-4 z-50 flex flex-col gap-2 " + (className ?? "")
        }
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              "min-w-[260px] max-w-sm rounded-lg border shadow-lg p-3 bg-white/95 backdrop-blur " +
              (t.variant === "success"
                ? "border-green-200"
                : t.variant === "error"
                ? "border-red-200"
                : t.variant === "warning"
                ? "border-yellow-200"
                : "border-gray-200")
            }
          >
            {t.title && <div className="text-sm font-semibold">{t.title}</div>}
            {t.description && (
              <div className="text-xs text-gray-600 mt-0.5">
                {t.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
