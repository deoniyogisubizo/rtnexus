import { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight, Package } from 'lucide-react';
import { FEATURED_PRODUCTS } from '../data/mockData';
import { searchAll, SearchResultItem } from '../utils/search';

interface RTShopShowcaseProps {
  setView: (view: string) => void;
  theme?: 'light' | 'dark';
  onSelectProduct: (productId: string) => void;
  onSelectCategory?: (category: string) => void;
}

export default function RTShopShowcase({ setView, theme = 'light', onSelectProduct, onSelectCategory }: RTShopShowcaseProps) {
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { results, suggestion } = searchAll(search);

  const categoryMap = new Map<string, (typeof FEATURED_PRODUCTS)[number]>();
  FEATURED_PRODUCTS.forEach(p => {
    if (!categoryMap.has(p.category)) categoryMap.set(p.category, p);
  });
  const categories = Array.from(categoryMap.entries()).map(([name, product]) => ({ name, product }));

  const categoryNames = new Set(results.filter(r => r.type === 'category').map(r => r.label));
  const productResults = results.filter(r => r.type === 'product');
  const hasCategoryMatch = results.some(r => r.type === 'category');
  const hasProductMatch = results.some(r => r.type === 'product');
  const noResults = search.trim() && results.length === 0;

  const gridCategories = search.trim()
    ? categories.filter(c => categoryNames.has(c.name) || productResults.some(p => p.product.category === c.name))
    : categories;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const bg = isDark ? 'bg-[#1a1a1a] text-gray-200' : 'bg-[#FAFAFA] text-gray-900';
  const cardBg = isDark ? 'bg-[#222] border-gray-700' : 'bg-white border-gray-200';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderCls = isDark ? 'border-gray-800' : 'border-gray-200';
  const dropdownBg = isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200';

  return (
    <section className={`w-full select-none py-14 px-6 font-sans border-b ${bg} ${borderCls}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div className="border-l-4 border-[#3373AB] pl-4">
            <p className="text-xs font-mono tracking-widest text-[#3373AB] uppercase font-bold">RT SHOP</p>
            <h2 className="text-lg font-bold uppercase tracking-tight mt-0.5">Shop by Category</h2>
          </div>
          <div ref={ref} className="relative w-64">
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted} z-10`} />
            <input
              type="text"
              placeholder="Search products & categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              className={`w-full border pl-9 pr-3 py-2 text-xs outline-none transition-colors ${isDark ? 'bg-[#222] border-gray-700 text-gray-200 placeholder-gray-500 focus:border-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#3373AB]'}`}
            />

            {focused && search.trim() && (
              <div className={`absolute top-full left-0 right-0 mt-1 border shadow-lg z-20 max-h-72 overflow-y-auto ${dropdownBg}`}>
                {noResults ? (
                  <div className="p-3 space-y-2">
                    <p className={`text-xs ${textMuted}`}>No results for "<span className="font-semibold">{search}</span>"</p>
                    {suggestion && (
                      <button
                        onClick={() => setSearch(suggestion)}
                        className="text-xs text-[#3373AB] hover:underline block"
                      >
                        Are you looking for "<span className="font-semibold">{suggestion}</span>"?
                      </button>
                    )}
                    <button
                      onClick={() => { setView('shop'); setFocused(false); }}
                      className="text-xs text-[#3373AB] border border-[#3373AB]/30 hover:border-[#3373AB] px-2.5 py-1 inline-flex items-center gap-1 transition-colors mt-1"
                    >
                      <Package size={12} /> Search in products <ArrowRight size={10} />
                    </button>
                  </div>
                ) : (
                  <div>
                    {categoryNames.size > 0 && (
                      <div>
                        <div className={`text-[9px] font-mono uppercase tracking-widest px-3 pt-2 pb-1 ${textMuted}`}>Categories</div>
                        {results.filter(r => r.type === 'category').map(r => (
                          <button
                            key={r.label}
                            onClick={() => { setSearch(r.label); setFocused(false); }}
                            className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
                          >
                            <span className={isDark ? 'text-gray-200' : 'text-gray-800'}>{r.label}</span>
                            <ArrowRight size={11} className={textMuted} />
                          </button>
                        ))}
                      </div>
                    )}
                    {productResults.length > 0 && (
                      <div>
                        <div className={`text-[9px] font-mono uppercase tracking-widest px-3 pt-2 pb-1 ${textMuted}`}>Products</div>
                        {productResults.slice(0, 5).map(r => (
                          <button
                            key={r.product.id}
                            onClick={() => { onSelectProduct(r.product.id); setFocused(false); }}
                            className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-3 hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
                          >
                            <span className="font-mono font-bold text-[11px] text-[#D95907] whitespace-nowrap w-24 text-right">
                              RWF {r.product.price.toFixed(2)}
                            </span>
                            <span className={`truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{r.label}</span>
                          </button>
                        ))}
                        {productResults.length > 5 && (
                          <button
                            onClick={() => { setView('shop'); setFocused(false); }}
                            className={`w-full text-left px-3 py-1.5 text-xs ${textMuted} hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors italic`}
                          >
                            +{productResults.length - 5} more products...
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-[#e5e5e5] border border-[#e5e5e5]">
          {gridCategories.slice(0, 12).map(({ name, product }) => (
            <div
              key={name}
              onClick={() => { onSelectCategory?.(name); setView('shop'); }}
              className={`flex flex-col ${cardBg} p-4 relative group hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-pointer`}
            >
              <div className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full border border-gray-400/30 text-gray-500 group-hover:bg-[#3373AB] group-hover:text-white group-hover:border-[#3373AB] transition-all duration-200">
                <ArrowRight size={13} className="-rotate-45" />
              </div>
              <div className="h-28 sm:h-32 flex items-center justify-center mb-3 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <span className={`text-xs sm:text-sm font-mono tracking-widest uppercase font-bold sm:font-black ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{name}</span>
            </div>
          ))}
        </div>

        {gridCategories.length > 12 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setView('shop')}
              className="border border-[#3373AB]/30 hover:border-[#3373AB] text-[#3373AB] font-mono text-xs uppercase tracking-widest px-5 py-2.5 transition-colors inline-flex items-center gap-2"
            >
              View All Categories <ArrowRight size={12} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
