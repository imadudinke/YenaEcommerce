const CartLoading = () => {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="h-8 w-40 rounded-md bg-muted animate-pulse mb-6" />
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg border p-4 animate-pulse"
            >
              <div className="size-20 rounded-md bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-4 w-1/3 rounded bg-muted" />
              </div>
              <div className="h-10 w-28 rounded bg-muted" />
            </div>
          ))}
        </div>
        <aside className="lg:col-span-4">
          <div className="rounded-lg border p-6 space-y-4 animate-pulse">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-12 w-full rounded bg-muted" />
            <div className="h-10 w-full rounded bg-muted" />
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CartLoading;
