import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, ShoppingCart, X, Check, ArrowRight } from 'lucide-react';
import { Product, CartItem } from '../types';
import { fetchProducts } from '../services/api';
import { FEATURED_PRODUCTS, VENDORS } from '../data/mockData';
import CartQuantityModal from './CartQuantityModal';
import { searchAll } from '../utils/search';

interface ShopSectionProps {
  addToCart: (product: Product, quantity?: number) => void;
  searchQuery: string;
  cartItems: CartItem[];
  theme?: 'light' | 'dark';
  preselectProductId?: string | null;
  onClearPreselectProductId?: () => void;
}

export default function ShopSection({ addToCart, searchQuery, cartItems, theme = 'light', preselectProductId, onClearPreselectProductId }: ShopSectionProps) {
  const isDark = theme === 'dark';
  const [products, setProducts] = useState<Product[]>(FEATURED_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartProduct, setCartProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts().then(data => {
      if (data.length > 0) setProducts(data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (preselectProductId) {
      const product = products.find(p => p.id === preselectProductId);
      if (product) {
        setSelectedProduct(product);
      }
      onClearPreselectProductId?.();
    }
  }, [preselectProductId]);

  const categories = ['All', 'IoT Devices', 'Development Boards', 'Sensors', 'Robotics', 'Power Solutions', 'Electronics Components'];
  const brands = ['All', 'Nexus Embedded Corp', 'Silicon Ventures Ltd', 'Matrix Transducers', 'OmniDrive Robotics'];

  // Filter & Search processing
  const filteredProducts = products.filter(product => {
    // Top bar general search + section local search
    const matchesSearch = 
      product.name.toLowerCase().includes((searchQuery || localSearch).toLowerCase()) ||
      product.description.toLowerCase().includes((searchQuery || localSearch).toLowerCase()) ||
      product.category.toLowerCase().includes((searchQuery || localSearch).toLowerCase()) ||
      product.vendorName.toLowerCase().includes((searchQuery || localSearch).toLowerCase());

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'All' || product.vendorName === selectedBrand;
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured
  });

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
  };

  function BigSearch() {
    const [q, setQ] = useState('');
    const [focused, setFocused] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const { results, suggestion } = searchAll(q);
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

    return (
      <div ref={ref} className="relative mb-8">
        <div className={`flex items-center border-2 px-4 py-3 transition-all ${focused ? 'border-[#3373AB]' : 'border-gray-200'} ${inputBg}`}>
          <Search size={18} className={`${isDark ? 'text-gray-500' : 'text-gray-400'} mr-3`} />
          <input
            type="text"
            placeholder="Search products, categories, vendors..."
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            className="bg-transparent text-sm outline-none w-full"
          />
          {q && (
            <button onClick={() => { setQ(''); setFocused(true); }} className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} hover:text-gray-600`}>
              <X size={14} />
            </button>
          )}
        </div>

        {focused && q.trim() && (
          <div className={`absolute top-full left-0 right-0 mt-1 border shadow-lg z-30 max-h-80 overflow-y-auto ${ddBg}`}>
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
                    <div className={`text-[10px] font-mono uppercase tracking-widest px-4 pt-3 pb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Categories</div>
                    {cats.map(r => (
                      <button
                        key={r.label}
                        onClick={() => { setSelectedCategory(r.label); setQ(''); setFocused(false); }}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
                      >
                        <span>{r.label}</span>
                        <ArrowRight size={12} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}
                {prods.length > 0 && (
                  <div>
                    <div className={`text-[10px] font-mono uppercase tracking-widest px-4 pt-3 pb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Products</div>
                    {prods.slice(0, 6).map(r => (
                      <button
                        key={r.product.id}
                        onClick={() => { setSelectedProduct(r.product); setQ(''); setFocused(false); }}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
                      >
                        <span className="font-mono font-bold text-[#D95907] whitespace-nowrap w-28 text-right">
                          RWF {r.product.price.toFixed(2)}
                        </span>
                        <span className="truncate">{r.label}</span>
                        <span className={`text-[10px] ml-auto ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{r.product.category}</span>
                      </button>
                    ))}
                    {prods.length > 6 && (
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'} hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors italic`}
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

  return (
    <section className={`w-full select-none py-12 px-6 font-sans ${isDark ? 'bg-[#1a1a1a] text-gray-200' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="border-l-4 border-[#3373AB] pl-5 mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono font-bold tracking-widest text-[#3373AB]">B2B FOUNDRY MARKETPLACE</p>
            <h2 className={`text-xl lg:text-2xl font-bold uppercase tracking-tight mt-1 ${isDark ? 'text-white' : 'text-[#111111]'}`}>RT SHOP COMPONENT DIRECTORY</h2>
          </div>
          <p className="text-xs text-gray-500 max-w-sm font-light">
            Sovereign escrow purchasing of calibrated electronics, multi-protocol sensors, and certified development boards directly from factory hubs.
          </p>
        </div>

        {notification && (
          <div className="bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500 p-3 mb-6 text-xs font-semibold flex items-center justify-between pointer-events-auto">
            <span className="flex items-center gap-2">
              <Check size={14} />
              {notification}
            </span>
            <button onClick={() => setNotification(null)} className="text-emerald-500 hover:text-emerald-800">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Big hero search */}
        <BigSearch />

        {/* Search and Quick categories */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT COLUMN: ADVANCED FILTERS SYSTEM */}
          <div className="lg:col-span-1 bg-gray-50 p-6 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <span className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-gray-900">
                <SlidersHorizontal size={14} className="text-[#3373AB]" />
                <span>Search Diagnostics</span>
              </span>
              <button 
                onClick={handleResetFilters}
                className="text-[10px] font-mono hover:text-[#3373AB] cursor-pointer text-gray-400"
              >
                [RESET]
              </button>
            </div>

            {/* Keyword search inside shop */}
            <div className="mb-5">
              <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1.5">Direct Query</label>
              <div className="flex items-center bg-white border border-gray-200 px-2.5 py-1.5">
                <input 
                  type="text" 
                  placeholder="e.g. gateway, sensors..." 
                  value={localSearch || searchQuery}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="bg-transparent text-xs text-gray-800 outline-none w-full"
                />
                <Search size={12} className="text-gray-400" />
              </div>
            </div>

            {/* Category selection */}
            <div className="mb-5">
              <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1.5">Foundry Category</label>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left text-xs py-1 px-2.5 transition-colors font-sans block ${selectedCategory === cat ? 'bg-[#3373AB] text-white font-semibold' : 'hover:bg-gray-100 text-gray-600'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand/Vendor selection */}
            <div className="mb-5">
              <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1.5">Original Factory</label>
              <select 
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-white border border-gray-200 text-xs px-2.5 py-2 text-gray-700 outline-none focus:border-[#3373AB]"
              >
                {brands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Price slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-gray-400 uppercase mb-1.5">
                <span>Maximum Price Limit</span>
                <span className="text-[#3373AB] font-bold">RWF {maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="100000" 
                step="500" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full justify-self-stretch h-1 bg-gray-200 rounded-none appearance-none cursor-pointer accent-[#3373AB]"
              />
              <div className="flex justify-between text-[9px] font-mono text-gray-400 mt-1">
                <span>RWF 30</span>
                <span>RWF 100,000</span>
              </div>
            </div>

            {/* Vendor Escrow Note */}
            <div className="bg-white p-3 border border-gray-200">
              <h5 className="text-[10px] font-semibold text-gray-900 uppercase">Escrow Logistics</h5>
              <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                All transactions are logged on the physical ledger. Hardware products undergo active stress tests at RTTI laboratories before freight courier dispatch.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE PRODUCTS LISTING */}
          <div className="lg:col-span-3">
            
            {/* Sorting and status bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-3 mb-6 gap-3">
              <p className="text-xs text-gray-500 font-mono">
                Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> verified component records
              </p>
              
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-gray-400 uppercase">Sort Order</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border border-gray-200 text-xs px-2.5 py-1.5 text-gray-700 outline-none focus:border-[#3373AB]"
                >
                  <option value="featured">Default (Featured)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating Matrix</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-gray-200 p-8">
                <p className="text-sm text-gray-500">No hardware components match your diagnostic filter credentials.</p>
                <button 
                  onClick={handleResetFilters}
                  className="mt-4 bg-[#3373AB] text-white text-xs font-semibold py-2 px-4 rounded-none uppercase tracking-wider hover:bg-[#255C8E]"
                >
                  Clear search filters
                </button>
              </div>
            ) : loading ? (
              <div className="text-center py-16 border border-dashed border-gray-200 p-8">
                <p className="text-sm text-gray-500">Loading components from database...</p>
              </div>
            ) : (
              /* Products grid - HTML inspired card design */
              <div className="flex flex-wrap border-t border-l border-[#eeeeee]">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="w-1/2 sm:w-[230px] h-[341px] border-r border-b border-[#eeeeee] bg-white box-border">
                    <div className="p-[14px] flex flex-col h-full box-border">
                      <span className="text-[11px] text-[#768B9C] no-underline block mb-1">
                        {product.category}
                      </span>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-left"
                      >
                        <h3 className="text-[13px] font-bold text-[#0062BD] leading-tight line-clamp-2 mb-2.5">
                          {product.name}
                        </h3>
                      </button>
                      <div className="flex-1 flex items-center justify-center py-2.5">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="max-w-full max-h-full h-auto w-auto object-contain"
                        />
                      </div>
                      <div className="mt-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[16px] font-normal text-[#333E48]">RWF {product.price.toFixed(2)}</span>
                          <button
                            onClick={() => setCartProduct(product)}
                            className="bg-[#D95907] text-white w-9 h-9 rounded-full flex items-center justify-center text-base shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:scale-110 hover:bg-[#b54a06] transition-transform"
                            title="Add to cart"
                          >
                            <ShoppingCart size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Vendor Showcases section in bottom */}
            <div className="mt-12 border-t border-gray-200 pt-10">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider mb-6">Original Equipment Manufacturers (OEM) Vetted Registry</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {VENDORS.map((vendor, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 p-4 flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#3373AB] text-white flex items-center justify-center font-mono font-bold text-lg rounded-none">
                      {vendor.logo}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-xs text-gray-900 leading-tight">{vendor.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{vendor.productsCount} catalog items • ★ {vendor.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {cartProduct && (
          <CartQuantityModal
            product={cartProduct}
            onClose={() => setCartProduct(null)}
            onAddToCart={handleLocalAddToCart}
            onViewDetails={(id) => { setCartProduct(null); setSelectedProduct(products.find(p => p.id === id) || null); }}
          />
        )}

        {/* DIALOG/MODAL: DETAILED TECHNICAL DATASHEET VIEW */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-[#111111]/85 z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full text-left rounded-none border border-gray-200 shadow-2xl flex flex-col max-h-[90vh]">
              
              {/* Modal header */}
              <div className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold text-[#3373AB] uppercase tracking-widest leading-none">__RT SHOP  //  TECHNICAL DATASHEET PORTAL</span>
                  <span className="text-sm font-bold tracking-tight uppercase font-sans mt-1">MODULE SCHEMA {selectedProduct.id}</span>
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  className="text-gray-400 hover:text-white outline-none cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Photo representation */}
                  <div className="md:col-span-1 h-52 bg-gray-100 border border-gray-200 overflow-hidden">
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  {/* Description breakdown */}
                  <div className="md:col-span-2">
                    <h3 className="text-base font-bold text-gray-900">{selectedProduct.name}</h3>
                    <p className="text-[10px] font-mono text-gray-400 uppercase mt-0.5">OEM: {selectedProduct.vendorName}</p>
                    <p className="text-xs text-gray-600 mt-2 font-mono leading-relaxed font-light">
                      {selectedProduct.description}
                    </p>
                  </div>
                </div>

                {/* Where It Will Be Used */}
                <div className="bg-blue-50 border border-blue-100 p-4">
                  <h4 className="text-xs font-bold uppercase text-[#3373AB] tracking-wider mb-2">Applications & Use Cases</h4>
                  <p className="text-[11px] text-gray-700 leading-relaxed font-sans">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Specs register table */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-800 border-b border-gray-300 pb-1.5 mb-3 tracking-wider">Calibrated Specification Profile</h4>
                  <table className="w-full text-xs font-mono">
                    <tbody>
                      {Object.entries(selectedProduct.specs).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-100">
                          <td className="py-2 text-gray-500 font-bold w-1/3 leading-tight pr-3 text-[11px]">{key}</td>
                          <td className="py-2 text-gray-800 text-[11px]">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Logistics */}
                <div className="bg-gray-50 border border-gray-200 p-4">
                  <h5 className="text-[10px] font-mono font-bold text-[#3373AB] uppercase">Hardware stress report</h5>
                  <p className="text-[11px] text-gray-600 leading-relaxed font-sans mt-1">
                    This unit calibrated profile satisfies FCC Part 15 and CE industrial interference regulations. Calibrated at 22°C ambient with 45% standard saturation. Zero defects logic verified by RTTI instrumentation audits.
                  </p>
                </div>

                {/* Related Products */}
                {(() => {
                  const related = products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 4);
                  if (related.length === 0) return null;
                  return (
                    <div>
                      <h4 className="text-xs font-bold uppercase text-gray-800 border-b border-gray-300 pb-1.5 mb-3 tracking-wider">Related Products</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {related.map(rp => (
                          <button
                            key={rp.id}
                            onClick={() => setSelectedProduct(rp)}
                            className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-2.5 text-left hover:border-[#3373AB] transition-colors"
                          >
                            <div className="h-10 w-10 bg-gray-100 border border-gray-200 shrink-0">
                              <img src={rp.image} alt={rp.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-gray-900 leading-tight truncate">{rp.name}</p>
                              <p className="text-[10px] font-mono text-gray-400">RWF {rp.price.toFixed(2)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Footer pricing */}
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">Single Unit Escrow price</span>
                  <span className="text-lg font-bold font-mono text-gray-900">RWF {selectedProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 text-xs rounded-none outline-none"
                  >
                    Close Sheet
                  </button>
                  <button 
                    onClick={() => { const p = selectedProduct; setSelectedProduct(null); setTimeout(() => setCartProduct(p), 50); }}
                    className="bg-[#3373AB] hover:bg-[#255C8E] text-white font-bold px-5 py-2 text-xs rounded-none transition-colors outline-none flex items-center gap-2"
                  >
                    <ShoppingCart size={14} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
