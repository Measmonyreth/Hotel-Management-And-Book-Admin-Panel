"use client";

import { useNotifications } from "@/hooks/notification_api";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateNotificationPage from "./_components/createNotification";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { DeleteNotificationDailog } from "./_components/DeleteNotificationDailog";
import { Notification } from "@/app/types/notification";
import CreateButton from "@/components/ui/CreateButton";

const statusStyles: Record<string, string> = {
  READ: "bg-green-100 text-green-700 ring-green-200",
  UNREAD: "bg-yellow-100 text-yellow-700 ring-yellow-200",
  PAID: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  PENDING: "bg-orange-100 text-orange-700 ring-orange-200",
  default: "bg-gray-100 text-gray-700 ring-gray-200",
};

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ page: 1, size: 10, isPage: true });
  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [refetchKey, setRefetchKey] = useState(0);

  const { data, loading, error } = useNotifications(
    refetchKey,
    submittedFilters,
  );

  const notifications = data?.data.notificationResponses ?? [];
  const totalpage = Math.max(
    1,
    Math.ceil(
      (data?.data.totalNotification ?? 0) / (submittedFilters.size ?? 10),
    ),
  );
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSubmittedFilters((prev) => ({ ...prev, page: newPage }));
    setRefetchKey((prev) => prev + 1);
  };
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteNotificationId, setDeleteNotificationId] = useState<
    string | null
  >(null);
  const [selectedNotification, setSelectedNotification] = useState<
    Notification | undefined
  >();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("role") === "ADMIN");
  }, []);

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
        <span className="text-gray-600">{String(value) || "—"}</span>
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
      key: "deletedDate",
      label: "Status",
      width: "whitespace-nowrap",
      render: (_, row) => {
        const status = Boolean(row.deletedDate);
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
              statusStyles[status ? "DELETED" : "ACTIVE"] ??
              statusStyles.default
            }`}
          >
            {status ? "DELETED" : "ACTIVE"}
          </span>
        );
      },
    },
    // {
    //   key: "paidStatus",
    //   label: "Status Read",
    //   width: "whitespace-nowrap",
    //   render: (_, row) => {
    //     const statusKey = (
    //       row.paidStatus?.toUpperCase() ?? (row.readAt ? "READ" : "UNREAD")
    //     ).toUpperCase();
    //     return (
    //       <span
    //         className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
    //           statusStyles[statusKey] ?? statusStyles.default
    //         }`}
    //       >
    //         {row.paidStatus ?? (row.readAt ? "Read" : "Unread")}
    //       </span>
    //     );
    //   },
    // },
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
    ...(isAdmin
      ? [
          {
            label: "Update",
            color: "gray" as const,
            onClick: (row: Notification) => {
              setSelectedNotification(row);
              setOpenCreate(true);
            },
          },
          {
            label: "Delete",
            color: "red" as const,
            onClick: (row: Notification) => setDeleteNotificationId(row.id),
          },
        ]
      : []),
  ];

  if (loading) {
    return (
      <HandleResponse>
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
        >
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-sm font-medium text-gray-600">
            Loading notifications...
          </span>
        </div>
      </HandleResponse>
    );
  }

  if (error) {
    return (
      <HandleResponse>
        <div
          role="alert"
          className="flex w-full max-w-md items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="text-sm">
            <p className="font-semibold text-red-800">
              Error fetching notifications
            </p>
            <p className="mt-1 break-words text-red-700">{String(error)}</p>
          </div>
        </div>
      </HandleResponse>
    );
  }

  if (!data) {
    return (
      <HandleResponse>
        <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <Inbox className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            No notification data available
          </p>
          <p className="text-xs text-gray-500">
            New notifications will appear here once they are created.
          </p>
        </div>
      </HandleResponse>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        {/* <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Overview
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">
            Notifications
          </h1>
        </div> */}
        {isAdmin && (
          <CreateButton
            label="Create Notification"
            onClick={() => {
              setSelectedNotification(undefined);
              setOpenCreate(true);
            }}
          />
        )}
        {openCreate && (
          <CreateNotificationPage
            open={openCreate}
            isUpdate={Boolean(selectedNotification)}
            initialNotification={selectedNotification}
            onClose={() => setOpenCreate(false)}
            onSubmit={(values) => {
              console.log(
                selectedNotification
                  ? "Notification updated:"
                  : "Notification created:",
                values,
              );
              setOpenCreate(false);
              setRefetchKey((previous) => previous + 1);
              router.refresh();
            }}
          />
        )}
      </div>

      <WidgetTable
        title="All Notifications"
        subtitle={`${notifications.length} notification${notifications.length === 1 ? "" : "s"}`}
        columns={columns}
        data={notifications}
        actions={actions}
        emptyMessage="No notifications found."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-gray-50"
        onPageChange={handlePageChange}
        currentPage={page}
        toatalRecords={data?.data?.totalNotification ?? 0}
        totalPages={totalpage}
      />

      {deleteNotificationId && (
        <DeleteNotificationDailog
          open
          notificationId={deleteNotificationId}
          onClose={() => setDeleteNotificationId(null)}
          onDeleted={() => {
            setDeleteNotificationId(null);
            setRefetchKey((previous) => previous + 1);
          }}
        />
      )}
    </div>
  );
}
