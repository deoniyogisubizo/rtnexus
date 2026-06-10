import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Product, CartItem } from '../types';
import { FEATURED_PRODUCTS } from '../data/mockData';
import CartQuantityModal from './CartQuantityModal';
import Breadcrumb from './Breadcrumb';

interface ProductDetailPageProps {
  productId: string;
  addToCart: (product: Product, quantity?: number) => void;
  cartItems: CartItem[];
  theme?: 'light' | 'dark';
  onBack: () => void;
  onViewProduct: (id: string) => void;
}

export default function ProductDetailPage({ productId, addToCart, cartItems, theme = 'light', onBack, onViewProduct }: ProductDetailPageProps) {
  const isDark = theme === 'dark';
  const allProducts = FEATURED_PRODUCTS;
  const product = allProducts.find(p => p.id === productId);
  const [cartProduct, setCartProduct] = useState<Product | null>(null);

  const bg = isDark ? 'bg-[#1a1a1a] text-gray-200' : 'bg-white text-gray-900';
  const borderCls = isDark ? 'border-gray-800' : 'border-gray-200';

  if (!product) {
    return (
      <section className={`w-full min-h-screen select-none py-14 px-6 font-sans ${bg}`}>
        <div className="max-w-7xl mx-auto text-center py-20">
          <p className="text-sm text-gray-500">Product not found.</p>
          <button onClick={onBack} className="mt-4 text-[#3373AB] text-xs underline">Return to Shop</button>
        </div>
      </section>
    );
  }

  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6);

  return (
    <section className={`w-full min-h-screen select-none font-sans ${bg}`}>
      <div className={`border-b ${borderCls}`}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono text-[#3373AB] hover:underline"
          >
            <ArrowLeft size={14} />
            <span>BACK TO SHOP DIRECTORY</span>
          </button>
          <span className="text-[10px] font-mono text-gray-400 uppercase">{product.id}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Breadcrumb
          segments={[
            { label: 'Home', onClick: () => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); } },
            { label: 'Shop', onClick: onBack },
            { label: product.name },
          ]}
          theme={theme}
        />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className={`h-80 sm:h-96 border ${borderCls} ${isDark ? 'bg-[#222]' : 'bg-gray-50'} flex items-center justify-center p-6`}>
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          <div className="md:col-span-3 space-y-6">
            <div>
              <p className="text-[10px] font-mono font-bold text-[#3373AB] uppercase tracking-widest">{product.category}</p>
              <h1 className={`text-xl lg:text-2xl font-bold uppercase tracking-tight mt-1 ${isDark ? 'text-white' : 'text-[#111111]'}`}>{product.name}</h1>
              <p className="text-[10px] font-mono text-gray-400 uppercase mt-1">OEM: {product.vendorName}</p>
            </div>

            <div className={`border-l-4 border-[#3373AB] pl-4 py-1`}>
              <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {product.description}
              </p>
            </div>

            <div className={`bg-blue-50 border border-blue-100 p-4 ${isDark ? 'bg-blue-900/20 border-blue-800' : ''}`}>
              <h4 className="text-xs font-bold uppercase text-[#3373AB] tracking-wider mb-2">Applications & Use Cases</h4>
              <p className={`text-[11px] leading-relaxed font-sans ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {product.description}
              </p>
            </div>

            <div>
              <h4 className={`text-xs font-bold uppercase border-b pb-1.5 mb-3 tracking-wider ${isDark ? 'text-gray-200 border-gray-700' : 'text-gray-800 border-gray-300'}`}>Calibrated Specification Profile</h4>
              <table className="w-full text-xs font-mono">
                <tbody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key} className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                      <td className={`py-2 font-bold w-1/3 leading-tight pr-3 text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{key}</td>
                      <td className={`py-2 text-[11px] ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} border p-4`}>
              <h5 className="text-[10px] font-mono font-bold text-[#3373AB] uppercase">Hardware stress report</h5>
              <p className={`text-[11px] leading-relaxed font-sans mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                This unit calibrated profile satisfies FCC Part 15 and CE industrial interference regulations. Calibrated at 22°C ambient with 45% standard saturation. Zero defects logic verified by RTTI instrumentation audits.
              </p>
            </div>

            <div className={`border-t pt-6 flex items-center justify-between ${borderCls}`}>
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Single Unit Escrow price</span>
                <span className={`text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>RWF {product.price.toFixed(2)}</span>
                <span className={`text-[10px] font-mono block mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Stock: {product.stock} units verified
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onBack}
                  className={`border px-4 py-2.5 text-xs font-semibold rounded-none outline-none ${isDark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                >
                  Back to Shop
                </button>
                <button
                  onClick={() => setCartProduct(product)}
                  className="bg-[#D95907]/80 hover:bg-[#D95907]/60 text-white font-semibold px-4 py-2 text-[10px] rounded-none transition-colors outline-none flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-cart-arrow-down" style={{fontSize:'10px'}}></i>
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className={`mt-16 pt-8 border-t ${borderCls}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="border-l-4 border-[#3373AB] pl-4">
                <p className="text-[10px] font-mono font-bold text-[#3373AB] uppercase tracking-widest">RELATED MODULES</p>
                <h3 className={`text-sm font-bold uppercase tracking-tight mt-0.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  Familiar Devices & Alternatives
                </h3>
              </div>
              <button
                onClick={onBack}
                className="text-[10px] font-mono text-[#3373AB] hover:underline"
              >
                View All in Category
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[#e5e5e5] border border-[#e5e5e5]">
              {related.map(rp => (
                <div
                  key={rp.id}
                  onClick={() => onViewProduct(rp.id)}
                  className={`flex flex-col ${isDark ? 'bg-[#222]' : 'bg-white'} p-3 group hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-pointer`}
                >
                  <span className={`text-[9px] font-mono mb-1 ${isDark ? 'text-gray-400' : 'text-[#768B9C]'}`}>{rp.category}</span>
                  <div className="h-20 flex items-center justify-center mb-2 overflow-hidden">
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <p className={`text-[11px] font-bold leading-tight line-clamp-2 ${isDark ? 'text-gray-200' : 'text-[#0062BD]'}`}>{rp.name}</p>
                  <p className={`text-[10px] font-mono mt-auto pt-1 ${isDark ? 'text-gray-400' : 'text-[#333E48]'}`}>RWF {rp.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {cartProduct && (
        <CartQuantityModal
          product={cartProduct}
          onClose={() => setCartProduct(null)}
          onAddToCart={(p, q) => { addToCart(p, q); setCartProduct(null); }}
          onViewDetails={(id) => { setCartProduct(null); onViewProduct(id); }}
        />
      )}
    </section>
  );
}
