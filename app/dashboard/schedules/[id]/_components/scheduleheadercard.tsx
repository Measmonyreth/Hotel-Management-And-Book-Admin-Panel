import React from "react";
import { formatDate, formatOptional } from "@/components/detailpage/formatters";
import { NoteFieldGrid } from "@/components/detailpage/notefield";
import { Calendar, Clock } from "lucide-react";

export interface Shift {
  id: string;
  shift: string;
  dayWork?: string;
  dayOff?: string;
  startingTime?: string;
  endingTime?: string;
  createdDate: string;
  createBy?: string;
  lastModifiedDate: string;
  lastModifiedBy?: string;
  deletedDate?: string;
  deletedBy?: string;
}

interface ShiftHeaderCardProps {
  shift: Shift;
}

function formatTime(value: unknown) {
  if (!value) return "—";
  const timeStr = String(value);
  if (timeStr.includes(":")) {
    return timeStr;
  }
  return timeStr;
}

/**
 * ShiftHeaderCard: Displays shift name, times, and summary cards
 */
export const ShiftHeaderCard: React.FC<ShiftHeaderCardProps> = ({ shift }) => {
  return (
    <div className="space-y-4">
      {/* Main Header Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Shift Name</p>
          <p className="text-2xl font-bold text-gray-900">
            {shift.shift || "Shift Details"}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ID: {shift.id} • {formatTime(shift.startingTime)} - {formatTime(shift.endingTime)}
          </p>
        </div>

        <NoteFieldGrid
          columns={2}
          fields={[
            {
              label: "Created Date",
              value: formatDate(shift.createdDate),
            },
            {
              label: "Last Modified",
              value: formatDate(shift.lastModifiedDate),
            },
          ]}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3">
        {/* Work Days Card */}
        <div className="overflow-hidden rounded-lg border border-emerald-200 bg-linear-to-br from-emerald-50 to-emerald-100/50 shadow-sm">
          <div className="border-b border-emerald-200 bg-linear-to-r from-emerald-500 to-emerald-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-white" />
              <h3 className="font-semibold text-white text-sm">Work Days</h3>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="font-bold text-emerald-900 text-sm">
              {formatOptional(shift.dayWork)}
            </p>
          </div>
        </div>

        {/* Days Off Card */}
        <div className="overflow-hidden rounded-lg border border-red-200 bg-linear-to-br from-red-50 to-red-100/50 shadow-sm">
          <div className="border-b border-red-200 bg-linear-to-r from-red-500 to-red-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-white" />
              <h3 className="font-semibold text-white text-sm">Days Off</h3>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="font-bold text-red-900 text-sm">
              {formatOptional(shift.dayOff)}
            </p>
          </div>
        </div>

        {/* Start Time Card */}
        <div className="overflow-hidden rounded-lg border border-amber-200 bg-linear-to-br from-amber-50 to-amber-100/50 shadow-sm">
          <div className="border-b border-amber-200 bg-linear-to-r from-amber-500 to-amber-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-white" />
              <h3 className="font-semibold text-white text-sm">Start Time</h3>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="font-bold text-amber-900 text-sm">
              {formatTime(shift.startingTime)}
            </p>
          </div>
        </div>

        {/* End Time Card */}
        <div className="overflow-hidden rounded-lg border border-orange-200 bg-linear-to-br from-orange-50 to-orange-100/50 shadow-sm">
          <div className="border-b border-orange-200 bg-linear-to-r from-orange-500 to-orange-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-white" />
              <h3 className="font-semibold text-white text-sm">End Time</h3>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="font-bold text-orange-900 text-sm">
              {formatTime(shift.endingTime)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
