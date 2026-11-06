import React from "react";
import ShiftDetailRow from "./scheduledetailrow";

interface DetailItem {
  label: string;
  value: string | null | undefined;
  icon: React.ComponentType<{ size: number }>;
  color: string;
}

interface ShiftDetailCardProps {
  shift: DetailItem[];
  title?: string;
}

export default function ShiftDetailCard({
  shift,
  title = "Schedule Information",
}: ShiftDetailCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-100/50 px-6 py-4">
        <h2 className="font-semibold text-slate-900">{title}</h2>
      </div>

      <div className="divide-y divide-slate-200">
        {shift.map((detail, index) => (
          <ShiftDetailRow
            key={index}
            label={detail.label}
            value={detail.value}
            icon={detail.icon}
            color={detail.color}
          />
        ))}
      </div>
    </div>
  );
}
