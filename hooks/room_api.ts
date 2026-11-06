"use client";

import type { Floors } from "@/app/types/floor";
import type { RoomDetails, Rooms } from "@/app/types/room";
import { api, useApiAuthenticated } from "./useApi";

export function useRooms() {
  return useApiAuthenticated<Rooms>("/room/all");
}

export function useRoomList(url: string) {
  return useApiAuthenticated<Rooms>(url);
}

export function useRoomById(id: string) {
  return useApiAuthenticated<RoomDetails>(
    `/room/getroom/${encodeURIComponent(id)}`,
  );
}

export function useRoomFloors() {
  return useApiAuthenticated<Floors>("/floors/getallfloors");
}

export function createRoom(formData: FormData) {
  return api<unknown>("/room/create", {
    method: "POST",
    body: formData,
  });
}

export function updateRoom(id: string, formData: FormData) {
  return api<unknown>(`/room/updateroom/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: formData,
  });
}

export function deleteRoom(id: string|number) {
  return api<unknown>(`/room/deleteroom/${id}`, {
    method: "DELETE",
  });
}