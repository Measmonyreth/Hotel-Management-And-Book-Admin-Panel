"use client";

import { useParams } from "next/navigation";
import { useNotificationById } from "@/hooks/notification_api";
import {
  AlertCircle,
  Lock,
  Calendar,
  Tag,
  DollarSign,
  Loader,
} from "lucide-react";
import { NotificationHeaderCard } from "./_components/notificationheadercard";

import { NotificationDetailCard } from "./_components/notificationdetailcard";
import { NotificationDetailResponse } from "@/app/types/notification";

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

function getNotificationTypeColor(type: string | undefined) {
  switch (type?.toUpperCase()) {
    case "BOOKING":
      return "text-blue-600";
    case "PAYMENT":
      return "text-green-600";
    case "ALERT":
      return "text-red-600";
    case "INFO":
      return "text-slate-600";
    case "PROMOTION":
      return "text-purple-600";
    default:
      return "text-slate-600";
  }
}

export default function NotificationDetailPage() {
  const params = useParams();
  const notificationId = params?.id as string;

  const { data, loading, error } = useNotificationById(notificationId);
  const notification_data = data;
  const notification = notification_data?.data;


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-600">
            Loading notification details...
          </p>
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
              <h3 className="font-semibold text-red-900">
                Error Loading Notification
              </h3>
              <p className="mt-1 text-sm text-red-700">{String(error)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-900">
            Notification not found
          </p>
          <p className="mt-1 text-sm text-slate-600">
            No notification data available
          </p>
        </div>
      </div>
    );
  }

  const notificationDetails = [
    // {
    //   label: "Notification ID",
    //   value: notification?.id,
    //   icon: Lock,
    //   color: "text-purple-600",
    // },
    {
      label: "Type",
      value: notification?.type,
      icon: Tag,
      color: getNotificationTypeColor(notification?.type),
    },
    {
      label: "Scope",
      value: notification?.scope,
      icon: Tag,
      color: "text-indigo-600",
    },
    {
      label: "Title",
      value: notification?.title,
      icon: Tag,
      color: "text-slate-600",
    },
    {
      label: "Body",
      value: notification?.body,
      icon: Tag,
      color: "text-slate-500",
    },
    {
      label: "Entity Type",
      value: notification?.entityType,
      icon: Tag,
      color: "text-orange-600",
    },
    {
      label: "Entity ID",
      value: notification?.entityId?.id,
      icon: Lock,
      color: "text-orange-500",
    },
    {
      label: "Entity Code",
      value: notification?.entityId?.code,
      icon: Tag,
      color: "text-orange-400",
    },
    ...(notification?.paidStatus
      ? [
          {
            label: "Paid Status",
            value: notification?.paidStatus,
            icon: DollarSign,
            color: "text-green-600",
          },
        ]
      : []),
    {
      label: "Created Date",
      value: formatDate(notification?.createdDate),
      icon: Calendar,
      color: "text-sky-600",
    },
    {
      label: "Last Modified Date",
      value: formatDate(notification?.lastModifiedDate),
      icon: Calendar,
      color: "text-emerald-600",
    },
    {
      label: "Deleted Date",
      value: notification?.deletedDate
        ? formatDate(notification.deletedDate)
        : "Not deleted",
      icon: Calendar,
      color: "text-rose-600",
    },
    {
      label: "Created By",
      value: formatOptional(notification?.createBy),
      icon: Tag,
      color: "text-slate-600",
    },
    {
      label: "Last Modified By",
      value: formatOptional(notification?.lastModifiedBy),
      icon: Tag,
      color: "text-slate-600",
    },
    {
      label: "Deleted By",
      value: formatOptional(notification?.deletedBy),
      icon: Tag,
      color: "text-slate-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <NotificationHeaderCard notification={notification} />
        <NotificationDetailCard
          notification={notification}
          details={notificationDetails}
        />
      </div>
    </div>
  );
}
