import React from "react";
import { Payment } from "../../../../types/payment";
import { DollarSign } from "lucide-react";

function formatOptional(value: unknown) {
  return value ? String(value) : "—";
}

interface PaymentAmountCardProps {
  payment: Payment;
}

export const PaymentAmountCard: React.FC<PaymentAmountCardProps> = ({
  payment,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-blue-600" />
        Payment Amount
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-600 mb-1">Paid Amount</p>
            <p className="text-3xl font-bold text-green-700">
              ${payment.paidAmount?.toFixed(2)}
            </p>
          </div>
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-600 mb-1">Currency</p>
            <p className="text-2xl font-bold text-blue-700">
              {formatOptional(payment.currency)}
            </p>
          </div>
        </div>

        {payment.refundedAmount && (
          <div className="bg-linear-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-red-600 mb-1">Refunded Amount</p>
            <p className="text-3xl font-bold text-red-700">
              ${payment.refundedAmount?.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
