"use client";
import { useCustomerList } from "@/hooks/customer_api";
import buildQueryString from "@/app/lib/actions/buildQueryUrl";
import { useEffect, useState } from "react";
import FilterSearch from "@/app/lib/actions/filter_search";
import WidgetTable, { Action, Column } from "@/app/lib/actions/Widgettable";
import CreateCustomerPage from "./_components/createCustomer";
import { useRouter } from "next/navigation";
import HandleResponse from "@/components/ui/handleResponse";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { DeleteCustomerDialog } from "./_components/deleteCustomerDialog";
import { Customer } from "@/app/types/customer";
import CreateButton from "@/components/ui/CreateButton";

export default function CustomersPage() {
  const size = 10;
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    size,
    isPage: true,
  });

  const MapFilter: Record<string, Record<string, string>> = {
    status: {
      All: "",
      ACTIVE: "ACTIVE",
      INACTIVE: "INACTIVE",
      SUSPENDED: "SUSPENDED",
      DELETED: "DELETED",
    },
    created_date: {
      All: "",
    },
  };
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("role") === "ADMIN");
  }, []);
  const route = useRouter();

  const [createCustomerModalOpen, setCreateCustomerModalOpen] = useState(false);
  const [submittedFilters, setSubmittedFilters] = useState(filters);
  const [refetchKey, setRefetchKey] = useState(0);
  const [page, setPage] = useState(1);
  const [updateCustomer, setUpdateCustomer] = useState<
    (typeof customerList)[0] | undefined
  >(undefined);
  const [deleteCustomerModalOpen, setDeleteCustomerModalOpen] = useState(false);
  const queryString = buildQueryString(submittedFilters);
  const url = queryString
    ? `/customers/list?${queryString}`
    : "/customers/list";
  // Properly construct URL with refetch parameter
  const urlWithRefetch = `${url}${queryString ? "&" : "?"}__refetch=${refetchKey}`;
  const { data, loading, error } = useCustomerList(urlWithRefetch);
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
  const customers = data?.data;
  const customerList = customers?.customers ?? [];
  const totalPages = Math.max(
    1,
    Math.ceil((customers?.totalCustomers ?? customerList.length) / size),
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
    setSubmittedFilters((prev) => ({ ...prev, page: newPage }));
    setRefetchKey((prev) => prev + 1);
  };

  const columns: Column<(typeof customerList)[0]>[] = [
      {
      key: "customerId",
      label: "ID",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },{
      key: "firstName",
      label: "Name",
      width: "whitespace-nowrap",
      render: (_, row) => (
        <span className="font-medium text-gray-900">
          {row.firstName} {row.lastName}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
      {
      key: "phone",
      label: "Phone",
      width: "whitespace-nowrap",
      render: (value) => <span className="text-gray-700">{String(value)}</span>,
    },
       {
      key: "emailVerified",
      label: "Verify Email",
      width: "whitespace-nowrap",
      render: (value) => {
        if(value == false){
           return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
              Inactive
            </span>
          );
        }else{
return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-green-800">
              active
            </span>
          );
        }
      }
    },
  
    {
      key: "status",
      label: "Status",
      width: "whitespace-nowrap",
      render: (value) => {
        if (value === "SUSPENDED") {
          return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
              Suspended
            </span>
          );
        }
        if (value === "DELETED") {
          return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
              Deleted
            </span>
          );
        }
        if (value === "ACTIVE") {
          return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              Active
            </span>
          );
        }
        if (value === "INACTIVE") {
          return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
              Inactive
            </span>
          );
        }
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
      },
    },
  ];

  const actions: Action<(typeof customerList)[0]>[] = [
    {
      label: "View",
      color: "blue",
      onClick: (row) => route.push(`/dashboard/customers/${row.id}`),
    },
    ...(isAdmin
      ? [
          {
            label: "Update",
            color: "gray" as const,
            onClick: (row: Customer) => {
              setCreateCustomerModalOpen(true);
              setUpdateCustomer(row);
            },
          },
          {
            label: "Delete",
            color: "red" as const,
            onClick: (row: Customer) => {
              setDeleteCustomerModalOpen(true);
              setUpdateCustomer(row);
            },
          },
        ]
      : []),
  ];

  if (loading) {
    return (
      <HandleResponse>
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
        >
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-sm font-medium text-gray-600">
            Loading customers...
          </span>
        </div>
      </HandleResponse>
    );
  }

  if (error) {
    return (
      <HandleResponse>
        <div
          role="alert"
          className="flex w-full max-w-md items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="text-sm">
            <p className="font-semibold text-red-800">
              Error fetching customers
            </p>
            <p className="mt-1 break-words text-red-700">{String(error)}</p>
          </div>
        </div>
      </HandleResponse>
    );
  }

  if (!data) {
    return (
      <HandleResponse>
        <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <Inbox className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            No customer data available.
          </p>
          <p className="text-xs text-gray-500">
            New customers will appear here once they are added.
          </p>
        </div>
      </HandleResponse>
    );
  }
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-end">
        {/* <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Overview
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        </div> */}
        {isAdmin && (
          <CreateButton
            label="Create Customer"
            onClick={() => {
              setCreateCustomerModalOpen(true);
              setUpdateCustomer(undefined);
            }}
          />
        )}
      </div>
      <CreateCustomerPage
        isUpdate={Boolean(updateCustomer)}
        initialCustomer={updateCustomer}
        open={createCustomerModalOpen}
        onClose={() => setCreateCustomerModalOpen(false)}
        onSubmit={() => {
          setCreateCustomerModalOpen(false);
          setRefetchKey((prev) => prev + 1);
        }}
      />

      <DeleteCustomerDialog
        open={deleteCustomerModalOpen}
        customerId={updateCustomer?.id ?? ""}
        onClose={() => setDeleteCustomerModalOpen(false)}
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
        title="Customer List"
        subtitle="Manage customer accounts"
        columns={columns}
        data={customerList}
        actions={actions}
        emptyMessage="No customers found."
        headerBgColor="bg-gray-50"
        rowHoverColor="hover:bg-blue-50"
        onPageChange={handlePageChange}
        currentPage={page}
        toatalRecords={customers?.totalCustomers ?? customerList.length}
        totalPages={totalPages}
      />
    </div>
  );
}
