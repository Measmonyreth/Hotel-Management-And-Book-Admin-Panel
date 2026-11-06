"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import type { Room, Rooms } from "./_component/type";
import buildQueryString from "@/app/lib/actions/buildQueryUrl";
import FilterSearch from "@/app/lib/actions/filter_search";
import { config } from "@/config";

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

function formatPrice(value?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

export default function CustomerRoomsPage() {
  const [filters, setFilters] = useState({
    type: "",
    search: "",
    page: 1,
  });
  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [refetchKey, setRefetchKey] = useState(0);

  const queryString = buildQueryString(submittedFilters);
  const baseUrl = `${config.apiUrl.replace(/\/$/, "")}/api/room/all`;
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
  // Properly construct URL with refetch parameter
  const urlWithRefetch = `${url}${queryString ? "&" : "?"}__refetch=${refetchKey}`;
  const handleFilterChange = (key: string, value: string | number | boolean) => {
    const nextFilters = {
      ...filters,
      [key]: value,
      page: key === "search" && value !== "" ? filters.page : 1,
    };
    setFilters(nextFilters);

    if (key !== "search" || value === "") {
      setSubmittedFilters(nextFilters);
      setRefetchKey((prev) => prev + 1);
    }
  };
  const { data, loading, error } = useApi<Rooms>(urlWithRefetch);
  const roomSummary = data?.data;
  const rooms = data?.data?.rooms;

  const MapFilter = {
    type: {
      All: "",
      PAID: "PAID",
      UNPAID: "UNPAID",
      PARTIALLY_PAID: "PARTIALLY_PAID",
      REFUNDED: "REFUNDED",
      PARTIALLY_REFUND: "PARTIALLY_REFUND",
    },
  };

  const stats = [
    { label: "Total Rooms", value: roomSummary?.totalRooms ?? 0 },
    { label: "Available", value: roomSummary?.availableRooms ?? 0 },
    { label: "Booked", value: roomSummary?.bookedRooms ?? 0 },
    { label: "Occupied", value: roomSummary?.occupiedRooms ?? 0 },
    { label: "Cleaning", value: roomSummary?.cleaningRooms ?? 0 },
    { label: "Maintenance", value: roomSummary?.maintenanceRooms ?? 0 },
    { label: "Out of Service", value: roomSummary?.outOfServiceRooms ?? 0 },
    { label: "Pending", value: roomSummary?.pendingRooms ?? 0 },
  ];

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (error)
    return (
      <p className="text-center py-8 text-red-500">Error: {String(error)}</p>
    );
  if (!data) return <p className="text-center py-8">No data available</p>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Rooms
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">
            Available Rooms
          </h1>
        </div>
      </div>

      <div>
        <FilterSearch
          mapFilter={MapFilter}
          filterValues={filters}
          onFilterChange={handleFilterChange}
          searchValue={filters.search}
          onSearchChange={(e) => handleFilterChange("search", e.target.value)}
          onSearchKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setSubmittedFilters(filters);
              setRefetchKey((prev) => prev + 1);
            }
          }}
        />
      </div>

      <div className="space-y-3">
        {rooms?.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No rooms found matching your criteria.
          </p>
        ) : (
          rooms!.map((room) => {
            const imageUrl =
              room.images?.[0]?.imageUrl ||
              room.images?.[0]?.filePath ||
              "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80";
            const statusClass =
              statusClasses[room.statusRoom] ?? statusClasses.DEFAULT;

            return (
              <div
                key={room.id}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="h-20 w-24 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url("${imageUrl}")` }}
                  aria-label={room.roomName}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {room.roomName}
                    </h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusClass}`}
                    >
                      {room.statusRoom}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                    <span>Room #{room.roomNumber}</span>
                    <span>{room.roomType}</span>
                    <span>Floor {room.floor?.floorNumber ?? "N/A"}</span>
                    <span>
                      {room.rating?.toFixed(1) ?? "0"}★ (
                      {room.discountPercentage}% off)
                    </span>
                  </div>

                  {room.description && (
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {room.description}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">
                    Price per night
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(room.price)}
                  </p>
                  {room.discountPercentage > 0 && (
                    <p className="text-xs text-red-500 mt-1">
                      Was:{" "}
                      {formatPrice(
                        room.price +
                          (room.price * room.discountPercentage) / 100,
                      )}
                    </p>
                  )}
                </div>

                {/* Customer action buttons - View details, Book now (if available) */}
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
                    View Details
                  </button>
                  {room.statusRoom === "AVAILABLE" && (
                    <button className="flex-1 rounded-md bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600">
                      Book Now
                    </button>
                  )}
                  {room.statusRoom !== "AVAILABLE" && (
                    <button
                      className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500"
                      disabled
                    >
                      Unavailable
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
