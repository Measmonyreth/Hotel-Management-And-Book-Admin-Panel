"use client";

import { useState, useEffect } from "react";
import {
  getFcmTokens,
  sendNotificationToToken,
  sendNotificationToTopic,
  type FCMTokenEntry,
} from "@/hooks/notification_api";
import { Notification } from "@/app/types/notification";

export type NotificationScope = "GENERAL" | "PERSONAL";
export type NotificationType =
  | "BOOKING_SUCCESS"
  | "BOOKING_FAILED"
  | "BOOKING_CHECKIN"
  | "BOOKING_CHECKOUT"
  | "BOOKING_COMPLETED"
  | "PROMOTION_NEW"
  | "ROOM_NEW"
  | "INFO_GENERAL";

export interface CreateNotificationFormValues {
  type: NotificationType;
  scope: NotificationScope;
  title: string;
  body: string;
  image: File| null;
  icon: File| null;
  recipientToken: string;
}

type CreateNotificationModalProps = {
  open: boolean;
  isUpdate: boolean;
  initialNotification?: Notification;
  onClose: () => void;
  onSubmit?: (values: CreateNotificationFormValues) => void;
};

const defaultValues: CreateNotificationFormValues = {
  type: "INFO_GENERAL",
  scope: "GENERAL",
  title: "",
  body: "",
  image: null,
  icon: null,
  recipientToken: "",
};

