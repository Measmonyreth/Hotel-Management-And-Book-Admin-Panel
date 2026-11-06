import React from "react";
import { DollarSign } from "lucide-react";
import { BookResponse } from "../../../../types/book";
import { calculatePaymentPercentage, formatCurrency } from "@/components/detailpage/formatters";


interface PaymentSummaryCardProps {
  booking: BookResponse;
}

/**
 * PaymentSummaryCard: Displays payment totals and progress bar
 */
export const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({
  booking,
}) => {
  const percentage = calculatePaymentPercentage(
    booking.paidAmount,
    booking.totalAmount
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-blue-600" />
        Payment Summary
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Amount</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(booking.totalAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Paid Amount</span>
          <span className="font-semibold text-green-600">
            {formatCurrency(booking.paidAmount)}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-3">
          <span className="text-gray-600 font-medium">Remaining</span>
          <span className="font-bold text-orange-600">
            {formatCurrency(booking.remainingAmount)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {percentage.toFixed(0)}% Paid
        </p>
      </div>
    </div>
  );
};