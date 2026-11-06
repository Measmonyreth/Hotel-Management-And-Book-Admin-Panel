import React from "react";
import { FileText } from "lucide-react";
import { BookResponse } from "../../../../types/book";
import { NoteFieldGrid } from "@/components/detailpage/notefield";
import { formatOptional } from "@/components/detailpage/formatters";


interface AdditionalInfoCardProps {
  booking: BookResponse;
}

/**
 * AdditionalInfoCard: Displays creation, modification, and status details
 */
export const AdditionalInfoCard: React.FC<AdditionalInfoCardProps> = ({
  booking,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        Additional Info
      </h3>

      <NoteFieldGrid
        columns={1}
        fields={[
          {
            label: "Created By",
            value: formatOptional(booking.createBy),
          },
          {
            label: "Last Modified By",
            value: formatOptional(booking.lastModifiedBy),
          },
          {
            label: "Status",
            value: booking.deletedDate ? "Deleted" : "Active",
            valueClassName: booking.deletedDate
              ? "text-sm font-medium text-red-600"
              : "text-sm font-medium text-green-600",
          },
        ]}
      />
    </div>
  );
};