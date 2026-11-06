import React from "react";
import type { LucideIcon } from "lucide-react";
import {
  File as FileIcon,
  Image as ImageIcon,
  Mail,
  Paperclip,
  Sparkles,
  Users,
} from "lucide-react";
import type {
  Notification,
  NotificationImageResponse,
} from "../../../../types/notification";
import { NotificationDetailRow } from "./notificationdetailrow";

interface DetailItem {
  label: string;
  value: string | React.ReactNode;
  icon: LucideIcon;
  color: string;
}

interface NotificationDetailCardProps {
  notification: Notification;
  details: DetailItem[];
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export const NotificationDetailCard: React.FC<NotificationDetailCardProps> = ({
  notification,
  details,
}) => {
  const customerResponses = notification.customer_notificationResponse ?? [];
  const readCount = customerResponses.filter(
    (response) => response.readAt,
  ).length;
  const readPercentage = customerResponses.length
    ? (readCount / customerResponses.length) * 100
    : 0;
  const attachments = (notification.notificationImageResponses ?? []).filter(
    (attachment) => attachment.notification_url || attachment.filePath,
  );

  const getAttachmentUrl = (a: NotificationImageResponse) =>
    a.notification_url || a.filePath;

  const iconAttachments = attachments.filter(
    (a) => a.type?.toLowerCase() === "icon",
  );

  const imageAttachments = attachments.filter((a) => {
    if (iconAttachments.includes(a)) return false; // icons never count as images
    const fileType = a.fileType?.toLowerCase() ?? "";
    const type = a.type?.toLowerCase() ?? "";
    return fileType.startsWith("image/") || type.includes("image");
  });
  const otherAttachments = attachments.filter(
    (attachment) =>
      !iconAttachments.includes(attachment) &&
      !imageAttachments.includes(attachment),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
      <main className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-6 md:px-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                {notification.type || "Notification"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {notification.scope || "General"}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {notification.title || "Notification"}
            </h1>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600 md:text-base">
              {notification.body || "No message content."}
            </p>
            <p className="mt-5 text-xs font-medium text-slate-400">
              Sent {formatDate(notification.createdDate)}
            </p>
          </div>

          {attachments.length > 0 && (
            <div className="space-y-8 p-6 md:p-8">
              {iconAttachments.length > 0 && (
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Sparkles size={17} className="text-blue-600" /> Icons
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {iconAttachments.map((icon) => (
                      <div
                        key={icon.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2"
                      >
                        <img
                          src={getAttachmentUrl(icon)}
                          alt={icon.fileName || "Icon"}
                          className="h-10 w-10 rounded-lg bg-slate-50 object-contain p-1"
                        />
                        <span className="max-w-[140px] truncate text-xs font-medium text-slate-600">
                          {icon.fileName || "Icon"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {imageAttachments.length > 0 && (
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <ImageIcon size={17} className="text-blue-600" /> Images
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {imageAttachments.map((image) => {
                      const imageUrl = getAttachmentUrl(image);
                      return (
                        <a
                          key={image.id}
                          href={imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                        >
                          <img
                            src={imageUrl}
                            alt={image.fileName || "Notification attachment"}
                            className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                          <p className="truncate px-4 py-3 text-xs font-medium text-slate-600">
                            {image.fileName || "View image"}
                          </p>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {otherAttachments.length > 0 && (
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Paperclip size={17} className="text-blue-600" /> Files
                  </h2>
                  <ul className="space-y-2">
                    {otherAttachments.map((file) => (
                      <li key={file.id}>
                        <a
                          href={getAttachmentUrl(file)}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          {file.fileName || "Download file"}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-100/50 px-6 py-4">
            <h2 className="font-semibold text-slate-900">
              Notification information
            </h2>
          </div>
          <div className="divide-y divide-slate-200">
            {details.map((detail, index) => (
              <NotificationDetailRow key={index} {...detail} />
            ))}
          </div>
        </section>
      </main>

      <aside>
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <Users size={19} />
              </span>
              <div>
                <h2 className="font-semibold text-slate-900">Customers</h2>
                <p className="text-xs text-slate-500">
                  Delivery and read status
                </p>
              </div>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {customerResponses.length}
            </span>
          </div>
          <div className="p-5">
            <div className="mb-4 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">Read summary</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {readCount}
                <span className="text-sm font-medium text-slate-400">
                  {` / ${customerResponses.length} read`}
                </span>
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${readPercentage}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              {customerResponses.map((response) => {
                const customerName =
                  response.customer?.name ??
                  response.customer?.fullName ??
                  "Unknown customer";

                return (
                  <article
                    key={response.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
                        {customerName.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {customerName}
                          </p>
                          <span
                            className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${
                              response.readAt
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {response.readAt ? "Read" : "Unread"}
                          </span>
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500">
                          <Mail size={13} />
                          {response.customer?.email ?? "No email"}
                        </p>
                        <p className="mt-3 text-[11px] text-slate-400">
                          {response.readAt
                            ? `Read ${formatDate(response.readAt)}`
                            : "Has not opened this notification"}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
              {customerResponses.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-500">
                  No customer responses yet.
                </p>
              )}
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
};
