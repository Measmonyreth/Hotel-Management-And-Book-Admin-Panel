import React from "react";
import { formatDate, formatOptional } from "@/components/detailpage/formatters";
import { NoteFieldGrid } from "@/components/detailpage/notefield";
import { CheckCircle } from "lucide-react";

export interface Task {
  id: number;
  task_type: string;
  task_status: string;
  description?: string;
  employee?: {
    id: number;
    name: string;
    employeeId: string;
  };
  room?: {
    id: number;
    roomNumber: string;
    roomName: string;
  };
  createdDate: string;
  createBy?: string;
  lastModifiedDate: string;
  lastModifiedBy?: string;
  deletedDate?: string;
  deletedBy?: string;
}

interface TaskHeaderCardProps {
  task: Task;
}

function getStatusColor(status: string | undefined) {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "text-emerald-600";
    case "IN_PROGRESS":
      return "text-blue-600";
    case "PENDING":
      return "text-amber-600";
    case "CANCELLED":
      return "text-red-600";
    default:
      return "text-slate-600";
  }
}

/**
 * TaskHeaderCard: Displays task type, status, and key information
 */
export const TaskHeaderCard: React.FC<TaskHeaderCardProps> = ({ task }) => {
  return (
    <div className="space-y-4">
      {/* Main Header Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Task Type</p>
            <p className="text-2xl font-bold text-gray-900">
              {task.task_type || "Task Details"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              ID: {task.id}
            </p>
          </div>
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              task.task_status === "COMPLETED"
                ? "bg-emerald-100 text-emerald-800"
                : task.task_status === "IN_PROGRESS"
                ? "bg-blue-100 text-blue-800"
                : task.task_status === "PENDING"
                ? "bg-amber-100 text-amber-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div className="h-2 w-2 rounded-full bg-current"></div>
            {task.task_status}
          </div>
        </div>

        <NoteFieldGrid
          columns={2}
          fields={[
            {
              label: "Created Date",
              value: formatDate(task.createdDate),
            },
            {
              label: "Last Modified",
              value: formatDate(task.lastModifiedDate),
            },
          ]}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3">
        {/* Assigned Employee Card */}
        <div className="overflow-hidden rounded-lg border border-indigo-200 bg-linear-to-br from-indigo-50 to-indigo-100/50 shadow-sm">
          <div className="border-b border-indigo-200 bg-linear-to-r from-indigo-500 to-indigo-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-white" />
              <h3 className="font-semibold text-white text-sm">Assigned Employee</h3>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="font-bold text-indigo-900 text-sm">
              {task.employee?.name || "—"}
            </p>
            <p className="mt-1 text-xs text-indigo-700">
              {task.employee?.employeeId || ""}
            </p>
          </div>
        </div>

        {/* Room Card */}
        <div className="overflow-hidden rounded-lg border border-orange-200 bg-linear-to-br from-orange-50 to-orange-100/50 shadow-sm">
          <div className="border-b border-orange-200 bg-linear-to-r from-orange-500 to-orange-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-white" />
              <h3 className="font-semibold text-white text-sm">Room</h3>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="font-bold text-orange-900 text-sm">
              {task.room?.roomNumber || "—"}
            </p>
            <p className="mt-1 text-xs text-orange-700">
              {task.room?.roomName || ""}
            </p>
          </div>
        </div>

        {/* Description Card */}
        {task.description && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {task.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
