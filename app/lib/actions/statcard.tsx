import React from 'react';

interface StatData {
  label: string;
  value: string | number;
}

interface StatGridProps {
  stats: StatData[];
  columns?: 2 | 3 | 4;
}

const StatGrid: React.FC<StatGridProps> = ({ stats, columns = 4 }) => {
  const gridClass = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
  };

  return (
    <div className={`grid gap-3 ${gridClass[columns]}`}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <p className="text-xs text-gray-500">{stat.label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatGrid;
export type { StatData, StatGridProps };