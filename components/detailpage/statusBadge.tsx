import React from "react";

type StatusType = "booking" | "payment" | "customer" | "vipCustomer";

interface StatusBadgeProps {
  emailVerified?: boolean;
  vipCustomer?: boolean;
  status?: string;
  type?: StatusType;
  className?: string;
}

function getStatusColor(status?: string, type: StatusType = "booking"): string {
  if (!status) return "bg-gray-100 text-gray-700";

  if (type === "booking") {
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

  if (type === "payment") {
    const statusMap: Record<string, string> = {
      PAID: "bg-green-100 text-green-700",
      UNPAID: "bg-red-100 text-red-700",
      PARTIALLY_PAID: "bg-orange-100 text-orange-700",
      REFUNDED: "bg-blue-100 text-blue-700",
      PARTIALLY_REFUND: "bg-cyan-100 text-cyan-700",
    };
    return statusMap[status] || "bg-gray-100 text-gray-700";
  }

  if (type === "customer") {
    const statusMap: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-700",
      INACTIVE: "bg-red-100 text-red-700",
      SUSPENDED: "bg-orange-100 text-orange-700",
      DELETED: "bg-blue-100 text-blue-700",
    };
    return statusMap[status] || "bg-gray-100 text-gray-700";
  }

  if(type === "vipCustomer") {
    const statusMap: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-700",
      INACTIVE: "bg-red-100 text-red-700",
      EXPIRED: "bg-red-100 text-red-700",
      SUSPENDED: "bg-orange-100 text-orange-700",
      DELETED: "bg-blue-100 text-blue-700",
    };
    return statusMap[status] || "bg-gray-100 text-gray-700";
  }

  return "bg-gray-100 text-gray-700";
}

/**
 * StatusBadge: Displays a colored badge for booking or payment status
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = "booking",
  className = "",
  emailVerified,
  vipCustomer,
}) => {
  return (
   <div>
     <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
        status,
        type
      )} ${className}`}
    >
      {status || "—"}
    </span>
    <span>
        {emailVerified && (
          <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
            Email Verified
          </span>
        )}
        {vipCustomer && (
          <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            VIP Customer
          </span>
        )}
    </span>
   </div>
  );
};