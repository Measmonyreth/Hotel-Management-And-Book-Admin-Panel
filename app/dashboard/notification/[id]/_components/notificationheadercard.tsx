import React from "react";
import type { Notification } from "../../../../types/notification";
import { ChevronLeft, Bell, Tag, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

function getNotificationTypeBgColor(type: string | undefined) {
  switch (type?.toUpperCase()) {
    case "BOOKING":
      return "bg-blue-100 text-blue-800";
    case "PAYMENT":
      return "bg-green-100 text-green-800";
    case "ALERT":
      return "bg-red-100 text-red-800";
    case "INFO":
      return "bg-slate-100 text-slate-800";
    case "PROMOTION":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

interface NotificationHeaderCardProps {
  notification: Notification;
}

export const NotificationHeaderCard: React.FC<NotificationHeaderCardProps> = ({
  notification,
}) => {
  const router = useRouter();
  const customerResponses = notification.customer_notificationResponse ?? [];
  const customerNames = customerResponses
    .map((response) => response.customer?.name ?? response.customer?.fullName)
    .filter((name): name is string => Boolean(name));
  const isRead =
    customerResponses.length > 0 &&
    customerResponses.every((response) => Boolean(response.readAt));

  return (
    <>
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard/notification")}
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
        >
          <ChevronLeft size={16} />
          Back to Notifications
        </button>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Notification Details
          </p>
          {/* <h1 className="bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            {notification?.title}
          </h1> */}
          <p className="text-sm text-slate-600">
            {/* ID: {notification?.id} •  */}
            For:{" "}{customerNames.length ? customerNames.join(", ") : "All customer"}
          </p>
        </div>
      </div>

      {/* Status Badges */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${getNotificationTypeBgColor(
            notification?.type
          )}`}
        >
          <Bell size={16} />
          {notification?.type}
        </div>
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
          <Tag size={16} />
          {notification?.scope}
        </div>
        {/* <div
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
            isRead
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {isRead ? <Eye size={16} /> : <EyeOff size={16} />}
          {isRead ? "Read" : "Unread"}
        </div> */}
      </div>
    </>
  );
};
