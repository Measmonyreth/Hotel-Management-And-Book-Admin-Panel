"use client";

import {
  AlertCircle,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  MapPin,
  Phone,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { usePersonalInfo } from "@/hooks/personal_api";

function displayValue(value: unknown) {
 if (value == null || value === "") return "—";

    const time = String(value).trim();

    const twelveHour = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (twelveHour) {
      return `${twelveHour[1]}:${twelveHour[2]} ${twelveHour[3].toUpperCase()}`;
    }

    const twentyFourHour = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (twentyFourHour) {
      const hour = Number(twentyFourHour[1]);
      const period = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;

      return `${hour12}:${twentyFourHour[2]} ${period}`;
    }

    return time;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function Detail({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="min-w-0 border-b border-slate-100 py-3 last:border-b-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-medium text-slate-900">
        {displayValue(value)}
      </dd>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-3">
        <span className="text-blue-600">{icon}</span>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default  function PersonalPage() {

  const { employee, error, loading } = usePersonalInfo();



  //console.log(employee);
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse space-y-5">
        <div className="h-36 rounded-xl bg-slate-200" />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-64 rounded-xl bg-slate-200" />
          <div className="h-64 rounded-xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-rose-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <div>
            <h1 className="font-semibold text-slate-900">Profile unavailable</h1>
            <p className="mt-1 text-sm text-slate-600">{error ?? "Employee profile was not found."}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isActive = employee.status.toUpperCase() === "ACTIVE";

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-8">
      <header className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="h-2 bg-blue-600" />
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl font-semibold text-blue-700 ring-1 ring-blue-100">
            {employee.name.charAt(0) || <UserRound className="h-7 w-7" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Team member profile
            </p>
            <h1 className="mt-1 break-words text-2xl font-semibold text-slate-950">
              {employee.name}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {employee.role} <span className="px-1 text-slate-300">/</span> {employee.employeeId}
            </p>
          </div>
          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
              isActive
                ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                : "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-600" : "bg-amber-600"}`} />
            {employee.status}
          </span>
        </div>
        <div className="grid grid-cols-1 border-t border-slate-100 sm:grid-cols-3">
          <div className="flex items-center gap-3 px-5 py-3 sm:px-7">
            <UserRound className="h-4 w-4 text-blue-600" />
            <span className="truncate text-sm text-slate-700">{employee.username}</span>
          </div>
          <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-3 sm:border-l sm:border-t-0 sm:px-7">
            <Phone className="h-4 w-4 text-blue-600" />
            <span className="truncate text-sm text-slate-700">{displayValue(employee.phone)}</span>
          </div>
          <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-3 sm:border-l sm:border-t-0 sm:px-7">
            <BriefcaseBusiness className="h-4 w-4 text-blue-600" />
            <span className="truncate text-sm text-slate-700">{employee.shift?.shift}</span>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Personal details" icon={<UserRound className="h-4 w-4" />}>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Detail label="Full name" value={employee.name} />
            <Detail label="Employee ID" value={employee.employeeId} />
            <Detail label="Username" value={employee.username} />
            <Detail label="Phone" value={employee.phone} />
            <Detail label="Role" value={employee.role} />
            <Detail label="Account status" value={employee.status} />
          </dl>
        </Section>

        <Section title="Work schedule" icon={<Clock3 className="h-4 w-4" />}>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Detail label="Shift" value={employee.shift?.shift} />
            <Detail label="Working days" value={employee.shift?.dayWork} />
            <Detail label="Day off" value={employee.shift?.dayOff} />
            <Detail
              label="Hours"
              value={`${displayValue(employee.shift?.startingTime)} - ${displayValue(employee.shift?.endingTime)}`}
            />
            <Detail label="Shift created" value={formatDate(employee.shift?.createdDate)} />
          </dl>
        </Section>

        <Section title="Address" icon={<MapPin className="h-4 w-4" />}>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Detail label="Village" value={employee.address?.village} />
            <Detail label="Commune" value={employee.address?.commun} />
            <Detail label="City / Province" value={employee.address?.city_or_province} />
            <Detail label="Country" value={employee.address?.country} />
          </dl>
        </Section>

        <Section title="Account history" icon={<CalendarDays className="h-4 w-4" />}>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Detail label="Created" value={formatDate(employee.createdDate)} />
            <Detail label="Created by" value={employee.createBy} />
            <Detail label="Last modified" value={formatDate(employee.lastModifiedDate)} />
            <Detail label="Modified by" value={employee.lastModifiedBy} />
          </dl>
        </Section>
      </div>
    </div>
  );
}