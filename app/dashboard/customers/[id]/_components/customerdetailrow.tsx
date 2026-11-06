
interface CustomerDetailRowProps {
  label: string;
  value: string | null | undefined;
  icon: React.ComponentType<{ size: number }>;
  color: string;
}

export default function CustomerDetailRow({
  label,
  value,
  icon: Icon,
  color,
}: CustomerDetailRowProps) {
  return (
    <div className="flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg bg-slate-100 p-2 ${color}`}>
          <Icon size={18} />
        </div>
        <label className="text-sm font-medium text-slate-600">{label}</label>
      </div>
      <div className="text-sm font-semibold text-slate-900 sm:text-right">
        {value || "N/A"}
      </div>
    </div>
  );
}