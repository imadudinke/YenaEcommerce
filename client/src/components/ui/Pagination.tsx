interface Props {
  total: number;
  page: number;
  pageSize: number;
  onChange: (page: number) => void;
}

const Pagination = ({ total, page, pageSize, onChange }: Props) => {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const makeBtn = (
    label: string,
    disabled: boolean,
    onClick: () => void,
    extra?: string
  ) => (
    <button
      className={
        "px-3 py-2 text-sm rounded-md border " +
        (disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white hover:bg-gray-50") +
        (extra ? ` ${extra}` : "")
      }
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );

  // small window of page numbers around current
  const window = 2;
  const start = Math.max(1, page - window);
  const end = Math.min(totalPages, page + window);
  const pages = [] as number[];
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {makeBtn("Prev", !canPrev, () => onChange(page - 1))}
      {start > 1 && (
        <button className="px-3 py-2 text-sm" onClick={() => onChange(1)}>
          1
        </button>
      )}
      {start > 2 && <span className="px-1">…</span>}
      {pages.map((p) => (
        <button
          key={p}
          className={
            "px-3 py-2 text-sm rounded-md " +
            (p === page
              ? "bg-black text-white"
              : "bg-white border hover:bg-gray-50")
          }
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      {end < totalPages - 1 && <span className="px-1">…</span>}
      {end < totalPages && (
        <button
          className="px-3 py-2 text-sm"
          onClick={() => onChange(totalPages)}
        >
          {totalPages}
        </button>
      )}
      {makeBtn("Next", !canNext, () => onChange(page + 1))}
    </div>
  );
};

export default Pagination;
