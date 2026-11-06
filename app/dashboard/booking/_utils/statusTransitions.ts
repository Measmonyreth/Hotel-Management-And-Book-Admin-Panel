export type BookingStatus = "PENDING" | "CHECKED_IN" | "CHECKED_OUT" | "COMPLETED" | "CANCELLED" | "CONFIRMED";

export const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pending",
  CHECKED_IN: "Check In",
  CHECKED_OUT: "Check Out",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  CONFIRMED: "Confirmed",
};

export const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CHECKED_IN: "bg-purple-100 text-purple-700",
  CHECKED_OUT: "bg-orange-100 text-orange-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
};

// Forward only: PENDING → CHECK_IN → CHECK_OUT → COMPLETED
// From COMPLETED: can go to CANCELLED or CONFIRMED
export const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ["CHECKED_IN"],
  CHECKED_IN: ["CHECKED_OUT"],
  CHECKED_OUT: ["COMPLETED"],
  COMPLETED: ["CANCELLED", "CONFIRMED"],
  CANCELLED: [],
  CONFIRMED: [],
};

export const isValidTransition = (current: BookingStatus, next: BookingStatus): boolean =>
  VALID_TRANSITIONS[current]?.includes(next) ?? false;

export const getAvailableTransitions = (status: BookingStatus): BookingStatus[] =>
  VALID_TRANSITIONS[status] ?? [];

export const getTransitionWarning = (current: BookingStatus, next: BookingStatus): string | null =>
  next === "CANCELLED" ? "This action cannot be undone. The booking will be marked as cancelled." : null;
