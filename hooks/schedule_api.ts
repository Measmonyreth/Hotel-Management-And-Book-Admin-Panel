"use client";

import type { ShiftDetail, Shifts } from "@/app/types/schedule";
import { api, useApiAuthenticated } from "./useApi";

export function useSchedules() {
  return useApiAuthenticated<Shifts>("/shift/list");
}

export function useScheduleSearch(url: string) {
  return useApiAuthenticated<Shifts>(url);
}

export function useScheduleById(id: string) {
  return useApiAuthenticated<ShiftDetail>(
    `/shift/getbyid/${encodeURIComponent(id)}`,
  );
}

export type SchedulePayload = {
  id?: string;
  dayWork: string;
  dayOff: string;
  startingTime: string;
  endingTime: string;
  shift: string;
};

export function createSchedule(payload: SchedulePayload) {
  return api<unknown>("/shift/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateSchedule(id: string, payload: SchedulePayload) {
  return api<unknown>(`/shift/update/${encodeURIComponent(id)}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteSchedule(id: string | number) {
  return api<unknown>(`/shift/delete/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}