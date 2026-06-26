import { ChevronRight, Home } from 'lucide-react';

interface Crumb {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  segments: Crumb[];
  theme?: 'light' | 'dark';
}

export default function Breadcrumb({ segments, theme = 'light' }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-xs font-mono py-2 px-0 -mt-2">
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={8} className="text-gray-300" />}
            {i === 0 && <Home size={8} className="text-gray-400" />}
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
