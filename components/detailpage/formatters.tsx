/**
 * formatDate: Converts ISO date string to readable format
 * Returns "—" if value is missing or invalid
 */
export function formatDate(value?: string): string {
  if (!value) return "—";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

/**
 * formatOptional: Converts any value to string or "—" if falsy
 */
export function formatOptional(value: unknown): string {
  return value ? String(value) : "—";
}

/**
 * formatCurrency: Formats number as USD currency
 */
export function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return "—";
  return `$${value.toFixed(2)}`;
}

/**
 * calculatePaymentPercentage: Calculates payment completion percentage
 */
export function calculatePaymentPercentage(
  paid?: number,
  total?: number
): number {
  if (!total || total === 0) return 0;
  if (!paid) return 0;
  return (paid / total) * 100;
}