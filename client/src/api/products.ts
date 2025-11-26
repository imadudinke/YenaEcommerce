import apiFetch from "./fetchClient";

export interface ProductSearchResult {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  is_active: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
  };
  images: {
    id: number;
    image: string;
  }[];
  reviews: any[];
  // derived convenience field for first image url
  image?: string | null;
}

export interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductSearchResult[];
}

export const searchProducts = async (
  query: string,
  page: number = 1
): Promise<PaginatedResponse> => {
  if (!query.trim())
    return { count: 0, next: null, previous: null, results: [] };

  try {
    const data: PaginatedResponse | ProductSearchResult[] = await apiFetch(
      `api/products/?search=${encodeURIComponent(query)}&page=${page}`
    );

    let response: PaginatedResponse = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };

    if (Array.isArray((data as PaginatedResponse).results)) {
      response = data as PaginatedResponse;
    } else if (Array.isArray(data)) {
      response = {
        count: (data as ProductSearchResult[]).length,
        next: null,
        previous: null,
        results: data as ProductSearchResult[],
      };
    }

    response.results = response.results.map((product) => ({
      ...product,
      image: product.images?.[0]?.image || null,
    }));

    return response;
  } catch (e) {
    console.error("Search failed", e);
    return { count: 0, next: null, previous: null, results: [] };
  }
};

export const ProductDetail = async (id: string) => {
  const int_id = +id;

  try {
    const data = await apiFetch(`api/products/${int_id}`);
    return data;
  } catch (error) {
    console.error(`ProductDetail: Failed to fetch data for ID ${id}.`, error);
    return null;
  }
};
