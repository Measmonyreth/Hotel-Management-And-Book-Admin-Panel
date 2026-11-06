"use client";

import StatGrid from "@/app/lib/actions/statcard";
import { useApiAuthenticated } from "@/hooks/useApi";
import buildQueryString from "@/app/lib/actions/buildQueryUrl";
import { useState } from "react";
import { Booking } from "../../../types/book";
import FilterSearch from "@/app/lib/actions/filter_search";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import { useRouter } from "next/navigation";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { config } from "@/config";
import { useBookingSearch } from "@/hooks/booking_api";

const statusClasses: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  checked_in: "bg-blue-100 text-blue-700",
  checked_out: "bg-gray-100 text-gray-700",
  default: "bg-gray-100 text-gray-700",
};

const paymentStatusClasses: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-red-100 text-red-700",
  partially_paid: "bg-yellow-100 text-yellow-700",
  refunded: "bg-gray-100 text-gray-700",
  partially_refund: "bg-blue-100 text-blue-700",
  default: "bg-gray-100 text-gray-700",
};

export default function BookingReportPage() {
  const size = 10;
  const [filters, setFilters] = useState({
    payment_status: "",
    book_status: "",
    search: "",
    page: 1,
    size,
    isPage: true,
  });
  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [refetchKey, setRefetchKey] = useState(0);
  const [page, setPage] = useState(1);
  const queryString = buildQueryString(submittedFilters);
  const url = queryString
    ? `${config.apiUrl}/api/book/search?${queryString}`
    : `${config.apiUrl}/api/book/search`;
  const urlWithRefetch = `${url}${queryString ? "&" : "?"}__refetch=${refetchKey}`;
  const { data, loading, error } = useBookingSearch(urlWithRefetch);
  const router = useRouter();

  const bookingData = data?.data;
  const bookings = bookingData?.bookResponses ?? [];
  const totalPages = Math.max(
    1,
    Math.ceil((bookingData?.totalBooking ?? bookings.length) / size),
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
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSubmittedFilters((prev) => ({ ...prev, page: newPage }));
    setRefetchKey((prev) => prev + 1);
  };

  const MapFilter = {
    payment_status: {
      all: "",
      PAID: "PAID",
      UNPAID: "UNPAID",
      PARTIALLY_PAID: "PARTIALLY_PAID",
      REFUNDED: "REFUNDED",
      PARTIALLY_REFUND: "PARTIALLY_REFUND",
    },
    book_status: {
      all: "",
      PENDING: "PENDING",
      CONFIRMED: "CONFIRMED",
      CHECK_IN: "CHECK_IN",
      CHECK_OUT: "CHECK_OUT",
      CANCELLED: "CANCELLED",
      COMPLETED: "COMPLETED",
      UPCOMING: "UPCOMING",
    },
    created_date: {
      All: "",
    },
  };

  const columns: Column<(typeof bookings)[0]>[] = [
    {
      key: "code",
      label: "Booking Code",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="font-medium text-gray-900">{String(value)}</span>
      ),
    },
    {
      key: "customer",
      label: "Guest",
      width: "whitespace-nowrap",
      render: (_, row) => (
        <span className="text-gray-700">{row.customer?.name ?? "N/A"}</span>
      ),
    },
    {
      key: "book_status",
      label: "Status",
      width: "whitespace-nowrap",
      render: (value) => {
        const statusClass =
          statusClasses[String(value).toLowerCase()] ?? statusClasses.default;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}`}
          >
            {String(value)}
          </span>
        );
      },
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="font-medium text-gray-900">
          ${(Number(value) || 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: "bookItems",
      label: "Quantity",
      width: "whitespace-nowrap",
      render: (_, row) => (
        <span className="text-gray-700">{row.bookItems?.length ?? 0}</span>
      ),
    },
    {
      key: "payment_status",
      label: "Payment Status",
      width: "whitespace-nowrap",
      render: (value) => {
        const statusClass =
          paymentStatusClasses[String(value).toLowerCase()] ??
          paymentStatusClasses.default;
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

  const actions: Action<(typeof bookings)[0]>[] = [
    {
      label: "View",
      color: "blue",
      onClick: (booking) => {
        router.push(`/dashboard/booking/${booking.id}`);
      },
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
        <span className="text-sm font-medium text-gray-600">Loading booking report...</span>
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
            <p className="font-semibold text-red-800">Error fetching booking report</p>
            <p className="mt-1 break-words text-red-700">{String(error)}</p>
          </div>
        </div>
      </HandleResponse>
    );
  if (!data) return (
    <HandleResponse>
      <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <Inbox className="h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">No booking report data available</p>
        <p className="text-xs text-gray-500">Booking analytics will appear here once bookings are created.</p>
      </div>
    </HandleResponse>
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Booking Report</h1>
        <p className="text-gray-500 mt-2">
          View and analyze booking statistics
        </p>
      </div>

      {/* Booking Stats */}
      <StatGrid
        stats={[
          { label: "Total Bookings", value: bookingData?.totalBooking || 0 },
          { label: "Paid", value: bookingData?.totalPaid || 0 },
          { label: "Unpaid", value: bookingData?.totalUnpaid || 0 },
          { label: "Cancelled", value: bookingData?.totalCancel || 0 },
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
        title="Booking Details"
        subtitle="All bookings and their status"
        columns={columns}
        data={bookings}
        actions={actions}
        emptyMessage="No bookings found."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-blue-50"
        onPageChange={handlePageChange}
        currentPage={page}
        toatalRecords={bookingData?.totalBooking ?? bookings.length}
        totalPages={totalPages}
      />
    </div>
  );
}
