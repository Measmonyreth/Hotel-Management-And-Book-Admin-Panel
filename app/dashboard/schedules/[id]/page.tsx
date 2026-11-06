"use client";

import { useParams, useRouter } from "next/navigation";
import { useScheduleById } from "@/hooks/schedule_api";
import { ChevronLeft, AlertCircle, Lock, Calendar, UserCheck, Trash2, Briefcase, Clock } from "lucide-react";
import { ShiftHeaderCard } from "./_components/scheduleheadercard";
import ShiftDetailCard from "./_components/scheduledetailcard";
import { formatDate, formatOptional } from "@/components/detailpage/formatters";

function formatTime(value: unknown) {
  if (!value) return "—";
  const timeStr = String(value);
  if (timeStr.includes(":")) {
    return timeStr;
  }
  return timeStr;
}

export default function ShiftDetailPage() {
  const router = useRouter();
  const params = useParams();
  const shiftId = params?.id as string;

  const { data, loading, error } = useScheduleById(shiftId);

  const shift = data?.data;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-sm font-medium text-slate-600">Loading shift details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-6 w-6 shrink-0 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Error Loading Shift</h3>
              <p className="mt-1 text-sm text-red-700">{String(error)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-900">Shift not found</p>
          <p className="mt-1 text-sm text-slate-600">No shift data available</p>
        </div>
      </div>
    );
  }

  const shiftDetails = [
    {
      label: "Shift ID",
      value: shift?.id,
      icon: Lock,
      color: "text-purple-600",
    },
    {
      label: "Shift Name/Type",
      value: shift?.shift,
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      label: "Work Days",
      value: formatOptional(shift?.dayWork),
      icon: Calendar,
      color: "text-emerald-600",
    },
    {
      label: "Days Off",
      value: formatOptional(shift?.dayOff),
      icon: Calendar,
      color: "text-red-600",
    },
    {
      label: "Starting Time",
      value: formatTime(shift?.startingTime),
      icon: Clock,
      color: "text-amber-600",
    },
    {
      label: "Ending Time",
      value: formatTime(shift?.endingTime),
      icon: Clock,
      color: "text-orange-600",
    },
    {
      label: "Created Date",
      value: formatDate(shift?.createdDate),
      icon: Calendar,
      color: "text-cyan-600",
    },
    {
      label: "Created By",
      value: formatOptional(shift?.createBy),
      icon: UserCheck,
      color: "text-teal-600",
    },
    {
      label: "Last Modified Date",
      value: formatDate(shift?.lastModifiedDate),
      icon: Calendar,
      color: "text-sky-600",
    },
    {
      label: "Last Modified By",
      value: formatOptional(shift?.lastModifiedBy),
      icon: UserCheck,
      color: "text-cyan-700",
    },
    {
      label: "Deleted Date",
      value: formatDate(shift?.deletedDate),
      icon: Trash2,
      color: "text-red-600",
    },
    {
      label: "Deleted By",
      value: formatOptional(shift?.deletedBy),
      icon: Trash2,
      color: "text-red-700",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard/schedules")}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            <ChevronLeft size={16} />
            Back to Schedules
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Header Only */}
          <div>
            <ShiftHeaderCard shift={shift} />
          </div>

          {/* Right Column - All Details (Scrollable) */}
          <div className="max-h-screen overflow-y-auto pr-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <ShiftDetailCard shift={shiftDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
