"use client";

import { useEffect, useState } from "react";
import { useRoomList } from "@/hooks/room_api";
import type { Room } from "../../types/room";
import buildQueryString from "@/app/lib/actions/buildQueryUrl";
import FilterSearch from "@/app/lib/actions/filter_search";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import { useRouter } from "next/navigation";
import AddRoomModal from "./_component/AddRoomModal";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { DeleteRoomDialog } from "./_component/DeletedDailog";
import CreateButton from "@/components/ui/CreateButton";

const statusClasses: Record<string, string> = {
  CLEANING: "bg-amber-100 text-amber-800",
  AVAILABLE: "bg-emerald-100 text-emerald-800",
  BOOKED: "bg-blue-100 text-blue-800",
  OCCUPIED: "bg-violet-100 text-violet-800",
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

export default function RoomsPage() {
  const size = 10;
  const [filters, setFilters] = useState({
    status_room: "",
    type: "",
    action: "",
    search: "",
    page: 1,
    size: size,
    isPage: true,
  });
  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | undefined>(undefined);
  const [refetchKey, setRefetchKey] = useState(0);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const MapFilter: Record<string, Record<string, string>> = {
    status_room: {
      All: "",
      AVAILABLE: "Available",
      BOOKED: "Booked",
      OCCUPIED: "Occupied",
      CLEANING: "Cleaning",
      MAINTENANCE: "Maintenance",
      OUT_OF_SERVICE: "Out_of_Service",
      PENDING: "Pending",
    },
    type: {
      All: "",
      Single: "Single",
      Double: "Double",
      Twin: "Twin",
      Suite: "Suite",
      Family: "Family",
    },
    action: {
      All: "",
      Active: "Active",
      Inactive: "Inactive",
      Suspended: "Suspended",
      Deleted: "Deleted",
    },
    created_date: {
      All: "",
    },
  };
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("role") === "ADMIN");
  }, []);
  const queryString = buildQueryString(submittedFilters);
  const url = queryString ? `/room/list?${queryString}` : "/room/list";
  // Properly construct URL with refetch parameter
  const urlWithRefetch = `${url}${queryString ? "&" : "?"}__refetch=${refetchKey}`;
  const handleFilterChange = (
    key: string,
    value: string | number | boolean,
  ) => {
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
  const { data, loading, error } = useRoomList(urlWithRefetch);
  const roomSummary = data?.data;
  const rooms = roomSummary?.rooms ?? [];
  const totalPages = Math.max(
    1,
    Math.ceil((roomSummary?.totalRooms ?? rooms.length) / size),
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSubmittedFilters((prev) => ({ ...prev, page: newPage }));
    setRefetchKey((prev) => prev + 1);
  };

  const handleAddRoom = () => setRefetchKey((current) => current + 1);

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

  const columns: Column<Room>[] = [
    {
      key: "roomName",
      label: "Name",
      width: "whitespace-nowrap",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-12 rounded-lg bg-cover bg-center"
            style={{
              backgroundImage: `url("${
                row.images?.[0]?.imageUrl ||
                row.images?.[0]?.filePath ||
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
              }")`,
            }}
            aria-label={String(value)}
          />
          <span className="font-medium text-gray-900">{String(value)}</span>
        </div>
      ),
    },
    {
      key: "roomNumber",
      label: "Room #",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700">#{String(value)}</span>
      ),
    },
    {
      key: "roomType",
      label: "Type",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "floor",
      label: "Floor",
      width: "whitespace-nowrap",
      render: (_, row) => (
        <span className="text-gray-700">{row.floor?.floorNumber || "N/A"}</span>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700">{Number(value).toFixed(1)}★</span>
      ),
    },
    {
      key: "price",
      label: "Price",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="font-medium text-gray-900">
          {formatPrice(Number(value))}
        </span>
      ),
    },
    {
      key: "statusRoom",
      label: "Status",
      width: "whitespace-nowrap",
      render: (value) => {
        const statusClass =
          statusClasses[String(value)] ?? statusClasses.DEFAULT;
        return (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}
          >
            {String(value)}
          </span>
        );
      },
    },
  ];

  const actions: Action<Room>[] = [
    {
      color: "blue",
      onClick: (row) => router.push(`/dashboard/rooms/${row.id}`),
    },
    ...(isAdmin
      ? [
          {
            color: "gray" as const,
            onClick: (row: Room) => {
              setEditingRoom(row);
              setIsAddRoomOpen(true);
            },
          },
          {
            color: "red" as const,
            onClick: (row: Room) => {
              setEditingRoom(row);
              setOpenDeleteDialog(true);
            },
          },
        ]
      : []),
  ];

  if (loading)
    return (
      <HandleResponse>
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
        >
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-sm font-medium text-gray-600">
            Loading rooms...
          </span>
        </div>
      </HandleResponse>
    );
  if (error)
    return (
      <HandleResponse>
        <div
          role="alert"
          className="flex w-full max-w-md items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="text-sm">
            <p className="font-semibold text-red-800">Error fetching rooms</p>
            <p className="mt-1 break-words text-red-700">{String(error)}</p>
          </div>
        </div>
      </HandleResponse>
    );
  if (!data)
    return (
      <HandleResponse>
        <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <Inbox className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            No room data available
          </p>
          <p className="text-xs text-gray-500">
            Room inventory will appear here once they are added.
          </p>
        </div>
      </HandleResponse>
    );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-end">
        {/* <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Overview
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">Rooms</h1>
        </div> */}
        {isAdmin && (
          <CreateButton
            label="Create Room"
            onClick={() => setIsAddRoomOpen(true)}
          />
        )}

      </div>

      <AddRoomModal
        open={isAddRoomOpen}
        isUpdate={isAddRoomOpen && editingRoom !== undefined}
        initialRoom={editingRoom}
        onClose={() => {
          setIsAddRoomOpen(false);
          setEditingRoom(undefined);
        }}
        onSubmit={handleAddRoom}
      />

      <DeleteRoomDialog
        open={openDeleteDialog}
        roomId={editingRoom?.id as number | undefined}
        onClose={() => {
          setOpenDeleteDialog(false);
          setEditingRoom(undefined);
        }}
      />

      {/* <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
          >
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div> */}

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

      <WidgetTable
        title="Room List"
        subtitle="Manage hotel rooms"
        columns={columns}
        data={rooms}
        actions={actions}
        emptyMessage="No rooms found."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-blue-50"
        onPageChange={handlePageChange}
        currentPage={page}
        toatalRecords={roomSummary?.totalRooms ?? rooms.length}
        totalPages={totalPages}
      />
    </div>
  );
}
