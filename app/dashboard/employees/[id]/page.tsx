"use client";

import { useParams, useRouter } from "next/navigation";
import { useEmployeeById } from "@/hooks/employee_api";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Lock,
  Clock,
  MapPin,
  Calendar,
  UserCheck,
  Trash2,
} from "lucide-react";
import { EmployeeHeaderCard } from "./_components/employeeheadercard";
import EmployeeDetailCard from "./_components/employeedetailcard";

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

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params?.id as string;

  const { data, loading, error } = useEmployeeById(employeeId);

  const employee = data?.data;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-sm font-medium text-slate-600">Loading employee details...</p>
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
              <h3 className="font-semibold text-red-900">Error Loading Employee</h3>
              <p className="mt-1 text-sm text-red-700">{String(error)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-900">Employee not found</p>
          <p className="mt-1 text-sm text-slate-600">No employee data available</p>
        </div>
      </div>
    );
  }

  const employeeDetails = [
    {
      label: "Employee ID",
      value: employee?.employeeId,
      icon: Lock,
      color: "text-purple-600",
    },
    {
      label: "Full Name",
      value: employee?.name,
      icon: User,
      color: "text-blue-600",
    },
    {
      label: "Username",
      value: employee?.username,
      icon: User,
      color: "text-slate-600",
    },
    {
      label: "Phone Number",
      value: employee?.phone,
      icon: Phone,
      color: "text-green-600",
    },
    {
      label: "Role",
      value: employee?.role,
      icon: Briefcase,
      color: "text-amber-600",
    },
    {
      label: "Status",
      value: employee?.status,
      icon: CheckCircle,
      color: employee?.status === "ACTIVE" ? "text-emerald-600" : "text-red-600",
    },
    {
      label: "Address",
      value: employee.address != null ? 
     <div>
       <p>village: {employee?.address.village}</p>
       <p>commun: {employee?.address.commun}</p>
       <p>city or province: {employee?.address.city_or_province}</p>
       <p>country: {employee?.address.country}</p>
     </div>
    :
      "No address available",
      icon: MapPin,
      color: "text-orange-600",
    },
    {
      label: "Shift",
      value: formatOptional(employee?.shift),
      icon: Clock,
      color: "text-indigo-600",
    },
  ];
  const address_emp = [
    {
       
      label: "Village",
      value: formatOptional(employee?.address.village),
      icon: MapPin,
      color: "text-orange-600",
    
    },
      {
       
      label: "Community",
      value: formatOptional(employee?.address.commun),
      icon: MapPin,
      color: "text-orange-600",
    
    },
      {
       
      label: "City_or_province",
      value: formatOptional(employee?.address.city_or_province),
      icon: MapPin,
      color: "text-orange-600",
    
    },
      {
       
      label: "Country",
      value: formatOptional(employee?.address.country),
      icon: MapPin,
      color: "text-orange-600",
    
    }
  ]


  const employeeDetailsAudit = [
    {
      label: "Created Date",
      value: formatDate(employee?.createdDate),
      icon: Calendar,
      color: "text-cyan-600",
    },
    {
      label: "Created By",
      value: formatOptional(employee?.createBy),
      icon: UserCheck,
      color: "text-teal-600",
    },
    {
      label: "Last Modified Date",
      value: formatDate(employee?.lastModifiedDate),
      icon: Calendar,
      color: "text-sky-600",
    },
    {
      label: "Last Modified By",
      value: formatOptional(employee?.lastModifiedBy),
      icon: UserCheck,
      color: "text-cyan-700",
    },
    {
      label: "Deleted Date",
      value: formatDate(employee?.deletedDate),
      icon: Trash2,
      color: "text-red-600",
    },
    {
      label: "Deleted By",
      value: formatOptional(employee?.deletedBy),
      icon: Trash2,
      color: "text-red-700",
    },
  ];

  return (
    <div className="fixed inset-0 bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 p-6 flex flex-col">
      <div className="mx-auto max-w-7xl w-full flex flex-col flex-1">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard/employees")}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            <ChevronLeft size={16} />
            Back to Employees
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* Left Column - Header and Audit Details */}
          <div className="space-y-4">
            <EmployeeHeaderCard employee={employee} />
            <EmployeeDetailCard employee={employeeDetailsAudit} title="Audit Information" />
          </div>

          {/* Right Column - Employee Details (Only This Scrolls) */}
          <div className="h-full overflow-y-auto pr-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <EmployeeDetailCard employee={employeeDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}