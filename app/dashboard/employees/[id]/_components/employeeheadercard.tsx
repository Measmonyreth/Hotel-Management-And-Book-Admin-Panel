import React from "react";
import { StatusBadge } from "@/components/detailpage/statusBadge";
import { NoteFieldGrid } from "@/components/detailpage/notefield";
import { formatDate, formatOptional } from "@/components/detailpage/formatters";

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  username: string;
  phone?: string;
  role: string;
  status: string;
  shift?: string;
  createdDate: string;
  createBy?: string;
  lastModifiedDate: string;
  lastModifiedBy?: string;
  deletedDate?: string;
  deletedBy?: string;
}

interface EmployeeHeaderCardProps {
  employee: Employee;
}

/**
 * EmployeeHeaderCard: Displays employee name, status badges, and key dates
 */
export const EmployeeHeaderCard: React.FC<EmployeeHeaderCardProps> = ({
  employee,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Employee Name</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatOptional(employee.name)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ID: {employee.employeeId} • Role: {employee.role}
          </p>
        </div>
        <div className="flex gap-2">
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              employee.status === "ACTIVE"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div className="h-2 w-2 rounded-full bg-current"></div>
            {employee.status}
          </div>
        </div>
      </div>

      <NoteFieldGrid
        columns={2}
        fields={[
          {
            label: "Created Date",
            value: formatDate(employee.createdDate),
          },
          {
            label: "Last Modified",
            value: formatDate(employee.lastModifiedDate),
          },
        ]}
      />
    </div>
  );
};
