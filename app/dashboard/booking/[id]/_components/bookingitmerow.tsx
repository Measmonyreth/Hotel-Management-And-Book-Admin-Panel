"use client";

import React, { useState } from "react";
import { BookItem } from "../../../../types/book";
import {
  formatCurrency,
  formatOptional,
} from "@/components/detailpage/formatters";
import { NoteFieldGrid } from "@/components/detailpage/notefield";
import { RefreshCw } from "lucide-react";
import {
  BookingStatus,
  getAvailableTransitions,
} from "../../_utils/statusTransitions";
import { StatusChangeConfirmDialog } from "./StatusChangeConfirmDialog";
import { updateBookingItemStatus } from "@/hooks/booking_api";

interface BookingItemRowProps {
  item: BookItem;

}

export const BookingItemRow: React.FC<BookingItemRowProps> = ({
  item,

}) => {




  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900">
            {formatOptional(item.room?.name || "Unknown Room")}
          </p>
          <p className="text-sm text-gray-500">Room booking</p>
        </div>
        <div className="flex items-center gap-1">
   
        </div>
      </div>

      {/* Dates Grid */}
     

      {/* Pricing Details Grid */}
      <NoteFieldGrid
        columns={2}
        gap="gap-3 mb-3"
        fields={[

          {
            label: "Unit Price",
            value: formatCurrency(item.unit_price),
          },
        ]}
      />

      {/* Totals Section */}
      <div className="border-t border-gray-200 pt-3">
        <NoteFieldGrid
          columns={3}
          fields={[
            {
              label: "Subtotal",
              value: formatCurrency(item.total_amount),
              valueClassName: "font-semibold text-gray-900",
            },
            {
              label: "Discount",
              value: formatCurrency(item.discount_amount),
              valueClassName: "font-semibold text-gray-900",
            },
            {
              label: "Total",
              value: formatCurrency(item.total_amount),
              valueClassName: "font-semibold text-green-600",
            },
          ]}
        />
      </div>

    
    </div>
  );
};
