"use client";

import { useState } from "react";
import { useApiAuthenticated } from "@/hooks/useApi";
import { Customer, Customers } from "../../../types/customer";
import { Room, Rooms } from "../../../types/room";
import { config } from "@/config";

interface FormData {
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

interface BookingFormFieldsProps {
  formData: FormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onRoomSelectionChange: (roomIds: string[]) => void;
  customerReadOnly?: boolean;
}

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
    CARD: "CARD",
    ONLINE: "ONLINE",
  },
  PAYMENTTIMING: {
    ONLINE: "ONLINE",
    FRONT_DESK: "FRONT_DESK",
    CALL_CENTER: "CALL_CENTER",
    THIRD_PARTY_AGENT: "THIRD_PARTY_AGENT",
  },
};

export default function BookingFormFields({
  formData,
  onChange,
  onRoomSelectionChange,
  customerReadOnly = false,
}: BookingFormFieldsProps) {
  const [roomToAdd, setRoomToAdd] = useState("");
  const { data: customersData } = useApiAuthenticated<Customers>(
    `${config.apiUrl}/api/customers/list`,
  );
  const { data: roomsData } = useApiAuthenticated<Rooms>(
    `${config.apiUrl}/api/room/all`,
  );
  const customerList: Customer[] = customersData?.data?.customers ?? [];
  const roomList: Room[] = roomsData?.data?.rooms ?? [];

  return (
    <>
      {/* Booking Information */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-gray-900">
          Booking Information
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <label className="mb-0.5 block text-sm font-medium text-gray-700">
              Customer <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.customerId}
              onChange={onChange}
              name="customerId"
              required
              className=" w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              disabled={customerReadOnly}
            >
              <option value="">Select Customer</option>
              {customerList.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.firstName + " " + customer.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Room & Booking Details */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-gray-900">
          Room & Booking Details
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <p className="mb-0.5 block text-sm font-medium text-gray-700">
              Room <span className="text-red-500">*</span>
            </p>
            <div className="flex min-h-11 items-end gap-1 overflow-x-auto rounded-t-lg border border-gray-300 bg-gray-100 px-2 pt-2">
              {formData.roomIds.map((roomId) => {
                const room = roomList.find(
                  (availableRoom) => String(availableRoom.id) === roomId,
                );
                if (!room) return null;

                return (
                  <div
                    key={roomId}
                    className="flex shrink-0 items-center gap-2 rounded-t-md border border-b-0 border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                  >
                    <span>
                      {room.roomNumber} - {room.roomName}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove room ${room.roomNumber}`}
                      onClick={() =>
                        onRoomSelectionChange(
                          formData.roomIds.filter(
                            (selectedRoomId) => selectedRoomId !== roomId,
                          ),
                        )
                      }
                      disabled={customerReadOnly}
                      className="rounded px-1 text-gray-500 hover:bg-gray-200 hover:text-gray-900 disabled:cursor-not-allowed"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
              <select
                aria-label="Add a room"
                value={roomToAdd}
                onChange={(event) => {
                  const roomId = event.target.value;
                  if (roomId && !formData.roomIds.includes(roomId)) {
                    onRoomSelectionChange([...formData.roomIds, roomId]);
                  }
                  setRoomToAdd("");
                }}
                disabled={customerReadOnly}
                className="mb-1 min-w-32 rounded-md border border-dashed border-gray-400 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-500 disabled:cursor-not-allowed"
              >
                <option value="">
                  {roomList.length === formData.roomIds.length
                    ? "All rooms added"
                    : "+ Add room"}
                </option>
                {roomList
                  .filter(
                    (room) => !formData.roomIds.includes(String(room.id)),
                  )
                  .map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.roomNumber} - {room.roomName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="h-1 rounded-b-lg border-x border-b border-gray-300 bg-white" />
            <p className="mt-1 text-xs text-gray-500">
              Add rooms as tabs; remove any room with ×.
            </p>
          </div>

          <div>
           <label className="mb-0.5 block text-sm font-medium text-gray-700">
             Booking Type <span className="text-red-500">*</span>
            </label>
            <select
              name="bookingType"
              value={formData.bookingType}
              onChange={onChange}
              required
              className="w-full h-9 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Object.entries(MapList.BOOKINGTYPE).map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-0.5 block text-sm font-medium text-gray-700">
              Check-In Date &amp; Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={onChange}
              className="h-9 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-0.5 block text-sm font-medium text-gray-700">
              Check-Out Date &amp; Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={onChange}
              className="w-full h-9 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Discount Information */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-gray-900">
          Discount Information
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-0.5">
              Discount Description
            </label>
            <textarea
              name="discountDescription"
              value={formData.discountDescription}
              onChange={onChange}
              className="w-full h-9 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., 10% off for all rooms"
              rows={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">
              Discount Type
            </label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Object.entries(MapList.DISCOUNTTYPE).map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">
              Discount Valid From
            </label>
            <input
              type="date"
              name="valid_from"
              value={formData.valid_from}
              onChange={onChange}
              className="w-full h-9 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">
              Discount Valid Until
            </label>
            <input
              type="date"
              name="valid_until"
              value={formData.valid_until}
              onChange={onChange}
              className="w-full h-9 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-gray-900">
          Payment Information
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <label className="mb-0.5 block text-sm font-medium text-gray-700">
              Paid Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="paidAmount"
              value={formData.paidAmount}
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
              className="w-full h-9 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Paid via ABA mobile app"
              rows={1}
            />
          </div>
        </div>
      </div>
    </>
  );
}
