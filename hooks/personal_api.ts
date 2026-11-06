"use client";

import { useEffect, useState } from "react";
import type { EmployeeResponse } from "@/app/types/personal";
import { api } from "./useApi";

export function usePersonalInfo() {
  const [result, setResult] = useState<EmployeeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      setLoading(true);
      setError(null);

      try {
        const response = await api<EmployeeResponse>("/auth/getProfile");
        if (!ignore) setResult(response);
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Unable to load profile.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

  const employee = result?.success ? result.data : null;
  const responseError =
    result && !result.success ? result.message : null;

  return { employee, error: error ?? responseError, loading };
}
