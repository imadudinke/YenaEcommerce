const BASE_URL: string =
  (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:7000/";

function getCSRFToken() {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : "";
}

type FlexibleBody = BodyInit | object;

type ApiFetchOptions = {
  headers?: HeadersInit;
  method?: string;
  body?: FlexibleBody;
};

const apiFetch = async <T = any>(
  url: string,
  options: ApiFetchOptions = {}
): Promise<T> => {
  const { body, headers, ...restOptions } = options;

  let processedBody: BodyInit | undefined;

  if (body) {
    if (typeof body === "object" && !("body" in options)) {
      processedBody = JSON.stringify(body);
    } else {
      processedBody = body as BodyInit;
    }
  }

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  try {
    let res = await fetch(BASE_URL + url, {
      ...restOptions,
      headers: defaultHeaders,
      credentials: "include",
      body: processedBody,
    });
    console.log(BASE_URL, "Fetchhhhhhhhhhhhhhhh");
    if (res.status === 401 || res.status === 403) {
      const errBody: any = await res
        .clone()
        .json()
        .catch(() => ({}));
      const detail = (errBody?.detail || "").toString().toLowerCase();
      const tokenExpired =
        detail.includes("token has expired") ||
        detail.includes("token_not_valid") ||
        detail.includes("not valid");
      if (res.status === 401 || tokenExpired) {
        console.log(
          "Access token invalid/expired. Attempting cookie refresh..."
        );

        // Prefer cookie-based refresh endpoint
        const refreshCookieRes = await fetch(
          BASE_URL + "api/token/refresh-cookie/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCSRFToken(),
            },
            credentials: "include",
          }
        );

        if (!refreshCookieRes.ok) {
          const refreshRes = await fetch(BASE_URL + "api/token/refresh/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCSRFToken(),
            },
            credentials: "include",
            body: JSON.stringify({}),
          });

          if (!refreshRes.ok) {
            console.error("Refresh failed. Redirecting to login.");
            window.location.href = "/login";
            return Promise.reject("Refresh failed");
          }
        }

        console.log("Token refreshed. Retrying original request...");
        return apiFetch<T>(url, options);
      }
    }

    if (!res.ok) {
      const errorBody = await res
        .json()
        .catch(() => ({ message: res.statusText }));
      return Promise.reject(errorBody);
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error("Network error:", error);
    return Promise.reject(error);
  }
};

export default apiFetch;
