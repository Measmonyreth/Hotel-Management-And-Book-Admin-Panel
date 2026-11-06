import React from "react";
import { BookResponse } from "../../../../types/book";
import { formatDate, formatOptional } from "@/components/detailpage/formatters";
import { StatusBadge } from "@/components/detailpage/statusBadge";
import { NoteFieldGrid } from "@/components/detailpage/notefield";


interface BookingHeaderCardProps {
  booking: BookResponse;
}

/**
 * BookingHeaderCard: Displays booking code, status badges, and dates
 */
export const BookingHeaderCard: React.FC<BookingHeaderCardProps> = ({
  booking,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Booking Code</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatOptional(booking.code)}
          </p>
        </div>
        <div className="flex gap-2">
          <StatusBadge
            status={booking.book_status}
            type="booking"
          />
          <StatusBadge
            status={booking.payment_status}
            type="payment"
          />
        </div>
      </div> 

      <NoteFieldGrid
        columns={2}
        fields={[
          {
            label: "Created Date",
            value: formatDate(booking.createdDate),
          },
          {
            label: "Last Modified",
            value: formatDate(booking.lastModifiedDate),
          },
        ]}
      />
    </div>
  );
};