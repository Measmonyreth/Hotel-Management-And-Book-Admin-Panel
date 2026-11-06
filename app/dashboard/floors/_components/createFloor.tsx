"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Floor } from "../../../types/floor";
import { createFloor, updateFloor } from "@/hooks/floor_api";

export type CreateFloorFormValues = {
  floorName: string;
  floorNumber: string;
  description: string;
  statusFloor: string;
};

type CreateFloorModalProps = {
  open: boolean;
  isUpdate: boolean;
  onClose: () => void;
  onSubmit?: (values: CreateFloorFormValues) => void;
  initialFloor?: Floor; // Optional data for updating
};

const defaultValues: CreateFloorFormValues = {
  floorName: "",
  floorNumber: "",
  description: "",
  statusFloor: "OPEN",
};

export default function CreateFloorPage({
  open,
  isUpdate,
  initialFloor,
  onClose,
  onSubmit,
}: CreateFloorModalProps) {
  const [form, setForm] = useState<CreateFloorFormValues>(defaultValues);

  useEffect(() => {
    if (!open) {
      setForm(defaultValues);
    }
  }, [open]);

  useEffect(() => {
    if (isUpdate && initialFloor) {
      setForm({
        floorName: initialFloor.floorName,
        floorNumber: initialFloor.floorNumber,
        description: initialFloor.description,
        statusFloor: initialFloor.statusFloor,
      });
    }
  }, [isUpdate, initialFloor]);

  if (!open) return null;

  const updateField = (field: keyof CreateFloorFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      floorName: form.floorName.trim(),
      floorNumber: form.floorNumber.trim(),
      description: form.description.trim(),
      statusFloor: form.statusFloor,
    };

    if (!payload.floorName || !payload.floorNumber) {
      console.error("Please fill required floor fields");
      return;
    }

    try {
      if (isUpdate && initialFloor?.id) {
        await updateFloor(initialFloor.id, payload);
      } else {
        await createFloor(payload);
      }
      onSubmit?.({ ...form });
      onClose();
    } catch (error) {
      console.error(
        isUpdate ? "Error updating floor:" : "Error creating floor:",
        error,
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Floor Management
            </p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {isUpdate ? "Update Floor" : "Add New Floor"}
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

        {isUpdate == false ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">
                Floor Name <span className="text-red-600" aria-hidden="true">*</span>
                <input
                  required
                  value={form.floorName}
                  onChange={(e) => updateField("floorName", e.target.value)}
                  placeholder="e.g. First Floor"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                Floor Number <span className="text-red-600" aria-hidden="true">*</span>
                <input
                  required
                  value={form.floorNumber}
                  onChange={(e) => updateField("floorNumber", e.target.value)}
                  placeholder="e.g. 1"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-600" aria-hidden="true">*</span>
                <select
                  required
                  value={form.statusFloor}
                  onChange={(e) => updateField("statusFloor", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="OPEN">Open</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="CLOSE">Close</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Description
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  placeholder="Describe the floor and its features..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
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
                Save Floor
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">
                Floor Name
                <input
                  value={form.floorName}
                  onChange={(e) => updateField("floorName", e.target.value)}
                  placeholder="e.g. First Floor"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                Floor Number
                <input
                  value={form.floorNumber}
                  onChange={(e) => updateField("floorNumber", e.target.value)}
                  placeholder="e.g. 1"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
                <select
                  value={form.statusFloor}
                  onChange={(e) => updateField("statusFloor", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="OPEN">Open</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="CLOSE">Close</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Description
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  placeholder="Describe the floor and its features..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
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
                Save Floor
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
