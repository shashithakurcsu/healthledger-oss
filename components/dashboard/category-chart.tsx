'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface CategoryData {
  category: string;
  amount: number;
  label: string;
  [key: string]: string | number;
}

interface CategoryChartProps {
  data: CategoryData[];
}

const COLORS = [
  '#0d9488', // teal-600
  '#0891b2', // cyan-600
  '#2563eb', // blue-600
  '#7c3aed', // violet-600
  '#db2777', // pink-600
  '#ea580c', // orange-600
  '#65a30d', // lime-600
  '#dc2626', // red-600
  '#6366f1', // indigo-500
  '#14b8a6', // teal-500
];

export function CategoryChart({ data }: CategoryChartProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No expense data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="amount"
          nameKey="label"
          label={({ name, percent }) =>
            `${name}: ${((percent || 0) * 100).toFixed(0)}%`
          }
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
