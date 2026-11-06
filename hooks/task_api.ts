"use client";

import type { TaskDetailResponse, TaskResponse } from "@/app/types/task";
import { api, useApiAuthenticated } from "./useApi";

export function useTaskSearch(url: string) {
  return useApiAuthenticated<TaskResponse>(url);
}

export function useTaskById(id: string | number) {
  return useApiAuthenticated<TaskDetailResponse>(
    `/tasks/getbyid/${encodeURIComponent(String(id))}`,
  );
}

export type TaskPayload = {
  id?: number;
  description: string;
  taskType: string;
  taskStatus: string;
  roomId: string;
  employeeId: string;
};

export function createTask(payload: TaskPayload) {
  return api<unknown>("/tasks/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTask(id: number, payload: TaskPayload) {
  return api<unknown>(`/tasks/update/${encodeURIComponent(String(id))}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTask(id: number) {
  return api<unknown>(`/tasks/delete/${encodeURIComponent(String(id))}`, {
    method: "DELETE",
  });
}