import React from "react";
import { User } from "lucide-react";
import { NoteFieldGrid } from "@/components/detailpage/notefield";
import { formatOptional } from "@/components/detailpage/formatters";
import { BookResponse } from "../../../../types/book";
    

interface CustomerInfoCardProps {
  booking: BookResponse;
}

/**
 * CustomerInfoCard: Displays customer name and ID
 */
export const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
  booking,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-600" />
        Customer Information
      </h2>
      <NoteFieldGrid
        columns={1}
        fields={[
          {
            label: "Customer Name",
            value: formatOptional(booking.customer?.name),
          },
          {
            label: "Customer ID",
            value: formatOptional(booking.customer?.customerId),
          },
        ]}
      />
    </div>
  );
};