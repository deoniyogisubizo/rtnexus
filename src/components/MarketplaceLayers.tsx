import { useState } from 'react';
import { ShoppingCart, Plus, Search } from 'lucide-react';
import { Product } from '../types';
import { FEATURED_PRODUCTS } from '../data/mockData';
import CartQuantityModal from './CartQuantityModal';

interface MarketplaceLayersProps {
  addToCart: (product: Product, quantity?: number) => void;
  theme?: 'light' | 'dark';
  onSelectProduct: (productId: string) => void;
  setView: (view: string) => void;
}

const embeddedCats = new Set([
  'Microcontroller Boards', 'Embedded Wireless Modules', 'Development Boards',
  'Sensor Interface Circuits', 'Power Management ICs', 'Embedded Storage Modules',
  'Programmable Logic Circuits', 'Communication Bus Drivers',
]);

const sensorCats = new Set(['Sensor Interface Circuits']);
const ledCats = new Set(['LED Driver Modules', 'Display & LED Matrix Systems']);

export default function MarketplaceLayers({ addToCart, theme = 'light', onSelectProduct, setView }: MarketplaceLayersProps) {
  const isDark = theme === 'dark';
  const [cartProduct, setCartProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filterBySearch = (products: Product[]) => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  };

  const justLanded = filterBySearch(FEATURED_PRODUCTS.slice(0, 12));
  const embeddedDeals = filterBySearch(FEATURED_PRODUCTS.filter(p => embeddedCats.has(p.category)).slice(0, 12));
  const sensorDeals = filterBySearch(FEATURED_PRODUCTS.filter(p => sensorCats.has(p.category)).slice(0, 12));
  const ledDeals = filterBySearch(FEATURED_PRODUCTS.filter(p => ledCats.has(p.category)).slice(0, 12));

  function renderGrid(products: Product[]) {
    if (products.length === 0) return null;
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-[#e5e5e5] border border-[#e5e5e5]">
        {products.map((product) => (
          <div key={product.id} className={`flex flex-col p-[14px] box-border ${isDark ? 'bg-[#222]' : 'bg-white'} hover:shadow-xl hover:scale-[1.02] transition-transform`} style={{ minHeight: '341px' }}>
            <span className="text-[11px] text-[#768B9C] no-underline block mb-1">
              {product.category}
            </span>
            <button
              onClick={() => onSelectProduct(product.id)}
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
                className="max-w-full max-h-full h-auto w-auto object-contain"
              />
            </div>
            <div className="mt-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[16px] font-normal text-[#333E48]">RWF {product.price.toFixed(2)}</span>
                <button
                  onClick={() => setCartProduct(product)}
                  className="bg-[#D95907] text-white w-9 h-9 rounded-full flex items-center justify-center text-base shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:bg-[#0062BD] transition-colors relative"
                  title="Add to cart"
                >
                  <ShoppingCart size={16} />
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
      <div className="max-w-7xl mx-auto space-y-10">
        {renderSection('Just Landed', 'Fresh Inventory', justLanded)}
        <div>
          <img src="/inplace/microcontroler.png" alt="Microcontroller" className="w-full h-[180px] sm:h-[260px] md:h-[360px] object-cover mb-4" />
          <div className="border-l-4 border-[#3373AB] pl-4 mb-6 text-left">
            <p className="text-[9px] font-mono tracking-widest text-[#3373AB] uppercase font-bold">Embedded System Deals</p>
            <h3 className={`text-sm font-bold uppercase tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-[#111]'}`}>
              Microcontrollers, Wireless & Dev Boards
            </h3>
          </div>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search embedded system deals..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-sm border rounded ${isDark ? 'bg-[#333] text-white border-gray-600' : 'bg-white text-[#111] border-[#ccc]'}`}
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
          </div>
          {renderGrid(embeddedDeals)}
        </div>
        {renderSection('Sensor Deals', 'Sensor Interface & Signal Conditioning', sensorDeals)}
        {renderSection('LED Deals', 'LED Drivers & Display Matrix Systems', ledDeals)}
      </div>

      {cartProduct && (
        <CartQuantityModal
          product={cartProduct}
          onClose={() => setCartProduct(null)}
          onAddToCart={addToCart}
          onViewDetails={(id) => { setCartProduct(null); onSelectProduct(id); }}
        />
      )}
    </section>
  );
}
