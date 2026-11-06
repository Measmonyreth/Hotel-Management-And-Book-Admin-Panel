"use client";

import { useState } from "react";
import { useEffect } from "react";
import type { Shift } from "../../../types/schedule";
import { createSchedule, updateSchedule } from "@/hooks/schedule_api";

export interface CreateScheduleFormValues {
  id?: string;
  dayWork: string;
  dayOff: string;
  startingTime: string;
  endingTime: string;
  shift: string;
}

type CreateScheduleModalProps = {
  open: boolean;
  isUpdate: boolean;
  initialSchedule?: Shift;
  onClose: () => void;
  onSubmit?: (values: CreateScheduleFormValues) => void;
};

const defaultValues: CreateScheduleFormValues = {
  dayWork: "MONDAY_TO_FRIDAY",
  dayOff: "SATURDAY_AND_SUNDAY",
  startingTime: "",
  endingTime: "",
  shift: "FULLTIME",
};



export default function CreateSchedulePage({
  open,
  isUpdate,
  initialSchedule,
  onClose,
  onSubmit,
}: CreateScheduleModalProps) {
  const [form, setForm] = useState<CreateScheduleFormValues>({
    ...defaultValues,
  });

  const convertTo24HourFormat = (time12: string): string => {
    const match = time12.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return time12;

    let hours = Number(match[1]);
    const minutes = match[2];
    const period = match[3].toUpperCase();
    if (period === "AM" && hours === 12) hours = 0;
    if (period === "PM" && hours !== 12) hours += 12;
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  };

  useEffect(() => {
    if (open && initialSchedule) {
      setForm({
        id: initialSchedule.id,
        dayWork: initialSchedule.dayWork ?? defaultValues.dayWork,
        dayOff: initialSchedule.dayOff ?? defaultValues.dayOff,
        startingTime: convertTo24HourFormat(initialSchedule.startingTime ?? ""),
        endingTime: convertTo24HourFormat(initialSchedule.endingTime ?? ""),
        shift: initialSchedule.shift ?? defaultValues.shift,
      });
    } else if (open && !isUpdate) {
      setForm(defaultValues);
    }
  }, [open, isUpdate, initialSchedule]);

  if (!open) return null;

  // Convert 24-hour format (HH:mm) to 12-hour format (h:mmAM/PM)
  const convertTo12HourFormat = (time24: string): string => {
    if (!time24) return "";
    
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    
    return `${hours12}:${String(minutes).padStart(2, "0")}${period}`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      ...(isUpdate && form.id ? { id: form.id } : {}),
      dayWork: form.dayWork,
      dayOff: form.dayOff,
      startingTime: convertTo12HourFormat(form.startingTime),
      endingTime: convertTo12HourFormat(form.endingTime),
      shift: form.shift,
    };

    console.log("Raw time values:", {
      startingTime: form.startingTime,
      endingTime: form.endingTime,
    });
    console.log("Converted payload:", payload);

    if (!payload.startingTime || !payload.endingTime) {
      console.error("Please fill required schedule fields");
      return;
    }

    try {
      if (isUpdate && form.id) {
        await updateSchedule(form.id, payload);
      } else {
        await createSchedule(payload);
      }

      onSubmit?.({ ...form });
      onClose();
    } catch (error) {
      console.error(
        isUpdate ? "Failed to update schedule:" : "Failed to create schedule:",
        error,
      );
    }
  };

  const updateField = (
    field: keyof CreateScheduleFormValues,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Schedule Management
            </p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {isUpdate ? "Update Schedule" : "Add New Schedule"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 px-2.5 py-1.5 text-sm text-gray-500 hover:bg-gray-100"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Day Work <span className="text-red-600" aria-hidden="true">*</span>
              <select
                required
                value={form.dayWork}
                onChange={(e) => updateField("dayWork", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="MONDAY_TO_FRIDAY">Monday to Friday</option>
                <option value="MONDAY_TO_SATURDAY">Monday to Saturday</option>
                <option value="SUNDAY_TO_FRIDAY">Sunday to Friday</option>
              </select>
            </label>

            <label className="text-sm font-medium text-gray-700">
              Day Off <span className="text-red-600" aria-hidden="true">*</span>
              <select
                required
                value={form.dayOff}
                onChange={(e) => updateField("dayOff", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="SATURDAY">Saturday</option>
                <option value="SUNDAY">Sunday</option>
                <option value="SATURDAY_AND_SUNDAY">Saturday and Sunday</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Starting Time <span className="text-red-600" aria-hidden="true">*</span>
              <input
                type="time"
                required
                value={form.startingTime}
                onChange={(e) => updateField("startingTime", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Ending Time <span className="text-red-600" aria-hidden="true">*</span>  
              <input
                required
                type="time"
                value={form.endingTime}
                onChange={(e) => updateField("endingTime", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Shift <span className="text-red-600" aria-hidden="true">*</span>
              <select
                required
                value={form.shift}
                onChange={(e) => updateField("shift", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="FULLTIME">Full Time</option>
                <option value="AFTERNOON">Afternoon</option>
                <option value="MORNING">Morning</option>
                <option value="NIGHT">Night </option>
              </select>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              {isUpdate ? "Update Schedule" : "Save Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}