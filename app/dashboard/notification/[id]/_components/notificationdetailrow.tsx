import React from "react";
import type { LucideIcon } from "lucide-react";

interface NotificationDetailRowProps {
  label: string;
  value: string | React.ReactNode;
  icon: LucideIcon;
  color: string;
}

export const NotificationDetailRow: React.FC<NotificationDetailRowProps> = ({
  label,
  value,
  icon: IconComponent,
  color,
}) => {
  return (
    <div className="flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg bg-slate-100 p-2 ${color}`}>
          <IconComponent size={18} />
        </div>
        <label className="text-sm font-medium text-slate-600">{label}</label>
      </div>
      <div className="max-w-xs text-right text-sm font-semibold text-slate-900">
        {value || "N/A"}
      </div>
    </div>
  );
};
