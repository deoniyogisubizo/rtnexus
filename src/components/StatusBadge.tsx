interface StatusBadgeProps {
  title: string;
  label: string;
  count: number;
  onClick?: () => void;
  hoverHint?: string;
}

export default function StatusBadge({ title, label, count, onClick, hoverHint }: StatusBadgeProps) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`flex flex-col bg-white border border-gray-200 px-2.5 py-2 w-full outline-none min-h-[72px] group ${onClick ? 'hover:border-[#3373AB] hover:shadow-sm cursor-pointer transition-all' : ''}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-gray-700 tracking-[0.12em]">{title}</p>
        <p className="text-base font-bold text-gray-900 leading-none">{count}</p>
      </div>
      <p className="text-[10px] text-gray-500 mt-3 text-right leading-tight group-hover:hidden">{label}</p>
      {onClick && (
        <p className="text-[10px] text-[#3373AB] mt-3 text-right leading-tight font-medium hidden group-hover:block">{hoverHint || 'Click to manage'}</p>
      )}
    </Comp>
  );
}
