"use client";

import { useRouter } from "next/navigation";
import type { Shift } from "../../types/schedule";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import { useState } from "react";
import CreateSchedulePage from "./_components/createSchedule";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { useScheduleSearch } from "@/hooks/schedule_api";
import { DeleteScheduleDialog } from "./_components/deleteScheduleDailog";
import CreateButton from "@/components/ui/CreateButton";

export default function SchedulesPage() {
  const [refetchKey, setRefetchKey] = useState(0);
  const [page, setPage] = useState(1);
  const [ooenDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { data, loading, error } = useScheduleSearch(
    `/shift/list?__refetch=${refetchKey}`,
  );

  const route = useRouter();

  const shifts = data?.data;
  const shiftList = shifts?.shifts ?? [];
  const totalPages = Math.max(
    1,
    Math.ceil((shifts?.totalShifts ?? shiftList.length) / 10),
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  function formatTime(value: unknown) {
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

  const [addsetShiftModalOpen, setAddShiftModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | undefined>();
  const columns: Column<(typeof shiftList)[0]>[] = [
    {
      key: "dayWork",
      label: "Day Work",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "dayOff",
      label: "Day Off",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "startingTime",
      label: "Starting Time",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-900">{`${formatTime(value)} `}</span>
      ),
    },
    {
      key: "endingTime",
      label: "Ending Time",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-900">{`${formatTime(value)} `}</span>
      ),
    },
    {
      key: "shift",
      label: "Shift",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "deletedDate",
      label: "Status",
      width: "whitespace-nowrap",
      render: (_, row) => {
        const isDeleted = Boolean(row.deletedDate);
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
              isDeleted
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {isDeleted ? "Deleted" : "Active"}
          </span>
        );
      },
    },
  ];

  const actions: Action<(typeof shiftList)[0]>[] = [
    {
      label: "View",
      color: "blue",
      onClick: (row) => route.push(`/dashboard/schedules/${row.id}`),
    },
    {
      label: "Update",
      color: "gray",
      onClick: (row) => {
        setSelectedShift(row);
        setAddShiftModalOpen(true);
      },
    },
    {
      label: "Delete",
      color: "red",
      onClick: (row) => {
        setSelectedShift(row);
        setOpenDeleteDialog(true);
      },
    },
  ];

  if (loading)
    return (
      <HandleResponse>
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
        >
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-sm font-medium text-gray-600">
            Loading shifts...
          </span>
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
            <p className="font-semibold text-red-800">
              Error fetching schedules
            </p>
            <p className="mt-1 break-words text-red-700">{String(error)}</p>
          </div>
        </div>
      </HandleResponse>
    );
  if (!data)
    return (
      <HandleResponse>
        <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <Inbox className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            No schedule data available
          </p>
          <p className="text-xs text-gray-500">
            Shift schedules will appear here once they are created.
          </p>
        </div>
      </HandleResponse>
    );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        {/* <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Overview
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">Schedules</h1>
        </div> */}

        <CreateButton
          label="Create Schedule"
          onClick={() => {
            setSelectedShift(undefined);
            setAddShiftModalOpen(true);
          }}
        />
      </div>

      <CreateSchedulePage
        open={addsetShiftModalOpen}
        isUpdate={Boolean(selectedShift)}
        initialSchedule={selectedShift}
        onClose={() => {
          setAddShiftModalOpen(false);
          setSelectedShift(undefined);
        }}
        onSubmit={() => {
          setAddShiftModalOpen(false);
          setSelectedShift(undefined);
          setRefetchKey((previous) => previous + 1);
        }}
      />

      <DeleteScheduleDialog
        open={ooenDeleteDialog}
        scheduleId={selectedShift?.id ?? (0 as number)}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedShift(undefined);
          setRefetchKey((previous) => previous + 1);
        }}
      />

      <WidgetTable
        title="Shift Schedule"
        subtitle="Manage employee shifts"
        columns={columns}
        data={shiftList}
        actions={actions}
        emptyMessage="No shifts found."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-gray-50"
        onPageChange={handlePageChange}
        currentPage={page}
        toatalRecords={shifts?.totalShifts ?? shiftList.length}
        totalPages={totalPages}
      />
    </div>
  );
}
