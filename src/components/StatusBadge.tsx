interface StatusBadgeProps {
  label: string;
  count: number;
  color?: string;
}

export default function StatusBadge({ label, count, color = 'bg-gray-500' }: StatusBadgeProps) {
  return (
    <div className="flex items-center gap-2.5 bg-gray-50 rounded-lg p-3">
      <span className={`h-3 w-3 rounded-full ${color} shrink-0`} />
      <div>
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-gray-900 -mt-0.5">{count}</p>
      </div>
    </div>
  );
}
