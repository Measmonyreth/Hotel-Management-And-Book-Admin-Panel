import React from "react";
import { Payment } from "../../../../types/payment";
import { Check, X } from "lucide-react";

function formatDate(value?: string) {
  if (!value) return "—";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function formatOptional(value: unknown) {
  return value ? String(value) : "—";
}

function getPaymentStatusColor(status?: string) {
  if (!status) return "bg-gray-100 text-gray-700";
  const statusMap: Record<string, string> = {
    PAID: "bg-green-100 text-green-700",
    UNPAID: "bg-red-100 text-red-700",
    PARTIALLY_PAID: "bg-orange-100 text-orange-700",
    REFUNDED: "bg-blue-100 text-blue-700",
    PARTIALLY_REFUND: "bg-cyan-100 text-cyan-700",
  };
  return statusMap[status] || "bg-gray-100 text-gray-700";
}

interface PaymentHeaderCardProps {
  payment: Payment;
}

export const PaymentHeaderCard: React.FC<PaymentHeaderCardProps> = ({
  payment,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Payment Code</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatOptional(payment.code)}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${getPaymentStatusColor(
            payment.paymentStatus
          )}`}
        >
          {payment.paymentStatus === "PAID" && <Check className="w-4 h-4" />}
          {payment.paymentStatus === "UNPAID" && <X className="w-4 h-4" />}
          {payment.paymentStatus}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Created Date</p>
          <p className="text-gray-900 font-medium">
            {formatDate(payment.createdDate)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Created By</p>
          <p className="text-gray-900 font-medium">
            {formatOptional(payment.createdBy)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
        <div>
          <p className="text-sm text-gray-500 mb-1">Last Modified</p>
          <p className="text-gray-900 font-medium">
            {formatDate(payment.lastModifiedDate)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Modified By</p>
          <p className="text-gray-900 font-medium">
            {formatOptional(payment.lastModifiedBy)}
          </p>
        </div>
      </div>
    </div>
  );
};
