const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    const message =
      typeof data === "object" && data && "detail" in data
        ? String((data as { detail: string }).detail)
        : `API Error ${status}`;
    super(message);
    this.status = status;
    this.data = data;
  }
}

function getTokens() {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("hridayam_auth");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as {
      access_token: string;
      refresh_token: string;
    };
  } catch {
    return null;
  }
}

function setTokens(tokens: { access_token: string; refresh_token: string }) {
  localStorage.setItem("hridayam_auth", JSON.stringify(tokens));
}

function clearTokens() {
  localStorage.removeItem("hridayam_auth");
}

async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens?.refresh_token) return null;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: tokens.refresh_token }),
    });

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const data = await res.json();
    setTokens({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
    return data.access_token;
  } catch {
    clearTokens();
    return null;
  }
}

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, headers: customHeaders, ...rest } = options;

  let url = `${API_URL}${path}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const tokens = getTokens();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (tokens?.access_token) {
    headers["Authorization"] = `Bearer ${tokens.access_token}`;
  }

  let res = await fetch(url, { ...rest, headers });

  // Token expired - try refresh
  if (res.status === 401 && tokens?.refresh_token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, { ...rest, headers });
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
      throw new ApiError(401, { detail: "Session expired" });
    }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ApiError(res.status, data);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

async function apiUpload<T>(
  path: string,
  file: File,
  extraFields?: Record<string, string>
): Promise<T> {
  const tokens = getTokens();
  const formData = new FormData();
  formData.append("file", file);
  if (extraFields) {
    Object.entries(extraFields).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const headers: Record<string, string> = {};
  if (tokens?.access_token) {
    headers["Authorization"] = `Bearer ${tokens.access_token}`;
  }

  let res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (res.status === 401 && tokens?.refresh_token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers,
        body: formData,
      });
    } else {
      throw new ApiError(401, { detail: "Session expired" });
    }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ApiError(res.status, data);
  }

  return res.json();
}

export { apiFetch, apiUpload, ApiError, getTokens, setTokens, clearTokens, API_URL };
