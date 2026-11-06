"use client";

import type {
  CustomerDetailResponse,
  Customers,
} from "@/app/types/customer";
import { api, useApiAuthenticated } from "./useApi";

export function validateCustomerStatus(){
  
}

export function useCustomers() {
  return useApiAuthenticated<Customers>("/customers/getall");
}

export function useCustomerList(url: string) {
  return useApiAuthenticated<Customers>(url);
}

export function useCustomerById(id: string) {
  return useApiAuthenticated<CustomerDetailResponse>(
    `/customers/getbyid/withvipcard/${encodeURIComponent(id)}`,
  );
}

export type CustomerPayload = {
  id?: string | number;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
  nationality: string;
  city_or_province: string;
  status: string;
  country: string;
  email?: string;
};

export function createCustomer(payload: CustomerPayload) {
  return api<unknown>("/customers/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCustomer(payload: CustomerPayload) {
  return api<unknown>("/customers/update", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function useDeleteCustomer(id: string | number) {
  return api<unknown>(`/customers/delete/${id}`, {
    method: "DELETE",
  });
}