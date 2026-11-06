"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { createRoom, updateRoom, useRoomFloors } from "@/hooks/room_api";
import type { Room } from "../../../types/floor";

export type AddRoomFormValues = {
  roomName: string;
  roomNumber: string;
  roomType: string;
  price: string;
  description: string;
  statusRoom: string;
  floorId: number | string;
  file: File | null;
  rating: string;
  discountPercentage: string;
};

type AddRoomModalProps = {
  open: boolean;
  isUpdate: boolean;
  initialRoom?: Room;
  onClose: () => void;
  onSubmit?: (values: AddRoomFormValues) => void;
};

const defaultValues: AddRoomFormValues = {
  roomName: "",
  roomNumber: "",
  roomType: "DOUBLE",
  price: "",
  description: "",
  statusRoom: "AVAILABLE",
  floorId: "",
  file: null,
  rating: "0",
  discountPercentage: "",
};

export default function AddRoomModal({
  open,
  isUpdate,
  initialRoom,
  onClose,
  onSubmit,
}: AddRoomModalProps) {
  const [form, setForm] = useState<AddRoomFormValues>(defaultValues);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { data } = useRoomFloors();
  const floorOptions = data?.data?.floors ?? [];

  useEffect(() => {
    if (!open) {
      setForm(defaultValues);
    }
  }, [open]);

  useEffect(() => {
    if (isUpdate && initialRoom) {
      setForm({
        roomName: initialRoom.roomName,
        roomNumber: initialRoom.roomNumber,
        roomType: initialRoom.roomType,
        price: String(initialRoom.price),
        description: initialRoom.description,
        statusRoom: initialRoom.statusRoom,
        floorId: initialRoom.floor.id,
        file: null,
        rating: String(initialRoom.rating),
        discountPercentage: String(initialRoom.discountPercentage),
      });
    }
  }, [isUpdate, initialRoom]);

  if (!open) return null;

  const updateField = (
    field: keyof AddRoomFormValues,
    value: string | File | null,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value as never }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const floorIdValue = Number(form.floorId);
    const priceValue = Number(form.price || 0);
    //  const ratingValue = Number(form.rating || 0);
    const discountValue = Number(form.discountPercentage || 0);

    const payload = {
      roomName: form.roomName.trim(),
      roomNumber: form.roomNumber.trim(),
      roomType: form.roomType,
      price: priceValue,
      description: form.description.trim(),
      statusRoom: form.statusRoom,
      floorId: floorIdValue,
      rating: form.rating,
      discountPercentage: discountValue,
    };

    try {
      const formData = new FormData();
      formData.append("roomName", payload.roomName);
      formData.append("roomNumber", payload.roomNumber);
      formData.append("roomType", payload.roomType);
      formData.append("price", priceValue.toString());
      formData.append("description", payload.description);
      formData.append("statusRoom", payload.statusRoom);
      formData.append("floorId", payload.floorId.toString());
      formData.append("rating", payload.rating);
      if (form.file) {
        formData.append("file", form.file);
      }
      formData.append(
        "discountPercentage",
        payload.discountPercentage.toString(),
      );

      if (isUpdate && initialRoom) {
        await updateRoom(initialRoom.id, formData);
      } else {
        await createRoom(formData);
      }

      onSubmit?.({ ...form });
      onClose();
    } catch (error) {
      console.error(
        isUpdate ? "Error updating room:" : "Error adding room:",
        error,
      );
      setFormError(
        error instanceof Error ? error.message : "Unable to save room.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Room Management
            </p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {isUpdate ? "Update Room" : "Add New Room"}
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
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Room Name <span className="text-red-500">*</span>
              <input
                value={form.roomName}
                onChange={(e) => updateField("roomName", e.target.value)}
                placeholder="Ocean Deluxe"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Room Number <span className="text-red-500">*</span>
              <input
                value={form.roomNumber}
                onChange={(e) => updateField("roomNumber", e.target.value)}
                placeholder="101"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-medium text-gray-700">
              Room Type
              <select
                value={form.roomType}
                onChange={(e) => updateField("roomType", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="SINGLE">Standard</option>
                <option value="DOUBLE">Double</option>
                <option value="TWIN">Twin</option>
                <option value="FAMILY">Family</option>
                <option value="SUITE">Suite</option>
              </select>
            </label>

            <label className="text-sm font-medium text-gray-700">
              Floor <span className="text-red-500">*</span>
              <select
                value={form.floorId}
                onChange={(e) => updateField("floorId", e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {!isUpdate && <option value="">Select floor</option>}
                {floorOptions.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.floorNumber}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-gray-700">
              Price <span className="text-red-500">*</span>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="120"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block text-sm font-medium text-gray-700">
              Status
              <select
                value={form.statusRoom}
                onChange={(e) => updateField("statusRoom", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="AVAILABLE">Available</option>
                <option value="BOOKED">Booked</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="CLEANING">Cleaning</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="PENDING">Pending</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </label>

            <label className="text-sm font-medium text-gray-700">
              Rating
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => updateField("rating", e.target.value)}
                placeholder="4.5"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Discount %
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.discountPercentage}
                onChange={(e) =>
                  updateField("discountPercentage", e.target.value)
                }
                placeholder="20.0"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block text-sm font-medium text-gray-700">
              Description
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={4}
                placeholder="Describe the room and its features..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            {isUpdate && initialRoom?.images?.[0] ? (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Current Image:
                </p>
                <div className="h-20 w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                  <img
                    src={
                      initialRoom.images[0].imageUrl ||
                      initialRoom.images[0].filePath ||
                      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
                    }
                    alt="Current room image"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Upload a new image to replace the current one
                </p>
              </div>
            ) : null}

            <label className="block text-sm font-medium text-gray-700">
              Image
              <input
                type="file"
                accept="image/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateField(
                    "file",
                    e.target.files && e.target.files[0]
                      ? e.target.files[0]
                      : null,
                  )
                }
                className="mt-1 mb-1 h-20 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              Save Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
