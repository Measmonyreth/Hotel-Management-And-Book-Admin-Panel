"use client";

import type { Customers } from "@/app/types/customer";
import type {
  VipCustomerDetail,
  VipCustomers,
} from "@/app/types/vip_customer";
import { api, useApiAuthenticated } from "./useApi";

export type VipCustomerPayload = {
  id?: string;
  customerId: string;
  type_vip: string;
  points: number;
  totalSpent: number;
  validFrom: string;
  validUntil: string;
  status: string;
  percentage_discount: number;
};

export function useVipCustomers() {
  return useApiAuthenticated<VipCustomers>("/vipcustomer/getall");
}

export function useVipCustomerSearch(query: string) {
  const queryString = query ? `?${query}` : "";
  return useApiAuthenticated<VipCustomers>(
    `/vipcustomer/search${queryString}`,
  );
}

export function useVipCustomerById(id: string) {
  return useApiAuthenticated<VipCustomerDetail>(
    `/vipcustomer/getbyid/${encodeURIComponent(id)}`,
  );
}

export function useVipCustomerOptions() {
  return useApiAuthenticated<Customers>("/customers/list");
}

export function createVipCustomer(payload: VipCustomerPayload) {
  return api<unknown>("/vipcustomer/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateVipCustomer(id: string, payload: VipCustomerPayload) {
  return api<unknown>(`/vipcustomer/update/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteVipCustomer(id: string | number) {
  return api<unknown>(`/vipcustomer/delete/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}