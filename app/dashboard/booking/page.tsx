"use client";

import { useApiAuthenticated } from "@/hooks/useApi";
import type { Booking, BookItem, BookResponse } from "../../types/book";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import buildQueryString from "@/app/lib/actions/buildQueryUrl";
import FilterSearch from "@/app/lib/actions/filter_search";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import CreateBooking from "./_components/createbooking";
import PayAndTopupBooking from "./_components/pay&topupBooking";
import { Handlee } from "next/font/google";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { useBookingSearch } from "@/hooks/booking_api";
import { DeleteBookDailog } from "./_components/DeleteBookDailog";
import UpdateBookingStatus from "./_components/UpdateBookingStatus";
import Image from "next/image";
import CreateButton from "@/components/ui/CreateButton";

function formatDate(value?: string) {
  if (!value) return "—";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export default function BookingPage() {
  const router = useRouter();
  const size = 10; // Number of records per page
  const [filters, setFilters] = useState({
    book_status: "",
    search: "",
    page: 1,
    size: size,
    isPage: true,
  });

  const MapFilter: Record<string, Record<string, string>> = {
    book_status: {
      All: "",
      PENDING: "PENDING",
      CONFIRMED: "CONFIRMED",
      CHECKED_IN: "CHECKED_IN",
      CHECKED_OUT: "CHECKED_OUT",
      CANCELLED: "CANCELLED",
      COMPLETED: "COMPLETED",
      UPCOMING: "UPCOMING",
    },
    created_date: {
      All: "",
    },
  };

  const handleCreateBooking = (value: FormData) => {
    console.log("Creating booking with data:", value);
  };

  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [refetchKey, setRefetchKey] = useState(0);

  const queryString = buildQueryString(submittedFilters);

  const baseUrl = `/api/book/search`;
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
  // Properly construct URL with refetch parameter
  const urlWithRefetch = `${url}${queryString ? "&" : "?"}__refetch=${refetchKey}`;
  //  const { data, loading, error } = useApiAuthenticated<Booking>(urlWithRefetch);
  const bookingsearch = useBookingSearch(urlWithRefetch);
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
  const [createBookingOpen, setCreateBookingOpen] = useState(false);
  const [payAndTopupBookingOpen, setPayAndTopupBookingOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null,
  );
  const [deleteBookingOpen, setDeleteBookingOpen] = useState(false);
  const [statusBooking, setStatusBooking] = useState<BookResponse | null>(null);
  const bookingData = bookingsearch.data?.data;
  const bookings: BookResponse[] = bookingData?.bookResponses ?? [];
  const [page, setPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("role") === "ADMIN");
  }, []);

  const totalpage = Math.max(
    1,
    Math.ceil((bookingData?.totalBooking ?? 0) / size),
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSubmittedFilters((prev) => ({ ...prev, page: newPage }));
    setRefetchKey((prev) => prev + 1);
  };

  const columns: Column<BookResponse>[] = [
    {
      key: "code",
      label: "Booking",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="font-medium text-gray-900">{String(value)}</span>
      ),
    },
    {
      key: "customer",
      label: "Guest",
      width: "whitespace-nowrap",
      render: (value, row) => (
        <span className="text-gray-900">{row.customer?.name ?? "N/A"}</span>
      ),
    },
    {
      key: "bookItems",
      label: "Room",
      width: "whitespace-nowrap",
      render: (value, row) => (
        <span className="text-gray-900">
          {row.bookItems[0]?.room?.name ?? "N/A"}
        </span>
      ),
    },
    {
      key: "checkInDate",
      label: "checkIn Date",
      width: "whitespace-nowrap",
      render: (value, row) => (
        <span className="text-gray-900">{`${formatDate(row.checkInDate)} `}</span>
      ),
    },
    {
      key: "checkOutDate",
      label: "checkIn Date",
      width: "whitespace-nowrap",
      render: (value, row) => (
        <span className="text-gray-900">{`${formatDate(row.checkOutDate)} `}</span>
      ),
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-900">
          {value ?? "N/A"} <b>$</b>
        </span>
      ),
    },
    {
      key: "book_status",
      label: "Status",
      hindenIcon:(row) => String(row.book_status) !== "COMPLETED",
      width: "whitespace-nowrap",
      icon: (
        <Image
          src="/icons/edit.png"
          alt=""
          width={24}
          height={24}
          className="h-6 w-6 shrink-0 object-contain"
        />
      ),
      onIconClick: (booking) => {
        if (booking.bookItems.length > 0) setStatusBooking(booking);
      },
      render: (value) => (
        <span className="text-gray-900">{String(value) ?? "N/A"}</span>
      ),
    },
    {
      key: "payment_status",
      label: "Payment",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-900">{String(value) ?? "N/A"}</span>
      ),
    },
  ];

  const getBookingActions = (row: BookResponse): Action<BookResponse>[] => {
    const paymentStatus = String(row.payment_status ?? "").toUpperCase();
    const actionsForRow: Action<BookResponse>[] = [
      {
        label: "View",
        color: "blue",
        onClick: (booking) => {
          router.push(`/dashboard/booking/${booking.id}`);
        },
      },
    ];

    if (paymentStatus !== "PAID") {
      actionsForRow.push({
        label: "Top Up / Pay",
        color: "green",
        onClick: (booking) => {
          if (!booking.id) return;

          setSelectedBookingId(booking.id);
          setPayAndTopupBookingOpen(true);
        },
      });
    }

    if (isAdmin) {
      actionsForRow.push({
        label: "Delete",
        color: "red",
        onClick: (booking) => {
          setDeleteBookingOpen(true);
          setSelectedBookingId(booking.id);
        },
      });
    }

    return actionsForRow;
  };

  if (bookingsearch.loading) {
    return (
      <HandleResponse>
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
        >
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-sm font-medium text-gray-600">
            Loading bookings...
          </span>
        </div>
      </HandleResponse>
    );
  }

  if (bookingsearch.error) {
    return (
      <HandleResponse>
        <div
          role="alert"
          className="flex w-full max-w-md items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="text-sm">
            <p className="font-semibold text-red-800">
              Error fetching bookings
            </p>
            <p className="mt-1 break-words text-red-700">
              {String(bookingsearch.error)}
            </p>
          </div>
        </div>
      </HandleResponse>
    );
  }

  // if (!bookingData || bookingsearch.data?.data?.totalBooking === 0) {
  //   return (
  //     <HandleResponse>
  //       <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
  //         <Inbox className="h-8 w-8 text-gray-400" />
  //         <p className="text-sm font-medium text-gray-700">
  //           No booking data available
  //         </p>
  //         <p className="text-xs text-gray-500">
  //           New bookings will appear here once they're created.
  //         </p>
  //       </div>
  //     </HandleResponse>
  //   );
  // }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-end">
        {/* <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Overview
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">
            Bookings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track room reservations, payment status, and booking progress.
          </p>
        </div> */}

        <CreateButton
          label="New Booking"
          onClick={() => setCreateBookingOpen(true)}
        />

        {createBookingOpen && (
          <CreateBooking
            open={createBookingOpen}
            onClose={() => {
              setCreateBookingOpen(false);
              setRefetchKey((prev) => prev + 1);
            }}
          />
        )}
      </div>

      {payAndTopupBookingOpen && selectedBookingId !== null && (
        <PayAndTopupBooking
          open={payAndTopupBookingOpen}
          bookingId={selectedBookingId}
          onClose={() => {
            setPayAndTopupBookingOpen(false);
            setSelectedBookingId(null);
            setRefetchKey((prev) => prev + 1);
          }}
        />
      )}

      {deleteBookingOpen && selectedBookingId !== null && (
        <DeleteBookDailog
          open={deleteBookingOpen}
          bookingId={selectedBookingId}
          onClose={() => {
            setDeleteBookingOpen(false);
            setSelectedBookingId(null);
            setRefetchKey((prev) => prev + 1);
          }}
        />
      )}

      {statusBooking && (
        <UpdateBookingStatus
          booking={statusBooking}
          onClose={() => setStatusBooking(null)}
          onUpdated={() => setRefetchKey((prev) => prev + 1)}
        />
      )}

      {/* Booking Stats */}
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
        title="Recent Bookings"
        subtitle="Bookings"
        columns={columns}
        data={bookings}
        actions={(row) => getBookingActions(row)}
        emptyMessage="No bookings found."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-blue-50"
        onPageChange={handlePageChange}
        currentPage={page}
        toatalRecords={bookingData?.totalBooking ?? 0}
        totalPages={totalpage}
      />
    </div>
  );
}
