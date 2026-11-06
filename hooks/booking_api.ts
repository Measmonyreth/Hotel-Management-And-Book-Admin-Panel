"use client";

import type { Booking, BookingDetail } from "@/app/types/book";
import { api, useApiAuthenticated } from "./useApi";


export function useBookings() {
  return useApiAuthenticated<Booking>("/book/getall");
}

export function useBookingById(id: string) {
  return useApiAuthenticated<BookingDetail>(`/book/getbyid/${id}`);
}

export function useBookingSearch(url: string) {
  return useApiAuthenticated<Booking>(url);
}

export function updateBookingItemStatus(
  id: string,
  status: "checkin" | "checkout" | "complete",
) {
  return api<unknown>(`/book/item/${encodeURIComponent(id)}/${status}`, {
    method: "PATCH",
  });
}

export function useTopUpBooking(payload: {
  bookId: number;
  paidAmount: number;
  description: string;
  paymentMethod: string;
  paymentTiming: string;
  note: string;
}) {
  return api<unknown>(`/payment/create`, {
    method: "POST",
    body: JSON.stringify({ ...payload }),
  });
}

export function useCreateBooking(payload: {}) {
  return api<unknown>(`/book/create`, {
    method: "POST",

    body: JSON.stringify({ ...payload }),
  });
}

export function useDeleteBooking(id: number) {
  return api<unknown>(`/book/deletebyid/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}