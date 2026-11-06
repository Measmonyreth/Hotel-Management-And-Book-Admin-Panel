import React from "react";
import { Payment } from "../../../../types/payment";
import { Mail } from "lucide-react";

function formatOptional(value: unknown) {
  return value ? String(value) : "—";
}

interface ContactInfoCardProps {
  payment: Payment;
}

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  payment,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Mail className="w-5 h-5 text-blue-600" />
        Contact Information
      </h2>

      <div>
        <p className="text-sm text-gray-500 mb-2">Email Address</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-900 font-medium break-all">
            {formatOptional(payment.email)}
          </p>
        </div>
      </div>
    </div>
  );
};
