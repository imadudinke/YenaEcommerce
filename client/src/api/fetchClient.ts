const BASE_URL = "http://localhost:8000/";

type ApiFetchProps = {
  url: string;
  options?: {
    headers?: {
      [key: string]: string;
    };
    method?: string;
    body?: string;
  };
};

const apiFetch = async (
  url: string,
  options: ApiFetchProps["options"] = {}
): Promise<any> => {
  try {
    const res = await fetch(BASE_URL + url, {
      ...options,
      headers: { "Content-type": "application/json", ...options.headers },
      credentials: "include",
    });

    if (res.status === 401) {
      console.log("Access token expired. Attempting to refresh token...");

      const refreshRes = await fetch(BASE_URL + "/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!refreshRes.ok) {
        console.error("Refresh failed. Redirecting to login.");
        window.location.href = "/login";
        return Promise.reject(
          "Session expired or network error during refresh"
        );
      }

      console.log("Token refreshed. Retrying original request...");
      return apiFetch(url, options);
    }

    if (!res.ok) {
      const errorBody = await res.json();
      return Promise.reject(errorBody);
    }

    return await res.json();
  } catch (error) {
    console.error("Network or unexpected error during fetch:", error);
    return Promise.reject(error);
  }
};

export default apiFetch;
