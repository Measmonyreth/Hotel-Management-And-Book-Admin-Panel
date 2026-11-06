"use client";

import React, { useState } from "react";
import StatGrid from "@/app/lib/actions/statcard";
import { useApiAuthenticated } from "@/hooks/useApi";
import { NotificationResponse } from "../../../types/notification";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import { useRouter } from "next/navigation";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/notification_api";

const statusStyles: Record<string, string> = {
  READ: "bg-green-100 text-green-700",
  UNREAD: "bg-yellow-100 text-yellow-700",
  PAID: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-orange-100 text-orange-700",
  default: "bg-gray-100 text-gray-700",
};

export default function NotificationReportPage() {
  const size = 10;
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ page: 1, size: size, isPage: true });
  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [refetchKey, setRefetchKey] = useState(0);

  const { data, loading, error } = useNotifications(refetchKey, submittedFilters);

  const notifications = data?.data.notificationResponses ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.data?.totalNotification?? 0) / (submittedFilters.size ?? 10)));
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSubmittedFilters((prev) => ({ ...prev, page: newPage }));
    setRefetchKey((prev) => prev + 1);
  };
  const totalUnread = notifications.filter((item) => !item.readAt).length;
  const totalRead = notifications.filter((item) => item.readAt).length;
  const router = useRouter();

  function formatAmount(amount: number) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount ?? 0);
  }

  function formatDate(date?: string) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(parsedDate);
  }

  const columns: Column<(typeof notifications)[0]>[] = [
    {
      key: "customer",
      label: "Customer",
      width: "whitespace-nowrap",
      render: (_, row) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.customer?.fullName || "Unknown customer"}
          </div>
          <div className="text-xs text-gray-500">
            {row.customer?.id ?? "—"}
          </div>
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-900">{String(value) || "—"}</span>
      ),
    },
    {
      key: "body",
      label: "Message",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-600 max-w-xs truncate block">{String(value) || "—"}</span>
      ),
    },
    {
      key: "type",
      label: "Type",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700">{String(value) || "—"}</span>
      ),
    },
    {
      key: "scope",
      label: "Scope",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700">{String(value) || "—"}</span>
      ),
    },
    {
      key: "entityType",
      label: "Entity",
      width: "whitespace-nowrap",
      render: (_, row) => (
        <span className="text-gray-700">
          {row.entityType || "—"}
          {row.entityId ? ` #${row.entityId.code || row.entityId.id}` : ""}
        </span>
      ),
    },
    {
      key: "data",
      label: "Amount",
      width: "whitespace-nowrap",
      render: (_, row) =>
        row.data ? (
          <div>
            <div className="font-medium text-gray-900">
              Due: {formatAmount(row.data.amount_due ?? 0)}
            </div>
            <div className="text-xs text-gray-500">
              Paid: {formatAmount(row.data.amount_paid ?? 0)}
            </div>
          </div>
        ) : (
          "—"
        ),
    },
    {
      key: "paidStatus",
      label: "Status",
      width: "whitespace-nowrap",
      render: (_, row) => {
        const statusKey = (
          row.paidStatus?.toUpperCase() ?? (row.readAt ? "READ" : "UNREAD")
        ).toUpperCase();
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              statusStyles[statusKey] ?? statusStyles.default
            }`}
          >
            {row.paidStatus ?? (row.readAt ? "Read" : "Unread")}
          </span>
        );
      },
    },
    {
      key: "createdDate",
      label: "Created",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-600">{formatDate(String(value))}</span>
      ),
    },
  ];

    const actions: Action<(typeof notifications)[0]>[] = [
    {
      label: "View",
      color: "blue",
      onClick: (row) => router.push(`/dashboard/notification/${row.id}`),
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
        <span className="text-sm font-medium text-gray-600">Loading notification report...</span>
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
          <p className="font-semibold text-red-800">Error fetching notification report</p>
          <p className="mt-1 break-words text-red-700">{String(error)}</p>
        </div>
      </div>
    </HandleResponse>
  );
  if (!data) return (
    <HandleResponse>
      <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <Inbox className="h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">No notification report data available</p>
        <p className="text-xs text-gray-500">Notification analytics will appear here once notifications are sent.</p>
      </div>
    </HandleResponse>
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Notification Report
        </h1>
        <p className="text-gray-500 mt-2">
          Track notification delivery and customer engagement
        </p>
      </div>

      {/* Notification Metrics */}
      <StatGrid
        stats={[
          { label: "Total Notifications", value: notifications.length },
          { label: "Unread", value: totalUnread },
          { label: "Read", value: totalRead },
          { label: "Read Rate", value: notifications.length > 0 ? `${((totalRead / notifications.length) * 100).toFixed(1)}%` : "0%" },
        ]}
      />

      {/* Notification Type Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Notification Status Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Unread</span>
              <span className="text-sm font-semibold text-gray-900">
                {totalUnread} notifications
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-yellow-500 h-3 rounded-full"
                style={{
                  width: `${
                    notifications.length > 0
                      ? (totalUnread / notifications.length) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Read</span>
              <span className="text-sm font-semibold text-gray-900">
                {totalRead} notifications
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{
                  width: `${
                    notifications.length > 0
                      ? (totalRead / notifications.length) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <WidgetTable
        title="Notification Directory"
        subtitle={`${notifications.length} notification${notifications.length === 1 ? "" : "s"}`}
        columns={columns}
        actions={actions}
        data={notifications}
        emptyMessage="No notification data found."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-gray-50"
        onPageChange={handlePageChange}
        currentPage={page}
        toatalRecords={data?.data?.totalNotification ??0}
        totalPages={totalPages}
      />
    </div>
  );
}