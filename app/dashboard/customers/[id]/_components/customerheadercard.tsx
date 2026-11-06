import React from "react";
import { formatDate, formatOptional } from "@/components/detailpage/formatters";
import { StatusBadge } from "@/components/detailpage/statusBadge";
import { NoteFieldGrid } from "@/components/detailpage/notefield";
import { Customer } from "../../../../types/customer";


interface CustomerHeaderCardProps {
  customer: Customer;
}

/**
 * BookingHeaderCard: Displays booking code, status badges, and dates
 */
export const CustomerHeaderCard: React.FC<CustomerHeaderCardProps> = ({
  customer,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Customer Name</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatOptional(customer.firstName + " " + customer.lastName)}
          </p>
        </div>
        <div className="flex gap-2">
          <StatusBadge
            emailVerified={customer.emailVerified}
            vipCustomer={customer.vipCustomer}
            status={customer.status}
            type="customer"
          />
        </div>
      </div> 

      <NoteFieldGrid
        columns={2}
        fields={[
          {
            label: "Created Date",
            value: formatDate(customer.createdDate),
          },
          {
            label: "Last Modified",
            value: formatDate(customer.lastModifiedDate),
          },
        ]}
      />
    </div>
  );
};