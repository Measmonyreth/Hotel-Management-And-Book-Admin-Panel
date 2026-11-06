"use client";

import { useState, useEffect } from "react";
import type { Task } from "../../../types/task";
import { createTask, updateTask } from "@/hooks/task_api";
import { config } from "@/config";

interface RoomsResponse {
  success: boolean;
  message: string;
  data: { rooms: TaskRoom[] };
}

interface TaskRoom {
  id: string | number;
  roomNumber: string;
  roomName: string;
}

interface EmployeesResponse {
  success: boolean;
  message: string;
  data: { employees: TaskEmployee[] };
}

interface TaskEmployee {
  id: string | number;
  employeeId: string;
  name: string;
}

// Form values
export interface CreateTaskFormValues {
  id?: number;
  description: string;
  taskType: string;
  taskStatus: string;
  roomId: string;
  employeeId: string;
}

type CreateTaskModalProps = {
  open: boolean;
  isUpdate: boolean;
  initialTask?: Task;
  onClose: () => void;
  onSubmit?: (values: CreateTaskFormValues) => void;
};

const defaultValues: CreateTaskFormValues = {
  description: "",
  taskType: "CLEANING",
  taskStatus: "PENDING",
  roomId: "",
  employeeId: "",
};

const taskTypeOptions = [
  { value: "CLEANING", label: "Cleaning" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "CHECKIN", label: "Check-in" },
  { value: "CHECKOUT", label: "Check-out" },
  { value: "RECEPTION", label: "Reception" },
  { value: "SETUP", label: "Setup" },
  { value: "HOUSEKEEPING", label: "Housekeeping" },
];

const taskStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function CreateTaskPage({
  open,
  isUpdate,
  initialTask,
  onClose,
  onSubmit,
}: CreateTaskModalProps) {
  const [form, setForm] = useState<CreateTaskFormValues>(defaultValues);

  const [rooms, setRooms] = useState<TaskRoom[]>([]);
  const [employees, setEmployees] = useState<TaskEmployee[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/api/room/all`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token") ?? ""}`,
          },
        });
        const json = (await res.json()) as RoomsResponse;
        const roomsData =  json.data.rooms ?? [];
        console.log("Fetched rooms:", roomsData);
        setRooms(roomsData);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/api/auth/list`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token") ?? ""}`,
          },
        });
        const json = (await res.json()) as EmployeesResponse;
        const employeesData = json?.data?.employees ?? [];
        setEmployees(employeesData);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    fetchRooms();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (open && initialTask) {
      setForm({
        ...defaultValues,
        id: initialTask.id,
        description: initialTask.description ?? "",
        taskType: initialTask.task_type ?? "CLEANING",
        taskStatus: initialTask.task_status ?? "PENDING",
        roomId: initialTask.room?.id ? String(initialTask.room.id) : "",
        employeeId: initialTask.employee?.id
          ? String(initialTask.employee.id)
          : "",
      });
    } else if (open && !isUpdate) {
      setForm(defaultValues);
    }
  }, [open, isUpdate, initialTask]);

  if (!open) return null;

  const updateField = (field: keyof CreateTaskFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      ...(isUpdate && form.id ? { id: form.id } : {}),
      description: form.description,
      taskType: form.taskType,
      taskStatus: form.taskStatus,
      roomId: form.roomId,
      employeeId: form.employeeId,
    };

    if (!payload.taskType || !payload.taskStatus) {
      console.error("Please fill required task fields");
      return;
    }

    try {
      if (isUpdate && form.id !== undefined) {
        await updateTask(form.id, payload);
      } else {
        await createTask(payload);
      }

      onSubmit?.({ ...form });
      onClose();
    } catch (error) {
      console.error(
        isUpdate ? "Failed to update task:" : "Failed to create task:",
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
              Task Management
            </p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {isUpdate ? "Update Task" : "Add New Task"}
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
              Description
              <input
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Enter task description"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Task Type <span className="text-red-600" aria-hidden="true">*</span> required
              <select
                value={form.taskType}
                onChange={(e) => updateField("taskType", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              >
                {taskTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-gray-700">
              Task Status <span className="text-red-600" aria-hidden="true">*</span> required
              <select
                value={form.taskStatus}
                onChange={(e) => updateField("taskStatus", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              >
                {taskStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Room <span className="text-red-600" aria-hidden="true">*</span> required
              <select
                value={form.roomId}
                onChange={(e) => updateField("roomId", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              >
                <option value="">Select room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={String(room.id)}>
                    {room.roomName} ({room.roomNumber})
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-gray-700">
              Employee <span className="text-red-600" aria-hidden="true">*</span> required
              <select
                value={form.employeeId}
                onChange={(e) => updateField("employeeId", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              >
                <option value="">Select employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={String(employee.id)}>
                    {employee.name} (ID: {employee.employeeId})
                  </option>
                ))}
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
              {isUpdate ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
