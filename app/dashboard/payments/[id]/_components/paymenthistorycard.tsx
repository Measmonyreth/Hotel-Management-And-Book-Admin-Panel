import React from "react";
import { Payment, PaymentHistory } from "../../../../types/payment";
import { History } from "lucide-react";

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

interface PaymentHistoryCardProps {
  payment: Payment;
}

export const PaymentHistoryCard: React.FC<PaymentHistoryCardProps> = ({
  payment,
}) => {
  if (!payment.paymentHistory || payment.paymentHistory.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <History className="w-5 h-5 text-blue-600" />
        Payment History
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                Date
              </th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                Type
              </th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                Method
              </th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                Created By
              </th>
            </tr>
          </thead>
          <tbody>
            {payment.paymentHistory.map((history: PaymentHistory, index: number) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">
                  {formatDate(history.paymentDate)}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {formatOptional(history.paymentType)}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {formatOptional(history.paymentMethod)}
                </td>
                <td className="py-3 px-4 font-semibold text-gray-900">
                  {history.currency} {history.amount?.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {formatOptional(history.createdBy)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payment.paymentHistory.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Total transactions: <span className="font-semibold">{payment.paymentHistory.length}</span>
          </p>
        </div>
      )}
    </div>
  );
};
