import { useTopUpBooking } from "@/hooks/booking_api";
import { useState } from "react";

interface BookingRequestPayload {
  bookId: number;
  paidAmount: number;
  description: string;
  paymentMethod: string;
  paymentTiming: string;
  note: string;
}

interface PaymentFormData {
  paidAmount: string;
  paymentMethod: string;
  paymentTiming: string;
  paymentDescription: string;
  paymentNote: string;
}

export default function PayAndTopupBooking({
  open,
  bookingId,
  onClose,
}: {
  open: boolean;
  bookingId: number;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<PaymentFormData>({
    paidAmount: "",
    paymentMethod: "CASH",
    paymentTiming: "FRONT_DESK",
    paymentDescription: "",
    paymentNote: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const MapList = {
    BOOKINGTYPE: {
      ONLINE: "ONLINE",
      WALK_IN: "WALK_IN",
      PHONE: "PHONE",
      AGENT: "AGENT",
    },
    DISCOUNTTYPE: {
      GENERAL: "GENERAL",
      CARD: "CARD",
      GENERAL_AND_CARD: "GENERAL_AND_CARD",
    },
    PAYMENTMETHOD: {
      CASH: "CASH",
      CREDIT_CARD: "CREDIT_CARD",
      DEBIT_CARD: "DEBIT_CARD",
      MOBILE_PAYMENT: "MOBILE_PAYMENT",
      BANK_TRANSFER: "BANK_TRANSFER",
      PAYPAL: "PAYPAL",
    },
    PAYMENTTIMING: {
      ONLINE_APP: "ONLINE_APP",
      FRONT_DESK: "FRONT_DESK",
      CALL_CENTER: "CALL_CENTER",
      THIRD_PARTY_AGENT: "THIRD_PARTY_AGENT",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: BookingRequestPayload = {
      bookId: bookingId,
      paidAmount: Number.parseFloat(formData.paidAmount),
      description: formData.paymentDescription,
      paymentMethod: formData.paymentMethod,
      paymentTiming: formData.paymentTiming,
      note: formData.paymentNote,
    };

    try {
      await useTopUpBooking(payload);

      onClose();
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Booking Management
            </p>
            <h2 className="text-2xl font-semibold text-gray-900">
              Pay and Top Up Booking
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 px-2.5 py-1.5 text-sm text-gray-500 hover:bg-gray-100"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          {/* Payment Information */}
          <div>
            <h3 className="mb-1 text-sm font-semibold text-gray-900">
              Payment Information
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Paid Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleInputChange}
                  className="w-full h-9 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full h-9 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {Object.entries(MapList.PAYMENTMETHOD).map(([key, value]) => (
                    <option key={value} value={value}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Payment Timing
                </label>
                <select
                  name="paymentTiming"
                  value={formData.paymentTiming}
                  onChange={handleInputChange}
                  className="w-full rounded-lg h-9 border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {Object.entries(MapList.PAYMENTTIMING).map(([key, value]) => (
                    <option key={value} value={value}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Payment Description
                </label>
                <input
                  type="text"
                  name="paymentDescription"
                  value={formData.paymentDescription}
                  onChange={handleInputChange}
                  className="w-full h-9 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Deposit for booking"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Payment Note
                </label>
                <textarea
                  name="paymentNote"
                  value={formData.paymentNote}
                  onChange={handleInputChange}
                  className="w-full h-9 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Paid via ABA mobile app"
                  rows={1}
                />
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-2">
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
    </div>
  );
}
