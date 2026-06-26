import { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight, ChevronRight, Package } from 'lucide-react';
import { fetchProducts, fetchCategories } from '../services/api';
import { searchAll } from '../utils/search';

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
  const [showcaseProducts, setShowcaseProducts] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts().then(setShowcaseProducts).catch(() => {});
    fetchCategories().then(setCategoriesList).catch(() => {});
  }, []);

  const { results, suggestion } = searchAll(search, showcaseProducts);

  const categories = categoriesList.map(cat => {
    const product = showcaseProducts.find(p => p.category === cat.name);
    return { name: cat.name, image: product?.image || cat.thumbnail, id: cat.id };
  });

  const categoryNames = new Set(results.filter(r => r.type === 'category').map(r => r.label));
  const productResults = results.filter(r => r.type === 'product');
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
            <p className="text-xs tracking-widest text-[#3373AB] uppercase font-bold" style={{ fontFamily: "'Jarvane', serif" }}>RT SHOP</p>
            <h2 className="text-lg font-bold tracking-tight mt-0.5 capitalize">Shop by category</h2>
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
                        <div className={`text-xs font-mono uppercase tracking-widest px-3 pt-2 pb-1 ${textMuted}`}>Categories</div>
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
                        <div className={`text-xs font-mono uppercase tracking-widest px-3 pt-2 pb-1 ${textMuted}`}>Products</div>
                        {productResults.slice(0, 5).map(r => (
                          <button
                            key={r.product.id}
                            onClick={() => { onSelectProduct(r.product.id); setFocused(false); }}
                            className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-3 hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
                          >
                            <span className="font-mono font-bold text-xs text-[#D95907] whitespace-nowrap w-24 text-right">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
          {gridCategories.slice(0, 12).map(({ name, image }) => (
            <div
              key={name}
              onClick={() => { onSelectCategory?.(name); setView('shop'); }}
              className={`flex flex-col ${cardBg} relative group hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98] overflow-hidden rounded-sm`}
            >
              <div
                className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center border border-yellow-500/30 text-yellow-600/70 group-hover:bg-yellow-400/20 group-hover:text-yellow-600 group-hover:border-yellow-500/60 transition-all duration-200 z-10 lg:shadow-md lg:group-hover:shadow-lg"
                style={{ borderRadius: '50%' }}
              >
                <ChevronRight size={13} className="-rotate-45" />
              </div>
              <div className="h-32 sm:h-36 flex items-center justify-center overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                    <Package size={40} />
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
              <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-xs font-semibold capitalize text-white text-center leading-tight px-3 line-clamp-2 max-w-[90%]">{name}</span>
            </div>
          ))}
        </div>

        {gridCategories.length > 12 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setView('shop')}
              className="border border-[#3373AB]/30 hover:border-[#3373AB] text-[#3373AB] font-mono text-xs font-bold uppercase tracking-widest px-5 py-2.5 transition-colors inline-flex items-center gap-2"
            >
              View All Categories <ArrowRight size={12} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
