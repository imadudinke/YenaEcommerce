import type { ProductSearchResult } from "@/api/products";
import { Link } from "react-router-dom";

interface Props {
  product: ProductSearchResult;
}

const ProductCard = ({ product }: Props) => {
  const imageUrl =
    product.image || product.category?.image || "/placeholder.svg";
  const price = parseFloat(product.price);

  return (
    <div className="group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link
        to={`/product/${product.id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-label={`${product.name} details`}
      >
        <div className="aspect-4/5 sm:aspect-square w-full bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-fit object-center group-hover:scale-105 transition-transform"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src !== "/placeholder.svg")
                target.src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="p-2.5 sm:p-3 md:p-4">
          <h3 className="text-sm md:text-base font-medium line-clamp-2">
            {product.name}
          </h3>
          <p className="hidden sm:block text-xs text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-2">
            <span className="text-base sm:text-lg font-semibold">
              ${price.toFixed(2)}
            </span>
            <span
              className={
                "text-[10px] sm:text-xs rounded-full px-2 py-1 " +
                (product.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600")
              }
            >
              {product.stock > 0 ? "In stock" : "Out of stock"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
