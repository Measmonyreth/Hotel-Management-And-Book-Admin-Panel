"use client";

import StatGrid from "@/app/lib/actions/statcard";
import { useApiAuthenticated } from "@/hooks/useApi";
import buildQueryString from "@/app/lib/actions/buildQueryUrl";
import { useState } from "react";
import { VipCustomers } from "../../../types/vip_customer";
import FilterSearch from "@/app/lib/actions/filter_search";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import { useRouter } from "next/navigation";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { useVipCustomerSearch } from "@/hooks/vip_customer_api";

const vipTypeStyles: Record<string, string> = {
  SILVER: "bg-gray-100 text-gray-700",
  GOLD: "bg-yellow-100 text-yellow-700",
  PLATINUM: "bg-purple-100 text-purple-700",
  DIAMOND: "bg-blue-100 text-blue-700",
  default: "bg-gray-100 text-gray-700",
};

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-700",
  SUSPENDED: "bg-red-100 text-red-700",
  EXPIRED: "bg-orange-100 text-orange-700",
  DELETED: "bg-red-100 text-red-700",
  default: "bg-gray-100 text-gray-700",
};

export default function VipCustomerReportPage() {
  const size = 10;
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    size,
    isPage: true,
  });

  const MapFilter: Record<string, Record<string, string>> = {
    status: {
      all: "",
      ACTIVE: "ACTIVE",
      INACTIVE: "INACTIVE",
      SUSPENDED: "SUSPENDED",
      EXPIRED: "EXPIRED",
      DELETED: "DELETED",
    },
      created_date: {
      All: "",
    }
  };

  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [refetchKey, setRefetchKey] = useState(0);
  const [page, setPage] = useState(1);
  const queryString = buildQueryString(submittedFilters);
  // const url = queryString
  //   ? `http://localhost:8080/api/vipcustomer/search?${queryString}`
  //   : "http://localhost:8080/api/vipcustomer/search";
  const { data, loading, error } = useVipCustomerSearch(queryString);

  const vipData = data?.data;
  const vipList = vipData?.vipCustomerResponses ?? [];
  const totalPages = Math.max(
    1,
    Math.ceil((vipData?.totalVipCustomers ?? vipList.length) / size),
  );
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
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSubmittedFilters((prev) => ({ ...prev, page: newPage }));
    setRefetchKey((prev) => prev + 1);
  };
  const router = useRouter();

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
      key: "customer",
      label: "Customer",
      width: "whitespace-nowrap",
      render: (_, row) => (
        <span className="text-gray-700">{row.customer?.name ?? "N/A"}</span>
      ),
    },
    {
      key: "type_vip",
      label: "VIP Type",
      width: "whitespace-nowrap",
      render: (value) => {
        const vipTypeKey = String(value)?.toUpperCase() ?? "default";
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              vipTypeStyles[vipTypeKey] ?? vipTypeStyles.default
            }`}
          >
            {String(value)}
          </span>
        );
      },
    },
    {
      key: "points",
      label: "Points",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700">{Number(value).toLocaleString()}</span>
      ),
    },
    {
      key: "percentage_discount",
      label: "Discount",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700">{String(value)}%</span>
      ),
    },
    {
      key: "validUntil",
      label: "Valid Until",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700">
          {value ? new Date(String(value)).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "whitespace-nowrap",
      render: (value) => {
        const statusKey = String(value)?.toUpperCase() ?? "default";
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              statusStyles[statusKey] ?? statusStyles.default
            }`}
          >
            {String(value)}
          </span>
        );
      },
    },
  ];

  const actions: Action<(typeof vipList)[0]>[] = [
    {
      label: "View",
      color: "blue",
      onClick: (row) => router.push(`/dashboard/vip/${row.id}`),
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
        <span className="text-sm font-medium text-gray-600">Loading VIP report...</span>
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
          <p className="font-semibold text-red-800">Error fetching VIP report</p>
          <p className="mt-1 break-words text-red-700">{String(error)}</p>
        </div>
      </div>
    </HandleResponse>
  );
  if (!data) return (
    <HandleResponse>
      <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <Inbox className="h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">No VIP report data available</p>
        <p className="text-xs text-gray-500">VIP analytics will appear here once VIP customers are created.</p>
      </div>
    </HandleResponse>
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">VIP Customer Report</h1>
        <p className="text-gray-500 mt-2">
          Track VIP customer metrics and loyalty program performance
        </p>
      </div>

      {/* VIP Metrics */}
      <StatGrid
        stats={[
          { label: "Total VIP Customers", value: vipData?.totalVipCustomers || 0 },
          { label: "Active VIP Customers", value: vipData?.activeVipCustomers || 0 },
          { label: "Expired VIP Customers", value: vipData?.expiredVipCustomers || 0 },
          { label: "Deleted VIP Customers", value: vipData?.deletedVipCustomers || 0 },
        ]}
      />

      {/* VIP Tier Breakdown */}
      <StatGrid
        stats={[
          { label: "Silver Tier", value: vipData?.silver || 0 },
          { label: "Gold Tier", value: vipData?.gold || 0 },
          { label: "Platinum Tier", value: vipData?.platinum || 0 },
          { label: "Diamond Tier", value: vipData?.diamond || 0 },
        ]}
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
          }
        }}
      />

      <WidgetTable
        title="VIP Customer Directory"
        subtitle="All VIP customers and their tier"
        columns={columns}
        data={vipList}
        actions={actions}
        emptyMessage="No VIP customer data found."
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