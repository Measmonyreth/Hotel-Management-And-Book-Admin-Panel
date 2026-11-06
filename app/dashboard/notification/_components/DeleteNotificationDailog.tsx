"use client";

import { useState } from "react";
import { deleteNotification } from "@/hooks/notification_api";

interface DeleteNotificationDailogProps {
  open: boolean;
  notificationId: string;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteNotificationDailog({
  notificationId,
  onClose,
  onDeleted,
  open,
}: DeleteNotificationDailogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      await deleteNotification(notificationId);
      onDeleted();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete notification.",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-notification-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5">
          <h2
            id="delete-notification-title"
            className="mb-4 text-xl font-semibold"
          >
            Confirm Deletion
          </h2>
          <p>Are you sure you want to delete this notification?</p>
        </div>

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
