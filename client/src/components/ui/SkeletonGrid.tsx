const SkeletonGrid = () => {
  const items = Array.from({ length: 8 });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {items.map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-gray-200 overflow-hidden"
        >
          <div className="aspect-4/5 sm:aspect-square bg-gray-200" />
          <div className="p-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonGrid;
