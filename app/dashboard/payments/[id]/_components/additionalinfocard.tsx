import React from "react";
import { Payment } from "../../../../types/payment";
import { FileText } from "lucide-react";

interface AdditionalInfoCardProps {
  payment: Payment;
}

export const AdditionalInfoCard: React.FC<AdditionalInfoCardProps> = ({
  payment,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        Additional Information
      </h2>

      {payment.description && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Description</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-900 whitespace-pre-wrap">
              {payment.description}
            </p>
          </div>
        </div>
      )}

      {payment.note && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Note</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-gray-900 whitespace-pre-wrap">{payment.note}</p>
          </div>
        </div>
      )}
    </div>
  );
};
