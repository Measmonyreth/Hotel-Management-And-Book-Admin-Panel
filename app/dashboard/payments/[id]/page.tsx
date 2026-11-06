"use client";

import { useParams, useRouter } from "next/navigation";
import type { Payment } from "../../../types/payment";
import { usePaymentById } from "@/hooks/payment_api";
import {
  ArrowLeft,
  AlertCircle,
  Loader,
} from "lucide-react";
import { PaymentHeaderCard } from "./_components/paymentheadercard";
import { PaymentAmountCard } from "./_components/paymentamountcard";
import { PaymentMethodCard } from "./_components/paymentmethodcard";
import { TransactionDetailsCard } from "./_components/transactiondetailscard";
import { ContactInfoCard } from "./_components/contactinfocard";
import { AdditionalInfoCard } from "./_components/additionalinfocard";
import { PaymentHistoryCard } from "./_components/paymenthistorycard";

export default function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data, loading, error } = usePaymentById(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {error || "Failed to load payment details"}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const payment: Payment = data.data;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Payments
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Payment Details</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Header Card */}
          <PaymentHeaderCard payment={payment} />

          {/* Payment Amount Section */}
          <PaymentAmountCard payment={payment} />

          {/* Payment Method & Type */}
          <PaymentMethodCard payment={payment} />

          {/* Transaction Details */}
          <TransactionDetailsCard payment={payment} />

          {/* Contact Information */}
          <ContactInfoCard payment={payment} />

          {/* Payment History */}
          <PaymentHistoryCard payment={payment} />

          {/* Additional Information */}
          <AdditionalInfoCard payment={payment} />
        </div>

        {/* Sidebar - Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Payment Summary
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Status</span>
                <span className="px-3 py-1 rounded-full text-sm font-bold text-green-700 bg-green-100">
                  {payment.paymentStatus}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Amount</span>
                <span className="text-lg font-bold text-green-600">
                  {payment.currency} {payment.paidAmount?.toFixed(2)}
                </span>
              </div>

              {payment.refundedAmount && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-600">Refunded</span>
                  <span className="text-lg font-bold text-red-600">
                    -{payment.currency} {payment.refundedAmount?.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Details Report */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Details
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600">Type</span>
                <span className="text-gray-900 font-medium">{payment.paymentType || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600">Method</span>
                <span className="text-gray-900 font-medium">{payment.paymentMethod || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600">Timing</span>
                <span className="text-gray-900 font-medium">{payment.paymentTiming || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600">Gateway</span>
                <span className="text-gray-900 font-medium text-xs">{payment.paymentGetway || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transactions</span>
                <span className="text-gray-900 font-bold text-lg">{payment.paymentHistory?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
