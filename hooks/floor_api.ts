"use client";

import type { FloorDetail, Floors } from "@/app/types/floor";
import { api, useApiAuthenticated } from "./useApi";

export function useFloors() {
  return useApiAuthenticated<Floors>("/floors/getallfloors");
}

export function useFloorSearch(url: string) {
  return useApiAuthenticated<Floors>(url);
}

export function useFloorById(id: string) {
  return useApiAuthenticated<FloorDetail>(
    `/floors/getfloorbyid/${encodeURIComponent(id)}`,
  );
}

export type FloorPayload = {
  floorName: string;
  floorNumber: string;
  description: string;
  statusFloor: string;
};

export function createFloor(payload: FloorPayload) {
  return api<unknown>("/floors/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateFloor(id: string, payload: FloorPayload) {
  return api<unknown>(`/floors/update/${encodeURIComponent(id)}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteFloor(id: string | number) {
  return api<unknown>(`/floors/delete/${id}`, {
    method: "DELETE",
  });
}