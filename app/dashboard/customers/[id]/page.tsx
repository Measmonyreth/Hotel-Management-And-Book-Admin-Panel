"use client";

import { useParams, useRouter } from "next/navigation";
import { Customer } from "../../../types/customer";
import { useCustomerById } from "@/hooks/customer_api";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Lock,
  MapPin,
  Calendar,
  UserCheck,
  Trash2,
  Globe,
  Image as ImageIcon,
  Star,
  Code,
} from "lucide-react";
import { CustomerHeaderCard } from "./_components/customerheadercard";
import CustomerDetailCard from "./_components/custoemrdetailcard";

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
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatOptional(value: unknown) {
  return value ? String(value) : "—";
}

function formatBoolean(value: unknown) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "—";
}

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params?.id as string;

  const { data, loading, error } = useCustomerById(customerId);

  const customer = data?.data;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-sm font-medium text-slate-600">
            Loading customer details...
          </p>
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
              <h3 className="font-semibold text-red-900">
                Error Loading Customer
              </h3>
              <p className="mt-1 text-sm text-red-700">{String(error)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-900">
            Customer not found
          </p>
          <p className="mt-1 text-sm text-slate-600">
            No customer data available
          </p>
        </div>
      </div>
    );
  }

  const customerDetails = [
    {
      label: "Customer ID",
      value: customer?.customerId,
      icon: Lock,
      color: "text-purple-600",
    },
    {
      label: "First Name",
      value: customer?.firstName,
      icon: User,
      color: "text-blue-600",
    },
    {
      label: "Last Name",
      value: customer?.lastName,
      icon: User,
      color: "text-blue-500",
    },
    {
      label: "Email",
      value: customer?.email,
      icon: Mail,
      color: "text-red-600",
    },
    {
      label: "Phone",
      value: formatOptional(customer?.phone),
      icon: Phone,
      color: "text-green-600",
    },
    {
      label: "Email Verified",
      value: formatBoolean(customer?.emailVerified),
      icon: CheckCircle,
      color: customer?.emailVerified ? "text-emerald-600" : "text-slate-600",
    },
    {
      label: "Role",
      value: customer?.role,
      icon: Briefcase,
      color: "text-amber-600",
    },
    {
      label: "Status",
      value: customer?.status,
      icon: CheckCircle,
      color:
        customer?.status === "ACTIVE" ? "text-emerald-600" : "text-red-600",
    },
    {
      label: "Provider",
      value: customer?.provider,
      icon: Code,
      color: "text-indigo-600",
    },
    {
      label: "Provider ID",
      value: formatOptional(customer?.providerId),
      icon: Code,
      color: "text-indigo-500",
    },
    {
      label: "Nationality",
      value: formatOptional(customer?.nationality),
      icon: Globe,
      color: "text-cyan-600",
    },
    {
      label: "City/Province",
      value: formatOptional(customer?.city_or_province),
      icon: MapPin,
      color: "text-orange-600",
    },
    {
      label: "Country",
      value: formatOptional(customer?.country),
      icon: Globe,
      color: "text-teal-600",
    },
    {
      label: "VIP Customer",
      value: formatOptional(customer?.vipCustomer),
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  const customerDetailsAudit = [
    {
      label: "Created Date",
      value: formatDate(customer?.createdDate),
      icon: Calendar,
      color: "text-cyan-600",
    },
    {
      label: "Created By",
      value: formatOptional(customer?.createBy),
      icon: UserCheck,
      color: "text-teal-600",
    },
    {
      label: "Last Modified Date",
      value: formatDate(customer?.lastModifiedDate),
      icon: Calendar,
      color: "text-sky-600",
    },
    {
      label: "Last Modified By",
      value: formatOptional(customer?.lastModifiedBy),
      icon: UserCheck,
      color: "text-cyan-700",
    },
    {
      label: "Deleted Date",
      value: formatDate(customer?.deletedDate),
      icon: Trash2,
      color: "text-red-600",
    },
    {
      label: "Deleted By",
      value: formatOptional(customer?.deletedBy),
      icon: Trash2,
      color: "text-red-700",
    },
  ];

  const fullName =
    `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6 flex flex-col">
      <div className="mx-auto max-w-7xl w-full flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard/customers")}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            <ChevronLeft size={16} />
            Back to Customers
          </button>
        </div>

        {/* Two Column Layout - Equal heights with right scroll */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* Left Column - Static content */}
          <div className="space-y-4 overflow-hidden">
            <CustomerHeaderCard customer={customer} />
            <CustomerDetailCard customer={customerDetailsAudit} />
          </div>

          {/* Right Column - Scrollable content */}
          <div className="overflow-y-auto pr-2">
            <CustomerDetailCard customer={customerDetails} />
          </div>
        </div>
      </div>
    </div>
  );
}
