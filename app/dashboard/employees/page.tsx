"use client";
import { useRouter } from "next/navigation";

import type { Employee } from "../../types/employee";
import { useEmployeeSearch } from "@/hooks/employee_api";
import buildQueryString from "@/app/lib/actions/buildQueryUrl";
import { useState } from "react";
import FilterSearch from "@/app/lib/actions/filter_search";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import CreateEmployeePage from "./_components/createEmployee";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { DeleteEmployeeDialog } from "./_components/deleteDailog";
import CreateButton from "@/components/ui/CreateButton";

export default function EmployeesPage() {
  const size = 10;
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    size,
    isPage: true,
  });

  const router = useRouter();

  const MapFilter: Record<string, Record<string, string>> = {
    status: {
      All: "",
      ACTIVE: "active",
      INACTIVE: "inactive",
      SUSPENDED: "suspended",
      DELETED: "deleted",
    },
    created_date: {
      All: "",
    },
  };

  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [createEmployeeModalOpen, setCreateEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<
    Employee | undefined
  >();
  const [refetchKey, setRefetchKey] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [page, setPage] = useState(1);

  const queryString = buildQueryString(submittedFilters);
  const url = queryString ? `/auth/search?${queryString}` : "/auth/search";
  // Properly construct URL with refetch parameter
  const urlWithRefetch = `${url}${queryString ? "&" : "?"}__refetch=${refetchKey}`;
  const { data, loading, error } = useEmployeeSearch(urlWithRefetch);
  const handleFilterChange = (
    key: string,
    value: string | number | boolean,
  ) => {
    const nextFilters = {
      ...filters,
      [key]: value,
      page: key === "search" && value !== "" ? filters.page : 1,
    };
    setFilters(nextFilters);

    if (key !== "search" || value === "") {
      setSubmittedFilters(nextFilters);
      setRefetchKey((prev) => prev + 1);
    }
  };
  const employees = data?.data;
  const employeeList = employees?.employees ?? [];
  const totalPages = Math.max(
    1,
    Math.ceil((employees?.totalEmployees ?? employeeList.length) / size),
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSubmittedFilters((prev) => ({ ...prev, page: newPage }));
    setRefetchKey((prev) => prev + 1);
  };

  const columns: Column<(typeof employeeList)[0]>[] = [
    {
      key: "employeeId",
      label: "emp_id",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="font-medium text-gray-900">{String(value)}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "username",
      label: "Username",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-500 truncate max-w-xs">{String(value)}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
    {
      key: "role",
      label: "Role",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700 capitalize">{String(value)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "whitespace-nowrap",
      render: (value) => (
        <span className="text-gray-700 capitalize">{String(value)}</span>
      ),
    },
  ];

  const actions: Action<(typeof employeeList)[0]>[] = [
    {
      label: "View",
      color: "blue",
      onClick: (row) => router.push(`/dashboard/employees/${row.id}`),
    },
    {
      label: "Update",
      color: "gray",
      onClick: (row) => {
        setSelectedEmployee(row);
        setCreateEmployeeModalOpen(true);
      },
    },
    {
      label: "Delete",
      color: "red",
      onClick: (row) => {
        setSelectedEmployee(row);
        setOpenDeleteDialog(true);
      },
    },
  ];

  if (loading)
    return (
      <HandleResponse>
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
        >
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-sm font-medium text-gray-600">
            Loading employees...
          </span>
        </div>
      </HandleResponse>
    );
  if (error)
    return (
      <HandleResponse>
        <div
          role="alert"
          className="flex w-full max-w-md items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="text-sm">
            <p className="font-semibold text-red-800">
              Error fetching employees
            </p>
            <p className="mt-1 break-words text-red-700">{String(error)}</p>
          </div>
        </div>
      </HandleResponse>
    );
  if (!data)
    return (
      <HandleResponse>
        <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <Inbox className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            No employee data available
          </p>
          <p className="text-xs text-gray-500">
            New employee records will appear here once they are created.
          </p>
        </div>
      </HandleResponse>
    );

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-end mb-4">
          {/* <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Employee Management
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              Employees Overview
            </h1>
          </div> */}

            <CreateButton
              label="Create Employee"
              onClick={() => {
                setSelectedEmployee(undefined);
                setCreateEmployeeModalOpen(true);
              }}
            />

        </div>
      </div>

      <CreateEmployeePage
        open={createEmployeeModalOpen}
        isUpdate={Boolean(selectedEmployee)}
        initialEmployee={selectedEmployee}
        onClose={() => {
          setCreateEmployeeModalOpen(false);
          setSelectedEmployee(undefined);
        }}
        onSubmit={(values) => {
          console.log(
            selectedEmployee
              ? "Updated employee values:"
              : "New employee values:",
            values,
          );
          setCreateEmployeeModalOpen(false);
          setSelectedEmployee(undefined);
          setRefetchKey((prev) => prev + 1);
        }}
      />

      <DeleteEmployeeDialog
        open={openDeleteDialog}
        employeeId={selectedEmployee?.id ?? 0}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedEmployee(undefined);
          setRefetchKey((prev) => prev + 1);
        }}
      />

      <FilterSearch
        mapFilter={MapFilter}
        filterValues={filters}
        onFilterChange={handleFilterChange}
        searchValue={filters.search}
        onSearchChange={(e) => handleFilterChange("search", e.target.value)}
        onSearchKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setSubmittedFilters(filters);
            setRefetchKey((prev) => prev + 1);
          }
        }}
      />

      <WidgetTable
        title="Employee List"
        subtitle={`Showing ${employeeList.length} of ${employees?.totalEmployees ?? 0} employees`}
        columns={columns}
        data={employeeList}
        actions={actions}
        emptyMessage="No employees found."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-gray-50"
        onPageChange={handlePageChange}
        currentPage={page}
        toatalRecords={employees?.totalEmployees ?? employeeList.length}
        totalPages={totalPages}
      />
    </div>
  );
}
