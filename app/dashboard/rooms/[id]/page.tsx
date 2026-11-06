"use client";

import { useParams, useRouter } from "next/navigation";
import type { Room } from "../../../types/room";
import { useRoomById } from "@/hooks/room_api";
import { ChevronLeft, Star, Calendar } from "lucide-react";

const FALLBACK_ROOM_IMAGE =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

const statusClasses: Record<string, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-800",
  BOOKED: "bg-blue-100 text-blue-800",
  OCCUPIED: "bg-violet-100 text-violet-800",
  CLEANING: "bg-amber-100 text-amber-800",
  MAINTENANCE: "bg-rose-100 text-rose-800",
  OUT_OF_SERVICE: "bg-slate-200 text-slate-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  DEFAULT: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
  AVAILABLE: "Available",
  BOOKED: "Booked",
  OCCUPIED: "Occupied",
  CLEANING: "Cleaning",
  MAINTENANCE: "Maintenance",
  OUT_OF_SERVICE: "Out of Service",
  PENDING: "Pending",
  DEFAULT: "Unknown",
  DELETED: "Deleted",
};

function formatPrice(value?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

function formatStatus(value?: string) {
  return statusLabels[String(value ?? "")] ?? statusLabels.DEFAULT;
}

function formatStatusClass(value?: string) {
  return statusClasses[String(value ?? "")] ?? statusClasses.DEFAULT;
}

function formatDate(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatOptional(value: unknown) {
  return value ? String(value) : "—";
}

function getRoomImage(image: Room["images"][number] | undefined) {
  return image?.imageUrl || image?.filePath || FALLBACK_ROOM_IMAGE;
}

export default function RoomDetailsPage() {
  const route = useRouter();
  const param = useParams();
  const roomId = param.id as string;

  const { data, loading, error } = useRoomById(roomId);

  if (loading) {
    return (
      <div className="flex min-h-105 items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></span>
          Loading room details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="border-l-4 border-red-500 bg-red-50 p-4">
          <p className="font-medium text-red-700">Unable to load room</p>
          <p className="mt-1 text-sm text-red-600">{String(error)}</p>
        </div>
      </div>
    );
  }

  const room = data?.data as Room | undefined;
  if (!room) {
    return (
      <div className="space-y-6 p-6">
        <button
          type="button"
          onClick={() => route.push("/dashboard/rooms")}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Rooms
        </button>
        <div className="border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-medium text-gray-900">Room not found</p>
          <p className="mt-1 text-sm text-gray-600">
            No room was found for ID: {roomId}
          </p>
        </div>
      </div>
    );
  }

  const roomImages = room.images?.length
    ? room.images
    : [{ imageUrl: FALLBACK_ROOM_IMAGE } as Room["images"][number]];
  const rating = Number(room.rating ?? 0);
  const price = Number(room.price ?? 0);
  const discountPercentage = Number(room.discountPercentage ?? 0);
  const discountPrice = Number(room.discountPrice ?? 0);
  const displayedDiscountedPrice =
    discountPrice > 0
      ? discountPrice
      : price - (price * discountPercentage) / 100;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-4">
          <button
            type="button"
            onClick={() => route.push("/dashboard/rooms")}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
          >
            <ChevronLeft size={16} /> Back to rooms
          </button>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-600">Room details</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                {room.roomName}
              </h1>
            </div>
            <span
              className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-semibold ${formatStatusClass(room.statusRoom)}`}
            >
              Status: {formatStatus(room.statusRoom)}
            </span>
          </div>
        </header>

        <section
          aria-labelledby="room-overview"
          className="rounded-lg border border-slate-300 bg-white"
        >
          <h2
            id="room-overview"
            className="border-b border-slate-200 px-5 py-4 text-lg font-semibold"
          >
            Room overview
          </h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 p-5 sm:grid-cols-3 lg:grid-cols-6">
            <div>
              <dt className="text-sm text-slate-600">Room number</dt>
              <dd className="mt-1 text-lg font-medium">{room.roomNumber}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-600">Floor</dt>
              <dd className="mt-1 text-lg font-medium">
                {room.floor?.floorNumber ?? "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-600">Room type</dt>
              <dd className="mt-1 text-lg font-medium">
                {room.roomType || "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-600">Price per night</dt>
              <dd className="mt-1 text-lg font-medium">{formatPrice(price)}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-600">Discount</dt>
              <dd className="mt-1 text-lg font-medium">
                {discountPercentage > 0 ? `${discountPercentage}%` : "None"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-600">Rating</dt>
              <dd className="mt-1 flex items-center gap-1 text-lg font-medium">
                <Star size={16} className="fill-amber-400 text-amber-500" />
                {rating.toFixed(1)} / 5
              </dd>
            </div>
          </dl>
          {discountPercentage > 0 && (
            <p className="border-t border-slate-200 px-5 py-3 text-sm text-slate-700">
              Discounted price:{" "}
              <span className="font-semibold">
                {formatPrice(displayedDiscountedPrice)} per night
              </span>
            </p>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <section
            aria-labelledby="gallery-heading"
            className="rounded-lg border border-slate-300 bg-white p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="gallery-heading" className="text-lg font-semibold">
                Photos
              </h2>
              <span className="text-sm text-slate-600">
                {roomImages.length}{" "}
                {roomImages.length === 1 ? "photo" : "photos"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {roomImages.map((image, index) => (
                <div
                  key={`${image.id ?? index}-${getRoomImage(image)}`}
                  className="relative aspect-square overflow-hidden rounded-md bg-slate-100"
                >
                  <div
                    role="img"
                    aria-label={`Room photo ${index + 1}`}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${getRoomImage(image)}")` }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="description-heading"
            className="rounded-lg border border-slate-300 bg-white p-5"
          >
            <h2 id="description-heading" className="text-lg font-semibold">
              Description
            </h2>
            <p className="mt-3 whitespace-pre-wrap leading-6 text-slate-700">
              {room.description || "No description provided."}
            </p>
          </section>
        </div>

        <section
          aria-labelledby="record-heading"
          className="rounded-lg border border-slate-300 bg-white"
        >
          <h2
            id="record-heading"
            className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 text-lg font-semibold"
          >
            <Calendar size={18} /> Record information
          </h2>
          <dl className="grid gap-x-8 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm text-slate-600">Created</dt>
              <dd className="mt-1 font-medium">
                {formatDate(room.createdDate)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-600">Last modified</dt>
              <dd className="mt-1 font-medium">
                {formatDate(room.lastModifiedDate)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-600">Deleted</dt>
              <dd className="mt-1 font-medium">
                {formatDate(room.deletedDate)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-600">Created by</dt>
              <dd className="mt-1 font-medium">
                {formatOptional(room.createBy)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-600">Modified by</dt>
              <dd className="mt-1 font-medium">
                {formatOptional(room.lastModifiedBy)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-600">Deleted by</dt>
              <dd className="mt-1 font-medium">
                {formatOptional(room.deletedBy)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-600">Record action</dt>
              <dd className="mt-1 font-medium">
                {formatOptional(room.action)}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
