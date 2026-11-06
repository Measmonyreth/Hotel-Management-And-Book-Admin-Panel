import { useEffect, useState, type FormEvent } from "react";
import type { Payment } from "../../../types/payment";
import { getBookingForRefund, refundPayment } from "@/hooks/payment_api";

export interface createpaymentFormValue {
  amount: number;
  description: string;
  currency: string;
  paymentMethod: string;
  paymentTiming: string;
  note: string;
}

interface createpaymentprop {
  open: boolean;
  paymentlist?: Payment;
  onClosed: () => void;
  onSubmit: (payment: createpaymentFormValue) => void;
}

function calculateRefundRate(checkInDate: Date, now: Date): number {
  const hoursUntilCheckIn =
    (checkInDate.getTime() - now.getTime()) / 3_600_000;

  if (hoursUntilCheckIn <= 0) return 0;
  if (hoursUntilCheckIn > 48) return 0.7;
  if (hoursUntilCheckIn > 24) return 0.5;
  if (hoursUntilCheckIn > 12) return 0.2;
  return 1;
}

export default function CreatePayment({
  open,
  paymentlist,
  onClosed,
  onSubmit,
}: createpaymentprop) {
  const bookingId =
    paymentlist?.bookId || String(paymentlist?.book?.bookId ?? "");
  const [formValue, setFormValue] = useState<createpaymentFormValue>({
    amount: 0,
    description: "",
    currency: paymentlist?.currency ?? "USD",
    paymentMethod: paymentlist?.paymentMethod ?? "CASH",
    paymentTiming: paymentlist?.paymentTiming ?? "FRONT_DESK",
    note: "",
  });
  const [refundRate, setRefundRate] = useState<number | null>(null);
  const [calculatedRefundAmount, setCalculatedRefundAmount] = useState<
    number | null
  >(null);
  const [bookingDates, setBookingDates] = useState<{
    checkInDate: string;
    checkOutDate: string;
  } | null>(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      amount: formValue.amount,
      description: formValue.description,
      currency: formValue.currency,
      paymentMethod: formValue.paymentMethod,
      paymentTiming: formValue.paymentTiming,
      note: formValue.note,
    };

    if (formValue.amount <= 0) {
      setRefundError("Enter a refund amount greater than zero.");
      return;
    }

    if (refundLoading || calculatedRefundAmount === null) {
      setRefundError("The refund amount cannot be submitted until it is calculated.");
      return;
    }

    if (formValue.amount > calculatedRefundAmount) {
      setRefundError(
        `Refund amount cannot be greater than ${calculatedRefundAmount.toFixed(2)} ${formValue.currency}.`,
      );
      return;
    }

    if (!paymentlist?.id) {
      setRefundError("Payment ID is missing, so the refund cannot be submitted.");
      return;
    }

    setRefundError(null);
    try {
      await refundPayment(paymentlist.id, payload);
      onSubmit(formValue);
    } catch (error) {
      setRefundError(
        error instanceof Error ? error.message : "Unable to submit refund.",
      );
    }
  };

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setRefundError(null);
    setRefundRate(null);
    setCalculatedRefundAmount(null);
    setBookingDates(null);
    setRefundLoading(false);

    if (!bookingId) {
      setRefundError(
        "Booking ID is missing, so the refund amount cannot be calculated.",
      );
      return;
    }

    const paidAmount = paymentlist?.paidAmount ?? 0;

    const loadRefundAmount = async () => {
      setRefundLoading(true);

      try {
        const booking = await getBookingForRefund(bookingId);
        if (!booking.success) {
          throw new Error(booking.message || "Unable to load booking details.");
        }

        const { checkInDate, checkOutDate } = booking.data;
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        if (
          Number.isNaN(checkIn.getTime()) ||
          Number.isNaN(checkOut.getTime()) ||
          checkOut <= checkIn
        ) {
          throw new Error("Booking check-in or check-out date is invalid.");
        }
        if (!Number.isFinite(paidAmount) || paidAmount <= 0) {
          throw new Error("Payment amount is unavailable for refund calculation.");
        }

        const rate = calculateRefundRate(checkIn, new Date());
        const amount = Number((paidAmount * rate).toFixed(2));

        if (!cancelled) {
          setRefundRate(rate);
          setCalculatedRefundAmount(amount);
          setBookingDates({ checkInDate, checkOutDate });
          setFormValue((current) => ({
            ...current,
            amount,
            currency: paymentlist?.currency ?? current.currency,
            paymentMethod: paymentlist?.paymentMethod ?? current.paymentMethod,
            paymentTiming: paymentlist?.paymentTiming ?? current.paymentTiming,
          }));
        }
      } catch (error) {
        if (!cancelled) {
          setRefundError(
            error instanceof Error
              ? error.message
              : "Unable to calculate refund.",
          );
        }
      } finally {
        if (!cancelled) setRefundLoading(false);
      }
    };

    loadRefundAmount();

    return () => {
      cancelled = true;
    };
  }, [bookingId, open, paymentlist]);

  const handleChange = (
    field: keyof createpaymentFormValue,
    value: string | number,
  ) => {
    setFormValue((current) => ({ ...current, [field]: value }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Create Payment</h3>
          </div>

          <button
            type="button"
            onClick={onClosed}
            className="rounded-full border border-gray-200 px-2.5 py-1.5 text-sm text-gray-500 hover:bg-gray-100"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        {paymentlist && (
          <p className="mb-4 text-sm text-gray-600">
            Payment:{" "}
            <span className="font-medium text-gray-900">
              {paymentlist.code}
            </span>
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="payment-amount"
              className="block text-sm font-medium text-gray-700"
            >
              Refund amount <span className="text-red-600" aria-hidden="true">*</span> required
            </label>
            <input
              id="payment-amount"
              type="number"
              min="0"
              step="0.01"
              value={formValue.amount || ""}
              onChange={(event) =>
                handleChange("amount", Number(event.target.value))
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
            {refundLoading && (
              <p className="mt-1 text-sm text-gray-500">
                Calculating refund...
              </p>
            )}
            {calculatedRefundAmount !== null && refundRate !== null ? (
              <div className="mt-1 text-sm text-gray-600">
                <p>
                  Suggested maximum refund: {calculatedRefundAmount.toFixed(2)}{" "}
                  {formValue.currency}
                </p>
                <p>
                  Calculation: {(paymentlist?.paidAmount ?? 0).toFixed(2)}{" "}
                  {paymentlist?.currency} × {(refundRate * 100).toFixed(2)}%
                  cancellation rate (based on booking check-in).
                </p>
                {bookingDates && (
                  <p>
                    Booking dates: {bookingDates.checkInDate} to{" "}
                    {bookingDates.checkOutDate}.
                  </p>
                )}
              </div>
            ) : refundLoading ? (
              <p className="mt-1 text-sm text-gray-500">
                Calculating suggested maximum refund...
              </p>
            ) : null}
            {refundError && (
              <p className="mt-1 text-sm text-red-600">{refundError}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="payment-description"
              className="block text-sm font-medium text-gray-700"
            >
              Refund description
            </label>
            <input
              id="payment-description"
              value={formValue.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="payment-currency"
                className="block text-sm font-medium text-gray-700"
              >
                Currency <span className="text-red-600" aria-hidden="true">*</span> required
              </label>
              <input
                id="payment-currency"
                value={formValue.currency}
                onChange={(event) =>
                  handleChange("currency", event.target.value)
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="payment-method"
                className="block text-sm font-medium text-gray-700"
              >
                Refund method <span className="text-red-600" aria-hidden="true">*</span> required
              </label>
              <input
                id="payment-method"
                value={formValue.paymentMethod}
                onChange={(event) =>
                  handleChange("paymentMethod", event.target.value)
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="payment-timing"
              className="block text-sm font-medium text-gray-700"
            >
              Refund timing
            </label>
            <input
              id="payment-timing"
              value={formValue.paymentTiming}
              onChange={(event) =>
                handleChange("paymentTiming", event.target.value)
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="payment-note"
              className="block text-sm font-medium text-gray-700"
            >
              Refund note
            </label>
            <textarea
              id="payment-note"
              value={formValue.note}
              onChange={(event) => handleChange("note", event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Confirm refund
          </button>
        </form>
      </div>
    </div>
  );
}
