import React from "react";
import { BookResponse } from "../../../../types/book";
import { formatCurrency, formatDate, formatOptional } from "@/components/detailpage/formatters";
import { StatusBadge } from "@/components/detailpage/statusBadge";
import { NoteField, NoteFieldGrid } from "@/components/detailpage/notefield";


interface PaymentHistoryRowProps {
  payment: BookResponse["payments"][0];
}

/**
 * PaymentHistoryRow: Displays a single payment record with all details
 */
export const PaymentHistoryRow: React.FC<PaymentHistoryRowProps> = ({
  payment,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
      {/* Header Row */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold text-lg text-gray-900">
            {formatCurrency(payment.paidAmount)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Payment Code: {formatOptional(payment.code)}
          </p>
        </div>
        <StatusBadge
          status={payment.paymentStatus}
          type="payment"
        />
      </div>

      {/* Payment Details Grid */}
      <div className="border-t border-gray-200 pt-3">
        <NoteFieldGrid
          columns={2}
          fields={[
            {
              label: "Payment Type",
              value: formatOptional(payment.paymentType),
            },
            {
              label: "Payment Method",
              value: formatOptional(payment.paymentMethod),
            },
            {
              label: "Payment Timing",
              value: formatOptional(payment.paymentTiming),
            },
            {
              label: "Currency",
              value: formatOptional(payment.currency),
            },
          ]}
        />
      </div>

      {/* Email and Refund Info */}
      <div className="grid grid-cols-2 gap-3 mb-3 mt-3">
        <NoteField
          label="Email"
          value={formatOptional(payment.email)}
          valueClassName="text-xs font-medium text-gray-900 break-words"
        />
        <NoteField
          label="Refunded Amount"
          value={formatCurrency(payment.refundedAmount || 0)}
          valueClassName="text-sm font-medium text-red-600"
        />
      </div>

      {/* Gateway Transaction ID */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
        <p className="text-xs font-mono text-gray-900 break-words bg-gray-50 p-2 rounded">
          {formatOptional(payment.getwayTransactionId)}
        </p>
      </div>

      {/* Description and Note */}
      <div className="space-y-2 mb-3">
        {payment.description && (
          <div className="bg-blue-50 rounded p-2 border border-blue-100">
            <p className="text-xs text-gray-500 mb-1">Description</p>
            <p className="text-sm text-gray-900">{payment.description}</p>
          </div>
        )}
        {payment.note && (
          <div className="bg-yellow-50 rounded p-2 border border-yellow-100">
            <p className="text-xs text-gray-500 mb-1">Note</p>
            <p className="text-sm text-gray-900">{payment.note}</p>
          </div>
        )}
      </div>

      {/* Date and Email Footer */}
      <div className="border-t border-gray-200 pt-3">
        <NoteFieldGrid
          columns={2}
          fields={[
            {
              label: "Payment Date",
              value: formatDate(payment.paymentDate),
            },
            {
              label: "Email",
              value: formatOptional(payment.email),
              valueClassName: "text-xs font-medium text-gray-900 break-words",
            },
          ]}
        />
      </div>
    </div>
  );
};