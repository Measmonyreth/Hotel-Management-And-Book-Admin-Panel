'use client';

import { useState } from "react";
import StatGrid from "@/app/lib/actions/statcard";
import FilterSearch from "@/app/lib/actions/filter_search";
import { useApiAuthenticated } from "@/hooks/useApi";
import buildQueryString from "@/app/lib/actions/buildQueryUrl";
import { Payments } from "../../../types/payment";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import { useRouter } from "next/navigation";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { usePaymentSearch } from "@/hooks/payment_api";

const paymentStatusClasses: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-red-100 text-red-700",
  partially_paid: "bg-yellow-100 text-yellow-700",
  refunded: "bg-gray-100 text-gray-700",
  partially_refund: "bg-blue-100 text-blue-700",
  default: "bg-gray-100 text-gray-700",
};

export default function RevenueReportPage() {
  const size = 10;
  const [filters, setFilters] = useState({
    payment_status: "",
    payment_type: "",
    payment_method: "",
    payment_timing: "",
    search: "",
    page: 1,
    size: size,
    isPage: true,
  });

  const MapFilter: Record<string, Record<string, string>> = {
    payment_status: {
      all: "",
      UNPAID: "UNPAID",
      PARTIALLY_PAID: "PARTIALLY_PAID",
      PAID: "PAID",
      PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED",
      REFUNDED: "REFUNDED",
    },
    payment_type: {
      all: "",
      FULL_PAYMENT: "FULL_PAYMENT",
      DEPOSIT_PAID: "DEPOSIT_PAID",
    },
    payment_method: {
      all: "",
      CREDIT_CARD: "CREDIT_CARD",
      DEBIT_CARD: "DEBIT_CARD",
      MOBILE_PAYMENT: "MOBILE_PAYMENT",
      BANK_TRANSFER: "BANK_TRANSFER",
      PAYPAL: "PAYPAL",
      CASH: "CASH",
    },
    payment_timing: {
      all: "",
      ONLINE_APP: "ONLINE_APP",
      FRONT_DESK: "FRONT_DESK",
      CALL_CENTER: "CALL_CENTER",
      THIRD_PARTY_AGENT: "THIRD_PARTY_AGENT"
    },
      created_date: {
      All: "",
    }
  };

  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [refetchKey, setRefetchKey] = useState(0);
  const [page, setPage] = useState(1);
    const queryString = buildQueryString(submittedFilters);
    const searchParams = new URLSearchParams(queryString);
    searchParams.set("__refetch", String(refetchKey));
    const { data, loading, error } = usePaymentSearch(searchParams.toString());
  const router = useRouter();
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

  const paymentData = data?.data;
  const payments = paymentData?.payments ?? [];
  const totalPages = Math.max(
    1,
    Math.ceil((paymentData?.totalPayment?? 0) / size),
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSubmittedFilters((prev) => ({ ...prev, page: newPage }));
    setRefetchKey((prev) => prev + 1);
  };

  const columns: Column<(typeof payments)[0]>[] = [
    {
      key: "id",
      label: "Payment ID",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="font-medium text-gray-900">{String(value).substring(0, 8)}</span>
      ),
    },
    {
      key: "code",
      label: "Booking Code",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700">{String(value)}</span>
      ),
    },
    {
      key: "paidAmount",
      label: "Amount",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="font-medium text-gray-900">
          {formatCurrency(Number(value) || 0)}
        </span>
      ),
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      width: "whitespace-nowrap",
      render: (value) => {
        const statusClass = paymentStatusClasses[String(value).toLowerCase()] ?? paymentStatusClasses.default;
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {String(value)}
          </span>
        );
      },
    },
    {
      key: "paymentMethod",
      label: "Method",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
  ];

  const actions: Action<(typeof payments)[0]>[] = [
    {
      label: "View",
      color: "blue",
      onClick: (row) =>        router.push(`/dashboard/payments/${row.id}`)
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
        <span className="text-sm font-medium text-gray-600">Loading revenue report...</span>
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
          <p className="font-semibold text-red-800">Error fetching revenue report</p>
          <p className="mt-1 break-words text-red-700">{String(error)}</p>
        </div>
      </div>
    </HandleResponse>
  );
  if (!data) return (
    <HandleResponse>
      <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <Inbox className="h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">No revenue report data available</p>
        <p className="text-xs text-gray-500">Financial records will appear here once payments are processed.</p>
      </div>
    </HandleResponse>
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Revenue Report</h1>
        <p className="text-gray-500 mt-2">
          Track revenue metrics and financial performance
        </p>
      </div>

      {/* Revenue Metrics */}
      <StatGrid
        stats={[
          { label: "Total Revenue", value: formatCurrency(paymentData?.totalRevenue || 0) },
          { label: "Total Refunds", value: formatCurrency(paymentData?.totalRefund || 0) },
          { label: "Paid Transactions", value: paymentData?.numberPaid || 0 },
          { label: "Unpaid Transactions", value: paymentData?.numberUnpaid || 0 },
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
        title="Payment Transactions"
        subtitle={`${payments.length} payment${payments.length === 1 ? "" : "s"}`}
        columns={columns}
        data={payments}
        actions={actions}
        emptyMessage="No payment data found."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-gray-50"
        onPageChange={handlePageChange}
        currentPage={page}
        toatalRecords={paymentData?.totalPayment ?? 0}
        totalPages={totalPages}
      />
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}