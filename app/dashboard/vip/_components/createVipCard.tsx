"use client";

import { useEffect, useState } from "react";
import {
  createVipCustomer,
  updateVipCustomer,
  useVipCustomerOptions,
  type VipCustomerPayload,
} from "@/hooks/vip_customer_api";
import type { VipCustomerResponse } from "../../../types/vip_customer";

export interface CreateVipFormValues {
  id?: string;
  customerId: string;
  type_vip: string;
  points: string;
  totalSpent: string;
  validFrom: string;
  validUntil: string;
  status: string;
  percentage_discount: string;
}

type CreateVipModalProps = {
  open: boolean;
  isUpdate: boolean;
  initialVip?: VipCustomerResponse;
  onClose: () => void;
  onSubmit?: (values: CreateVipFormValues) => void;
};

const defaultValues: CreateVipFormValues = {
  customerId: "",
  type_vip: "SILVER",
  points: "",
  totalSpent: "",
  validFrom: "",
  validUntil: "",
  status: "ACTIVE",
  percentage_discount: "",
};

export default function CreateVipPage({
  open,
  isUpdate,
  initialVip,
  onClose,
  onSubmit,
}: CreateVipModalProps) {
  const [form, setForm] = useState<CreateVipFormValues>({
    ...defaultValues,
  });

  useEffect(() => {
    if (open && initialVip) {
      setForm({
        id: initialVip.id,
        customerId: initialVip.customer?.id ?? "",
        type_vip: initialVip.type_vip ?? defaultValues.type_vip,
        points: String(initialVip.points ?? ""),
        totalSpent: String(initialVip.totalSpent ?? ""),
        validFrom: initialVip.validFrom?.slice(0, 10) ?? "",
        validUntil: initialVip.validUntil?.slice(0, 10) ?? "",
        status: initialVip.status ?? defaultValues.status,
        percentage_discount: String(initialVip.percentage_discount ?? ""),
      });
    } else if (open && !isUpdate) {
      setForm(defaultValues);
    }
  }, [open, isUpdate, initialVip]);

  const { data: customersData } = useVipCustomerOptions();
  const customerList = customersData?.data?.customers ?? [];

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: VipCustomerPayload = {
      ...(isUpdate && form.id ? { id: form.id } : {}),
      customerId: form.customerId,
      type_vip: form.type_vip,
      points: Number(form.points || 0),
      totalSpent: Number(form.totalSpent || 0),
      validFrom: form.validFrom,
      validUntil: form.validUntil,
      status: form.status,
      percentage_discount: Number(form.percentage_discount || 0),
    };

    if (!payload.customerId) {
      console.error("Please select a customer");
      return;
    }

    if (isUpdate && !form.id) {
      console.error("Cannot update VIP customer without an ID");
      return;
    }

    try {
      if (isUpdate) {
        if (!form.id) {
          console.error("Cannot update VIP customer without an ID");
          return;
        }
        await updateVipCustomer(form.id, payload);
      } else {
        await createVipCustomer(payload);
      }

      onSubmit?.({ ...form });
      onClose();
    } catch (error) {
      console.error(
        isUpdate ? "Error updating VIP:" : "Error creating VIP:",
        error,
      );
    }
  };

  const updateField = (
    field: keyof CreateVipFormValues,
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
              VIP Management
            </p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {isUpdate ? "Update VIP Card" : "Add New VIP Card"}
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
              Customer <span className="text-red-600" aria-hidden="true">*</span> required
              <select
                required
                value={form.customerId}
                onChange={(e) => updateField("customerId", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="" disabled>Select customer</option>
                {customerList.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-gray-700">
              VIP Type <span className="text-red-600" aria-hidden="true">*</span> required
              <select
                required
                value={form.type_vip}
                onChange={(e) => updateField("type_vip", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="SILVER">Silver</option>
                <option value="GOLD">Gold</option>
                <option value="PLATINUM">Platinum</option>
                <option value="DIAMOND">Diamond</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Points <span className="text-red-600" aria-hidden="true">*</span> required
              <input
                type="number"
                required
                min="0"
                value={form.points}
                onChange={(e) => updateField("points", e.target.value)}
                placeholder="e.g. 1000"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Total Spent <span className="text-red-600" aria-hidden="true">*</span> required
              <input
                type="number"
                required
                min="0"
                value={form.totalSpent}
                onChange={(e) => updateField("totalSpent", e.target.value)}
                placeholder="e.g. 5000"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Valid From <span className="text-red-600" aria-hidden="true">*</span> required
              <input
                type="date"
                required
                value={form.validFrom}
                onChange={(e) => updateField("validFrom", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Valid Until <span className="text-red-600" aria-hidden="true">*</span> required
              <input
                type="date"
                required
                value={form.validUntil}
                onChange={(e) => updateField("validUntil", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Status <span className="text-red-600" aria-hidden="true">*</span> required
              <select
                required
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="EXPIRED">Expired</option>
                <option value="DELETED">Deleted</option>
              </select>
            </label>

            <label className="text-sm font-medium text-gray-700">
              Discount % <span className="text-red-600" aria-hidden="true">*</span> required
              <input
                type="number"
                required
                min="0"
                max="100"
                step="0.1"
                value={form.percentage_discount}
                onChange={(e) =>
                  updateField("percentage_discount", e.target.value)
                }
                placeholder="e.g. 10"
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
              {isUpdate ? "Update VIP" : "Save VIP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
