import EmployeeDetailRow from "./employeedetailrow";

interface EmployeeDetailCardProps {
  employee: {
    icon: React.ComponentType<{ size: number }>;
    color: string;
    label: string;
    value: React.ReactNode;
  }[];
  title?: string;
}

export default function EmployeeDetailCard({
  employee,
  title = "Employee Information",
}: EmployeeDetailCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-100/50 px-6 py-4">
        <h2 className="font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="divide-y divide-slate-200">
        {employee.map((detail, index) => {
          const IconComponent = detail.icon;
          return (
            <EmployeeDetailRow
              key={index}
              icon={IconComponent}
              color={detail.color}
              label={detail.label}
              value={detail.value}
            />
          );
        })}
      </div>
    </div>
  );
}
