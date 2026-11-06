import React from "react";
import { Payment } from "../../../../types/payment";
import { CreditCard } from "lucide-react";

function formatOptional(value: unknown) {
  return value ? String(value) : "—";
}

interface PaymentMethodCardProps {
  payment: Payment;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  payment,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-blue-600" />
        Payment Method Details
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">Payment Type</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="font-semibold text-gray-900">
              {formatOptional(payment.paymentType)}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Payment Method</p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="font-semibold text-gray-900">
              {formatOptional(payment.paymentMethod)}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Payment Timing</p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="font-semibold text-gray-900">
              {formatOptional(payment.paymentTiming)}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Payment Gateway</p>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
            <p className="font-semibold text-gray-900">
              {formatOptional(payment.paymentGetway)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
