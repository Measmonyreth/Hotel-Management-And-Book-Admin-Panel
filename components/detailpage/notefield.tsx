import React from "react";

interface NoteFieldProps {
  label: string;
  value: string | number | undefined | null;
  className?: string;
  valueClassName?: string;
  icon?: React.ReactNode;
}

/**
 * NoteField: Displays a label-value pair
 * Maps key → value format for consistent data display
 */
export const NoteField: React.FC<NoteFieldProps> = ({
  label,
  value,
  className = "",
  valueClassName = "text-gray-900 font-medium",
  icon,
}) => {
  const displayValue = value ? String(value) : "—";

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-gray-400">{icon}</span>}
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className={`text-sm ${valueClassName}`}>{displayValue}</p>
    </div>
  );
};

interface NoteFieldGridProps {
  fields: NoteFieldProps[];
  columns?: 1 | 2 | 3 | 4;
  gap?: string;
}

/**
 * NoteFieldGrid: Renders multiple NoteFields in a grid layout
 */
export const NoteFieldGrid: React.FC<NoteFieldGridProps> = ({
  fields,
  columns = 2,
  gap = "gap-3",
}) => {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={`grid ${colClasses[columns]} ${gap}`}>
      {fields.map((field, idx) => (
        <NoteField key={idx} {...field} />
      ))}
    </div>
  );
};