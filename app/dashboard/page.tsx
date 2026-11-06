"use client";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { useRooms } from "@/hooks/room_api";
import { useBookings } from "@/hooks/booking_api";
import { usePayments } from "@/hooks/payment_api";
import { useCustomers } from "@/hooks/customer_api";
import { useEmployees } from "@/hooks/employee_api";
import { useSchedules } from "@/hooks/schedule_api";
import { useVipCustomers } from "@/hooks/vip_customer_api";
import { useFloors } from "@/hooks/floor_api";

export default function DashboardPage() {
  const router = useRouter();
  const [greeting, setGreeting] = useState("Good morning");

  // Auth guard: only ADMIN and STAFF are allowed to access the dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      router.replace("/login");
      return;
    }

    // Customers and any other non-admin/staff users go to /rooms
    if (!["ADMIN", "STAFF", "MANAGER"].includes(role)) {
      router.replace("/rooms");
    }
  }, [router]);

  const statusBadge: Record<string, { bg: string; color: string }> = {
    "Checked In": { bg: "#d1fae5", color: "#065f46" },
    Confirmed: { bg: "#dbeafe", color: "#1e40af" },
    Pending: { bg: "#fef9c3", color: "#854d0e" },
    "Checked Out": { bg: "#f1f5f9", color: "#475569" },
    Cancelled: { bg: "#fee2e2", color: "#991b1b" },
  };
  const rooms = useRooms();
  const bookings = useBookings();
  const payments = usePayments();
  const customers = useCustomers();
  const employees = useEmployees();
  const schedules = useSchedules();
  const vipCustomers = useVipCustomers();
  const floors = useFloors();


  // useEffect(() => {
  //   const hour = new Date().getHours();
  //   setGreeting(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');
  // }, []);  // ✅ Empty array - NOT [setGreeting]

  // ✅ FIX 1: Safely extract data with proper fallbacks
  const roomList = Array.isArray(rooms.data?.data?.rooms)
    ? rooms.data.data.rooms
    : Array.isArray(rooms.data)
      ? rooms.data
      : [];

  const bookingList = Array.isArray(bookings.data?.data?.bookResponses)
    ? bookings.data.data.bookResponses
    : Array.isArray(bookings.data)
      ? bookings.data
      : [];

  const paymentList = Array.isArray(payments.data?.data?.payments)
    ? payments.data.data.payments
    : Array.isArray(payments.data)
      ? payments.data
      : [];

  const customerList = Array.isArray(customers.data?.data?.customers)
    ? customers.data.data.customers
    : Array.isArray(customers.data)
      ? customers.data
      : [];

  const employeeList = Array.isArray(employees.data?.data?.employees)
    ? employees.data.data.employees
    : Array.isArray(employees.data)
      ? employees.data
      : [];

  const scheduleList = Array.isArray(schedules.data?.data?.shifts)
    ? schedules.data.data.shifts
    : Array.isArray(schedules.data)
      ? schedules.data
      : [];

  const vipList = Array.isArray(vipCustomers.data?.data?.vipCustomerResponses)
    ? vipCustomers.data.data.vipCustomerResponses
    : Array.isArray(vipCustomers.data)
      ? vipCustomers.data
      : [];

  const floorList = Array.isArray(floors.data?.data?.floors)
    ? floors.data.data.floors
    : Array.isArray(floors.data)
      ? floors.data
      : [];

  // ✅ FIX 2: Proper numeric conversions
  const totalRooms =
    roomList.length || Number(rooms.data?.data?.totalRooms ?? 0);
  const availableRooms = Number(rooms.data?.data?.availableRooms ?? 0);
  const occupiedRooms = Number(rooms.data?.data?.occupiedRooms ?? 0);
  const maintenanceRooms = Number(rooms.data?.data?.maintenanceRooms ?? 0);

  // ✅ FIX 3: KPI data with corrected values
  const kpis = [
    {
      label: "Total Rooms",
      value: String(totalRooms),
      change: `${availableRooms} available now`,
      positive: true,
      color: "bg-blue-100",
      textColor: "text-blue-600",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
        >
          <path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" />
          <path d="M3 21h18" />
          <path d="M9 21V12h6v9" />
        </svg>
      ),
    },
    {
      label: "Paid Bookings",
      value: String(bookings.data?.data?.totalPaid ?? bookingList.length) ,
      change: `${bookingList.length} total records`,
      positive: true,
      color: "bg-green-100",
      textColor: "text-green-600",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: "Today's Revenue",
      value: String(payments.data?.data?.totalRevenue + " $"  ),
      change: `${paymentList.length} payments`,
      positive: true,
      color: "bg-purple-100",
      textColor: "text-purple-600",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
        >
          <rect x="1" y="4" width="22" height="16" rx="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
    {
      label: "Occupancy Rate",
      value: `${totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0}%`,
      change: `${vipList.length} VIP guests`,
      positive: totalRooms ? occupiedRooms / totalRooms > 0.7 : false,
      color: "bg-amber-100",
      textColor: "text-amber-600",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
        >
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
  ];

  const roomStatus = [
    { label: "Available", count: availableRooms, color: "bg-green-500" },
    { label: "Occupied", count: occupiedRooms, color: "bg-blue-500" },
    { label: "Maintenance", count: maintenanceRooms, color: "bg-amber-500" },
  ];

  const hotelSummary = [
    { label: "Customers", value: customerList.length },
    { label: "Employees", value: employeeList.length },
    { label: "VIP", value: vipList.length },
    { label: "Floors", value: floorList.length },
    { label: "Schedules", value: scheduleList.length },
  ];

  const activity = [
    {
      msg: `${bookingList.length} bookings are currently tracked in the hotel system.`,
      time: "Just now",
      dot: "#3b82f6",
    },
    {
      msg: `${availableRooms} rooms are available for check-in today.`,
      time: "Today",
      dot: "#10b981",
    },
    {
      msg: `${vipList.length} VIP guests are registered in the system.`,
      time: "This week",
      dot: "#a855f7",
    },
  ];

  // ✅ FIX 4: Properly check loading and error states
  const isLoading = [
    rooms.loading,
    bookings.loading,
    payments.loading,
    customers.loading,
    employees.loading,
    schedules.loading,
    vipCustomers.loading,
    floors.loading,
  ].some(Boolean);

  const hasError = [
    rooms.error,
    bookings.error,
    payments.error,
    customers.error,
    employees.error,
    schedules.error,
    vipCustomers.error,
    floors.error,
  ].some(Boolean);

  if (isLoading) {
    return (
      <HandleResponse>
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
        >
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-sm font-medium text-gray-600">
            Loading dashboard data...
          </span>
        </div>
      </HandleResponse>
    );
  }

  if (hasError) {
    return (
      <HandleResponse>
        <div
          role="alert"
          className="flex w-full max-w-md items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="text-sm">
            <p className="font-semibold text-red-800">
              Error loading dashboard data
            </p>
            <p className="mt-1 break-words text-red-700">
              Some API endpoints are not responding. Please try again later.
            </p>
          </div>
        </div>
      </HandleResponse>
    );
  }

  if (!bookingList.length && !roomList.length && !customerList.length && !employeeList.length && !vipList.length && !floorList.length && !paymentList.length && !scheduleList.length) {
    return (
      <HandleResponse>
        <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <Inbox className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            No dashboard data available
          </p>
          <p className="text-xs text-gray-500">
            Hotel analytics will appear here once the backend data is available.
          </p>
        </div>
      </HandleResponse>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
     <div className="relative flex items-center justify-between overflow-hidden rounded-[32px] border border-gray-200/80 bg-white/70 p-8 shadow-xl backdrop-blur-2xl">
  <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-fuchsia-300/30 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />

  <div className="relative">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
      {greeting},
    </p>
    <h2 className="mt-1 text-4xl font-bold tracking-tight text-gray-900">
      Hotel <span className="text-blue-600">Management</span> 👋
    </h2>
    <p className="mt-2 text-sm text-gray-500">Live overview from the hotel management services.</p>
  </div>

  <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
    <svg viewBox="0 0 24 24" className="h-11 w-11" fill="none">
      <path d="M6 4v16M18 4v16M6 12h12" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <circle cx="18" cy="4" r="1.5" fill="#FCD34D" />
    </svg>
  </div>
</div>

      {/* Error Banner */}
      {hasError && (
        <div className="rounded-lg border border-orange-300 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-900">
          Some API endpoints are not responding. Showing partial data from
          available routes.
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-700">
          Loading dashboard data...
        </div>
      ) : (
        <>
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-4 gap-4">
            {kpis.map((k) => (
              <div
                key={k.label}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {k.label}
                  </p>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${k.color} ${k.textColor}`}
                  >
                    {k.icon}
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{k.value}</p>
                  <p
                    className={`mt-1 text-xs font-semibold ${k.positive ? "text-green-600" : "text-red-600"}`}
                  >
                    {k.positive ? "↑" : "↓"} {k.change}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Recent Bookings Table */}
            <div className="col-span-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <p className="font-semibold text-gray-900">Recent Bookings</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Live bookings from the backend
                  </p>
                </div>
                <a
                  href="/dashboard/booking"
                  className="inline-block rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                >
                  View all →
                </a>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {[
                        "Booking Code",
                        "Guest",
                        "Room",
                        "Check-In",
                        "Check-Out",
                        "Status",
                        "Amount",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* ✅ FIX 5: Show actual bookings from API data */}
                    {bookingList
                      .slice(0, 5)
                      .map((booking: any, index: number) => {
                        const bookingStatus = String(
                          booking?.status ??
                            booking?.book_status ??
                            booking?.payment_status ??
                            "Pending",
                        );
                        const badge = statusBadge[bookingStatus] ?? {
                          bg: "#e5e7eb",
                          color: "#6b7280",
                        };

                        return (
                          <tr
                            key={`${booking.id || booking.code || index}-${index}`}
                            className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                          >
                            <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                              {booking.code || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                              {booking.guestName ||
                                booking.guest ||
                                booking.customer?.name ||
                                "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              #
                              {booking.roomId ||
                                booking.room ||
                                booking.roomNumber ||
                                "N/A"}
                              <span className="text-xs text-gray-500">
                                ({booking.roomType || "Standard"})
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {booking.checkInDate ||
                                booking.checkIn ||
                                booking.bookItems?.[0]?.check_in_date ||
                                "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {booking.checkOutDate ||
                                booking.checkOut ||
                                booking.bookItems?.[0]?.check_out_date ||
                                "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className="inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold"
                                style={{
                                  backgroundColor: badge.bg,
                                  color: badge.color,
                                }}
                              >
                                {bookingStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                              {booking.totalAmount ||
                                booking.amount ||
                                booking.totalBooking ||
                                0}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Room Availability */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="mb-4 font-semibold text-gray-900">
                  Room Availability
                </p>
                <div className="flex flex-col gap-4">
                  {roomStatus.map((room) => (
                    <div key={room.label}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          {room.label}
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{
                            color: room.color
                              .replace("bg-", "#")
                              .replace("500", "600"),
                          }}
                        >
                          {room.count}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                        {/* ✅ FIX 6: Fixed width calculation with room.count */}
                        <div
                          className={`h-full rounded-full transition-all duration-400 ${room.color}`}
                          style={{
                            width: `${totalRooms ? (room.count / totalRooms) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="flex flex-1 flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="mb-4 font-semibold text-gray-900">
                  Recent Activity
                </p>
                <div className="flex flex-col gap-0">
                  {activity.map((entry, index) => (
                    <div
                      key={`${entry.msg}-${index}`}
                      className={`flex gap-3 py-3 ${index !== 0 ? "border-t border-gray-100 pt-3" : ""}`}
                    >
                      <div
                        className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: entry.dot }}
                      />
                      <div>
                        <p className="text-xs leading-relaxed text-gray-600">
                          {entry.msg}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {entry.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Metrics */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-4 font-semibold text-gray-900">Hotel Metrics</p>
            <div className="grid grid-cols-5 gap-3">
              {hotelSummary.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                >
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