export default function CreateNotificationPage({
  open,
  isUpdate,
  initialNotification,
  onClose,
  onSubmit,
}: CreateNotificationModalProps) {
  const [form, setForm] = useState<CreateNotificationFormValues>({
    ...defaultValues,
  });
  const [emailList, setEmailList] = useState<FCMTokenEntry[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open && initialNotification) {
      setForm({
        ...defaultValues,
        type: (initialNotification.type as NotificationType) ?? "INFO_GENERAL",
        scope: (initialNotification.scope as NotificationScope) ?? "GENERAL",
        title: initialNotification.title ?? "",
        body: initialNotification.body ?? "",
        image: initialNotification.actionUrl ?? "",
      });
    } else if (open && !isUpdate) {
      setForm({ ...defaultValues });
    }
  }, [open, isUpdate, initialNotification]);

  // Fetch emails when modal is open and scope is PERSONAL
  useEffect(() => {
    if (!open || isUpdate || form.scope !== "PERSONAL") return;

    const fetchEmails = async () => {
      setLoadingEmails(true);
      setEmailError(null);
      try {
        const data = await getFcmTokens();

        if (!data.data || data.data.length === 0) {
          setEmailError("No recipient emails found in the system");
        }

        setEmailList(data.data || []);
      } catch (error) {
        console.error("Error fetching emails:", error);
        setEmailError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoadingEmails(false);
      }
    };

    fetchEmails();
  }, [open, isUpdate, form.scope]);

  if (!open) return null;

  const updateField = (
    field: keyof CreateNotificationFormValues,
    value: string| File | null,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!form.title || !form.body) {
      setSubmitError("Please fill required notification fields.");
      return;
    }

    if (!isUpdate && form.scope === "PERSONAL" && !form.recipientToken) {
      setSubmitError("Recipient token is required for personal notifications.");
      return;
    }

    if (isUpdate && !initialNotification?.id) {
      setSubmitError("Cannot update a notification without its ID.");
      return;
    }

    const formData = new FormData();
    formData.append("scope", form.scope);
    formData.append("type", form.type);
    formData.append("title", form.title);
    formData.append("body", form.body);
    if (form.icon) formData.append("icon", form.icon);
    if (form.image) formData.append("file", form.image);
    if (!isUpdate && form.scope === "PERSONAL") {
      formData.append("recipientToken", form.recipientToken);
    }

    try {
      if (isUpdate) {
        // Notification updates are not currently supported by the API.
      } else if (form.scope === "PERSONAL") {
        await sendNotificationToToken(formData);
      } else {
        await sendNotificationToTopic("all", formData);
      }

      onSubmit?.({ ...form });
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to save notification.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Notification Management
            </p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {isUpdate ? "Update Notification" : "Add New Notification"}
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
          {submitError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {submitError}
            </p>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Scope{" "}
              <span className="text-red-600" aria-hidden="true">
                *
              </span>{" "}
              required
              <select
                value={form.scope}
                onChange={(e) =>
                  updateField("scope", e.target.value as NotificationScope)
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              >
                {isUpdate && <option value={form.scope}>{form.scope}</option>}
                {!isUpdate && (
                  <>
                    <option value="GENERAL">General (topic: all)</option>
                    <option value="PERSONAL">Personal (token)</option>
                  </>
                )}
              </select>
            </label>
          </div>

          <div className=" flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">
              Type{" "}
              <span className="text-red-600" aria-hidden="true">
                *
              </span>{" "}
              required
              <select
                value={form.type}
                onChange={(e) =>
                  updateField("type", e.target.value as NotificationType)
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              >
                <option value="BOOKING_SUCCESS">Booking Success</option>
                <option value="BOOKING_FAILED">Booking Failed</option>
                <option value="BOOKING_CHECKIN">Booking Check-in</option>
                <option value="BOOKING_CHECKOUT">Booking Check-out</option>
                <option value="BOOKING_COMPLETED">Booking Completed</option>
                <option value="PROMOTION_NEW">New Promotion</option>
                <option value="ROOM_NEW">New Room</option>
                <option value="INFO_GENERAL">General Info</option>
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              Icon
              <input
                type="file"
              //  value={form.image}
                onChange={(e) =>
                  updateField("icon", e.currentTarget.files?.[0] ?? null)
                }
                placeholder="https://example.com/image.png"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Title{" "}
              <span className="text-red-600" aria-hidden="true">
                *
              </span>{" "}
              required
              <input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Enter notification title"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Image
              <input
                type="file"
           //     value={form.image}
                onChange={(e) =>
                  updateField("image", e.currentTarget.files?.[0] ?? null)
                }
                placeholder="https://example.com/image.png"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Body{" "}
              <span className="text-red-600" aria-hidden="true">
                *
              </span>{" "}
              required
              <textarea
                value={form.body}
                onChange={(e) => updateField("body", e.target.value)}
                rows={3}
                placeholder="Enter notification message"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </label>
          </div>

          {form.scope === "PERSONAL" && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Recipient Email{" "}
                <span className="text-red-600" aria-hidden="true">
                  *
                </span>{" "}
                required
                {isUpdate ? (
                  <input
                    value={
                      initialNotification?.customer_notificationResponse[0]
                        .customer?.email ??
                      initialNotification?.customer_notificationResponse[0]
                        .customer?.name ??
                      "—"
                    }
                    disabled
                    className="mt-1 w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-3 py-2.5 text-sm text-gray-600"
                  />
                ) : (
                  <select
                    value={
                      emailList.find(
                        (item) => item.token === form.recipientToken,
                      )?.user.email ?? ""
                    }
                    onChange={(e) => {
                      const entry = emailList.find(
                        (item) => item.user.email === e.target.value,
                      );
                      updateField("recipientToken", entry?.token ?? "");
                    }}
                    disabled={loadingEmails}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  >
                    <option value="">
                      {loadingEmails
                        ? "Loading emails..."
                        : emailList.length === 0
                          ? "No emails available"
                          : "Select a recipient email"}
                    </option>
                    {emailList
                      .filter((item) => item?.user?.email)
                      .map((item) => (
                        <option key={item.user.id} value={item.user.email}>
                          {item.user.email}
                        </option>
                      ))}
                  </select>
                )}
              </label>
              {!isUpdate && loadingEmails && (
                <p className="mt-1 text-xs text-gray-500">
                  Loading recipient emails...
                </p>
              )}
              {!isUpdate && emailError && (
                <p className="mt-1 text-xs text-red-600">{emailError}</p>
              )}
            </div>
          )}

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
              {isUpdate ? "Update Notification" : "Send Notification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
