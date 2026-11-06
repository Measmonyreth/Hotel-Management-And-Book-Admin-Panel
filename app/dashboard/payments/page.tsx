"use client";

import { usePaymentSearch } from "@/hooks/payment_api";
import type { Payment } from "../../types/payment";
import { useRouter } from "next/navigation";
import buildQueryString from "@/app/lib/actions/buildQueryUrl";
import { useEffect, useState } from "react";
import FilterSearch from "@/app/lib/actions/filter_search";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import CreatePayment, {
  createpaymentFormValue,
} from "./_components/createPayment";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";

function formatAmount(amount: number, currency: string) {
  const currencyCode = /^[A-Za-z]{3}$/.test(currency)
    ? currency.toUpperCase()
    : "USD";

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(parsedDate);
}

export default function PaymentsPage() {
  const router = useRouter();
  const size = 10;
  const [filters, setFilters] = useState({
    payment_status: "",
    search: "",
    page: 1,
    size,
    isPage: true,
  });

  const MapFilter: Record<string, Record<string, string>> = {
    payment_status: {
      All: "",
      UNPAID: "UNPAID",
      PARTIALLY_PAID: "PARTIALLY_PAID",
      PAID: "PAID",
      PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED",
      REFUNDED: "REFUNDED",
    },
    created_date: {
      All: "",
    },
  };

  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [refetchKey, setRefetchKey] = useState(0);
  const [page, setPage] = useState(1);
  const [createRefundOpen, setCreateRefundOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment>();

  const queryString = buildQueryString(submittedFilters);
  const searchParams = new URLSearchParams(queryString);
  searchParams.set("__refetch", String(refetchKey));
  const { data, loading, error } = usePaymentSearch(searchParams.toString());
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

  const paymentsData = data?.data;
  const payments: Payment[] = paymentsData?.payments ?? [];
  const totalRecord = data?.data.totalPayment ?? 0;
  const totalPage = Math.max(1, Math.ceil(totalRecord / size));
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSubmittedFilters((prev) => ({ ...prev, page: newPage }));
    setRefetchKey((prev) => prev + 1);
  };

  const applyFilters = () => {
    const nextFilters = { ...filters, page: 1 };
    setPage(1);
    setFilters(nextFilters);
    setSubmittedFilters(nextFilters);
    setRefetchKey((prev) => prev + 1);
  };
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("role") === "ADMIN");
  }, []);
  const [refund, setRefund] = useState<Payment | undefined>(undefined);

  const columns: Column<Payment>[] = [
    {
      key: "code",
      label: "Payment",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="font-medium text-gray-900">
          {String(value) || "—"}
        </span>
      ),
    },
    {
      key: "book",
      label: "book code",
      width: "whitespace-nowrap",
      render: (_, row) => (
        <span className="font-medium text-gray-900">
          {row.book?.code || "—"}
        </span>
      ),
    },
    {
      key: "paidAmount",
      label: "Paid Amount",
      width: "whitespace-nowrap",
      render: (_, row) => (
        <span className="font-medium text-gray-900">
          {formatAmount(row.paidAmount, row.currency)}
        </span>
      ),
    },
    {
      key: "refundedAmount",
      label: "Refund Amount",
      width: "whitespace-nowrap",
      render: (_, row) => (
        <span className="font-medium text-gray-900">
          {formatAmount(row.refundedAmount, row.currency)}
        </span>
      ),
    },

    {
      key: "paymentStatus",
      label: "Status",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset">
          {String(value)}
        </span>
      ),
    },
    {
      key: "paymentMethod",
      label: "Method",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700">{String(value) || "—"}</span>
      ),
    },
    {
      key: "paymentDate",
      label: "Paid on",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700">{formatDate(String(value))}</span>
      ),
    },
  ];

  const actions = (row: Payment): Action<Payment>[] => [
    {
      label: "View",
      color: "blue",
      onClick: (payment) => {
        router.push(`/dashboard/payments/${payment.id}`);
      },
    },
    ...(isAdmin && row.paymentStatus.toUpperCase() !== "REFUNDED"
      ? [
          {
            label: "Refund",
            color: "green" as const,
            onClick: (payment: Payment) => {
              setSelectedPayment(payment);
              setCreateRefundOpen(true);
            },
          },
        ]
      : []),
  ];

  if (loading) {
    return (
      <HandleResponse>
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
        >
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-sm font-medium text-gray-600">
            Loading payments...
          </span>
        </div>
      </HandleResponse>
    );
  }

  if (error) {
    return (
      <HandleResponse>
        <div
          role="alert"
          className="flex w-full max-w-md items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="text-sm">
            <p className="font-semibold text-red-800">
              Error fetching payments
            </p>
            <p className="mt-1 break-words text-red-700">{String(error)}</p>
          </div>
        </div>
      </HandleResponse>
    );
  }

  if (!data) {
    return (
      <HandleResponse>
        <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <Inbox className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            No payment data available.
          </p>
          <p className="text-xs text-gray-500">
            Payment activity will appear here once transactions are recorded.
          </p>
        </div>
      </HandleResponse>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* <div>
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
          Overview
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">Payments</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review payment activity and outstanding transactions.
        </p>
      </div> */}

      <CreatePayment
        open={createRefundOpen}
        paymentlist={selectedPayment}
        onClosed={() => {
          setCreateRefundOpen(false);
          setSelectedPayment(undefined);
        }}
        onSubmit={() => {
          setCreateRefundOpen(false);
          setSelectedPayment(undefined);
          setRefetchKey((prev) => prev + 1);
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
            applyFilters();
          }
        }}
      />

      <WidgetTable
        title="Recent Payments"
        subtitle={`${totalRecord} transaction${totalRecord === 1 ? "" : "s"}`}
        columns={columns}
        data={payments}
        actions={actions}
        emptyMessage="No payments found."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-gray-50"
        onPageChange={handlePageChange}
        currentPage={page}
        toatalRecords={totalRecord}
        totalPages={totalPage}
      />
    </div>
  );
}
