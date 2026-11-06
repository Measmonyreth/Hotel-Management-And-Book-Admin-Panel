"use client";

import { useParams, useRouter } from "next/navigation";
import { useVipCustomerById } from "@/hooks/vip_customer_api";
import {
  ChevronLeft,
  AlertCircle,
  Lock,
  Calendar,
  UserCheck,
  Trash2,
  Gift,
  Crown,
  User,
  Percent,
  TrendingUp,
  Zap,
  CheckCircle,
} from "lucide-react";
import { VipHeaderCard } from "./_components/vipheadercard";
import VipDetailCard from "./_components/vipdetailcard";

function formatDate(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatOptional(value: unknown) {
  return value ? String(value) : "—";
}

function formatCurrency(value: unknown) {
  if (typeof value !== "number") {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function getVipTypeColor(type: string | undefined) {
  switch (type?.toUpperCase()) {
    case "PLATINUM":
      return "text-slate-600";
    case "GOLD":
      return "text-amber-600";
    case "SILVER":
      return "text-slate-400";
    case "DIAMOND":
      return "text-cyan-600";
    default:
      return "text-slate-600";
  }
}

function getStatusColor(status: string | undefined) {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "text-emerald-600";
    case "EXPIRED":
      return "text-red-600";
    case "PENDING":
      return "text-amber-600";
    default:
      return "text-slate-600";
  }
}

function isVipExpired(validUntil: string | undefined) {
  if (!validUntil) return false;
  const expireDate = new Date(validUntil);
  return expireDate < new Date();
}

export default function VipCustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const vipId = params?.id as string;

  const { data, loading, error } = useVipCustomerById(vipId);

  const vipCustomer = data?.data;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-sm font-medium text-slate-600">Loading VIP customer details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-6 w-6 shrink-0 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Error Loading VIP Customer</h3>
              <p className="mt-1 text-sm text-red-700">{String(error)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vipCustomer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-900">VIP Customer not found</p>
          <p className="mt-1 text-sm text-slate-600">No VIP customer data available</p>
        </div>
      </div>
    );
  }

  const vipDetails = [
    {
      label: "VIP ID",
      value: vipCustomer?.id,
      icon: Lock,
      color: "text-purple-600",
    },
    {
      label: "VIP Code",
      value: vipCustomer?.code,
      icon: Gift,
      color: "text-pink-600",
    },
    {
      label: "VIP Type",
      value: vipCustomer?.type_vip,
      icon: Crown,
      color: getVipTypeColor(vipCustomer?.type_vip),
    },
    {
      label: "Customer Name",
      value: vipCustomer?.customer?.name,
      icon: User,
      color: "text-blue-600",
    },
    {
      label: "Points",
      value: vipCustomer?.points?.toString(),
      icon: Zap,
      color: "text-yellow-600",
    },
    {
      label: "Total Spent",
      value: formatCurrency(vipCustomer?.totalSpent),
      icon: TrendingUp,
      color: "text-emerald-600",
    },
    {
      label: "Discount Percentage",
      value: `${vipCustomer?.percentage_discount}%`,
      icon: Percent,
      color: "text-red-600",
    },
    {
      label: "Status",
      value: vipCustomer?.status,
      icon: CheckCircle,
      color: getStatusColor(vipCustomer?.status),
    },
    {
      label: "Valid From",
      value: formatDate(vipCustomer?.validFrom),
      icon: Calendar,
      color: "text-cyan-600",
    },
    {
      label: "Valid Until",
      value: formatDate(vipCustomer?.validUntil),
      icon: Calendar,
      color: isVipExpired(vipCustomer?.validUntil) ? "text-red-600" : "text-cyan-600",
    },
    {
      label: "Created Date",
      value: formatDate(vipCustomer?.createdDate),
      icon: Calendar,
      color: "text-sky-600",
    },
    {
      label: "Created By",
      value: formatOptional(vipCustomer?.createBy),
      icon: UserCheck,
      color: "text-teal-600",
    },
    {
      label: "Last Modified Date",
      value: formatDate(vipCustomer?.lastModifiedDate),
      icon: Calendar,
      color: "text-sky-600",
    },
    {
      label: "Last Modified By",
      value: formatOptional(vipCustomer?.lastModifiedBy),
      icon: UserCheck,
      color: "text-cyan-700",
    },
    {
      label: "Deleted Date",
      value: formatDate(vipCustomer?.deletedDate),
      icon: Trash2,
      color: "text-red-600",
    },
    {
      label: "Deleted By",
      value: formatOptional(vipCustomer?.deletedBy),
      icon: Trash2,
      color: "text-red-700",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard/vip")}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            <ChevronLeft size={16} />
            Back to VIP Customers
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Header Only */}
          <div>
            <VipHeaderCard vipCustomer={vipCustomer} />
          </div>

          {/* Right Column - All Details (Scrollable) */}
          <div className="max-h-screen overflow-y-auto pr-2">
            <div className="rounded-lg border border-slate-200 bg-white ">
              <VipDetailCard vipDetails={vipDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
