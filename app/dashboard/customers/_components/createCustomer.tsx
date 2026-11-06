"use client";

import { useEffect, useState } from "react";
import { Customer } from "../../../types/customer";
import { createCustomer, updateCustomer } from "@/hooks/customer_api";

export interface CreateCustomerFormValues {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  nationality: string;
  city_or_province: string;
  status: string;
  country: string;
}

type CreateCustomerModalProps = {
  open: boolean;
  isUpdate: boolean;
  initialCustomer?: Customer;
  onClose: () => void;
  onSubmit?: (values: CreateCustomerFormValues) => void;
};

const defaultValues: CreateCustomerFormValues = {
  firstName: "",
  lastName: "",
  id: undefined,
  email: "",
  password: "",
  phone: "",
  nationality: "",
  city_or_province: "",
  status: "",
  country: "",
};

export default function CreateCustomerPage({
  open,
  isUpdate,
  initialCustomer,
  onClose,
  onSubmit,
}: CreateCustomerModalProps) {
  // Helper to convert null values to empty strings
  const sanitizeFormData = (data: Partial<CreateCustomerFormValues>) => {
    const sanitized: Partial<CreateCustomerFormValues> = {};
    for (const key in data) {
      sanitized[key as keyof CreateCustomerFormValues] = (data[
        key as keyof CreateCustomerFormValues
      ] ?? "") as never;
    }
    return sanitized;
  };

  const [form, setForm] = useState<CreateCustomerFormValues>({
    ...defaultValues,
    ...sanitizeFormData(initialCustomer ?? {}),
  });

  useEffect(() => {
    if (isUpdate && initialCustomer) {
      setForm({
        ...defaultValues,
        ...sanitizeFormData(initialCustomer ?? {}),
      });
    }
  }, [isUpdate, initialCustomer]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      id: form.id,
      firstName: form.firstName,
      lastName: form.lastName,
      password: form.password,
      phone: form.phone,
      nationality: form.nationality,
      city_or_province: form.city_or_province,
      status: form.status,
      country: form.country,
      ...(!isUpdate ? { email: form.email.trim() } : {}),
    };

    if (!payload.firstName || !payload.lastName) {
      console.error("Please fill required customer fields");
      return;
    }

    // Email is required only when creating
    // if (!isUpdate && !payload.email) {
    //   console.error("Please enter an email");
    //   return;
    // }

    // // Password is required only when creating
    // if (!isUpdate && !payload.password) {
    //   console.error("Please enter a password");
    //   return;
    // }

    try {
      if (isUpdate && initialCustomer) {
        await updateCustomer(payload);
      } else {
        await createCustomer(payload);
      }

      onSubmit?.({ ...form });
      onClose();
    } catch (error) {
      console.error(
        isUpdate ? "Failed to update customer:" : "Failed to create customer:",
        error,
      );
    }
  };

  const updateField = (
    field: keyof CreateCustomerFormValues,
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
              Customer Management
            </p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {isUpdate ? "Update Customer" : "Add New Customer"}
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
              First Name <span className="text-red-600" aria-hidden="true">*</span>
              <input
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="e.g. John"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Last Name <span className="text-red-600" aria-hidden="true">*</span>
              <input
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="e.g. Doe"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Email
              {isUpdate == true ? (
                <span className="text-gray-500">(cannot be changed)</span>
              ) : (
                <span className="text-gray-500">(optional)</span>
              )}
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder= {isUpdate ? "Email cannot be changed" : "Enter the email"}
                disabled={isUpdate}
                className={`mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                  isUpdate ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              
            </label>

            <label className="text-sm font-medium text-gray-700">
              Password <span className="text-gray-500">(optional)</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder={
                  isUpdate
                    ? "Leave empty to keep current password"
                    : "Enter the password"
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Phone <span className="text-red-600" aria-hidden="true">*</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="e.g. +1234567890"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Nationality <span className="text-red-600" aria-hidden="true">*</span>
              <input
                value={form.nationality}
                onChange={(e) => updateField("nationality", e.target.value)}
                placeholder="e.g. USA"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              City / Province <span className="text-red-600" aria-hidden="true">*</span>
              <input
                value={form.city_or_province}
                onChange={(e) =>
                  updateField("city_or_province", e.target.value)
                }
                placeholder="e.g. New York"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Country <span className="text-red-600" aria-hidden="true">*</span>
              <input
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                placeholder="e.g. USA"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Status <span className="text-red-600" aria-hidden="true">*</span>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="DELETED">Deleted</option>
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
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
