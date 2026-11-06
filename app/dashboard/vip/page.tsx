"use client";

import { useVipCustomerSearch } from "@/hooks/vip_customer_api";
import type { VipCustomerResponse } from "../../types/vip_customer";
import { useState } from "react";
import buildQueryString from "@/app/lib/actions/buildQueryUrl";
import FilterSearch from "@/app/lib/actions/filter_search";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import CreateVipPage from "./_components/createVipCard";
import { useRouter } from "next/navigation";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { DeleteVipDailog } from "./_components/deleteVipDailog";
import CreateButton from "@/components/ui/CreateButton";

export default function VipPage() {
  const size = 10;
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    size,
    isPage: true,
  });
  const route = useRouter();
  const MapFilter: Record<string, Record<string, string>> = {
    status: {
      All: "",
      ACTIVE: "ACTIVE",
      INACTIVE: "INACTIVE",
      SUSPENDED: "SUSPENDED",
      EXPIRED: "EXPIRED",
      DELETED: "DELETED",
    },
    created_date: {
      All: "",
    },
  };

  const [createVipModalOpen, setCreateVipModalOpen] = useState(false);
  const [selectedVip, setSelectedVip] = useState<
    VipCustomerResponse | undefined
  >();
  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [refetchKey, setRefetchKey] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [page, setPage] = useState(1);

  const queryString = buildQueryString(submittedFilters);
  const searchParams = new URLSearchParams(queryString);
  searchParams.set("__refetch", String(refetchKey));
  const { data, loading, error } = useVipCustomerSearch(
    searchParams.toString(),
  );
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
  const vipData = data?.data;
  const vipList = vipData?.vipCustomerResponses ?? [];
  const totalPages = Math.max(
    1,
    Math.ceil((vipData?.totalVipCustomers ?? vipList.length) / size),
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSubmittedFilters((prev) => ({ ...prev, page: newPage }));
    setRefetchKey((prev) => prev + 1);
  };

  const columns: Column<(typeof vipList)[0]>[] = [
    {
      key: "code",
      label: "Code",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="font-medium text-gray-900">{String(value)}</span>
      ),
    },
    {
      key: "type_vip",
      label: "Type",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "points",
      label: "Points",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "percentage_discount",
      label: "Discount %",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "validFrom",
      label: "Valid From",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "validUntil",
      label: "Valid Until",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "status",
      label: "Status",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
  ];

  const actions: Action<(typeof vipList)[0]>[] = [
    {
      label: "View",
      color: "blue",
      onClick: (row) => route.push(`/dashboard/vip/${row.id}`),
    },
    {
      label: "Update",
      color: "gray",
      onClick: (row) => {
        setSelectedVip(row);
        setCreateVipModalOpen(true);
      },
    },
    {
      label: "Delete",
      color: "red",
      onClick: (row) => {
        setSelectedVip(row);
        setOpenDeleteDialog(true);
      },
    },
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
            Loading VIP customers...
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
            <p className="font-semibold text-red-800">
              Error fetching VIP customers
            </p>
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
            No VIP customer data available
          </p>
          <p className="text-xs text-gray-500">
            VIP records will appear here once they are created.
          </p>
        </div>
      </HandleResponse>
    );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        {/* <div>
          <h1 className="text-2xl font-semibold text-gray-900">VIP Page</h1>
          <p className="mt-4 text-gray-600">
            This is the VIP page where users can manage their VIP information.
          </p>
        </div> */}
        <CreateButton
          label="Create VIP Card"
          onClick={() => {
            setSelectedVip(undefined);
            setCreateVipModalOpen(true);
          }}
        />

      </div>

      <CreateVipPage
        open={createVipModalOpen}
        isUpdate={Boolean(selectedVip)}
        initialVip={selectedVip}
        onClose={() => {
          setCreateVipModalOpen(false);
          setSelectedVip(undefined);
        }}
        onSubmit={(values) => {
          console.log(selectedVip ? "VIP updated:" : "VIP created:", values);
          setCreateVipModalOpen(false);
          setSelectedVip(undefined);
          setRefetchKey((previous) => previous + 1);
        }}
      />

      <DeleteVipDailog
        open={openDeleteDialog}
        vipCustomerId={selectedVip?.id ?? 0}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedVip(undefined);
        }}
      />

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
        title="VIP Customer List"
        subtitle="Manage VIP memberships"
        columns={columns}
        data={vipList}
        actions={actions}
        emptyMessage="No VIP customers found."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-gray-50"
        onPageChange={handlePageChange}
        currentPage={page}
        toatalRecords={vipData?.totalVipCustomers ?? vipList.length}
        totalPages={totalPages}
      />
    </div>
  );
}
