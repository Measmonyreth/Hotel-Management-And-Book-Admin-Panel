"use client";

import { useEffect, useState } from "react";
import BookingFormFields from "./BookingFormFields";
import { useCreateBooking } from "@/hooks/booking_api";

export interface FormData {
  customerId: string;
  roomIds: string[];
  bookingType: string;
  checkInDate: string;
  checkOutDate: string;
  discountDescription: string;
  discountType: string;
  valid_from: string;
  valid_until: string;
  paidAmount: string;
  paymentDescription: string;
  paymentMethod: string;
  paymentTiming: string;
  paymentNote: string;
}

interface CreateBookingProps {
  open: boolean;
  onClose: () => void;
  submit?: (data: BookingRequestPayload) => void;
}

interface BookingRequestPayload {
  bookRequest: {
    customerId: number;
    bookingType: string;
    checkInDate: string;
    checkOutDate: string;
    bookItemsRequest: Array<{
      roomId: number;
    }>;
    discountRequest: {
      description: string;
      type: string;
      valid_from: string;
      valid_until: string;
    };
  };
  paymentRequest: {
    paidAmount: number;
    description: string;
    paymentMethod: string;
    paymentTiming: string;
    note: string;
  };
}

function formatForApi(value: string): string {
  const match = value
    .trim()
    .match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);

  if (!match) {
    throw new Error(
      `Invalid date format: "${value}". Expected YYYY-MM-DDTHH:mm`,
    );
  }

  const [, date, hour, minute, second = "00"] = match;

  return `${date}T${hour}:${minute}:${second}`;
}

export default function CreateBooking({
  open,
  onClose,
  submit,
}: CreateBookingProps) {
  const [formData, setFormData] = useState<FormData>({
    customerId: "",
    roomIds: [],
    bookingType: "ONLINE",
    checkInDate: "",
    checkOutDate: "",
    discountDescription: "",
    discountType: "GENERAL",
    valid_from: "",
    valid_until: "",
    paidAmount: "",
    paymentDescription: "",
    paymentMethod: "CASH",
    paymentTiming: "FRONT_DESK",
    paymentNote: "",
  });
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (open) {
      setSubmitError("");
      setFormData({
        customerId: "",
        roomIds: [],
        bookingType: "ONLINE",
        checkInDate: "",
        checkOutDate: "",
        discountDescription: "",
        discountType: "GENERAL",
        valid_from: "",
        valid_until: "",
        paidAmount: "",
        paymentDescription: "",
        paymentMethod: "CASH",
        paymentTiming: "FRONT_DESK",
        paymentNote: "",
      });
    }
  }, [open]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setSubmitError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (formData.roomIds.length === 0) {
        setSubmitError("Select at least one room.");
        return;
      }

      const payload: BookingRequestPayload = {
        bookRequest: {
          customerId: parseInt(formData.customerId),
          bookingType: formData.bookingType,
          checkInDate: formatForApi(formData.checkInDate),
          checkOutDate: formatForApi(formData.checkOutDate),
          bookItemsRequest: formData.roomIds.map((roomId) => ({
            roomId: Number(roomId),
          })),
          discountRequest: {
            description: formData.discountDescription,
            type: formData.discountType,
            valid_from: formData.valid_from,
            valid_until: formData.valid_until,
          },
        },
        paymentRequest: {
          paidAmount: parseFloat(formData.paidAmount),
          description: formData.paymentDescription,
          paymentMethod: formData.paymentMethod,
          paymentTiming: formData.paymentTiming,
          note: formData.paymentNote,
        },
      };

      await useCreateBooking(payload);

      submit?.(payload);
      onClose();
    } catch (error) {
      console.error("Error creating booking:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Could not create booking.",
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-3 shadow-2xl my-1">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Create a new booking
            </p>
            <h2 className="text-xl font-semibold text-gray-900">
              Add New Booking
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          {submitError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {submitError}
            </p>
          )}
          <BookingFormFields
            formData={formData}
            onChange={handleInputChange}
            onRoomSelectionChange={(roomIds) => {
              setSubmitError("");
              setFormData((previous) => ({ ...previous, roomIds }));
            }}
          />

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-200 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
