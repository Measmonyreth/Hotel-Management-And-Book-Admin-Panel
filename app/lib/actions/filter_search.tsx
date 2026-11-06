import Image from "next/image";

type FilterSearchProps = {
  title?: string
  mapFilter: Record<string, Record<string, string>>;
  filterValues?: Record<string, string | number | boolean>; // widened
  onFilterChange?: (key: string, value: string) => void;
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isCreateDate?: boolean;
};

const formatLabel = (value: string): string => {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function FilterSearch({
  title,
  mapFilter,
  filterValues = {},
  onFilterChange,
  searchValue = "",
  onSearchChange,
  onSearchKeyDown,
  isCreateDate,
}: FilterSearchProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFilterChange?.(key, value);
  };

  return (
    <section className="sticky top-0 z-30 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex justify-between gap-4">
          {/* Filter Dropdowns */}
          <div className="  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(mapFilter).map(([filterName, filterOptions]) => {
              if (filterName === "created_date") {
                return (
                  <div key={filterName}>
                    <label
                      htmlFor={filterName}
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Created Date
                    </label>
                    <input
                      id={filterName}
                      type="date"
                      value={String(filterValues[filterName] ?? "")}
                      onChange={(e) =>
                        handleFilterChange(filterName, e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    />
                  </div>
                );
              }

              return (
                <div key={filterName}>
                  <label
                    htmlFor={filterName}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {formatLabel(filterName)}
                  </label>
                  <select
                    id={filterName}
                    value={String(filterValues[filterName] ?? "")} // stringify, since <select> needs string
                    onChange={(e) =>
                      handleFilterChange(filterName, e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white cursor-pointer"
                  >
                    {Object.entries(filterOptions).map(([key, value]) => (
                      <option key={key} value={value}>
                        {key === "All" ? "All" : formatLabel(key)}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search {title}
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchValue}
                  onChange={onSearchChange}
                  onKeyDown={onSearchKeyDown}
                  placeholder="Search by name, ID, username, or phone..."
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                />
                <Image
                  src="/icons/search.png"
                  alt=""
                  width={16}
                  height={16}
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
