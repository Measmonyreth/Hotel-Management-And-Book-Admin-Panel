import React from "react";
import { Payment } from "../../../../types/payment";
import { Wallet } from "lucide-react";

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

interface TransactionDetailsCardProps {
  payment: Payment;
}

export const TransactionDetailsCard: React.FC<TransactionDetailsCardProps> = ({
  payment,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-blue-600" />
        Transaction Details
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Gateway Transaction ID</p>
          <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 font-mono text-sm break-all">
            {formatOptional(payment.getwayTransactionId)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Book ID</p>
            <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 font-mono text-sm">
              {formatOptional(payment.book.code)}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
            <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 font-mono text-sm">
              {formatOptional(payment.book)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Payment Date</p>
            <p className="text-gray-900 font-medium">
              {formatDate(payment.paymentDate)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Payment Code</p>
            <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 font-mono text-sm">
              {formatOptional(payment.code)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
