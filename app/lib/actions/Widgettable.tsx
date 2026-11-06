"use client";

import { BookResponse } from "@/app/types/book";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

// Type definitions
interface Column<T> {
  key: keyof T;
  icon?: ReactNode;
  hindenIcon?: (row: T) => boolean;
  label: string;
  width?: string;
  onIconClick?: (row: T) => void;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface Action<T> {
  label?: string;
  color?: "blue" | "gray" | "red" | "green";
  onClick: (row: T) => void;
}

interface WidgetTableProps<T> {
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[] | ((row: T) => Action<T>[]);
  emptyMessage?: string;
  headerBgColor?: string;
  rowHoverColor?: string;
  accentColor?: string;
  enableInternalSearch?: boolean;
  onPageChange?: (newPage: number) => void;
  currentPage?: number;
  toatalRecords?: number;
  totalPages?: number;
}

const WidgetTable = <T,>({
  title,
  subtitle,
  columns,
  data,
  actions = [],
  emptyMessage = "No records found.",
  headerBgColor = "bg-gray-50",
  rowHoverColor = "hover:bg-blue-50",
  accentColor = "blue",
  enableInternalSearch = false,
  onPageChange,
  currentPage,
  toatalRecords,
  totalPages,
}: WidgetTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const getRowKey = (row: T, fallback: number): string | number => {
    if (typeof row === "object" && row !== null && "id" in row) {
      const id = row.id;
      if (typeof id === "string" || typeof id === "number") {
        return id;
      }
    }
    return fallback;
  };

  // Sync filteredData when data prop changes from API fetch
  useEffect(() => {
    if (!enableInternalSearch) {
      setFilteredData(data);
      setSearchQuery("");
    } else {
      // Re-apply search filter to new data
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const filtered = data.filter((row) =>
          columns.some((col) => {
            const value = row[col.key];
            return String(value).toLowerCase().includes(query);
          }),
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(data);
      }
    }
  }, [data, enableInternalSearch, searchQuery, columns]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredData(data);
      return;
    }

    // Search: match any column
    const filtered = data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        return String(value).toLowerCase().includes(query);
      }),
    );
    setFilteredData(filtered);
  };

  const displayData = filteredData;
  const hasActions = typeof actions === "function" || actions.length > 0;

  const getActionColor = (
    color?: "blue" | "gray" | "red" | "green",
  ): string => {
    const colors: Record<string, string> = {
      blue: "bg-blue-600 hover:bg-blue-700 text-white",
      gray: "bg-gray-100 hover:bg-gray-200 text-gray-700",
      red: "bg-red-600 hover:bg-red-700 text-white",
      green: "bg-green-600 hover:bg-green-700 text-white",
    };
    return colors[color || "blue"];
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>

        {enableInternalSearch && (
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search..."
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Content */}
      {displayData.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="max-h-[calc(100vh-300px)] min-h-64 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Head */}
            <thead className={`sticky top-0 z-20 ${headerBgColor}`}>
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    scope="col"
                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 sm:px-6 ${
                      col.width ? col.width : ""
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
                {hasActions && (
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 sm:px-6"
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 bg-white">
              {displayData.map((row, rowIndex) => (
                <tr
                  key={getRowKey(row, rowIndex)}
                  className={`transition-colors ${rowHoverColor}`}
                >
                  {/* Data Cells */}
                  {columns.map((col) => (
                    <td
                      key={`${getRowKey(row, rowIndex)}-${String(col.key)}`}
                      className={`px-4 py-4 text-sm text-gray-900 sm:px-6 ${col.width ? col.width : ""}`}
                    >
                      <div className="flex gap-2">
                        {col.render
                          ? col.render(row[col.key], row)
                          : (row[col.key] as ReactNode) || "—"}
                        {/* <button
                          type="button"
                          onClick={() => col.onIconClick?.(row)}
                        > */}
                          {col.hindenIcon?.(row) && (
                            <button
                              type="button"
                              onClick={() => col.onIconClick?.(row)}
                            >
                              {col.icon}
                            </button>
                          )}
                        {/* </button> */}
                      </div>
                    </td>
                  ))}

                  {/* Action Buttons */}
                  {hasActions && (
                    <td className="whitespace-nowrap px-4 py-4 text-sm sm:px-6">
                      <div className="flex items-center gap-2">
                        {(typeof actions === "function"
                          ? actions(row)
                          : actions
                        ).map((action, idx) => {
                          const label =
                            action.label ??
                            ["View", "Edit", "Delete"][idx] ??
                            `Action ${idx + 1}`;
                          const normalizedLabel = label.toLowerCase();
                          const iconSrc = normalizedLabel.includes("view")
                            ? "/icons/view.png"
                            : normalizedLabel.includes("edit") ||
                                normalizedLabel.includes("update")
                              ? "/icons/edit.png"
                              : normalizedLabel.includes("delete") ||
                                  normalizedLabel.includes("remove")
                                ? "/icons/delete.png"
                                : undefined;

                          return (
                            <button
                              key={`${label}-${idx}`}
                              type="button"
                              aria-label={label}
                              title={label}
                              onClick={() => action.onClick(row)}
                              className={`inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${getActionColor(action.color)}`}
                            >
                              {iconSrc ? (
                                <Image
                                  src={iconSrc}
                                  alt=""
                                  width={20}
                                  height={20}
                                  className="h-5 w-5 shrink-0 object-contain"
                                />
                              ) : (
                                label
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-4 py-3 text-left text-sm text-gray-500 sm:px-6"
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <span>
                      Showing {displayData.length} of{" "}
                      {toatalRecords ?? displayData.length} records
                    </span>
                    <div className="ml-auto flex items-center gap-5">
                      {onPageChange && (
                        <button
                          onClick={() =>
                            onPageChange(Math.max(1, (currentPage ?? 1) - 1))
                          }
                          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={(currentPage ?? 1) <= 1}
                        >
                          Previous
                        </button>
                      )}

                      <p className="text-sm text-gray-600">
                        Page {currentPage ?? 1} of {totalPages ?? 1}
                      </p>

                      {onPageChange && (
                        <button
                          onClick={() => onPageChange((currentPage ?? 1) + 1)}
                          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={
                            typeof totalPages === "number"
                              ? (currentPage ?? 1) >= totalPages
                              : false
                          }
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default WidgetTable;
export type { Column, Action, WidgetTableProps };
