import { ChevronRight, Home } from 'lucide-react';

interface Crumb {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  segments: Crumb[];
  theme?: 'light' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Breadcrumb({ segments, theme = 'light', className = '', size = 'sm' }: BreadcrumbProps) {
  const sizeClass = size === 'lg' ? 'text-sm py-3' : size === 'md' ? 'text-xs py-2.5' : 'text-xs py-2';
  const iconSize = size === 'lg' ? 14 : size === 'md' ? 10 : 8;
  return (
    <nav className={`flex items-center justify-center font-mono ${sizeClass} ${className}`}>
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={iconSize} className="text-gray-300" />}
            {i === 0 && <Home size={iconSize} className="text-gray-400" />}
            {isLast ? (
              <span className="text-[#3373AB] font-semibold">{seg.label}</span>
            ) : (
              <button
                onClick={seg.onClick}
                className="text-gray-500 hover:text-[#3373AB] transition-colors"
              >
                {seg.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
