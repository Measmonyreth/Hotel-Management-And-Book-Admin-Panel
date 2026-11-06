"use client";

import { DataCustomerRequest } from "@/app/types/customer_request";
import { useBookings } from "@/hooks/booking_api";
import {
  createCustomerRequest,
  updateCustomerRequest,
} from "@/hooks/customer_request_api";
import { useState } from "react";
import type { FormEvent } from "react";

type CreateRequestProp = {
  titile: string;
  open: boolean;
  initailReq: DataCustomerRequest | undefined;
  edit: boolean;
  onclose: () => void;
};

type FormData = {
  book: string;
  reason: string;
  status: string;
  calculatedPenaltyFee: number;
  calculatedRefundAmount: number;
  rejectionReason: string;
};

export default function CreateRequestPage({
  edit,
  titile,
  initailReq,
  open,
  onclose,
}: CreateRequestProp) {
  const { data } = useBookings();
  const booking = data?.data.bookResponses ?? [];
  const [formData, setFormData] = useState<FormData>(() => {
    if (!edit || !initailReq) {
      return {
        book: "",
        reason: "",
        status: "",
        calculatedPenaltyFee: 0,
        calculatedRefundAmount: 0,
        rejectionReason: "",
      };
    }

    return {
      book: String(initailReq.bookId.id),
      reason: initailReq.reason,
      status: initailReq.status,
      calculatedPenaltyFee: initailReq.calculatedPenaltyFee,
      calculatedRefundAmount: initailReq.calculatedRefundAmount,
      rejectionReason: initailReq.rejectionReason ?? "",
    };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <Field extends keyof FormData>(
    field: Field,
    value: FormData[Field],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!edit) {
        await createCustomerRequest(formData.book, formData.reason);
        setFormData({
          book: "",
          reason: "",
          status: "",
          calculatedPenaltyFee: 0,
          calculatedRefundAmount: 0,
          rejectionReason: "",
        });
      } else {
        if (!initailReq) {
          throw new Error("Cannot update a request without its ID.");
        }

        await updateCustomerRequest(initailReq.id, {
          bookId: formData.book,
          reason: formData.reason,
          calculatedPenaltyFee: formData.calculatedPenaltyFee,
          calculatedRefundAmount: formData.calculatedRefundAmount,
          status: formData.status,
          rejectionReason: formData.rejectionReason,
        });
      }
      onclose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to create request.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex justify-between">
          <div className="mb-5 flex items-center justify-between">
            <h1>{titile}</h1>
          </div>
          <button
            type="button"
            onClick={onclose}
            className="rounded-full border border-gray-200 px-2.5 py-1.5 text-sm text-gray-500 hover:bg-gray-100"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div>
          <form onSubmit={submit}>
            <div>
              <label
                htmlFor="request-book"
                className="text-sm font-medium text-gray-700"
              >
                Book <span className="text-red-500">*</span>
                <select
                  name="bookId"
                  id="request-book"
                  required
                  onChange={(e) => updateField("book", e.target.value)}
                  value={formData.book}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="" disabled>
                    Select Booking
                  </option>
                  {booking.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {edit && (
              <div className="mt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <label
                    htmlFor="request-reason"
                    className="block text-sm font-medium text-gray-700"
                  >
                    calculatedPenaltyFee
                    <span className="text-red-600" aria-hidden="true">
                      *
                    </span>
                    <input
                      id="request-penalty"
                      type="number"
                      name="calculatedPenaltyFee"
                      required
                      value={formData.calculatedPenaltyFee}
                      onChange={(e) =>
                        updateField(
                          "calculatedPenaltyFee",
                          Number(e.target.value),
                        )
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                  <label
                    htmlFor="request-refund"
                    className="block text-sm font-medium text-gray-700"
                  >
                    calculatedRefundAmount
                    <span className="text-red-600" aria-hidden="true">
                      *
                    </span>
                    <input
                      id="request-refund"
                      type="number"
                      name="calculatedRefundAmount"
                      required
                      value={formData.calculatedRefundAmount}
                      onChange={(e) =>
                        updateField(
                          "calculatedRefundAmount",
                          Number(e.target.value),
                        )
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                  <label
                    htmlFor="request-status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                    <select
                      id="request-status"
                      name="status"
                      value={formData.status}
                      onChange={(e) => updateField("status", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select</option>
                      <option value="REQUESTED">Requested</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="PROCESSING">Processing</option>
                    </select>
                  </label>
                </div>
                <label
                  htmlFor="request-rejection-reason"
                  className="text-sm font-medium text-gray-700"
                >
                  Rejection Reason
                  <span className="text-red-600" aria-hidden="true">
                    *
                  </span>
                  <input
                    id="request-rejection-reason"
                    type="text"
                    name="rejectionReason"
                    required
                    value={formData.rejectionReason}
                    onChange={(e) =>
                      updateField("rejectionReason", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>
            )}
            <div className="mt-4">
              <label
                htmlFor="request-reason"
                className="text-sm font-medium text-gray-700"
              >
                Reason
                <span className="text-red-600" aria-hidden="true">
                  *
                </span>
                <input
                  id="request-reason"
                  type="text"
                  name="reason"
                  required
                  value={formData.reason}
                  onChange={(e) => updateField("reason", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onclose}
                disabled={saving}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
