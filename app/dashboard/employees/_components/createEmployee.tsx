import { useEffect, useState } from "react";
import type { Employee } from "../../../types/employee";
import { createEmployee, updateEmployee } from "@/hooks/employee_api";

export interface CreateEmployeeFormValues {
  id?: string;
  name: string;
  username: string;
  password: string;
  phone: string;
  role: string;
}

type CreateEmployeeModalProps = {
  open: boolean;
  isUpdate: boolean;
  initialEmployee?: Employee;
  onClose: () => void;
  onSubmit?: (values: CreateEmployeeFormValues) => void;
};

const defaultValues: CreateEmployeeFormValues = {
  name: "",
  username: "",
  password: "",
  phone: "",
  role: "STAFF",
};

export default function CreateEmployeePage({
  open,
  isUpdate,
  initialEmployee,
  onClose,
  onSubmit,
}: CreateEmployeeModalProps) {
  const [form, setForm] = useState<CreateEmployeeFormValues>(defaultValues);

  useEffect(() => {
    if (open && initialEmployee) {
      setForm({
        ...defaultValues,
        id: initialEmployee.id,
        name: initialEmployee.name ?? "",
        username: initialEmployee.username ?? "",
        phone: initialEmployee.phone ?? "",
        role: initialEmployee.role ?? "STAFF",
      });
    } else if (open && !isUpdate) {
      setForm(defaultValues);
    }
  }, [open, isUpdate, initialEmployee]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      ...(isUpdate && form.id ? { id: form.id } : {}),
      name: form.name,
      password: form.password,
      phone: form.phone,
      role: form.role,
          ...(!isUpdate ? { username: form.username } : {}),
    };

    if (!payload.name || (!isUpdate && (!payload.username || !payload.password))) {
      console.error("Please fill required employee fields");
      return;
    }

    try {
      if (isUpdate && form.id) {
        await updateEmployee(form.id, payload);
      } else {
        await createEmployee(payload);
      }

      onSubmit?.({ ...form });
      onClose();
    } catch (error) {
      console.error(
        isUpdate ? "Failed to update employee:" : "Failed to create employee:",
        error,
      );
    }
  };
    const updateField = (field: keyof CreateEmployeeFormValues, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Employee Management
            </p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {isUpdate ? "Update Employee" : "Add New Employee"}
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
              Employee Name <span className="text-red-600" aria-hidden="true">*</span>
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. First Floor"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Email / Username {!isUpdate && <span className="text-red-600" aria-hidden="true">*</span>}
              <input
                type="text"
                value={form.username}
                onChange={(e) => updateField("username", e.target.value)}
                disabled={isUpdate}
                required={!isUpdate}
                placeholder="e.g. johndoe"
                className={`mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${isUpdate ? "cursor-not-allowed bg-gray-100" : ""}`}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700">
              Role <span className="text-red-600" aria-hidden="true">*</span>
              <select
                value={form.role}
                onChange={(e) => updateField("role", e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="ADMIN">Admin</option>
                <option value="STAFF">Staff</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Password {!isUpdate && <span className="text-red-600" aria-hidden="true">*</span>}
              {isUpdate && <span className="text-gray-500">(optional)</span>}
              <input
                type="password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                required={!isUpdate}
                placeholder={isUpdate ? "Leave empty to keep current password" : "Enter the password"}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone <span className="text-red-600" aria-hidden="true">*</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="Enter the phone number"
                required
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
              {isUpdate ? "Update Employee" : "Save Employee"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
