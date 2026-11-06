"use client";

import type {
  EmployeeDetailResponse,
  EmployeesResponse,
} from "@/app/types/employee";
import { api, useApiAuthenticated } from "./useApi";

export function useEmployees() {
  return useApiAuthenticated<EmployeesResponse>("/auth/list");
}

export function useEmployeeSearch(url: string) {
  return useApiAuthenticated<EmployeesResponse>(url);
}

export function useEmployeeById(id: string) {
  return useApiAuthenticated<EmployeeDetailResponse>(
    `/auth/getbyid/${encodeURIComponent(id)}`,
  );
}

export type EmployeePayload = {
  id?: string;
  name: string;
  username?: string;
  password: string;
  phone: string;
  role: string;
};

export function createEmployee(payload: EmployeePayload) {
  return api<unknown>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateEmployee(id: string, payload: EmployeePayload) {
  return api<unknown>(`/auth/update/${encodeURIComponent(id)}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteEmployee(id: string | number) {
  return api<unknown>(`/auth/delete/${id}`, {
    method: "DELETE",
  });
}