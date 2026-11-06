"use client";
import type { Floor } from "../../types/floor";
import { useState } from "react";
import buildQueryString from "@/app/lib/actions/buildQueryUrl";
import FilterSearch from "@/app/lib/actions/filter_search";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import CreateFloorPage from "./_components/createFloor";
import { useRouter } from "next/navigation";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { useFloorSearch } from "@/hooks/floor_api";
import { DeleteFloorDialog } from "./_components/deleteDailog";
import CreateButton from "@/components/ui/CreateButton";

export default function FloorPage() {
  const size = 10;
  const [filters, setFilters] = useState({
    status_floor: "",
    search: "",
    page: 1,
    size: size,
    isPage: true,
  });
  const [createFloorOpen, setCreateFloorOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState<Floor | undefined>(
    undefined,
  );
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const router = useRouter();

  const MapFilter: Record<string, Record<string, string>> = {
    status_floor: {
      All: "",
      OPEN: "OPEN",
      RESERVED: "RESERVED",
      CLOSE: "CLOSE",
      MAINTENANCE: "MAINTENANCE",
    },
    created_date: {
      All: "",
    },
  };

  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [refetchKey, setRefetchKey] = useState(0);
  const [page, setPage] = useState(1);

  const queryString = buildQueryString(submittedFilters);
  const url = queryString
    ? `/floors/list_group?${queryString}`
    : "/floors/list_group";
  // Properly construct URL with refetch parameter
  const urlWithRefetch = `${url}${queryString ? "&" : "?"}__refetch=${refetchKey}`;
  const { data, loading, error } = useFloorSearch(urlWithRefetch);

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
  // data.data is an array, get the first element which contains DataFloors
  const floors = data?.data;
  const floorList = floors?.floors ?? [];

  const stats = [
    { label: "Total Floors", value: floors?.totalfloors ?? 0 },
    { label: "Open", value: floors?.openfloors ?? 0 },
    { label: "Reserved", value: floors?.reservedfloors ?? 0 },
    { label: "Close", value: floors?.closefloors ?? 0 },
    { label: "Maintenance", value: floors?.maintenancefloors ?? 0 },
  ];

  const totalPages = Math.max(
    1,
    Math.ceil((floors?.totalfloors ?? floorList.length) / size),
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSubmittedFilters((prev) => ({ ...prev, page: newPage }));
    setRefetchKey((prev) => prev + 1);
  };

  const columns: Column<(typeof floorList)[0]>[] = [
    {
      key: "floorNumber",
      label: "Floor Number",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "floorName",
      label: "Floor Name",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },

    {
      key: "statusFloor",
      label: "Status",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "createBy",
      label: "Created By",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
  ];

  const actions: Action<(typeof floorList)[0]>[] = [
    {
      label: "View",
      color: "blue",
      onClick: (row) => router.push(`/dashboard/floors/${row.id}`),
    },
    {
      label: "Update",
      color: "gray",
      onClick: (row) => {
        setEditingFloor(row as Floor);
        setCreateFloorOpen(true);
      },
    },
    {
      label: "Delete",
      color: "red",
      onClick: (row) => {
        setEditingFloor(row);
        setOpenDeleteDialog(true);
      },
    },
  ];

  const handleAddFloor = () => {
    setRefetchKey((current) => current + 1);
  };

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
            Loading floors...
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
            <p className="font-semibold text-red-800">Error fetching floors</p>
            <p className="mt-1 break-words text-red-700">{String(error)}</p>
          </div>
        </div>
      </HandleResponse>
    );
  if (!data || !floors)
    return (
      <HandleResponse>
        <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <Inbox className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            No floor data available
          </p>
          <p className="text-xs text-gray-500">
            Floor details will appear here once they are created.
          </p>
        </div>
      </HandleResponse>
    );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        {/* <div>
          <h1 className="text-2xl font-semibold text-gray-900">Floor Page</h1>
          <p className="mt-4 text-gray-600">
            This is the floor page where users can manage their floor
            information.
          </p>
        </div> */}
        <CreateButton
          label="Create Floor"
          onClick={() => setCreateFloorOpen(true)}
        />
      </div>

      <CreateFloorPage
        open={createFloorOpen}
        isUpdate={createFloorOpen && editingFloor !== undefined}
        initialFloor={editingFloor}
        onClose={() => {
          setCreateFloorOpen(false);
          setEditingFloor(undefined);
        }}
        onSubmit={handleAddFloor}
      />

      <DeleteFloorDialog
        open={openDeleteDialog}
        floorId={editingFloor?.id ?? 0}
        onClose={() => {
          setOpenDeleteDialog(false);
          setEditingFloor(undefined);
          handleAddFloor();
        }}
      />

      {/* <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
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
      <div className="h-screen">
        <WidgetTable
          title="Floor List"
          subtitle="Manage hotel floors"
          columns={columns}
          data={floorList}
          actions={actions}
          emptyMessage="No floors found."
          headerBgColor="bg-gray-50"
          rowHoverColor="hover:bg-gray-50"
          onPageChange={handlePageChange}
          currentPage={page}
          toatalRecords={floors?.totalfloors ?? floorList.length}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
