'use client';

import React from 'react';
import StatGrid from '@/app/lib/actions/statcard';
import { useApiAuthenticated } from '@/hooks/useApi';
import buildQueryString from '@/app/lib/actions/buildQueryUrl';
import { useState } from 'react';
import { Rooms } from '../../../types/room';
import FilterSearch from '@/app/lib/actions/filter_search';
import WidgetTable, { Action, Column } from '@/app/lib/actions/Widgettable';
import { config } from "@/config";
import { useRouter } from 'next/navigation';
import HandleResponse from '@/components/ui/handleResponse';
import { AlertCircle, Inbox, Loader2 } from 'lucide-react';
import { useRoomList } from '@/hooks/room_api';

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

export default function OccupancyReportPage() {
  const size = 10;
  const [filters, setFilters] = useState({
    status_room: "",
    type: "",
    search: "",
    page: 1,
    size,
    isPage: true,
  });
  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [refetchKey, setRefetchKey] = useState(0);
  const [page, setPage] = useState(1);

  const MapFilter: Record<string, Record<string, string>> = {
    status_room: {
      all: "",
      AVAILABLE: "AVAILABLE",
      BOOKED: "BOOKED",
      OCCUPIED: "OCCUPIED",
      CLEANING: "CLEANING",
      MAINTENANCE: "MAINTENANCE",
      OUT_OF_SERVICE: "OUT_OF_SERVICE",
      PENDING: "PENDING",
    },
    type: {
      all: "",
      Single: "Single",
      Double: "Double",
      Twin: "Twin",
      Suite: "Suite",
      Family: "Family",
    },
      created_date: {
      All: "",
    }
  };

  const queryString = buildQueryString(submittedFilters);
  const url = queryString
    ? `${config.apiUrl}/api/room/list?${queryString}`
    : `${config.apiUrl}/api/room/list`;
  const urlWithRefetch = `${url}${queryString ? '&' : '?'}__refetch=${refetchKey}`;
  const { data, loading, error } =useRoomList(urlWithRefetch);
  const router = useRouter();

  const roomData = data?.data;
  const rooms = roomData?.rooms ?? [];
  const totalPages = Math.max(
    1,
    Math.ceil((roomData?.totalRooms ?? rooms.length) / size),
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSubmittedFilters((prev) => ({ ...prev, page: newPage }));
    setRefetchKey((prev) => prev + 1);
  };

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

  const columns: Column<(typeof rooms)[0]>[] = [
    {
      key: "roomName",
      label: "Room",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="font-medium text-gray-900">{String(value)}</span>
      ),
    },
    {
      key: "roomNumber",
      label: "Room #",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">#{String(value)}</span>,
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
        <span className="text-gray-700">{row.floor?.floorNumber ?? "N/A"}</span>
      ),
    },
    {
      key: "price",
      label: "Price",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="font-medium text-gray-900">{formatPrice(Number(value))}</span>
      ),
    },
    {
      key: "statusRoom",
      label: "Status",
      width: "whitespace-nowrap",
      render: (value) => {
        const statusClass = statusClasses[String(value)] ?? statusClasses.DEFAULT;
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {String(value)}
          </span>
        );
      },
    },
  ];

  const actions: Action<(typeof rooms)[0]>[] = [
    {
      label: "View",
      color: "blue",
      onClick: (row) => router.push(`/dashboard/rooms/${row.id}`),
    },
  ];

  if (loading) return (
    <HandleResponse>
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
      >
        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        <span className="text-sm font-medium text-gray-600">Loading occupancy report...</span>
      </div>
    </HandleResponse>
  );
  if (error) return (
    <HandleResponse>
      <div
        role="alert"
        className="flex w-full max-w-md items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm"
      >
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
        <div className="text-sm">
          <p className="font-semibold text-red-800">Error fetching occupancy report</p>
          <p className="mt-1 break-words text-red-700">{String(error)}</p>
        </div>
      </div>
    </HandleResponse>
  );
  if (!data) return (
    <HandleResponse>
      <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <Inbox className="h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">No occupancy report data available</p>
        <p className="text-xs text-gray-500">Room occupancy statistics will appear here once rooms are listed.</p>
      </div>
    </HandleResponse>
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Occupancy Report</h1>
        <p className="text-gray-500 mt-2">Monitor room occupancy rates and availability</p>
      </div>

      {/* Occupancy Metrics */}
      <StatGrid
        stats={[
          { label: "Total Rooms", value: roomData?.totalRooms || 0 },
          { label: "Occupied Rooms", value: roomData?.occupiedRooms || 0 },
          { label: "Available Rooms", value: roomData?.availableRooms || 0 },
          { label: "Occupancy Rate", value: roomData?.totalRooms ? `${(((roomData.occupiedRooms || 0) / roomData.totalRooms) * 100).toFixed(1)}%` : "0%" },
        ]}
      />

      {/* Room Status Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Room Status Breakdown</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Available</span>
              <span className="text-sm font-semibold text-gray-900">{roomData?.availableRooms || 0} rooms</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${roomData?.totalRooms ? ((roomData.availableRooms || 0) / roomData.totalRooms * 100) : 0}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Occupied</span>
              <span className="text-sm font-semibold text-gray-900">{roomData?.occupiedRooms || 0} rooms</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${roomData?.totalRooms ? ((roomData.occupiedRooms || 0) / roomData.totalRooms * 100) : 0}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Booked</span>
              <span className="text-sm font-semibold text-gray-900">{roomData?.bookedRooms || 0} rooms</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${roomData?.totalRooms ? ((roomData.bookedRooms || 0) / roomData.totalRooms * 100) : 0}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Maintenance</span>
              <span className="text-sm font-semibold text-gray-900">{roomData?.maintenanceRooms || 0} rooms</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${roomData?.totalRooms ? ((roomData.maintenanceRooms || 0) / roomData.totalRooms * 100) : 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>

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
          }
        }}
      />

      <WidgetTable
        title="Room List"
        subtitle="All rooms and their current status"
        columns={columns}
        data={rooms}
        actions={actions}
        emptyMessage="No room data found."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-gray-50"
        onPageChange={handlePageChange}
        currentPage={page}
        toatalRecords={roomData?.totalRooms ?? rooms.length}
        totalPages={totalPages}
      />
    </div>
  );
}