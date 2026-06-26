import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon?: ReactNode;
}

export default function MetricCard({ title, value, trend, icon }: MetricCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend !== undefined && (
          trend > 0 ? (
            <span className="flex items-center gap-[2px] text-xs font-semibold text-emerald-600 mb-[3px]">
              <TrendingUp size={12} />+{trend}%
            </span>
          ) : trend < 0 ? (
            <span className="flex items-center gap-[2px] text-xs font-semibold text-red-600 mb-[3px]">
              <TrendingDown size={12} />{trend}%
            </span>
          ) : (
            <span className="flex items-center gap-[2px] text-xs font-semibold text-gray-400 mb-[3px]">
              <Minus size={12} />0%
            </span>
          )
        )}
      </div>
    </div>
  );
}
