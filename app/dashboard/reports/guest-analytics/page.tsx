"use client";

import StatGrid from "@/app/lib/actions/statcard";
import { useApiAuthenticated } from "@/hooks/useApi";
import buildQueryString from "@/app/lib/actions/buildQueryUrl";
import { useState } from "react";
import { Customers } from "../../../types/customer";
import FilterSearch from "@/app/lib/actions/filter_search";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import { useRouter } from "next/navigation";
import { config } from "@/config";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { useCustomerList } from "@/hooks/customer_api";

const statusClasses: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-700",
  DELETED: "bg-red-100 text-red-700",
  default: "bg-gray-100 text-gray-700",
};

export default function GuestAnalyticsReportPage() {
  const size = 10;
  const [filters, setFilters] = useState({
    status: "",
    nationality: "",
    country: "",
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
      DELETED: "DELETED",
    },
    nationality: {
      all: "",
      USA: "USA",
      CANADA: "CANADA",
      UK: "UK",
      AUSTRALIA: "AUSTRALIA",
    },
    country: {
      all: "",
      USA: "USA",
      CANADA: "CANADA",
      UK: "UK",
      AUSTRALIA: "AUSTRALIA",
    },
      created_date: {
      All: "",
    }
  };

  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [refetchKey, setRefetchKey] = useState(0);
  const [page, setPage] = useState(1);
  const queryString = buildQueryString(submittedFilters);
  const url = queryString
    ? `${config.apiUrl}/api/customers/list?${queryString}`
    : `${config.apiUrl}/api/customers/list`;
  const urlWithRefetch = `${url}${queryString ? "&" : "?"}__refetch=${refetchKey}`;
  const { data, loading, error } =useCustomerList(urlWithRefetch);

  const customerData = data?.data;
  const customers = customerData?.customers ?? [];
  const totalPages = Math.max(
    1,
    Math.ceil((customerData?.totalCustomers ?? customers.length) / size),
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

  const UserIcon = "👥";
  const ActiveIcon = "✅";
  const InactiveIcon = "⏸️";
  const DeletedIcon = "🗑️";
  const GoogleIcon = "🔵";
  const SystemIcon = "🔧";

  const stats = [
    { label: "Total Customers", value: customerData?.totalCustomers ?? 0 },
    { label: "Active", value: customerData?.totalActiveCustomers ?? 0 },
    { label: "Inactive", value: customerData?.totalInacitveCustomers ?? 0 },
    { label: "Deleted", value: customerData?.totalDeletedCustomers ?? 0 },
    { label: "Google Login", value: customerData?.loginWithGoogle ?? 0 },
    { label: "System Login", value: customerData?.loginWithSystem ?? 0 },
  ];

  const columns: Column<(typeof customers)[0]>[] = [
    {
      key: "customerId",
      label: "Customer ID",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="font-medium text-gray-900">{String(value)}</span>
      ),
    },
    {
      key: "firstName",
      label: "Name",
      width: "whitespace-nowrap",
      render: (_, row) => (
        <span className="text-gray-700">
          {row.firstName} {row.lastName}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "provider",
      label: "Provider",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "status",
      label: "Status",
      width: "whitespace-nowrap",
      render: (value) => {
        const statusClass =
          statusClasses[String(value).toUpperCase()] ?? statusClasses.default;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}`}
          >
            {String(value)}
          </span>
        );
      },
    },
  ];

  const actions: Action<(typeof customers)[0]>[] = [
    {
      label: "View",
      color: "blue",
      onClick: (row) =>  router.push(`/dashboard/customers/${row.id}`),
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
        <span className="text-sm font-medium text-gray-600">Loading guest analytics...</span>
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
            <p className="font-semibold text-red-800">Error fetching guest analytics</p>
            <p className="mt-1 break-words text-red-700">{String(error)}</p>
          </div>
        </div>
      </HandleResponse>
    );
  if (!data) return (
    <HandleResponse>
      <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <Inbox className="h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">No guest analytics data available</p>
        <p className="text-xs text-gray-500">Guest data will appear here once customers are added.</p>
      </div>
    </HandleResponse>
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Guest Analytics</h1>
        <p className="text-gray-500 mt-2">
          Analyze guest behavior, demographics, and satisfaction
        </p>
      </div>

      <StatGrid stats={stats} />

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
        title="Customer Directory"
        subtitle="All customers and their status"
        columns={columns}
        data={customers}
        actions={actions}
        emptyMessage="No customer data found."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-gray-50"
        onPageChange={handlePageChange}
        currentPage={page}
        toatalRecords={customerData?.totalCustomers ?? customers.length}
        totalPages={totalPages}
      />
    </div>
  );
}
