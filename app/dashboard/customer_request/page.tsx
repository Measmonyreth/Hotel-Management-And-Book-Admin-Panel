"use client";

import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import type { DataCustomerRequest } from "@/app/types/customer_request";
import { useGetAllCustomerRequests } from "@/hooks/customer_request_api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateRequestPage from "./component/CreateRequest";
import DeleteRequestPage from "./component/DelectRequest";
import CreateButton from "@/components/ui/CreateButton";
import Image from "next/image";
import UpdateStatus from "./component/UpdateStatus";

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  if (typeof value === "object") {
    return JSON.stringify(value) ?? "—";
  }
  return String(value);
}

export default function Customer_Request() {
  const { data, loading, error } = useGetAllCustomerRequests();
  const [editreq_form, setEditreq_form] = useState<
    DataCustomerRequest | undefined
  >(undefined);
  const request = data?.data ?? [];
  const route = useRouter();
  const [CreateRequest, SetcreateRequest] = useState(Boolean);
  const [DeleteRequest, SetDeleteRequest] = useState(Boolean);
  const [editRequest, SeteditRequest] = useState(Boolean);
  const [open, setOpen] = useState(Boolean);
  const [isAdmin, setIsAdmin] = useState(false);
  const [opneupdateStatus, SetopenupdateStatus] = useState(Boolean);
  const [updateStatus, SetupdateStatus] = useState<number | undefined>();
  const [status, SetStatus] = useState<string | undefined>();

  useEffect(() => {
    setIsAdmin(localStorage.getItem("role") === "ADMIN");
  }, []);
  const actions: Action<DataCustomerRequest>[] = [
    {
      label: "View",
      color: "blue",
      onClick: (row) => route.push(`/dashboard/customer_request/${row.id}`),
    },
    ...(isAdmin
      ? [
          {
            label: "Update",
            color: "gray" as const,
            onClick: (row: DataCustomerRequest) => {
              setEditreq_form(row);
              SeteditRequest(true);
              setOpen(true);
            },
          },
          {
            label: "Delete",
            color: "red" as const,
            onClick: (row: DataCustomerRequest) => {
              setEditreq_form(row);
              SetDeleteRequest(true);
            },
          },
        ]
      : []),
  ];
  const columns: Column<DataCustomerRequest>[] = [
    {
      key: "bookId",
      label: "Booking Code",
      width: "whitespace-nowrap",
      render: (book) => book.code,
    },

    {
      key: "reason",
      label: "Reason",
    },
    {
      key: "calculatedPenaltyFee",
      label: "Penalty Fee",
    },
    {
      key: "calculatedRefundAmount",
      label: "Refund Amount",
    },
    {
      key: "status",
      label: "Status",
      hindenIcon: (row) => String(row.status) !== "COMPLETED",

      icon: (
        <Image
          src="/icons/edit.png"
          alt=""
          width={24}
          height={24}
          className="h-6 w-6 shrink-0 object-contain"
        />
      ),
      onIconClick: (value) => {
        SetopenupdateStatus(true);
        SetupdateStatus(value.id);
        SetStatus(value.status);
      },
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "APPROVED"
              ? "bg-green-100 text-green-800"
              : value === "PROCESSING"
                ? "bg-yellow-100 text-yellow-800"
                : value === "REQUESTED"
                  ? "bg-gray-300 text-white-800"
                  : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "reviewedBy",
      label: "Reviewed By",
      render: (value) => formatValue(value),
    },
    {
      key: "rejectionReason",
      label: "Rejection Reason",
      render: (value) => formatValue(value),
    },
    {
      key: "reviewedDate",
      label: "Review Date",
      width: "whitespace-nowrap",
    },
  ];
  {
    loading && <p>Loading customer requests...</p>;
  }
  {
    error && <p role="alert">{error}</p>;
  }
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        {/* <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Overview
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">
            Cancel Requst
          </h1>
        </div> */}
        {isAdmin && (
          <CreateButton
            label="Create Request"
            onClick={() => {
              (SetcreateRequest(true), setOpen(true));
            }}
          />
        )}
      </div>

      {/* {CreateRequest ? (
        <CreateRequestPage
          titile="Create Request Book"
          edit={editRequest}
          initailReq={editreq_form}
          open={CreateRequest}
          onclose={() => SetcreateRequest(false)}
        />
      ) : null} */}
      {opneupdateStatus && (
        <UpdateStatus
          open={opneupdateStatus}
          status={status ?? ""}
          id={updateStatus as number}
          onClose={() => SetopenupdateStatus(false)}
        />
      )}

      {open && (
        <CreateRequestPage
          titile={
            CreateRequest
              ? "Create Customer Request"
              : "Update Customer Request"
          }
          initailReq={editreq_form}
          edit={editRequest}
          open={open}
          onclose={() => {
            (setOpen(false), SetcreateRequest(false), SeteditRequest(false));
          }}
        />
      )}

      {DeleteRequest ? (
        <DeleteRequestPage
          open={DeleteRequest}
          onClose={() => SetDeleteRequest(false)}
          requestId={editreq_form?.id ?? 0}
        />
      ) : null}

      <WidgetTable
        title="Customer Requests"
        subtitle={`${request.length} request${request.length === 1 ? "" : "s"}`}
        columns={columns}
        data={request}
        actions={actions}
        emptyMessage="No customer requests found."
      />
    </div>
  );
}
