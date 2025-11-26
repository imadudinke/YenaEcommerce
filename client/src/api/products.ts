import apiFetch from "./fetchClient";

interface ProductImage {
  id: number;
  image: string;
}

interface ProductInnerCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface ProductRawData {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  is_active: boolean;
  category: ProductInnerCategory;
  images: ProductImage[];
  reviews: any[];
}

export interface ProductSearchResult extends ProductRawData {
  image: string | null;
}

export interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductSearchResult[];
}

export interface CategoryProps {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

const transformProductData = (rawData: any): PaginatedResponse => {
  let results: ProductRawData[] = [];
  let count: number = 0;
  let next: string | null = null;
  let previous: string | null = null;

  if (rawData && Array.isArray(rawData.results)) {
    results = rawData.results as ProductRawData[];
    count = rawData.count || results.length;
    next = rawData.next || null;
    previous = rawData.previous || null;
  } else if (rawData && Array.isArray(rawData)) {
    results = rawData as ProductRawData[];
    count = results.length;
  }

  const transformedResults: ProductSearchResult[] = results.map(
    (product: ProductRawData) => ({
      ...product,
      image: product.images?.[0]?.image || null,
    })
  );

  return { count, next, previous, results: transformedResults };
};

export const searchProducts = async (
  query: string,
  page: number = 1
): Promise<PaginatedResponse> => {
  if (!query.trim()) {
    return { count: 0, next: null, previous: null, results: [] };
  }

  try {
    const rawData = await apiFetch(
      `api/products/?search=${encodeURIComponent(query)}&page=${page}`
    );

    return transformProductData(rawData);
  } catch (e) {
    console.error("Search failed", e);
    return { count: 0, next: null, previous: null, results: [] };
  }
};

export const ProductDetail = async (
  id: string
): Promise<ProductRawData | null> => {
  const int_id = parseInt(id, 10);

  if (isNaN(int_id)) {
    console.error(`ProductDetail: Invalid ID provided: ${id}`);
    return null;
  }

  try {
    const data: ProductRawData = await apiFetch(`api/products/${int_id}`);
    return data;
  } catch (error) {
    console.error(`ProductDetail: Failed to fetch data for ID ${id}.`, error);
    return null;
  }
};

export const CategoryListData = async (): Promise<CategoryProps[] | null> => {
  try {
    const data = await apiFetch("api/products/categories/");

    if (data && Array.isArray(data["results"])) {
      return data["results"] as CategoryProps[];
    }
    return [];
  } catch (error) {
    console.error(`Failed to fetch CategoryList.`, error);
    return null;
  }
};

export const SearchByCategory = async (
  slug: string
): Promise<PaginatedResponse> => {
  try {
    const rawData = await apiFetch(`api/products/category/${slug}/`);

    return transformProductData(rawData);
  } catch (e) {
    console.error(`SearchByCategory failed for slug: ${slug}`, e);
    return { count: 0, next: null, previous: null, results: [] };
  }
};
