"use client";

import type { PaymentDetail, Payments } from "@/app/types/payment";
import type { BookingDetail } from "@/app/types/book";
import { api, useApiAuthenticated } from "./useApi";

export function usePayments() {
  return useApiAuthenticated<Payments>("/payment/get-all");
}

export function usePaymentSearch(query: string) {
  const queryString = query ? `?${query}` : "";
  return useApiAuthenticated<Payments>(`/payment/search_filter${queryString}`);
}

export function usePaymentById(id: string) {
  return useApiAuthenticated<PaymentDetail>(
    `/payment/get-by-id/${encodeURIComponent(id)}`,
  );
}

export type PaymentRefundPayload = {
  amount: number;
  description: string;
  currency: string;
  paymentMethod: string;
  paymentTiming: string;
  note: string;
};

export function getBookingForRefund(id: string) {
  return api<BookingDetail>(
    `/book/getbyid/${encodeURIComponent(id)}`,
  );
}

export function refundPayment(
  id: string,
  payload: PaymentRefundPayload,
) {
  return api<unknown>(`/payment/refund/${encodeURIComponent(id)}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
