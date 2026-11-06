"use client";

import { FormEvent, useState } from "react";
import type { BookResponse } from "@/app/types/book";
import { updateBookingItemStatus } from "@/hooks/booking_api";
import { getAvailableTransitions } from "../_utils/statusTransitions";

type BookingItemStatusAction = "checkin" | "checkout" | "complete";

function getNextStatus(
  currentStatus: string | undefined,
): { action: BookingItemStatusAction; status: string } | null {
  const normalizedStatus = currentStatus?.toUpperCase().replace(/[^A-Z]/g, "");
  const currentBookingStatus =
    normalizedStatus === "PENDING"
      ? "PENDING"
      : normalizedStatus === "CHECKIN" || normalizedStatus === "CHECKEDIN"
        ? "CHECKED_IN"
        : normalizedStatus === "CHECKOUT" || normalizedStatus === "CHECKEDOUT"
          ? "CHECKED_OUT"
          : null;
  if (!currentBookingStatus) return null;

  const nextStatus = getAvailableTransitions(currentBookingStatus)[0];
  if (!nextStatus) return null;

  const actionByStatus: Partial<Record<string, BookingItemStatusAction>> = {
    CHECKED_IN: "checkin",
    CHECKED_OUT: "checkout",
    COMPLETED: "complete",
  };
  const action = actionByStatus[nextStatus];
  return action ? { action, status: nextStatus } : null;
}

interface UpdateBookingStatusProps {
  booking: BookResponse;
  onClose: () => void;
  onUpdated: () => void;
}

export default function UpdateBookingStatus({
  booking,
  onClose,
  onUpdated,
}: UpdateBookingStatusProps) {
  const [itemId, setItemId] = useState(booking.bookItems[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedItem = booking.bookItems.find((item) => item.id === itemId);
  const currentStatus =
    selectedItem?.status?.trim() || booking.book_status?.trim();
  const nextStatus = getNextStatus(currentStatus);

  const updateStatus = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!itemId || !nextStatus) return;

    setError(null);
    setIsSubmitting(true);
    try {
      await updateBookingItemStatus(itemId, nextStatus.action);
      onUpdated();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update booking status",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-booking-status-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2
              id="update-booking-status-title"
              className="text-lg font-semibold text-gray-900"
            >
              Update booking status
            </h2>
            <p className="mt-1 text-sm text-gray-500">{booking.code}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-gray-200 px-2.5 py-1.5 text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={updateStatus} className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Room
            <select
              value={itemId}
              onChange={(event) => {
                setItemId(event.target.value);
                setError(null);
              }}
              required
              disabled={isSubmitting}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {booking.bookItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.room?.name || "Room"} (
                  {item.status?.trim() || booking.book_status || "Unknown"})
                </option>
              ))}
            </select>
          </label>

          <div className="text-sm font-medium text-gray-700">
            Next status
            <p className="mt-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5">
              {nextStatus?.status ?? "No further status change available"}
            </p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !nextStatus}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
