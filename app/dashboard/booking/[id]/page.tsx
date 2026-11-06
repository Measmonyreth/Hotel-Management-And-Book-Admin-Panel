"use client";
import { AdditionalInfoCard } from "./_components/additionalinfocard";

import { useParams, useRouter } from "next/navigation";
import { BookingDetail, BookResponse } from "../../../types/book";
import { useApiAuthenticated } from "@/hooks/useApi";
import {
  ChevronLeft,
  Calendar,
  User,
  Phone,
  Mail,
  DollarSign,
  FileText,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Loader,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { BookingHeaderCard } from "./_components/bookingheadercard";
import { CustomerInfoCard } from "./_components/cusomerinfocard";
import { BookingItemsCard } from "./_components/bookingitmescard,";
import { PaymentSummaryCard } from "./_components/paymentsummerycard";
import { PaymentHistoryCard } from "./_components/paymenthistorycard";
import { useBookingById } from "@/hooks/booking_api";

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

function getStatusColor(status?: string) {
  if (!status) return "bg-gray-100 text-gray-700";
  const statusMap: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    CHECK_IN: "bg-purple-100 text-purple-700",
    CHECK_OUT: "bg-indigo-100 text-indigo-700",
    CANCELLED: "bg-red-100 text-red-700",
    COMPLETED: "bg-green-100 text-green-700",
    UPCOMING: "bg-cyan-100 text-cyan-700",
  };
  return statusMap[status] || "bg-gray-100 text-gray-700";
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

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { data, loading, error } = useBookingById(id);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
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
            {error || "Failed to load booking details"}
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

  const booking: BookResponse = data.data;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Bookings
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Header Card */}
          <BookingHeaderCard booking={booking} />

          {/* Customer Information */}
          <CustomerInfoCard booking={booking} />

          {/* Booking Items */}
          <BookingItemsCard booking={booking} />
        </div>

        {/* Sidebar - Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Payment Summary */}
          <PaymentSummaryCard booking={booking} />

          {/* Payment History */}
          <PaymentHistoryCard booking={booking} />

          {/* Additional Info */}
          <AdditionalInfoCard booking={booking} />
        </div>
      </div>
    </div>
  );
}
