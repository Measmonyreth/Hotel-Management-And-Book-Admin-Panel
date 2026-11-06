interface Filters {
  [key: string]: string | number | boolean;
}

// keys whose param name should stay exactly as written (skip snake_case conversion)
const KEEP_AS_IS = new Set(["page", "size", "isPage"]);

export default function buildQueryString(filterObj: Filters): string {
  return Object.entries(filterObj)
    .filter(
      ([, value]) =>
        value !== undefined && value !== null && String(value).trim() !== "",
    )
    .map(([key, value]) => {
      const paramKey = KEEP_AS_IS.has(key)
        ? key
        : key.replace(/([A-Z])/g, "_$1").toLowerCase();
      return `${paramKey}=${encodeURIComponent(String(value).trim())}`;
    })
    .join("&");
}