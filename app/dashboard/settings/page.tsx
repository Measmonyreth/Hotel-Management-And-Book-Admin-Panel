import {
  Bell,
  Building2,
  CalendarClock,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Globe2,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const sections = [
  { label: "General", icon: Building2, active: true },
  { label: "Your profile", icon: UserRound },
  { label: "Operations", icon: CalendarClock },
  { label: "Notifications", icon: Bell },
  { label: "Billing", icon: CreditCard },
  { label: "Security", icon: ShieldCheck },
];

function Toggle({ enabled = false }: { enabled?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        enabled ? "bg-blue-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </span>
  );
}

function Field({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        aria-label={label}
        className="h-11 w-full rounded-md border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
        defaultValue={value}
        readOnly
      />
      {hint && <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-7xl pb-10">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
            <span className="h-px w-6 bg-blue-600" /> Property controls
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Settings
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Fine-tune how your hotel runs, from guest arrivals to team updates.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Save changes <ChevronRight size={16} />
        </button>
      </div>

      <div className="mb-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-5 px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-700">
              <Building2 size={25} strokeWidth={1.7} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="truncate text-lg font-semibold text-slate-900">
                  The Meridian House
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  Active property
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin size={14} /> Portland, Oregon
                <span className="mx-1 text-slate-300">·</span> Property ID HM-2048
              </p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            View property <ChevronRight size={15} />
          </button>
        </div>
        <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50/70 sm:grid-cols-4">
          {[
            ["PROPERTY TYPE", "Boutique hotel"],
            ["ROOMS", "84 rooms"],
            ["LOCAL TIME", "10:42 AM · PDT"],
            ["PLAN", "Hospitality Pro"],
          ].map(([label, value]) => (
            <div key={label} className="border-r border-slate-100 px-5 py-3.5 last:border-r-0 sm:px-6">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400">
                {label}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-700">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav
          aria-label="Settings sections"
          className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2 lg:flex-col"
        >
          {sections.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition lg:w-full ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={17} strokeWidth={1.8} />
              {label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />}
            </button>
          ))}
          <div className="mt-2 hidden border-t border-slate-100 px-3 pt-3 lg:block">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Resources
            </p>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-md px-0 py-2 text-left text-sm text-slate-500 hover:text-slate-800"
            >
              <CircleHelp size={17} /> Help center
            </button>
          </div>
        </nav>

        <div className="space-y-5">
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">Property details</h2>
              <p className="mt-1 text-sm text-slate-500">
                The information guests and staff see across your workspace.
              </p>
            </div>
            <div className="grid gap-x-5 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
              <Field label="Property name" value="The Meridian House" />
              <Field label="Contact email" value="hello@meridianhouse.com" />
              <Field label="Phone number" value="+1 (503) 555-0184" />
              <Field label="Website" value="www.meridianhouse.com" />
              <div className="sm:col-span-2">
                <Field
                  label="Street address"
                  value="418 NW Alder Street, Portland, OR 97209"
                  hint="Used for guest confirmations and invoices."
                />
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">Regional preferences</h2>
              <p className="mt-1 text-sm text-slate-500">
                Set the defaults used for dates, times, and financial reporting.
              </p>
            </div>
            <div className="grid gap-x-5 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
              <Field label="Time zone" value="Pacific Time (US & Canada)" />
              <Field label="Default currency" value="USD — US Dollar" />
              <Field label="Date format" value="MMM D, YYYY (Sep 30, 2026)" />
              <Field label="Language" value="English (United States)" />
            </div>
            <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 text-xs text-slate-500 sm:px-6">
              <Globe2 size={15} className="shrink-0 text-blue-600" />
              <span>These preferences apply to all staff accounts at this property.</span>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">Guest notifications</h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose which updates are sent automatically to guests.
              </p>
            </div>
            <div className="divide-y divide-slate-100 px-5 sm:px-6">
              {([
                ["Booking confirmations", "Send an email when a reservation is confirmed.", true],
                ["Arrival reminders", "Remind guests 24 hours before check-in.", true],
                ["Post-stay follow-up", "Invite guests to share feedback after checkout.", false],
              ] as const).map(([title, description, enabled]) => (
                <div key={title} className="flex items-center justify-between gap-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                  </div>
                  <Toggle enabled={Boolean(enabled)} />
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-200/80 bg-amber-50/70 px-4 py-3.5">
            <div className="flex items-start gap-3">
              <LockKeyhole size={17} className="mt-0.5 shrink-0 text-amber-800" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Your property data stays protected</p>
                <p className="mt-0.5 text-xs text-slate-600">
                  Settings are visible to property administrators only.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-amber-900">Privacy & security</span>
          </div>
        </div>
      </div>
    </div>
  );
}