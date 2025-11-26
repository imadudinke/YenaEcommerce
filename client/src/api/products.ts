import apiFetch from "./fetchClient";

export interface ProductSearchResult {
  id: number;
  name: string;
  price: string;
  image: string | null;
}

export const searchProducts = async (
  query: string
): Promise<ProductSearchResult[]> => {
  if (!query.trim()) return [];
  try {
    const data = await apiFetch(
      `/api/products/?search=${encodeURIComponent(query)}`
    );
    return Array.isArray(data.results)
      ? data.results
      : Array.isArray(data)
      ? data
      : [];
  } catch (e) {
    console.error("Search failed", e);
    return [];
  }
};
