import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  const location = useLocation();
  return (
    <div className="min-h-[60vh] w-full grid place-items-center px-4 sm:px-6">
      <div className="w-full max-w-xl mx-auto text-center">
        <div className="inline-flex items-center justify-center rounded-2xl bg-slate-100 text-slate-700 px-3 py-1 text-xs font-medium mb-4">
          404 • Page not found
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          We couldn't find that page
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          The path{" "}
          <span className="font-mono text-slate-800">{location.pathname}</span>{" "}
          doesn't exist. It might have been moved or deleted.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild>
            <Link to="/">Go back home</Link>
          </Button>
          <Link to="/search" className="text-blue-600 hover:underline text-sm">
            Try searching for products →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-500">
          <div className="rounded-xl border p-3">Check the URL spelling</div>
          <div className="rounded-xl border p-3">Use the site navigation</div>
          <div className="rounded-xl border p-3">Contact support if needed</div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
