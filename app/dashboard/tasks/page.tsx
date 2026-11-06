"use client";

import type { Task } from "../../types/task";
import { useState } from "react";
import buildQueryString from "@/app/lib/actions/buildQueryUrl";
import FilterSearch from "@/app/lib/actions/filter_search";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import CreateTaskPage from "./_components/createTask";
import { useRouter } from "next/navigation";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { useTaskSearch } from "@/hooks/task_api";
import { DeleteTaskDialog } from "./_components/deleteTaskDailog";
import CreateButton from "@/components/ui/CreateButton";

const statusStyles: Record<string, string> = {
  IN_PROGRESS: "bg-blue-100 text-blue-700 ring-blue-200",
  PENDING: "bg-yellow-100 text-yellow-700 ring-yellow-200",
  COMPLETED: "bg-green-100 text-green-700 ring-green-200",
  CANCELLED: "bg-red-100 text-red-700 ring-red-200",
  default: "bg-gray-100 text-gray-700 ring-gray-200",
};

export default function TasksPage() {
  const size = 10;
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    size,
    isPage: true,
  });

  const MapFilter: Record<string, Record<string, string>> = {
    task_status: {
      All: "",
      PENDING: "PENDING",
      IN_PROGRESS: "IN_PROGRESS",
      COMPLETED: "COMPLETED",
      CANCELLED: "CANCELLED",
    },
    created_date: {
      All: "",
    },
  };
  const route = useRouter();
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [refetchKey, setRefetchKey] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [page, setPage] = useState(1);

  const queryString = buildQueryString(submittedFilters);
  const url = queryString ? `/tasks/search?${queryString}` : "/tasks/search";
  // Properly construct URL with refetch parameter
  const urlWithRefetch = `${url}${queryString ? "&" : "?"}__refetch=${refetchKey}`;
  const { data, loading, error } = useTaskSearch(urlWithRefetch);
  const handleFilterChange = (
    key: string,
    value: string | number | boolean,
  ) => {
    const nextFilters = {
      ...filters,
      [key]: value,
      page: key === "search" && value !== "" ? filters.page : 1,
    };
    setFilters(nextFilters);

    if (key !== "search" || value === "") {
      setSubmittedFilters(nextFilters);
      setRefetchKey((prev) => prev + 1);
    }
  };
  const tasks = data?.data;
  const taskList = tasks?.tasks ?? [];
  const totalPages = Math.max(
    1,
    Math.ceil((tasks?.totalTasks ?? taskList.length) / size),
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSubmittedFilters((prev) => ({ ...prev, page: newPage }));
    setRefetchKey((prev) => prev + 1);
  };

  const columns: Column<(typeof taskList)[0]>[] = [
    {
      key: "id",
      label: "Task ID",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="font-semibold text-gray-900">{String(value)}</span>
      ),
    },
    {
      key: "employee",
      label: "Employee",
      width: "whitespace-nowrap",
      render: (_, row) => (
        <span className="text-gray-700">{row.employee?.name ?? "—"}</span>
      ),
    },
    {
      key: "room",
      label: "Room",
      width: "whitespace-nowrap",
      render: (_, row) => (
        <span className="text-gray-700">
          {row.room?.roomName ?? row.room?.roomNumber ?? "—"}
        </span>
      ),
    },
    {
      key: "task_type",
      label: "Type",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700">{String(value) ?? "—"}</span>
      ),
    },
    {
      key: "description",
      label: "Description",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700">{String(value) ?? "—"}</span>
      ),
    },
    {
      key: "createdDate",
      label: "Created",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700">
          {value ? new Date(String(value)).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "task_status",
      label: "Status",
      width: "whitespace-nowrap",
      render: (value) => {
        const statusKey = String(value)?.toUpperCase() ?? "default";
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
              statusStyles[statusKey] ?? statusStyles.default
            }`}
          >
            {String(value) ?? "Unknown"}
          </span>
        );
      },
    },
  ];

  const actions: Action<(typeof taskList)[0]>[] = [
    {
      label: "View",
      color: "blue",
      onClick: (row) => route.push(`/dashboard/tasks/${row.id}`),
    },
    {
      label: "Edit",
      color: "gray",
      onClick: (row) => {
        setSelectedTask(row);
        setCreateTaskModalOpen(true);
      },
    },
    {
      label: "Delete",
      color: "red",
      onClick: (row) => {
        setSelectedTask(row);
        setOpenDeleteDialog(true);
      },
    },
  ];

  if (loading)
    return (
      <HandleResponse>
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
        >
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-sm font-medium text-gray-600">
            Loading tasks...
          </span>
        </div>
      </HandleResponse>
    );
  if (error)
    return (
      <HandleResponse>
        <div
          role="alert"
          className="flex w-full max-w-md items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="text-sm">
            <p className="font-semibold text-red-800">Error fetching tasks</p>
            <p className="mt-1 break-words text-red-700">{String(error)}</p>
          </div>
        </div>
      </HandleResponse>
    );
  if (!data)
    return (
      <HandleResponse>
        <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <Inbox className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            No task data available.
          </p>
          <p className="text-xs text-gray-500">
            Task records will appear here once they are created.
          </p>
        </div>
      </HandleResponse>
    );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        {/* <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Overview
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
        </div> */}
        <CreateButton
          label="Create Task"
          onClick={() => {
            setSelectedTask(undefined);
            setCreateTaskModalOpen(true);
          }}
        />

      </div>

      <CreateTaskPage
        open={createTaskModalOpen}
        isUpdate={Boolean(selectedTask)}
        initialTask={selectedTask}
        onClose={() => {
          setCreateTaskModalOpen(false);
          setSelectedTask(undefined);
        }}
        onSubmit={() => {
          setCreateTaskModalOpen(false);
          setSelectedTask(undefined);
          setRefetchKey((prev) => prev + 1);
        }}
      />

      <DeleteTaskDialog
        open={openDeleteDialog}
        taskId={selectedTask?.id ?? 0}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedTask(undefined);
          setRefetchKey((prev) => prev + 1);
        }}
      />

      <FilterSearch
        mapFilter={MapFilter}
        filterValues={filters}
        onFilterChange={handleFilterChange}
        searchValue={filters.search}
        onSearchChange={(e) => handleFilterChange("search", e.target.value)}
        onSearchKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setSubmittedFilters(filters);
            setRefetchKey((prev) => prev + 1);
          }
        }}
      />

      <WidgetTable
        title="Task List"
        subtitle="All tasks and their status"
        columns={columns}
        data={taskList}
        actions={actions}
        emptyMessage="No tasks found."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-gray-50"
        onPageChange={handlePageChange}
        currentPage={page}
        toatalRecords={tasks?.totalTasks ?? taskList.length}
        totalPages={totalPages}
      />
    </div>
  );
}
