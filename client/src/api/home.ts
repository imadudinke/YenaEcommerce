import apiFetch from "./fetchClient";

// Shape based on server response; extend as backend evolves
export interface HomeDataBanner {
  id: number;
  title: string;
  image: string;
  url?: string;
  order?: number;
}
export interface HomeDataProduct {
  id: number;
  name: string;
  price: string;
  image: string | null;
}
export interface HomeDataCategory {
  id: number;
  name: string;
  slug: string;
  image: string | null;
}
export interface HomeDataResponse {
  banners: HomeDataBanner[];
  featured: HomeDataProduct[];
  new_arrivals: HomeDataProduct[];
  categories: HomeDataCategory[];
  best_sellers: HomeDataProduct[];
}

export const getHomeData = async (): Promise<HomeDataResponse | null> => {
  try {
    return await apiFetch("/api/home/");
  } catch (err) {
    console.error("Failed to fetch home data", err);
    return null;
  }
};
