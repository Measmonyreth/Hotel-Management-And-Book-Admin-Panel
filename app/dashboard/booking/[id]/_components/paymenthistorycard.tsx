import React from "react";
import { Clock } from "lucide-react";
import { PaymentHistoryRow } from "./paymenthistoryrow";
import { BookResponse } from "../../../../types/book";


interface PaymentHistoryCardProps {
  booking: BookResponse;
}

/**
 * PaymentHistoryCard: Displays list of all payment records
 */
export const PaymentHistoryCard: React.FC<PaymentHistoryCardProps> = ({
  booking,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        Payment History ({booking.payments?.length || 0})
      </h3>

      <div className="space-y-4">
        {booking.payments && booking.payments.length > 0 ? (
          booking.payments.map((payment) => (
            <PaymentHistoryRow key={payment.id} payment={payment} />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No payments recorded</p>
        )}
      </div>
    </div>
  );
};