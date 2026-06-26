import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search, SlidersHorizontal, X, Check, ArrowRight, Cpu, Star, ShieldCheck, Package,
  Heart, Eye, GitCompare, ChevronLeft, ChevronRight, Filter, Clock, ShoppingBag
} from 'lucide-react';
import { Product, CartItem } from '../types';
import { fetchProducts, fetchCategories } from '../services/api';

import CartQuantityModal from './CartQuantityModal';
import Breadcrumb from './Breadcrumb';
import { searchAll } from '../utils/search';

interface ShopSectionProps {
  addToCart: (product: Product, quantity?: number) => void;
  searchQuery: string;
  cartItems: CartItem[];
  theme?: 'light' | 'dark';
  onViewProduct?: (id: string) => void;
  preselectCategory?: string | null;
  onClearPreselectCategory?: () => void;
}

const ITEMS_PER_PAGE = 20;
const WISHLIST_KEY = 'rt_wishlist';
const RECENT_KEY = 'rt_recently_viewed';

export default function ShopSection({ addToCart, searchQuery, cartItems, theme = 'light', onViewProduct, preselectCategory, onClearPreselectCategory }: ShopSectionProps) {
  const isDark = theme === 'dark';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [cartProduct, setCartProduct] = useState<Product | null>(null);
  const [cartButtonRect, setCartButtonRect] = useState<DOMRect | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [categoryList, setCategoryList] = useState<{ id: string; name: string }[]>([]);
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);

  // --- New engagement features ---
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const directoryRef = useRef<HTMLDivElement>(null);
  const categoryRailRef = useRef<HTMLDivElement>(null);
  const topRatedRailRef = useRef<HTMLDivElement>(null);
  const budgetRailRef = useRef<HTMLDivElement>(null);
  const recentRailRef = useRef<HTMLDivElement>(null);

  function scrollRail(ref: React.RefObject<HTMLDivElement>, dir: number) {
    ref.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  }

  function scrollToDirectory() {
    directoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function addRecentlyViewed(id: string) {
    setRecentlyViewedIds(prev => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, 10);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function toggleWishlist(id: string, e?: React.MouseEvent) {
    e?.stopPropagation();
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(Array.from(next))); } catch {}
      return next;
    });
  }

  function toggleCompare(id: string, e?: React.MouseEvent) {
    e?.stopPropagation();
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) {
        setNotification('You can compare up to 3 components at a time.');
        setTimeout(() => setNotification(null), 2500);
        return prev;
      }
      return [...prev, id];
    });
  }

  function openQuickView(product: Product, e?: React.MouseEvent) {
    e?.stopPropagation();
    setQuickViewProduct(product);
    setQuickViewQty(1);
    addRecentlyViewed(product.id);
  }

  function handleCardClick(productId: string, productName: string) {
    addRecentlyViewed(productId);
    setLoadingProduct(productName);
    setTimeout(() => onViewProduct?.(productId), 350);
  }

  useEffect(() => {
    fetchProducts().then(data => setProducts(data)).catch(() => {}).finally(() => setLoading(false));
    fetchCategories().then(data => setCategoryList(data)).catch(() => {});
    try {
      const storedWishlist = localStorage.getItem(WISHLIST_KEY);
      if (storedWishlist) setWishlist(new Set(JSON.parse(storedWishlist)));
      const storedRecent = localStorage.getItem(RECENT_KEY);
      if (storedRecent) setRecentlyViewedIds(JSON.parse(storedRecent));
    } catch {}
  }, []);

  useEffect(() => {
    if (preselectCategory) {
      setSelectedCategory(preselectCategory);
      onClearPreselectCategory?.();
    }
  }, [preselectCategory]);

  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [searchQuery, localSearch, selectedCategory, selectedBrand, maxPrice, sortBy, showWishlistOnly]);

  const categories = ['All', ...categoryList.map(c => c.name)];
  const brands = ['All', 'Nexus Embedded Corp', 'Silicon Ventures Ltd', 'Matrix Transducers', 'OmniDrive Robotics'];

  // Derived marketplace data — all computed from real props/state, nothing fabricated
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }, [products]);

  const vendorStats = useMemo(() => {
    const map: Record<string, { count: number; ratingSum: number }> = {};
    products.forEach(p => {
      if (!map[p.vendorName]) map[p.vendorName] = { count: 0, ratingSum: 0 };
      map[p.vendorName].count += 1;
      map[p.vendorName].ratingSum += (p.rating || 0);
    });
    return Object.entries(map)
      .map(([name, d]) => ({ name, count: d.count, avgRating: d.count ? d.ratingSum / d.count : 0 }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  const topRatedProducts = useMemo(() => [...products].sort((a, b) => b.rating - a.rating).slice(0, 8), [products]);
  const budgetProducts = useMemo(() => [...products].sort((a, b) => a.price - b.price).slice(0, 8), [products]);

  const recentlyViewedProducts = useMemo(
    () => recentlyViewedIds.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[],
    [recentlyViewedIds, products]
  );

  const categoryRailItems = useMemo(() => categoryList.map(c => {
    const sample = products.find(p => p.category === c.name);
    return { id: c.id, name: c.name, image: sample?.image, count: categoryCounts[c.name] || 0 };
  }), [categoryList, products, categoryCounts]);

  // cartItems shape may vary by integration — defensively read common shapes
  const cartProductIds = useMemo(() => {
    const ids = new Set<string>();
    (cartItems || []).forEach((item: any) => {
      const id = item?.product?.id ?? item?.productId ?? item?.id;
      if (id) ids.add(id);
    });
    return ids;
  }, [cartItems]);

  const basketCount = useMemo(
    () => (cartItems || []).reduce((sum: number, item: any) => sum + (item?.quantity ?? 1), 0),
    [cartItems]
  );

  // Filter & Search processing
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes((searchQuery || localSearch).toLowerCase()) ||
      product.description.toLowerCase().includes((searchQuery || localSearch).toLowerCase()) ||
      product.category.toLowerCase().includes((searchQuery || localSearch).toLowerCase()) ||
      product.vendorName.toLowerCase().includes((searchQuery || localSearch).toLowerCase());

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'All' || product.vendorName === selectedBrand;
    const matchesPrice = product.price <= maxPrice;
    const matchesWishlist = !showWishlistOnly || wishlist.has(product.id);

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesWishlist;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    return 0; // featured
  });

  const displayedProducts = filteredProducts.slice(0, displayCount);

  const activeFilters: { label: string; onRemove: () => void }[] = [];
  if (localSearch) activeFilters.push({ label: `"${localSearch}"`, onRemove: () => setLocalSearch('') });
  if (selectedCategory !== 'All') activeFilters.push({ label: selectedCategory, onRemove: () => setSelectedCategory('All') });
  if (selectedBrand !== 'All') activeFilters.push({ label: selectedBrand, onRemove: () => setSelectedBrand('All') });
  if (maxPrice < 100000) activeFilters.push({ label: `Under RWF ${maxPrice.toLocaleString()}`, onRemove: () => setMaxPrice(100000) });
  if (showWishlistOnly) activeFilters.push({ label: 'Saved Only', onRemove: () => setShowWishlistOnly(false) });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < filteredProducts.length && !loadingMore) {
          setLoadingMore(true);
          const timer = setTimeout(() => {
            setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length));
            setLoadingMore(false);
          }, 600);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1 }
    );
    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => { if (sentinel) observer.unobserve(sentinel); };
  }, [displayCount, filteredProducts.length, loadingMore]);

  const handleLocalAddToCart = (product: Product, quantity: number = 1) => {
    addToCart(product, quantity);
    setNotification(`Successfully added ${quantity}x "${product.name}" to the RT Escrow Basket.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setMaxPrice(100000);
    setSortBy('featured');
    setShowWishlistOnly(false);
    setDisplayCount(ITEMS_PER_PAGE);
  };

  function renderStars(rating: number, size: number = 11) {
    const rounded = Math.round(rating);
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} size={size} className={i <= rounded ? 'fill-[#D95907] text-[#D95907]' : 'fill-gray-200 text-gray-200'} />
        ))}
        <span className={`text-xs ml-1 font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{rating.toFixed(1)}</span>
      </div>
    );
  }

  // Compact rail card — used by Top Rated / Budget Picks / Recently Viewed rails
  function RailCard({ product, badge }: { product: Product; badge?: string }) {
    return (
      <div
        onClick={() => handleCardClick(product.id, product.name)}
        className={`flex-shrink-0 w-[170px] border cursor-pointer group transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'bg-[#212121] border-gray-800 hover:border-[#3373AB]/50' : 'bg-white border-gray-100 hover:border-[#3373AB]/40 hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)]'}`}
      >
        <div className={`relative h-[110px] flex items-center justify-center p-3 border-b ${isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-[#FAFBFC] border-gray-100'}`}>
          {badge && (
            <span className="absolute top-1.5 left-1.5 bg-[#3373AB] text-white text-[14px] font-mono font-bold uppercase px-1 py-0.5 tracking-wider">
              {badge}
            </span>
          )}
          <button
            onClick={(e) => toggleWishlist(product.id, e)}
            className={`absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center transition-colors ${wishlist.has(product.id) ? 'text-[#D95907]' : (isDark ? 'text-gray-600' : 'text-gray-300')} hover:text-[#D95907]`}
          >
            <Heart size={13} className={wishlist.has(product.id) ? 'fill-[#D95907]' : ''} />
          </button>
          <img src={product.image} alt={product.name} referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-2.5">
          <p className={`text-xs font-bold leading-snug line-clamp-2 mb-1 ${isDark ? 'text-[#5BA3DD]' : 'text-[#0062BD]'}`}>{product.name}</p>
          {renderStars(product.rating, 9)}
          <div className="flex items-center justify-between mt-1.5">
            <span className={`text-xs font-bold ${isDark ? 'text-gray-100' : 'text-[#333E48]'}`}>RWF {product.price.toFixed(0)}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setCartButtonRect(e.currentTarget.getBoundingClientRect()); setCartProduct(product); }}
              className="bg-[#D95907] text-white w-5 h-5 flex items-center justify-center hover:bg-[#B84B05] transition-colors"
            >
              <i className="fa-solid fa-cart-arrow-down" style={{fontSize:'10px'}}></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  function RailHeader({ icon, title, railRef }: { icon: React.ReactNode; title: string; railRef: React.RefObject<HTMLDivElement> }) {
    return (
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          {icon} {title}
        </h3>
        <div className="flex items-center gap-1.5">
          <button onClick={() => scrollRail(railRef, -1)} className={`w-6 h-6 flex items-center justify-center border ${isDark ? 'border-gray-700 text-gray-400 hover:border-[#3373AB]' : 'border-gray-200 text-gray-500 hover:border-[#3373AB]'} hover:text-[#3373AB] transition-colors`}>
            <ChevronLeft size={13} />
          </button>
          <button onClick={() => scrollRail(railRef, 1)} className={`w-6 h-6 flex items-center justify-center border ${isDark ? 'border-gray-700 text-gray-400 hover:border-[#3373AB]' : 'border-gray-200 text-gray-500 hover:border-[#3373AB]'} hover:text-[#3373AB] transition-colors`}>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    );
  }

  function BigSearch() {
    const [q, setQ] = useState('');
    const [focused, setFocused] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const { results, suggestion } = searchAll(q, products);
    const cats = results.filter(r => r.type === 'category');
    const prods = results.filter(r => r.type === 'product');
    const noResults = q.trim() && results.length === 0;

    useEffect(() => {
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
      }
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const inputBg = isDark ? 'bg-[#222] border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400';
    const ddBg = isDark ? 'bg-[#1a1a1a] border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-900';
    const rowHover = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

    return (
      <div ref={ref} className="relative mb-8">
        <div className={`flex items-center border-2 px-5 py-4 transition-all shadow-sm ${focused ? 'border-[#3373AB] shadow-md' : 'border-gray-200'} ${inputBg}`}>
          <Search size={20} className={`${isDark ? 'text-gray-500' : 'text-gray-400'} mr-3 flex-shrink-0`} />
          <input
            type="text"
            placeholder="Search components, part numbers, vendors, categories..."
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            className="bg-transparent text-sm outline-none w-full"
          />
          {q && (
            <button onClick={() => { setQ(''); setFocused(true); }} className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} hover:text-gray-600 flex-shrink-0`}>
              <X size={14} />
            </button>
          )}
        </div>

        {!focused && !q && categoryList.length > 0 && (
          <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1">
            <span className={`text-xs font-mono uppercase tracking-wider flex-shrink-0 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Popular:</span>
            {categoryList.slice(0, 6).map(c => (
              <button
                key={c.id}
                onClick={() => { setSelectedCategory(c.name); scrollToDirectory(); }}
                className={`text-xs px-3 py-1 border flex-shrink-0 transition-colors ${isDark ? 'border-gray-700 text-gray-400 hover:border-[#3373AB] hover:text-[#3373AB]' : 'border-gray-200 text-gray-500 hover:border-[#3373AB] hover:text-[#3373AB]'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {focused && q.trim() && (
          <div className={`absolute top-full left-0 right-0 mt-1 border shadow-lg z-30 max-h-96 overflow-y-auto ${ddBg}`}>
            {noResults ? (
              <div className="p-4 space-y-2">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No results for "<span className="font-semibold">{q}</span>"</p>
                {suggestion && (
                  <button onClick={() => setQ(suggestion)} className="text-sm text-[#3373AB] hover:underline block">
                    Are you looking for "<span className="font-semibold">{suggestion}</span>"?
                  </button>
                )}
              </div>
            ) : (
              <div>
                {cats.length > 0 && (
                  <div>
                    <div className={`text-xs font-mono uppercase tracking-widest px-4 pt-3 pb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Categories</div>
                    {cats.map(r => (
                      <button
                        key={r.label}
                        onClick={() => { setSelectedCategory(r.label); setQ(''); setFocused(false); scrollToDirectory(); }}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${rowHover}`}
                      >
                        <span>{r.label}</span>
                        <ArrowRight size={12} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}
                {prods.length > 0 && (
                  <div>
                    <div className={`text-xs font-mono uppercase tracking-widest px-4 pt-3 pb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Products</div>
                    {prods.slice(0, 6).map(r => (
                      <button
                        key={r.product.id}
                        onClick={() => { onViewProduct?.(r.product.id); setQ(''); setFocused(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${rowHover}`}
                      >
                        <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center border ${isDark ? 'border-gray-700 bg-[#222]' : 'border-gray-100 bg-gray-50'}`}>
                          <img src={r.product.image} alt="" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className="truncate flex-1">{r.label}</span>
                        <span className="font-mono font-bold text-[#D95907] whitespace-nowrap text-right">
                          RWF {r.product.price.toFixed(2)}
                        </span>
                      </button>
                    ))}
                    {prods.length > 6 && (
                      <button
                        className={`w-full text-left px-4 py-2 text-sm italic transition-colors ${isDark ? 'text-gray-500' : 'text-gray-400'} ${rowHover}`}
                        onClick={() => { setQ(''); setFocused(false); }}
                      >
                        +{prods.length - 6} more results...
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  function renderFilters() {
    return (
      <>
        <div className={`flex items-center justify-between border-b pb-3 mb-5 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <span className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <SlidersHorizontal size={14} className="text-[#3373AB]" />
            <span>Refine Results</span>
          </span>
          <button onClick={handleResetFilters} className="text-xs font-mono hover:text-[#3373AB] cursor-pointer text-gray-400">
            [RESET]
          </button>
        </div>

        <button
          onClick={() => setShowWishlistOnly(prev => !prev)}
          className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-2.5 mb-5 border transition-colors ${showWishlistOnly ? 'bg-[#D95907] text-white border-[#D95907]' : `${isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'} hover:border-[#D95907] hover:text-[#D95907]`}`}
        >
          <span className="flex items-center gap-2"><Heart size={13} className={showWishlistOnly ? 'fill-white' : ''} /> Saved Items</span>
          <span className="font-mono">{wishlist.size}</span>
        </button>

        <div className="mb-5">
          <label className="text-xs font-mono font-bold text-gray-400 uppercase block mb-1.5">Refine Within Results</label>
          <div className={`flex items-center border px-2.5 py-1.5 ${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200'}`}>
            <input
              type="text"
              placeholder="e.g. gateway, sensors..."
              value={localSearch || searchQuery}
              onChange={(e) => setLocalSearch(e.target.value)}
              className={`bg-transparent text-xs outline-none w-full ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
            />
            <Search size={12} className="text-gray-400" />
          </div>
        </div>

        <div className="mb-5">
          <label className="text-xs font-mono font-bold text-gray-400 uppercase block mb-1.5">Foundry Category</label>
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-left text-xs py-1.5 px-2.5 transition-colors font-sans flex items-center justify-between ${selectedCategory === cat ? 'bg-[#3373AB] text-white font-semibold' : `${isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}`}
              >
                <span>{cat}</span>
                <span className={`text-xs font-mono ${selectedCategory === cat ? 'text-white/70' : 'text-gray-400'}`}>
                  {cat === 'All' ? products.length : (categoryCounts[cat] || 0)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="text-xs font-mono font-bold text-gray-400 uppercase block mb-1.5">Original Factory</label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className={`w-full border text-xs px-2.5 py-2 outline-none focus:border-[#3373AB] ${isDark ? 'bg-[#1a1a1a] border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}
          >
            {brands.map(b => (<option key={b} value={b}>{b}</option>))}
          </select>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-mono font-bold text-gray-400 uppercase mb-1.5">
            <span>Maximum Price Limit</span>
            <span className="text-[#3373AB] font-bold">RWF {maxPrice}</span>
          </div>
          <input
            type="range" min="30" max="100000" step="500" value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full justify-self-stretch h-1 bg-gray-200 rounded-none appearance-none cursor-pointer accent-[#3373AB]"
          />
          <div className="flex justify-between text-xs font-mono text-gray-400 mt-1">
            <span>RWF 30</span>
            <span>RWF 100,000</span>
          </div>
        </div>

        <div className={`p-3 border ${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200'}`}>
          <h5 className={`text-xs font-semibold uppercase ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Escrow Logistics</h5>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            All transactions are logged on the physical ledger. Hardware products undergo active stress tests at RTTI laboratories before freight courier dispatch.
          </p>
        </div>
      </>
    );
  }

  const compareProducts = compareList.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];

  return (
    <section className={`w-full select-none py-12 px-6 font-sans relative ${isDark ? 'bg-[#1a1a1a] text-gray-200' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">

        <Breadcrumb
          segments={[
            { label: 'Home', onClick: () => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); } },
            { label: 'Shop' },
            ...(selectedCategory !== 'All' ? [{ label: selectedCategory } as { label: string; onClick?: () => void }] : []),
          ]}
          theme={theme}
        />

        {/* Hero header */}
        <div className={`relative overflow-hidden flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-8 mb-10 border-b-2 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className={`absolute -top-10 -right-10 w-72 h-72 rounded-full pointer-events-none ${isDark ? 'bg-[#3373AB]/10' : 'bg-[#3373AB]/[0.06]'}`} />
          <div className="border-l-4 border-[#3373AB] pl-5 relative z-10">
            <p className="text-xs font-mono font-bold tracking-widest text-[#3373AB] flex items-center gap-1.5">
              <ShieldCheck size={13} /> B2B FOUNDRY MARKETPLACE
            </p>
            <h2 className={`text-2xl lg:text-4xl font-extrabold uppercase tracking-tight mt-1.5 leading-none ${isDark ? 'text-white' : 'text-[#111111]'}`}>
              Component Directory
            </h2>
            <p className="text-xs text-gray-500 max-w-md font-light mt-3 leading-relaxed">
              Sovereign escrow purchasing of calibrated electronics, multi-protocol sensors, and certified development boards directly from factory hubs.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 relative z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowWishlistOnly(prev => !prev)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 border transition-colors ${showWishlistOnly ? 'bg-[#D95907] border-[#D95907] text-white' : `${isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'} hover:border-[#D95907] hover:text-[#D95907]`}`}
              >
                <Heart size={13} className={showWishlistOnly ? 'fill-white' : ''} /> Saved ({wishlist.size})
              </button>
              <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 border ${isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'}`}>
                <ShoppingBag size={13} className="text-[#3373AB]" /> Basket ({basketCount})
              </div>
            </div>
            <div className={`flex items-stretch gap-0 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              {[
                { value: products.length.toLocaleString(), label: 'Verified Parts' },
                { value: vendorStats.length.toString(), label: 'OEM Partners' },
                { value: categoryList.length.toString(), label: 'Categories' },
              ].map((stat, i) => (
                <div key={stat.label} className={`px-5 py-3 text-center ${i > 0 ? (isDark ? 'border-l border-gray-800' : 'border-l border-gray-200') : ''}`}>
                  <p className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-[#111111]'}`}>{stat.value}</p>
                  <p className="text-xs font-mono uppercase tracking-wider text-gray-400 whitespace-nowrap">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {notification && (
          <div className="bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500 p-3 mb-6 text-xs font-semibold flex items-center justify-between pointer-events-auto">
            <span className="flex items-center gap-2"><Check size={14} /> {notification}</span>
            <button onClick={() => setNotification(null)} className="text-emerald-500 hover:text-emerald-800"><X size={14} /></button>
          </div>
        )}

        <BigSearch />

        {/* Shop by Category rail */}
        {categoryRailItems.length > 0 && (
          <div className="mb-10">
            <RailHeader icon={<Package size={13} className="text-[#3373AB]" />} title="Shop by Category" railRef={categoryRailRef} />
            <div ref={categoryRailRef} className="flex gap-3 overflow-x-auto pb-2 scroll-smooth">
              {categoryRailItems.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCategory(c.name); scrollToDirectory(); }}
                  className={`flex-shrink-0 w-[140px] border text-left group transition-all ${isDark ? 'border-gray-800 hover:border-[#3373AB]/50' : 'border-gray-100 hover:border-[#3373AB]/40 hover:shadow-md'}`}
                >
                  <div className={`h-[90px] flex items-center justify-center p-3 border-b ${isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-[#FAFBFC] border-gray-100'}`}>
                    {c.image ? (
                      <img src={c.image} alt={c.name} referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <Package size={28} className="text-gray-300" />
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className={`text-xs font-bold truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{c.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{c.count} parts</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Top Rated rail */}
        {topRatedProducts.length > 0 && (
          <div className="mb-10">
            <RailHeader icon={<Star size={13} className="text-[#D95907] fill-[#D95907]" />} title="Top Rated This Week" railRef={topRatedRailRef} />
            <div ref={topRatedRailRef} className="flex gap-3 overflow-x-auto pb-2 scroll-smooth">
              {topRatedProducts.map(p => <RailCard key={p.id} product={p} badge="Top Rated" />)}
            </div>
          </div>
        )}

        {/* Budget Picks rail */}
        {budgetProducts.length > 0 && (
          <div className="mb-10">
            <RailHeader icon={<Cpu size={13} className="text-[#3373AB]" />} title="Budget-Friendly Picks" railRef={budgetRailRef} />
            <div ref={budgetRailRef} className="flex gap-3 overflow-x-auto pb-2 scroll-smooth">
              {budgetProducts.map(p => <RailCard key={p.id} product={p} badge="Best Price" />)}
            </div>
          </div>
        )}

        {/* Recently Viewed rail */}
        {recentlyViewedProducts.length > 0 && (
          <div className="mb-10">
            <RailHeader icon={<Clock size={13} className="text-[#3373AB]" />} title="Recently Viewed" railRef={recentRailRef} />
            <div ref={recentRailRef} className="flex gap-3 overflow-x-auto pb-2 scroll-smooth">
              {recentlyViewedProducts.map(p => <RailCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* Full directory */}
        <div ref={directoryRef} className={`flex items-center justify-between border-t pt-8 mb-6 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <h3 className={`text-sm font-extrabold uppercase tracking-wide ${isDark ? 'text-white' : 'text-gray-900'}`}>Full Component Directory</h3>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className={`lg:hidden flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border ${isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'}`}
          >
            <Filter size={13} /> Filters {activeFilters.length > 0 && <span className="bg-[#3373AB] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{activeFilters.length}</span>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Desktop sidebar */}
          <div className={`hidden lg:block lg:col-span-1 p-6 border lg:sticky lg:top-24 lg:self-start ${isDark ? 'bg-[#212121] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
            {renderFilters()}
          </div>

          <div className="lg:col-span-3">
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 mb-4 gap-3 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <p className="text-xs text-gray-500 font-mono">
                Showing <span className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{Math.min(displayCount, filteredProducts.length)}</span> of <span className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{filteredProducts.length}</span> verified component records
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400 uppercase">Sort Order</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`border text-xs px-2.5 py-1.5 outline-none focus:border-[#3373AB] ${isDark ? 'bg-transparent border-gray-700 text-gray-300' : 'bg-transparent border-gray-200 text-gray-700'}`}
                >
                  <option value="featured">Default (Featured)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating Matrix</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-6">
                {activeFilters.map((f, i) => (
                  <button key={i} onClick={f.onRemove} className="flex items-center gap-1.5 text-xs font-mono bg-[#3373AB]/10 text-[#3373AB] px-2.5 py-1 border border-[#3373AB]/30 hover:bg-[#3373AB]/20 transition-colors">
                    {f.label} <X size={10} />
                  </button>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-gray-200 p-8">
                <p className="text-sm text-gray-500">No hardware components match your diagnostic filter credentials.</p>
                <button onClick={handleResetFilters} className="mt-4 bg-[#3373AB] text-white text-xs font-semibold py-2 px-4 rounded-none uppercase tracking-wider hover:bg-[#255C8E]">
                  Clear search filters
                </button>
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center py-16 border border-dashed border-gray-200 p-8">
                <Cpu size={48} className="animate-spin text-[#3373AB]" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayedProducts.map((product) => {
                  const topRated = product.rating >= 4.5;
                  const inBasket = cartProductIds.has(product.id);
                  const isWishlisted = wishlist.has(product.id);
                  const isComparing = compareList.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleCardClick(product.id, product.name)}
                      className={`flex flex-col border bg-white box-border group transition-all duration-200 cursor-pointer active:scale-[0.98] hover:-translate-y-0.5 ${isDark ? 'bg-[#212121] border-gray-800 hover:border-[#3373AB]/50' : 'border-gray-100 hover:border-[#3373AB]/40 hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]'} ${isComparing ? 'ring-2 ring-[#3373AB]' : ''}`}
                    >
                      <div className={`relative h-[150px] flex items-center justify-center p-4 border-b ${isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-[#FAFBFC] border-gray-100'}`}>
                        {topRated && (
                          <span className="absolute top-2 left-2 bg-[#3373AB] text-white text-xs font-mono font-bold uppercase px-1.5 py-0.5 tracking-wider">
                            Top Rated
                          </span>
                        )}
                        <button
                          onClick={(e) => toggleCompare(product.id, e)}
                          title="Add to compare"
                          className={`absolute bottom-2 left-2 w-6 h-6 flex items-center justify-center border transition-colors opacity-0 group-hover:opacity-100 ${isComparing ? 'bg-[#3373AB] border-[#3373AB] text-white opacity-100' : `${isDark ? 'border-gray-700 bg-[#1a1a1a]' : 'border-gray-200 bg-white'} text-gray-400 hover:text-[#3373AB]`}`}
                        >
                          <GitCompare size={12} />
                        </button>
                        <button
                          onClick={(e) => toggleWishlist(product.id, e)}
                          title="Save for later"
                          className={`absolute top-2 right-2 w-6 h-6 flex items-center justify-center transition-colors ${isWishlisted ? 'text-[#D95907]' : (isDark ? 'text-gray-600' : 'text-gray-300')} hover:text-[#D95907]`}
                        >
                          <Heart size={14} className={isWishlisted ? 'fill-[#D95907]' : ''} />
                        </button>
                        <img src={product.image} alt={product.name} referrerPolicy="no-referrer" className="max-w-full max-h-full h-auto w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <button
                            onClick={(e) => openQuickView(product, e)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[#111] text-xs font-bold uppercase px-3 py-1.5 flex items-center gap-1.5"
                          >
                            <Eye size={12} /> Quick View
                          </button>
                        </div>
                      </div>

                      <div className="p-3.5 flex flex-col flex-1">
                        <span className="text-xs text-[#768B9C] uppercase tracking-wide group-hover:text-[#3373AB] transition-colors truncate">
                          {product.category}
                        </span>
                        <h3 className={`text-sm font-bold leading-tight line-clamp-2 mb-1.5 transition-colors ${isDark ? 'text-[#5BA3DD] group-hover:text-white' : 'text-[#0062BD] group-hover:text-[#3373AB]'}`}>
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-400 truncate mb-1.5">{product.vendorName}</p>
                        {renderStars(product.rating)}
                        {inBasket && (
                          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1"><Check size={10} /> In your basket</p>
                        )}

                        <div className="mt-auto flex items-center justify-between pt-2.5">
                          <span className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#333E48]'}`}>RWF {product.price.toFixed(2)}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setCartButtonRect(e.currentTarget.getBoundingClientRect()); setCartProduct(product); }}
                            className="flex items-center gap-1 bg-[#D95907] text-white text-xs font-bold uppercase px-2.5 py-1.5 hover:bg-[#B84B05] transition-colors shadow-sm"
                          >
                            <i className="fa-solid fa-cart-arrow-down" style={{fontSize:'12px'}}></i> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {displayCount < filteredProducts.length && (
              <div ref={sentinelRef} className="flex justify-center py-10">
                {loadingMore && <Cpu size={44} className="animate-spin text-[#3373AB]" />}
              </div>
            )}
            {displayCount >= filteredProducts.length && filteredProducts.length > 0 && (
              <p className="text-center text-xs text-gray-400 font-mono mt-8">All verified component records loaded.</p>
            )}

            <div className={`mt-12 border-t pt-10 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider mb-5">Original Equipment Manufacturers (OEM) Vetted Registry</h4>
              {vendorStats.length === 0 ? (
                <p className="text-xs text-gray-500">No vendors indexed yet.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {vendorStats.slice(0, 8).map(v => (
                    <button
                      key={v.name}
                      onClick={() => { setSelectedBrand(v.name); scrollToDirectory(); }}
                      className={`text-left p-3 border transition-colors ${isDark ? 'border-gray-800 hover:border-[#3373AB]/50 bg-[#212121]' : 'border-gray-200 hover:border-[#3373AB]/40 bg-white'}`}
                    >
                      <p className={`text-xs font-semibold truncate flex items-center gap-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                        <Package size={11} className="text-[#3373AB] flex-shrink-0" /> {v.name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono mt-1">{v.count} parts listed</p>
                      {renderStars(v.avgRating, 9)}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
            <div className={`absolute top-0 left-0 h-full w-[85%] max-w-sm overflow-y-auto p-6 ${isDark ? 'bg-[#212121]' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold uppercase">Filters</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400"><X size={18} /></button>
              </div>
              {renderFilters()}
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full mt-6 bg-[#3373AB] text-white text-xs font-bold uppercase py-3"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        )}

        {/* Sticky compare bar */}
        {compareList.length > 0 && !showCompareModal && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#111111] text-white px-6 py-3 flex items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3 overflow-x-auto">
              <span className="text-xs font-mono text-gray-400 flex-shrink-0">Comparing ({compareList.length}/3):</span>
              {compareProducts.map(p => (
                <div key={p.id} className="flex items-center gap-1.5 bg-white/10 px-2 py-1 flex-shrink-0">
                  <span className="text-xs truncate max-w-[100px]">{p.name}</span>
                  <button onClick={() => toggleCompare(p.id)}><X size={11} /></button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setCompareList([])} className="text-xs text-gray-400 hover:text-white">Clear</button>
              <button
                onClick={() => setShowCompareModal(true)}
                disabled={compareList.length < 2}
                className="bg-[#3373AB] disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xs font-bold uppercase px-4 py-2"
              >
                Compare Now
              </button>
            </div>
          </div>
        )}

        {/* Compare modal */}
        {showCompareModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
            <div className={`w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 ${isDark ? 'bg-[#212121] text-gray-200' : 'bg-white text-gray-900'}`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-extrabold uppercase">Component Comparison</h3>
                <button onClick={() => setShowCompareModal(false)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
              </div>
              <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${compareProducts.length}, minmax(0, 1fr))` }}>
                {compareProducts.map(p => (
                  <div key={p.id} className={`p-3 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                    <div className={`h-24 flex items-center justify-center mb-2 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#FAFBFC]'}`}>
                      <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="max-h-full object-contain" />
                    </div>
                    <p className="text-xs font-bold mb-1">{p.name}</p>
                    <p className="text-xs text-gray-400 mb-2">{p.vendorName}</p>
                    <div className="space-y-1.5 text-xs">
                      <p><span className="text-gray-400">Category:</span> {p.category}</p>
                      <p><span className="text-gray-400">Price:</span> RWF {p.price.toFixed(2)}</p>
                      <div className="flex items-center gap-1"><span className="text-gray-400">Rating:</span> {renderStars(p.rating, 9)}</div>
                    </div>
                    <button
                      onClick={() => { addToCart(p, 1); setShowCompareModal(false); setNotification(`Added "${p.name}" to the RT Escrow Basket.`); setTimeout(() => setNotification(null), 3000); }}
                      className="w-full mt-3 bg-[#D95907] text-white text-xs font-bold uppercase py-2"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick view modal */}
        {quickViewProduct && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4" onClick={() => setQuickViewProduct(null)}>
            <div onClick={(e) => e.stopPropagation()} className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 ${isDark ? 'bg-[#212121] text-gray-200' : 'bg-white text-gray-900'}`}>
              <div className={`relative h-64 sm:h-full flex items-center justify-center p-8 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#FAFBFC]'}`}>
                <button onClick={() => setQuickViewProduct(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"><X size={18} /></button>
                <img src={quickViewProduct.image} alt={quickViewProduct.name} referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="p-6 flex flex-col">
                <span className="text-xs text-[#3373AB] uppercase tracking-wide font-mono">{quickViewProduct.category}</span>
                <h3 className="text-lg font-bold leading-tight mt-1 mb-2">{quickViewProduct.name}</h3>
                <p className="text-xs text-gray-400 mb-2">{quickViewProduct.vendorName}</p>
                {renderStars(quickViewProduct.rating, 13)}
                <p className="text-xs text-gray-500 leading-relaxed mt-3 mb-4">{quickViewProduct.description}</p>
                <p className="text-2xl font-extrabold mb-4">RWF {quickViewProduct.price.toFixed(2)}</p>

                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex items-center border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button onClick={() => setQuickViewQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#3373AB]">−</button>
                    <span className="w-10 text-center text-sm font-mono">{quickViewQty}</span>
                    <button onClick={() => setQuickViewQty(q => q + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#3373AB]">+</button>
                  </div>
                  <button onClick={(e) => toggleWishlist(quickViewProduct.id, e)} className={`flex items-center gap-1.5 text-xs px-3 py-2 border ${wishlist.has(quickViewProduct.id) ? 'border-[#D95907] text-[#D95907]' : `${isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'}`}`}>
                    <Heart size={13} className={wishlist.has(quickViewProduct.id) ? 'fill-[#D95907]' : ''} /> Save
                  </button>
                </div>

                <div className="mt-auto flex flex-col gap-2">
                  <button
                    onClick={() => { addToCart(quickViewProduct, quickViewQty); setNotification(`Successfully added ${quickViewQty}x "${quickViewProduct.name}" to the RT Escrow Basket.`); setTimeout(() => setNotification(null), 3000); setQuickViewProduct(null); }}
                    className="w-full bg-[#D95907] text-white text-xs font-bold uppercase py-3 hover:bg-[#B84B05] transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => { onViewProduct?.(quickViewProduct.id); setQuickViewProduct(null); }}
                    className={`w-full text-xs font-semibold uppercase py-2.5 border ${isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'}`}
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {cartProduct && (
          <CartQuantityModal
            product={cartProduct}
            buttonRect={cartButtonRect}
            onClose={() => { setCartProduct(null); setCartButtonRect(null); }}
            onAddToCart={handleLocalAddToCart}
            onViewDetails={(id) => { setCartProduct(null); setCartButtonRect(null); onViewProduct?.(id); }}
          />
        )}

        {loadingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center gap-4 min-w-[280px]">
              <Cpu size={44} className="animate-spin text-[#3373AB]" />
              <p className="text-sm font-medium text-gray-700 text-center leading-relaxed">
                Loading <span className="text-[#3373AB] font-semibold">{loadingProduct}</span>
                <br />
                <span className="text-gray-400 text-xs">Accessing product dossier...</span>
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}