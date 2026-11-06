"use client";

import { useParams, useRouter } from "next/navigation";
import { useTaskById } from "@/hooks/task_api";
import {
  ChevronLeft,
  AlertCircle,
  Lock,
  Calendar,
  UserCheck,
  Trash2,
  Briefcase,
  CheckCircle,
  FileText,
  User,
  DoorOpen,
} from "lucide-react";
import { TaskHeaderCard } from "./_components/taskheadercard";
import TaskDetailCard, { TaskDetailCardProps } from "./_components/taskdetailcard";

function formatDate(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatOptional(value: unknown) {
  return value ? String(value) : "—";
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

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id as string;

  const { data, loading, error } = useTaskById(taskId);

  const task = data?.data;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-sm font-medium text-slate-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-6 w-6 shrink-0 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Error Loading Task</h3>
              <p className="mt-1 text-sm text-red-700">{String(error)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-900">Task not found</p>
          <p className="mt-1 text-sm text-slate-600">No task data available</p>
        </div>
      </div>
    );
  }

  const taskDetails = [
    {
      label: "Task ID",
      value: task?.id,
      icon: Lock,
      color: "text-purple-600",
    },
    {
      label: "Task Type",
      value: task?.task_type,
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      label: "Task Status",
      value: task?.task_status,
      icon: CheckCircle,
      color: getStatusColor(task?.task_status),
    },
    {
      label: "Assigned Employee",
      value: task?.employee ? `${task.employee.name} (${task.employee.employeeId})` : "—",
      icon: User,
      color: "text-indigo-600",
    },
    {
      label: "Room Number",
      value: task?.room ? `${task.room.roomNumber} - ${task.room.roomName}` : "—",
      icon: DoorOpen,
      color: "text-orange-600",
    },
    {
      label: "Description",
      value: task?.description,
      icon: FileText,
      color: "text-cyan-600",
    },

    {
      label: "Created Date",
      value: formatDate(task?.createdDate),
      icon: Calendar,
      color: "text-cyan-600",
    },
    {
      label: "Created By",
      value: formatOptional(task?.createBy),
      icon: UserCheck,
      color: "text-teal-600",
    },
    {
      label: "Last Modified Date",
      value: formatDate(task?.lastModifiedDate),
      icon: Calendar,
      color: "text-sky-600",
    },
    {
      label: "Last Modified By",
      value: formatOptional(task?.lastModifiedBy),
      icon: UserCheck,
      color: "text-cyan-700",
    },
    {
      label: "Deleted Date",
      value: formatDate(task?.deletedDate),
      icon: Trash2,
      color: "text-red-600",
    },
    {
      label: "Deleted By",
      value: formatOptional(task?.deletedBy),
      icon: Trash2,
      color: "text-red-700",
    },

    {
      label: "Created Date",
      value: formatDate(task?.createdDate),
      icon: Calendar,
      color: "text-cyan-600",
    },
    {
      label: "Created By",
      value: formatOptional(task?.createBy),
      icon: UserCheck,
      color: "text-teal-600",
    },
    {
      label: "Last Modified Date",
      value: formatDate(task?.lastModifiedDate),
      icon: Calendar,
      color: "text-sky-600",
    },
    {
      label: "Last Modified By",
      value: formatOptional(task?.lastModifiedBy),
      icon: UserCheck,
      color: "text-cyan-700",
    },
    {
      label: "Deleted Date",
      value: formatDate(task?.deletedDate),
      icon: Trash2,
      color: "text-red-600",
    },
    {
      label: "Deleted By",
      value: formatOptional(task?.deletedBy),
      icon: Trash2,
      color: "text-red-700",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard/tasks")}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            <ChevronLeft size={16} />
            Back to Tasks
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Header Only */}
          <div>
            <TaskHeaderCard task={task} />
          </div>

          {/* Right Column - All Details (Scrollable) */}
          <div className="max-h-screen overflow-y-auto pr-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <TaskDetailCard task={taskDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
