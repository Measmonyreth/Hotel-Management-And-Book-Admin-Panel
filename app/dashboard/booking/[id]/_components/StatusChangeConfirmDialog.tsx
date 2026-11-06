"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import {
  BookingStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  getTransitionWarning,
} from "../../_utils/statusTransitions";

interface StatusChangeConfirmDialogProps {
  isOpen: boolean;
  bookitemId?: string;
  currentStatus: BookingStatus;
  nextStatus: BookingStatus;
  roomName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const StatusChangeConfirmDialog: React.FC<
  StatusChangeConfirmDialogProps
> = ({
  isOpen,
  currentStatus,
  nextStatus,
  roomName,
  onConfirm,
  onCancel,
  isLoading = false,
  error,
}) => {
  if (!isOpen) return null;
  const warning = getTransitionWarning(currentStatus, nextStatus);
  

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            Confirm Status Change
          </h2>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Room</p>
            <p className="text-gray-900">{roomName}</p>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Current</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[currentStatus]}`}
              >
                {STATUS_LABELS[currentStatus]}
              </span>
            </div>
            <div className="text-gray-400 text-2xl">→</div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">New</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[nextStatus]}`}
              >
                {STATUS_LABELS[nextStatus]}
              </span>
            </div>
          </div>

          {warning && (
            <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{warning}</p>
            </div>
          )}
          {error && (
            <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 transition ${
              warning
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Updating..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};
