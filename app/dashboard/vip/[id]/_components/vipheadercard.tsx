import React from "react";
import { Crown, AlertCircle, Zap, Percent, TrendingUp, Calendar } from "lucide-react";
import { VipCustomerResponse } from "../../../../types/vip_customer";
import { StatusBadge } from "@/components/detailpage/statusBadge";

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

function getVipTypeBgColor(type: string | undefined) {
  switch (type?.toUpperCase()) {
    case "PLATINUM":
      return "from-slate-500 to-slate-600";
    case "GOLD":
      return "from-amber-500 to-amber-600";
    case "SILVER":
      return "from-slate-400 to-slate-500";
    case "DIAMOND":
      return "from-cyan-500 to-cyan-600";
    default:
      return "from-slate-500 to-slate-600";
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

function getStatusBadgeColor(status: string | undefined) {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-800";
    case "EXPIRED":
      return "bg-red-100 text-red-800";
    case "PENDING":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

function isVipExpired(validUntil: string | undefined) {
  if (!validUntil) return false;
  const expireDate = new Date(validUntil);
  return expireDate < new Date();
}

interface VipHeaderCardProps {
  vipCustomer: VipCustomerResponse;
}

/**
 * VipHeaderCard: Displays VIP customer name, code, type, status badges, and summary cards
 */
export const VipHeaderCard: React.FC<VipHeaderCardProps> = ({ vipCustomer }) => {
  return (
    <div className="space-y-4">
      {/* Main Header Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Customer Name</p>
          <p className="text-2xl font-bold text-gray-900">
            {vipCustomer?.customer?.name || "VIP Customer"}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Code: {vipCustomer?.code} • Type: {vipCustomer?.type_vip}
          </p>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={vipCustomer?.status} type="vipCustomer" />
          {isVipExpired(vipCustomer?.validUntil) && (
            <div className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-800">
              <AlertCircle size={16} />
              Expired
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* VIP Type Card */}
        <div
          className={`overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br shadow-sm ${
            vipCustomer?.type_vip?.toUpperCase() === "PLATINUM"
              ? "from-slate-50 to-slate-100/50"
              : vipCustomer?.type_vip?.toUpperCase() === "GOLD"
              ? "from-amber-50 to-amber-100/50"
              : vipCustomer?.type_vip?.toUpperCase() === "SILVER"
              ? "from-slate-50 to-slate-100/50"
              : "from-cyan-50 to-cyan-100/50"
          }`}
        >
          <div
            className={`border-b px-4 py-3 bg-linear-to-r text-white ${getVipTypeBgColor(
              vipCustomer?.type_vip
            )}`}
          >
            <div className="flex items-center gap-2">
              <Crown size={16} />
              <h3 className="font-semibold text-sm">VIP Type</h3>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className={`font-bold ${getVipTypeColor(vipCustomer?.type_vip)}`}>
              {vipCustomer?.type_vip}
            </p>
          </div>
        </div>

        {/* Points Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-yellow-50 to-yellow-100/50 shadow-sm">
          <div className="border-b border-yellow-200 bg-linear-to-r from-yellow-500 to-yellow-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-white" />
              <h3 className="font-semibold text-white text-sm">Points</h3>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="font-bold text-yellow-900">{vipCustomer?.points || 0}</p>
          </div>
        </div>

        {/* Discount Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-red-50 to-red-100/50 shadow-sm">
          <div className="border-b border-red-200 bg-linear-to-r from-red-500 to-red-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <Percent size={16} className="text-white" />
              <h3 className="font-semibold text-white text-sm">Discount</h3>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="font-bold text-red-900">
              {vipCustomer?.percentage_discount}%
            </p>
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-emerald-50 to-emerald-100/50 shadow-sm">
          <div className="border-b border-emerald-200 bg-linear-to-r from-emerald-500 to-emerald-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-white" />
              <h3 className="font-semibold text-white text-sm">Total Spent</h3>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="font-bold text-emerald-900">
              {formatCurrency(vipCustomer?.totalSpent)}
            </p>
          </div>
        </div>

        {/* Validity Period Card */}
        <div className="   col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-semibold text-slate-900 text-sm">Validity Period</h3>
          <div className="gap-2 flex w-full">
            <div className="rounded-lg border w-full border-blue-200 bg-blue-50 p-3">
              <p className="text-xs font-medium text-blue-600">Valid From</p>
              <p className="mt-1 font-semibold text-blue-900 text-sm">
                {formatDate(vipCustomer?.validFrom)}
              </p>
            </div>
            <div
              className={`rounded-lg border w-full p-3 ${
                isVipExpired(vipCustomer?.validUntil)
                  ? "border-red-200 bg-red-50"
                  : "border-emerald-200 bg-emerald-50"
              }`}
            >
              <p
                className={`text-xs font-medium ${
                  isVipExpired(vipCustomer?.validUntil)
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                Valid Until
              </p>
              <p
                className={`mt-1 font-semibold text-sm ${
                  isVipExpired(vipCustomer?.validUntil)
                    ? "text-red-900"
                    : "text-emerald-900"
                }`}
              >
                {formatDate(vipCustomer?.validUntil)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
