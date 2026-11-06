"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DataEmployee } from "../types/employee";
import { EmployeeResponse } from "../types/personal";
import { usePersonalInfo } from "@/hooks/personal_api";
import Image from "next/image";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userInitials?: string;
}

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <Image
        src="/icons/dashboard.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
    adminOnly: true,
  },
  {
    label: "Booking",
    href: "/dashboard/booking",
    icon: (
      <Image
        src="/icons/book.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
  },
  {
    label: "Rooms",
    href: "/dashboard/rooms",
    icon: (
      <Image
        src="/icons/room.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
    icon: (
      <Image
        src="/icons/customer.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
  },
  {
    label: "Employees",
    href: "/dashboard/employees",
    icon: (
      <Image
        src="/icons/employee.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
    adminOnly: true,
  },
  {
    label: "Floors",
    href: "/dashboard/floors",
    icon: (
      <Image
        src="/icons/floor.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
    adminOnly: true,
  },
  {
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: (
      <Image
        src="/icons/task.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
    adminOnly: true,
  },
  {
    label: "Schedules",
    href: "/dashboard/schedules",
    icon: (
      <Image
        src="/icons/schedule.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
    adminOnly: true,
  },
  {
    label: "VIP",
    href: "/dashboard/vip",
    icon: (
      <Image
        src="/icons/vipcard.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
    adminOnly: true,
  },
  {
    label: "Payments",
    href: "/dashboard/payments",
    icon: (
      <Image
        src="/icons/payment.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
  },
  {
    label: "Notifications",
    href: "/dashboard/notification",
    icon: (
      <Image
        src="/icons/notification_.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
  },
  {
    label: "Request",
    href: "/dashboard/customer_request",
    icon: (
      <Image
        src="/icons/request_1.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
  },
];

const reportItems = [
  {
    label: "Booking Reports",
    href: "/dashboard/reports/booking",
    icon: (
      <Image
        src="/icons/iconreport.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
  },
  {
    label: "Revenue Reports",
    href: "/dashboard/reports/revenue",
    icon: (
      <Image
        src="/icons/iconreport.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
  },
  {
    label: "Occupancy Reports",
    href: "/dashboard/reports/occupancy",
    icon: (
      <Image
        src="/icons/iconreport.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
  },
  {
    label: "Employee Reports",
    href: "/dashboard/reports/employee",
    adminOnly: true,
    icon: (
      <Image
        src="/icons/iconreport.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
  },
  {
    label: "Guest Analytics",
    href: "/dashboard/reports/guest-analytics",
    adminOnly: true,
    icon: (
      <Image
        src="/icons/iconreport.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
  },
  {
    label: "VIP Customer Report",
    href: "/dashboard/reports/vip-customer",
    adminOnly: true,
    icon: (
      <Image
        src="/icons/iconreport.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
  },
  {
    label: "Task Report",
    href: "/dashboard/reports/task",
    icon: (
      <Image
        src="/icons/iconreport.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
    adminOnly: true,
  },
  {
    label: "Notification Report",
    href: "/dashboard/reports/notification",
    icon: (
      <Image
        src="/icons/iconreport.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
      />
    ),
    adminOnly: true,
  },
];

const profileMenu = [
  { icon: "👤", label: "Profile", href: "/dashboard/personal" },
  { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
  { icon: "🚪", label: "Logout", href: "/logout" },
];

export default function DashboardLayout({
  children,
  userName = "John Doe",
  userInitials = "JD",
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const router = useRouter();
  const { employee, error, loading } = usePersonalInfo();
  // Auth guard: ADMIN, MANAGER, and STAFF can access the dashboard.

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    if (!localStorage.getItem("token") || !storedRole) {
      router.replace("/login");
      return;
    }
    if (!storedRole || !["ADMIN", "MANAGER", "STAFF"].includes(storedRole)) {
      router.replace("/rooms");
    }
  }, [router]);

  // The role loaded from the authenticated session is authoritative. A default
  // `userRole` prop must not grant staff access to admin-only navigation.
  const canAccessAdminRoutes = role === "ADMIN" || role === "MANAGER";

  const visibleMenuItems = menuItems.filter(
    (item) => !item.adminOnly || canAccessAdminRoutes,
  );
  const visibleReportItems = reportItems.filter(
    (item) => !item.adminOnly || canAccessAdminRoutes,
  );
  const title =
    [...visibleMenuItems, ...visibleReportItems, ...profileMenu]
      .filter(
        (item) =>
          pathname === item.href || pathname.startsWith(`${item.href}/`),
      )
      .sort((a, b) => b.href.length - a.href.length)[0]?.label ?? "Dashboard";

  // ...rest of the component...

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 min-h-0 flex-col overflow-hidden bg-white shadow-lg transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-6">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-extrabold text-white shadow-lg shadow-blue-500/30">
            H{/* small gold accent */}
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-300" />
          </div>

          <div className="leading-tight">
            <div className="text-lg font-bold tracking-wide text-gray-900">
              HOTEL<span className="text-blue-600">PRO</span>
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
              Management
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-6">
          <ul className="space-y-2">
            {visibleMenuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}

            {/* Reports Dropdown */}
            <li>
              <button
                onClick={() => setReportsOpen(!reportsOpen)}
                className={`cursor-pointer w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors`}
              >
                <Image
                  src="/icons/report.png"
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 shrink-0 object-contain"
                />{" "}
                <span className="flex-1 text-left">Reports</span>
                {reportsOpen ? (
                  <Image
                    src="/icons/arrow_up.png"
                    alt=""
                    width={14}
                    height={14}
                    className="h-4 w-4 shrink-0 object-contain"
                  />
                ) : (
                  <Image
                    src="/icons/arrow_down.png"
                    alt=""
                    width={14}
                    height={14}
                    className="h-5 w-5 mr-5 shrink-0 object-contain"
                  />
                )}
                {/* <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    reportsOpen ? 'rotate-180' : ''
                  }`}
                /> */}
              </button>

              {/* Dropdown Menu */}
              {reportsOpen && (
                <ul className="mt-2 ml-4 space-y-1 border-l-2 border-gray-200 pl-2">
                  {visibleReportItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
                            isActive
                              ? "bg-blue-100 text-blue-700"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        {/* User Profile Section */}
      </aside>

      {/* Main Content */}
      <div className=" flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            >
              <span className="text-xl">☰</span>
            </button>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {title}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-6">
            {/* Icons */}
            <button className="rounded-lg p-2 hover:bg-gray-100">🌙</button>
            <button className="relative rounded-lg p-2 hover:bg-gray-100">
              🔔
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* User Avatar */}
            {openProfile == false ? (
              <div className="border rounded-2xl border-gray-200">
                <button
                  className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-gray-100"
                  onClick={() => setOpenProfile(true)}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                    {employee?.name.charAt(0).toUpperCase()}
                    {employee?.name.split(" ")[1]?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-semibold text-gray-900">
                      {employee?.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {employee?.employeeId}
                    </div>
                  </div>
                  <span className="text-gray-400">▼</span>
                </button>
              </div>
            ) : (
              <div className="relative border rounded-2xl border-gray-200">
                <button
                  className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-gray-100"
                  onClick={() => setOpenProfile(false)}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                    {employee?.name.charAt(0).toUpperCase()}
                    {employee?.name.split(" ")[1]?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-semibold text-gray-900">
                      {employee?.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {employee?.employeeId}
                    </div>
                  </div>
                  <span className="text-gray-400">▲</span>
                </button>{" "}
                {openProfile && (
                  <div className="absolute top-16 right-6 rounded-2xl bg-white border border-gray-300 p-4 shadow-xl z-50 w-64">
                    <div>
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                            {employee?.name.charAt(0).toUpperCase()}
                            {employee?.name
                              .split(" ")[1]
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="text-left flex-1">
                            <div className="text-sm font-semibold text-gray-900">
                              {employee?.username}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {employee?.employeeId}
                            </div>
                          </div>
                        </div>
                      </div>

                      {profileMenu.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
