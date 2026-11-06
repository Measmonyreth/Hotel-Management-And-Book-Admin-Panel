"use client";

import { useEffect, useState } from "react";
import { config } from "@/config";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
}

function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("token");
  document.cookie = "auth=; Max-Age=0; SameSite=Lax; Path=/";
  window.location.assign("/login");
}

function resolveUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const endpoint = path.startsWith("/") ? path : `/${path}`;
  const apiEndpoint = endpoint === "/api" || endpoint.startsWith("/api/")
    ? endpoint
    : `/api${endpoint}`;
  const baseUrl = config.apiUrl.replace(/\/+$/, "").replace(/\/api$/i, "");
  return `${baseUrl}${apiEndpoint}`;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

type Options = RequestInit & { auth?: boolean };
type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export async function api<T>(
  path: string,
  { auth = true, headers: suppliedHeaders, ...options }: Options = {},
): Promise<T> {
  const headers = new Headers(suppliedHeaders);
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!headers.has("Content-Type") && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const token = auth ? getToken() : null;
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (config.apiKey && !headers.has("X-API-KEY")) {
    headers.set("X-API-KEY", config.apiKey);
  }

  const res = await fetch(resolveUrl(path), { ...options, headers });

  if (res.status === 401 && auth) {
    logout();
    throw new ApiError(401, "Unauthorized");
  }
  if (!res.ok) {
    throw new ApiError(res.status, `API error ${res.status}`);
  }

  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

function useApiRequest<T>(url: string, auth: boolean, options: Options = {}): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let ignore = false;

    queueMicrotask(() => {
      if (!ignore) {
        setState((current) => ({ ...current, loading: true, error: null }));
      }
    });

    void api<T>(url, { auth, ...options })
      .then((data) => {
        if (!ignore) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!ignore) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error instanceof Error ? error.message : "Unknown error",
          }));
        }
      });

    return () => {
      ignore = true;
    };
  }, [url, auth]);

  return state;
}

export function useApi<T>(url: string): ApiState<T> {
  return useApiRequest<T>(url, false);
}

export function useApiAuthenticated<T>(url: string, options: Options = {}): ApiState<T> {
  return useApiRequest<T>(url, true, options);
}
