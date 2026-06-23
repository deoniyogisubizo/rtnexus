import { useState, useEffect } from 'react';
import { Plus, Search, Loader2, ArrowRight, Cpu } from 'lucide-react';
import { Product } from '../types';
import { fetchProducts } from '../services/api';
import CartQuantityModal from './CartQuantityModal';

interface MarketplaceLayersProps {
  addToCart: (product: Product, quantity?: number) => void;
  theme?: 'light' | 'dark';
  onSelectProduct: (productId: string) => void;
  setView: (view: string) => void;
}

const embeddedKeywords = ['Microcontroller', 'Embedded Systems', 'Development Boards'];

const ledCats = new Set(['LED Driver Modules', 'Display & LED Matrix Systems']);

export default function MarketplaceLayers({ addToCart, theme = 'light', onSelectProduct, setView }: MarketplaceLayersProps) {
  const isDark = theme === 'dark';
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [cartProduct, setCartProduct] = useState<Product | null>(null);
  const [cartButtonRect, setCartButtonRect] = useState<DOMRect | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts().then(setAllProducts).catch(() => {});
  }, []);

  function handleCardClick(productId: string, productName: string) {
    setLoadingProduct(productName);
    setTimeout(() => onSelectProduct(productId), 350);
  }

  const filterBySearch = (products: Product[]) => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  };

  const justLanded = filterBySearch(allProducts.slice(0, 12));
  const embeddedDeals = filterBySearch(allProducts.filter(p => embeddedKeywords.some(k => p.category.toLowerCase().includes(k.toLowerCase()))).slice(0, 6));
  const ledDeals = filterBySearch(allProducts.filter(p => ledCats.has(p.category)).slice(0, 12));
  const microcontrollers = allProducts.filter(p => p.category === 'Microcontroller Boards').slice(0, 8);

  function renderGrid(products: Product[]) {
    if (products.length === 0) return null;
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-[#e5e5e5] border border-[#e5e5e5]">
        {products.map((product) => (
          <div key={product.id} onClick={() => handleCardClick(product.id, product.name)} className={`flex flex-col p-[14px] box-border ${isDark ? 'bg-[#222]' : 'bg-white'} hover:shadow hover:scale-[1.02] transition-all duration-200 cursor-pointer`} style={{ minHeight: '341px' }}>
            <span className="text-[11px] text-[#768B9C] no-underline block mb-1">
              {product.category}
            </span>
            <h3 className="text-[13px] font-bold text-[#0062BD] leading-tight line-clamp-2 mb-2.5">
              {product.name}
            </h3>
            <div className="flex-1 flex items-center justify-center py-2.5">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full h-auto w-auto object-contain"
              />
            </div>
            <div className="mt-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[16px] font-normal text-[#333E48]">RWF {product.price.toFixed(2)}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setCartButtonRect(e.currentTarget.getBoundingClientRect()); setCartProduct(product); }}
                  className="bg-[#D95907]/80 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm hover:bg-[#D95907]/60 transition-all relative"
                  title="Add to cart"
                >
                  <i className="fa-solid fa-cart-arrow-down" style={{fontSize:'10px'}}></i>
                  <Plus size={10} className="absolute -top-0.5 -right-0.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderSection(label: string, title: string, products: Product[]) {
    if (!products || products.length === 0) return null;
    return (
      <div>
        <div className="border-l-4 border-[#3373AB] pl-4 mb-6 text-left">
          <p className="text-[9px] font-mono tracking-widest text-[#3373AB] uppercase font-bold">{label}</p>
          <h3 className={`text-sm font-bold uppercase tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-[#111]'}`}>
            {title}
          </h3>
        </div>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 text-sm border rounded ${isDark ? 'bg-[#333] text-white border-gray-600' : 'bg-white text-[#111] border-[#ccc]'}`}
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
        </div>
        {renderGrid(products)}
      </div>
    );
  }

  return (
    <section className={`w-full select-none py-12 px-6 font-sans border-b ${isDark ? 'bg-[#1a1a1a] text-gray-200 border-gray-800' : 'bg-[#FAFAFA] text-gray-900 border-gray-200'}`}>
      <div className="max-w-7xl mx-auto">
        {renderSection('Just Landed', 'Fresh Inventory', justLanded)}
      </div>

      <div className="w-full h-[180px] sm:h-[260px] md:h-[360px] bg-cover bg-center" style={{backgroundImage: "url('/inplace/microcontroler.png')"}} />

      <div className="max-w-7xl mx-auto space-y-10">
        <div>
          <div className="border-l-4 border-[#3373AB] pl-4 mb-6 text-left">
            <p className="text-[9px] font-mono tracking-widest text-[#3373AB] uppercase font-bold">Embedded System Deals</p>
            <h3 className={`text-sm font-bold uppercase tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-[#111]'}`}>
              Microcontrollers, Wireless & Dev Boards
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-px bg-[#e5e5e5] border border-[#e5e5e5]">
            {embeddedDeals.map((product) => (
              <div key={product.id} onClick={() => handleCardClick(product.id, product.name)} className={`flex flex-col p-[14px] box-border ${isDark ? 'bg-[#222]' : 'bg-white'} hover:shadow hover:scale-[1.02] transition-all duration-200 cursor-pointer`} style={{ minHeight: '341px' }}>
                <span className="text-[11px] text-[#768B9C] no-underline block mb-1">
                  {product.category}
                </span>
                <h3 className="text-[13px] font-bold text-[#0062BD] leading-tight line-clamp-2 mb-2.5">
                  {product.name}
                </h3>
                <div className="flex-1 flex items-center justify-center py-2.5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full h-auto w-auto object-contain"
                  />
                </div>
                <div className="mt-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[16px] font-normal text-[#333E48]">RWF {product.price.toFixed(2)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setCartButtonRect(e.currentTarget.getBoundingClientRect()); setCartProduct(product); }}
                      className="bg-[#D95907]/80 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm hover:bg-[#D95907]/60 transition-all relative"
                      title="Add to cart"
                    >
                      <i className="fa-solid fa-cart-arrow-down" style={{fontSize:'10px'}}></i>
                      <Plus size={10} className="absolute -top-0.5 -right-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-5">
            <button onClick={() => setView('shop')} className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg shadow-md transition-all hover:shadow-lg ${isDark ? 'bg-[#3373AB] text-white hover:bg-[#255C8E]' : 'bg-[#3373AB] text-white hover:bg-[#255C8E]'}`}>
              View All Embedded Deals <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div>
          <div className="border-l-4 border-[#3373AB] pl-4 mb-5 text-left">
            <p className="text-[9px] font-mono tracking-widest text-[#3373AB] uppercase font-bold">Popular Microcontroller Boards</p>
            <h3 className={`text-sm font-bold uppercase tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-[#111]'}`}>
              Available Components for Embedded Development
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {microcontrollers.map((mcu) => (
              <button key={mcu.id} onClick={() => handleCardClick(mcu.id, mcu.name)} className={`flex flex-col items-center text-center p-2.5 rounded-lg border transition-all hover:shadow-md cursor-pointer outline-none ${isDark ? 'border-gray-700 hover:border-[#3373AB] bg-[#222]' : 'border-gray-200 hover:border-[#3373AB] bg-white'}`}>
                <Cpu size={18} className="text-[#3373AB] mb-1.5" />
                <span className="text-[9px] font-medium text-gray-700 leading-tight line-clamp-2">{mcu.name}</span>
                <span className="text-[8px] text-gray-400 mt-0.5">RWF {mcu.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
        {renderSection('LED Deals', 'LED Drivers & Display Matrix Systems', ledDeals)}
      </div>

      {cartProduct && (
        <CartQuantityModal
          product={cartProduct}
          buttonRect={cartButtonRect}
          onClose={() => { setCartProduct(null); setCartButtonRect(null); }}
          onAddToCart={addToCart}
          onViewDetails={(id) => { setCartProduct(null); setCartButtonRect(null); onSelectProduct(id); }}
        />
      )}

      {loadingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center gap-4 min-w-[280px]">
            <Loader2 size={36} className="animate-spin text-[#3373AB]" />
            <p className="text-sm font-medium text-gray-700 text-center leading-relaxed">
              Loading <span className="text-[#3373AB] font-semibold">{loadingProduct}</span>
              <br />
              <span className="text-gray-400 text-xs">Accessing product dossier...</span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
