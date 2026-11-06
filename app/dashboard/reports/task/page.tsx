"use client";

import React from "react";
import StatGrid from "@/app/lib/actions/statcard";
import { useApiAuthenticated } from "@/hooks/useApi";
import buildQueryString from "@/app/lib/actions/buildQueryUrl";
import { useState } from "react";
import { TaskResponse } from "../../../types/task";
import FilterSearch from "@/app/lib/actions/filter_search";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import { config } from "@/config";
import { useRouter } from "next/navigation";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { useTaskSearch } from "@/hooks/task_api";

const statusStyles: Record<string, string> = {
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  default: "bg-gray-100 text-gray-700",
};

export default function TaskReportPage() {
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
      all: "",
      PENDING: "PENDING",
      IN_PROGRESS: "IN_PROGRESS",
      COMPLETED: "COMPLETED",
      CANCELLED: "CANCELLED",
    },
      created_date: {
      All: "",
    }
  };

  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [refetchKey, setRefetchKey] = useState(0);
  const [page, setPage] = useState(1);
  const queryString = buildQueryString(submittedFilters);
  const url = queryString
    ? `${config.apiUrl}/api/tasks/search?${queryString}`
    : `${config.apiUrl}/api/tasks/search`;
  const { data, loading, error } =useTaskSearch(url);
  const router = useRouter();

  const taskData = data?.data;
  const tasks = taskData?.tasks ?? [];
  const totalPages = Math.max(
    1,
    Math.ceil((taskData?.totalTasks ?? tasks.length) / size),
  );
  const handleFilterChange = (key: string, value: string | number | boolean) => {
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
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSubmittedFilters((prev) => ({ ...prev, page: newPage }));
    setRefetchKey((prev) => prev + 1);
  };

  const columns: Column<(typeof tasks)[0]>[] = [
    {
      key: "id",
      label: "Task ID",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="font-medium text-gray-900">{String(value).substring(0, 8)}</span>
      ),
    },
    {
      key: "employee",
      label: "Employee",
      width: "whitespace-nowrap",
      render: (_, row) => (
        <span className="text-gray-700">{row.employee?.name ?? "N/A"}</span>
      ),
    },
    {
      key: "room",
      label: "Room",
      width: "whitespace-nowrap",
      render: (_, row) => (
        <span className="text-gray-700">
          {row.room?.roomName || row.room?.roomNumber || "N/A"}
        </span>
      ),
    },
    {
      key: "task_type",
      label: "Type",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "description",
      label: "Description",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value) || "N/A"}</span>,
    },
    {
      key: "createdDate",
      label: "Created",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700">
          {value ? new Date(String(value)).toLocaleDateString() : "N/A"}
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
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              statusStyles[statusKey] ?? statusStyles.default
            }`}
          >
            {String(value)}
          </span>
        );
      },
    },
  ];

  const actions: Action<(typeof tasks)[0]>[] = [
    {
      label: "View",
      color: "blue",
      onClick: (row) =>  router.push(`/dashboard/tasks/${row.id}`),
    },
  ];

  if (loading) return (
    <HandleResponse>
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
      >
        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        <span className="text-sm font-medium text-gray-600">Loading task report...</span>
      </div>
    </HandleResponse>
  );
  if (error) return (
    <HandleResponse>
      <div
        role="alert"
        className="flex w-full max-w-md items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm"
      >
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
        <div className="text-sm">
          <p className="font-semibold text-red-800">Error fetching task report</p>
          <p className="mt-1 break-words text-red-700">{String(error)}</p>
        </div>
      </div>
    </HandleResponse>
  );
  if (!data) return (
    <HandleResponse>
      <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <Inbox className="h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">No task report data available</p>
        <p className="text-xs text-gray-500">Task analytics will appear here once tasks are created.</p>
      </div>
    </HandleResponse>
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Task Report</h1>
        <p className="text-gray-500 mt-2">
          Monitor task completion rates and employee productivity
        </p>
      </div>

      {/* Task Metrics */}
      <StatGrid
        stats={[
          { label: "Total Tasks", value: taskData?.totalTasks || 0 },
          { label: "In Progress", value: taskData?.totalInProgress || 0 },
          { label: "Completed", value: taskData?.totalCompleted || 0 },
          { label: "Pending", value: taskData?.totalPending || 0 },
        ]}
      />

      {/* Task Status Breakdown */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="text-gray-500 text-sm font-medium">Pending Tasks</div>
          <div className="text-3xl font-bold text-yellow-600 mt-2">
            {taskData?.totalPending || 0}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{
                width: `${
                  taskData?.totalTasks
                    ? ((taskData.totalPending || 0) / taskData.totalTasks) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="text-gray-500 text-sm font-medium">In Progress</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            {taskData?.totalInProgress || 0}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${
                  taskData?.totalTasks
                    ? ((taskData.totalInProgress || 0) / taskData.totalTasks) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="text-gray-500 text-sm font-medium">Completed</div>
          <div className="text-3xl font-bold text-green-600 mt-2">
            {taskData?.totalCompleted || 0}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{
                width: `${
                  taskData?.totalTasks
                    ? ((taskData.totalCompleted || 0) / taskData.totalTasks) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="text-gray-500 text-sm font-medium">Cancelled</div>
          <div className="text-3xl font-bold text-red-600 mt-2">
            {taskData?.totalCancelled || 0}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{
                width: `${
                  taskData?.totalTasks
                    ? ((taskData.totalCancelled || 0) / taskData.totalTasks) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div> */}

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
          }
        }}
      />

      <WidgetTable
        title="Task Directory"
        subtitle="All tasks and their status"
        columns={columns}
        data={tasks}
        actions={actions}
        emptyMessage="No task data found."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-gray-50"
        onPageChange={handlePageChange}
        currentPage={page}
        toatalRecords={taskData?.totalTasks ?? tasks.length}
        totalPages={totalPages}
      />
    </div>
  );
}