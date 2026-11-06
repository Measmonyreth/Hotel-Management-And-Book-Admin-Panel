"use client";

import { formatDate, formatOptional } from "@/components/detailpage/formatters";
import { useGetCustomerRequestsById } from "@/hooks/customer_request_api";
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CustomerRequest() {
  const { id: requestId } = useParams<{ id: string }>();

  const { data, loading, error } = useGetCustomerRequestsById(requestId);
  const request = data?.data;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong.</p>;
  if (!request) return <p>Request not found.</p>;

  const dataRequest = [
    {
      label: "Booking code",
      value: formatOptional(request.bookId?.code),
    },
    {
      label: "Reason",
      value: formatOptional(request.reason),
    },
    {
      label: "Calculated penalty fee",
      value: formatOptional(request.calculatedPenaltyFee),
      icon: "$",
    },
    {
      label: "Calculated refund amount",
      value: formatOptional(request.calculatedRefundAmount),
      icon: "$",
    },
    {
      label: "Status",
      value: formatOptional(request.status),
      color:
        request.status === "APPROVED"
          ? "bg-green-100 text-green-700"
          : request.status === "REJECTED"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Rejection reason",
      value: formatOptional(request.rejectionReason),
    },
    {
      label: "Reviewed by",
      value: formatOptional(request.reviewedBy),
    },

    {
      label: "Reviewed date",
      value: formatDate(request.reviewedDate),
    },
    {
      label: "Created date",
      value: formatDate(request.createdDate),
    },
    {
      label: "Last modified date",
      value: formatDate(request.lastModifiedDate),
    },
    {
      label: "Deleted date",
      value: formatDate(request.deletedDate),
    },
    {
      label: "Created by",
      value: formatOptional(request.createBy),
    },
    {
      label: "Last modified by",
      value: formatOptional(request.lastModifiedBy),
    },
    {
      label: "Deleted by",
      value: formatOptional(request.deletedBy),
    },
  ];

  return (
    <div>
      <Link
        href="/dashboard/customer_request"
        aria-label="Back to customer requests"
        title="Back to customer requests"
        className="mb-4 inline-flex size-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <ArrowLeft size={18} aria-hidden="true" />
      </Link>
      <section
        aria-labelledby="customer-request-details-heading"
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1
            id="customer-request-details-heading"
            className="text-xl font-semibold text-gray-900"
          >
            Customer request details
          </h1>
        </div>
        <dl className="divide-x divide-gray-100">
          {dataRequest.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] items-start gap-4 py-3 first:pt-0 last:pb-0"
            >
              <dt className="min-w-0 text-sm font-medium text-gray-500">
                {item.label}
              </dt>
              <dd className="flex min-w-0 items-start justify-between gap-3 break-words text-sm text-gray-900 mr-150">
                <span className="min-w-0 flex">
                  <div className={`rounded px-2 py-0.5 ${item.color}`}>
                    {item.value}
                  </div>
                  <b className="h-4"> {item.icon}</b>
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
