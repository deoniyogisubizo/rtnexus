import { useState, useEffect } from 'react';
import { Search, ArrowLeft, Package, BookOpen, Monitor, Sparkles, X, ArrowRight } from 'lucide-react';
import { searchAll } from '../utils/search';
import { fetchProducts } from '../services/api';
import { Product } from '../types';

interface SearchPageProps {
  onBack: () => void;
  onSearch: (query: string) => void;
  onViewProduct?: (id: string) => void;
  setView: (view: string) => void;
}

export default function SearchPage({ onBack, onSearch, onViewProduct, setView }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {});
  }, []);

  const handleSubmit = (q: string) => {
    if (q.trim()) {
      onSearch(q);
    }
  };

  const { results, suggestion } = query.trim() ? searchAll(query, products) : { results: [], suggestion: null };
  const cats = results.filter(r => r.type === 'category');
  const prods = results.filter(r => r.type === 'product');

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-900 outline-none p-1">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 flex items-center border border-gray-300 px-3 py-2 bg-gray-50 rounded-lg">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search products, courses, videos..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit(query); }}
              className="w-full bg-transparent text-sm outline-none text-gray-900 placeholder-gray-400"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 outline-none p-0.5">
                <X size={14} />
              </button>
            )}
          </div>
          <button onClick={() => handleSubmit(query)} className="bg-[#3373AB] text-white text-xs font-semibold px-4 py-2 outline-none hover:bg-[#255C8E] rounded-lg">
            Search
          </button>
        </div>
      </div>

      <div className="p-4">
        {query.trim() ? (
          results.length === 0 ? (
            <div className="text-center py-10">
              <Search size={40} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm text-gray-500">No results for "<span className="font-semibold text-gray-700">{query}</span>"</p>
              {suggestion && (
                <button onClick={() => setQuery(suggestion)} className="mt-2 text-xs text-[#3373AB] hover:underline">
                  Did you mean "<span className="font-semibold">{suggestion}</span>"?
                </button>
              )}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button onClick={() => handleSubmit(query)} className="border border-[#3373AB]/30 text-[#3373AB] text-xs px-3 py-1.5 hover:bg-[#3373AB]/5 rounded-lg">
                  <Package size={12} className="inline mr-1" />Search in Products
                </button>
                <button onClick={() => { setView('rtti'); }} className="border border-[#3373AB]/30 text-[#3373AB] text-xs px-3 py-1.5 hover:bg-[#3373AB]/5 rounded-lg">
                  <BookOpen size={12} className="inline mr-1" />Browse Courses
                </button>
                <button onClick={() => { setView('mttv'); }} className="border border-[#3373AB]/30 text-[#3373AB] text-xs px-3 py-1.5 hover:bg-[#3373AB]/5 rounded-lg">
                  <Monitor size={12} className="inline mr-1" />Browse Videos
                </button>
              </div>
            </div>
          ) : (
            <div>
              {cats.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
                  {cats.map(r => (
                    <button key={r.label} onClick={() => handleSubmit(r.label)} className="flex items-center justify-between w-full px-3 py-2.5 text-sm hover:bg-gray-50 rounded-lg">
                      <span>{r.label}</span>
                      <ArrowRight size={14} className="text-gray-400" />
                    </button>
                  ))}
                </div>
              )}
              {prods.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Products</p>
                  {prods.slice(0, 8).map(r => (
                    <button key={r.product.id} onClick={() => { onViewProduct?.(r.product.id); }} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-gray-50 rounded-lg">
                      <img src={r.product.image} alt={r.product.name} className="h-10 w-10 object-cover rounded border border-gray-100" />
                      <div className="flex-1 text-left">
                        <p className="text-xs font-medium text-gray-900 truncate">{r.product.label}</p>
                        <p className="text-xs text-gray-400">RWF {r.product.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                  {prods.length > 8 && (
                    <button onClick={() => handleSubmit(query)} className="text-xs text-[#3373AB] font-semibold mt-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg w-full text-left">
                      + {prods.length - 8} more products...
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        ) : (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Access</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setView('shop'); }} className="flex items-center gap-3 p-4 border border-gray-200 hover:border-[#3373AB] hover:bg-gray-50 rounded-xl transition-all">
                <Package size={24} className="text-[#3373AB]" />
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">RT Shop</p>
                  <p className="text-xs text-gray-500">Browse products</p>
                </div>
              </button>
              <button onClick={() => { setView('rtti'); }} className="flex items-center gap-3 p-4 border border-gray-200 hover:border-[#3373AB] hover:bg-gray-50 rounded-xl transition-all">
                <BookOpen size={24} className="text-[#3373AB]" />
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">RTTI Courses</p>
                  <p className="text-xs text-gray-500">Learn & certify</p>
                </div>
              </button>
              <button onClick={() => { setView('mttv'); }} className="flex items-center gap-3 p-4 border border-gray-200 hover:border-[#3373AB] hover:bg-gray-50 rounded-xl transition-all">
                <Monitor size={24} className="text-[#3373AB]" />
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">MTTV Videos</p>
                  <p className="text-xs text-gray-500">Watch broadcasts</p>
                </div>
              </button>
              <button onClick={() => { setView('solutions'); }} className="flex items-center gap-3 p-4 border border-gray-200 hover:border-[#3373AB] hover:bg-gray-50 rounded-xl transition-all">
                <Sparkles size={24} className="text-[#3373AB]" />
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">Solutions</p>
                  <p className="text-xs text-gray-500">Explore services</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
