
"use client";

import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { BookingItemRow } from "./bookingitmerow";
import { BookResponse } from "../../../../types/book";


interface BookingItemsCardProps {
  booking: BookResponse;
}

/**
 * BookingItemsCard: Displays list of all booked rooms
 */
export const BookingItemsCard: React.FC<BookingItemsCardProps> = ({
  booking,
}) => {
  const [itemStatuses, setItemStatuses] = useState<Record<string, string>>(
    () => Object.fromEntries(booking.bookItems.map((item) => [item.id, item.status])),
  );



  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center ">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        Booked Rooms ({booking.totalBookitem || 0})
      </h2>
      </div>
      <div className="space-y-4">
        {booking.bookItems && booking.bookItems.length > 0 ? (
          booking.bookItems.map((item) => (
            <BookingItemRow
              key={item.id}
              item={{ ...item, status: itemStatuses[item.id] ?? item.status }}
            />
          ))
        ) : (
          <p className="text-gray-500">No booking items found</p>
        )}
      </div>
    </div>
  );
};