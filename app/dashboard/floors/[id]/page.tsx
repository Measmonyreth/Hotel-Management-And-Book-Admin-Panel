"use client";

import { useRouter, useParams } from "next/navigation";
import WidgetTable, { Column } from "@/app/lib/actions/Widgettable";
import type { Floor, Room } from "../../../types/floor";
import { useFloorById } from "@/hooks/floor_api";

export default function FloorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const floorId = params?.id as string;

  const { data, loading, error } = useFloorById(floorId);

  if (loading) return <p className="p-6 text-gray-600">Loading floor...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {String(error)}</p>;
  
  const floor: Floor | null = data?.data ?? null;

  if (!floor) {
    return (
      <div className="space-y-6 p-6">
        <button
          onClick={() => router.push("/dashboard/floors")}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Floors
        </button>
        <p className="text-gray-600">No floor found for ID: {floorId}</p>
      </div>
    );
  }

  const statusBadge: Record<string, string> = {
    OPEN: "bg-emerald-100 text-emerald-800",
    RESERVED: "bg-blue-100 text-blue-800",
    CLOSE: "bg-slate-200 text-slate-800",
    MAINTENANCE: "bg-amber-100 text-amber-800",
    DEFAULT: "bg-gray-100 text-gray-800",
  };

  const statusClass =
    statusBadge[floor.statusFloor] ?? statusBadge.DEFAULT;

  const infoCards = [
    { label: "Floor Number", value: floor.floorNumber },
    { label: "Total Rooms", value: floor.totalRooms },
    { label: "Available Rooms", value: floor.availableRooms },
    { label: "Created By", value: floor.createBy },
  ];

  const columns: Column<Room>[] = [
    {
      key: "roomNumber",
      label: "Room #",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="font-medium text-gray-700">#{String(value)}</span>
      ),
    },
    {
      key: "roomName",
      label: "Room Name",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "roomType",
      label: "Type",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "statusRoom",
      label: "Status",
      width: "whitespace-nowrap",
      render: (value) => {
        const statusClass = statusBadge[String(value)] ?? statusBadge.DEFAULT;
        return (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}
          >
            {String(value)}
          </span>
        );
      },
    },
    {
      key: "price",
      label: "Price",
      width: "whitespace-nowrap",
      render: (value) => {
        const price = Number(value);
        return (
          <span className="font-medium text-gray-900">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
            }).format(price || 0)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Back link */}
      <button
        onClick={() => router.push("/dashboard/floors")}
        className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
      >
        ← Back to Floors
      </button>

      {/* Header */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Floor Details
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">
            {floor.floorName}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Floor #{floor.floorNumber}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
        >
          {floor.statusFloor}
        </span>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {infoCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {card.label}
            </p>
            <p className="mt-1 text-xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      {floor.description && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Description
          </h2>
          <p className="mt-2 text-gray-700">{floor.description}</p>
        </div>
      )}

      {/* Footer meta */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Created:{" "}
          {floor.createdDate
            ? new Date(floor.createdDate).toLocaleString()
            : "N/A"}
        </span>
        <span>ID: {floor.id}</span>
      </div>

      {/* Rooms Table */}
      <WidgetTable
        title="Rooms"
        subtitle={`Rooms on Floor ${floor.floorNumber}`}
        columns={columns}
        data={floor.rooms ?? []}
        emptyMessage="No rooms found on this floor."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-gray-50"
        onPageChange={() => {}}
        currentPage={1}
        toatalRecords={(floor.rooms ?? []).length}
        totalPages={Math.max(1, Math.ceil(((floor.rooms ?? []).length ?? 0) / 10))}
      />
    </div>
  );
}
