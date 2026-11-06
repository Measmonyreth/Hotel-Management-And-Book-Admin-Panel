"use client";

import type {
  NotificationDetailResponse,
  NotificationResponse,
} from "@/app/types/notification";
import { api, useApiAuthenticated } from "./useApi";

export type FCMTokenEntry = {
  user: {
    email: string;
    id: string;
  };
  token: string;
};

export type FCMTokenResponse = {
  success: boolean;
  message: string;
  data: FCMTokenEntry[];
};

export function useNotifications(
  refetchKey = 0,
  filters: Record<string, string | number | boolean> = {},
) {
  const searchParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    searchParams.set(key, String(value));
  });
  searchParams.set("__refetch", String(refetchKey));

  return useApiAuthenticated<NotificationResponse>(
    `/notification/getall?${searchParams.toString()}`,
  );
}

export function useNotificationById(id: string) {
  return useApiAuthenticated<NotificationDetailResponse>(
    `/notification/getbyid/${encodeURIComponent(id)}`,
  );
}

export function getFcmTokens() {
  return api<FCMTokenResponse>("/fcm-tokens/all");
}

export function deleteNotification(id: string) {
  return api<unknown>(
    `/notification/delete/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}

export function sendNotificationToToken(formData: FormData) {
  return api<unknown>("/notifications/send-token", {
    method: "POST",
    body: formData,
  });
}

export function sendNotificationToTopic(
  topic: string,
  formData: FormData,
) {
  return api<unknown>(
    `/notifications/send-topic?topic=${encodeURIComponent(topic)}`,
    {
      method: "POST",
      body: formData,
    },
  );
}