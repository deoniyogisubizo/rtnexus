import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { Product, CartItem } from '../types';
import { fetchProducts } from '../services/api';
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

function getYoutubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function StarRating({ rating, isDark }: { rating: number; isDark: boolean }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: full }, (_, i) => (
        <Star key={`f${i}`} size={11} className="text-yellow-400 fill-yellow-400" />
      ))}
      {half && <Star key="half" size={11} className="text-yellow-400 fill-yellow-400 opacity-50" />}
      {Array.from({ length: empty }, (_, i) => (
        <Star key={`e${i}`} size={11} className={isDark ? 'text-gray-600' : 'text-gray-300'} />
      ))}
      <span className={`text-xs font-mono ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{rating.toFixed(1)}</span>
    </span>
  );
}

export default function ProductDetailPage({ productId, addToCart, cartItems, theme = 'light', onBack, onViewProduct }: ProductDetailPageProps) {
  const isDark = theme === 'dark';
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [cartProduct, setCartProduct] = useState<Product | null>(null);
  const [cartButtonRect, setCartButtonRect] = useState<DOMRect | null>(null);
  const [showFixedBar, setShowFixedBar] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetchProducts().then(setAllProducts).catch(() => {});
  }, []);

  const product = allProducts.find(p => p.id === productId);

  useEffect(() => {
    const handleScroll = () => {
      if (barRef.current) {
        const rect = barRef.current.getBoundingClientRect();
        setShowFixedBar(rect.top <= 112);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setSelectedImage(0);
    setVideoPlaying(false);
  }, [productId]);

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

  const allImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const embedSrc = product.videoUrl ? getYoutubeEmbedUrl(product.videoUrl) : null;

  const hasSpecTable = product.specTable && product.specTable.length > 0
    && product.specTable.some(row => row.some(cell => cell.trim() !== ''));

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
          <div className="md:col-span-2 space-y-3">
            <div className={`h-80 sm:h-96 border ${borderCls} ${isDark ? 'bg-[#222]' : 'bg-gray-50'} flex items-center justify-center p-6`}>
              <img
                src={allImages[selectedImage] || product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = product.image; }}
              />
            </div>

            {allImages.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-14 border-2 overflow-hidden flex items-center justify-center p-1 transition-all ${
                      selectedImage === idx
                        ? 'border-[#3373AB]'
                        : borderCls
                    }`}
                  >
                    <img src={img} alt="" className="max-w-full max-h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-3 space-y-6">
            <div>
              <p className="text-xs font-mono font-bold text-[#3373AB] uppercase tracking-widest">{product.category}</p>
              <h1 className={`text-xl lg:text-2xl font-bold uppercase tracking-tight mt-1 ${isDark ? 'text-white' : 'text-[#111111]'}`}>{product.name}</h1>
              <p className="text-xs font-mono text-gray-400 uppercase mt-1">OEM: {product.vendorName}</p>
              {product.rating > 0 && (
                <div className="mt-1.5">
                  <StarRating rating={product.rating} isDark={isDark} />
                </div>
              )}
            </div>

            <div ref={barRef} className={`border-t pt-6 pb-6 flex items-center justify-between ${borderCls} ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'} ${showFixedBar ? 'invisible' : ''}`}>
              <div>
                <span className="text-xs font-mono text-gray-400 uppercase block">Single Unit Escrow price</span>
                <span className={`text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>RWF {product.price.toFixed(2)}</span>
                <span className={`text-xs font-mono block mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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
                  onClick={(e) => { setCartButtonRect(e.currentTarget.getBoundingClientRect()); setCartProduct(product); }}
                  className="bg-[#D95907]/80 hover:bg-[#D95907]/60 text-white font-semibold px-4 py-2 text-xs rounded-none transition-colors outline-none flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-cart-arrow-down" style={{fontSize:'12px'}}></i>
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            <div className={`border-l-4 border-[#3373AB] pl-4 py-1`}>
              <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {product.description}
              </p>
            </div>

            <div>
              <h4 className={`text-xs font-bold uppercase border-b pb-1.5 mb-3 tracking-wider ${isDark ? 'text-gray-200 border-gray-700' : 'text-gray-800 border-gray-300'}`}>Calibrated Specification Profile</h4>
              <table className="w-full text-xs font-mono">
                <tbody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key} className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                      <td className={`py-2 font-bold w-1/3 leading-tight pr-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{key}</td>
                      <td className={`py-2 text-xs ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hasSpecTable && (
              <div>
                <h4 className={`text-xs font-bold uppercase border-b pb-1.5 mb-3 tracking-wider ${isDark ? 'text-gray-200 border-gray-700' : 'text-gray-800 border-gray-300'}`}>Detailed Specification Table</h4>
                <div className="overflow-x-auto">
                  <table className={`w-full text-xs font-mono border ${borderCls}`}>
                    <tbody>
                      {product.specTable!.map((row, ri) => (
                        <tr key={ri} className={`${ri === 0 ? (isDark ? 'bg-gray-800' : 'bg-gray-100') : ''} border-b ${borderCls}`}>
                          {row.map((cell, ci) => (
                            <td key={ci} className={`px-3 py-2 border-r ${borderCls} ${ri === 0 ? 'font-bold' : ''} ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className={`${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} border p-4`}>
              <h5 className="text-xs font-mono font-bold text-[#3373AB] uppercase">Hardware stress report</h5>
              <p className={`text-xs leading-relaxed font-sans mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                This unit calibrated profile satisfies FCC Part 15 and CE industrial interference regulations. Calibrated at 22°C ambient with 45% standard saturation. Zero defects logic verified by RTTI instrumentation audits.
              </p>
            </div>
          </div>
        </div>

        {embedSrc && (
          <div ref={videoSectionRef} className={`mt-16 pt-8 border-t ${borderCls}`}>
            <div className="border-l-4 border-[#3373AB] pl-4 mb-6">
              <p className="text-xs font-mono font-bold text-[#3373AB] uppercase tracking-widest">VIDEO GUIDE</p>
              <h3 className={`text-sm font-bold uppercase tracking-tight mt-0.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                How to Use & Setup Guide
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`relative aspect-video border ${borderCls} ${isDark ? 'bg-black' : 'bg-gray-50'} flex items-center justify-center overflow-hidden group`}>
                {videoPlaying ? (
                  <iframe
                    ref={iframeRef}
                    src={`${embedSrc}?autoplay=1&controls=1`}
                    title={product.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <>
                    <div className={`absolute inset-0 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      <div className="w-full h-full flex items-center justify-center">
                        <i className={`fa-solid fa-film text-5xl ${isDark ? 'text-gray-700' : 'text-gray-300'}`}></i>
                      </div>
                    </div>
                    <button
                      onClick={() => setVideoPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#D95907] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <i className="fa-solid fa-play text-white text-xl ml-1"></i>
                      </div>
                    </button>
                  </>
                )}
              </div>
              <div className="flex flex-col justify-center gap-3">
                {product.whereToUse && (
                  <div>
                    <h4 className={`text-xs font-bold uppercase mb-2 tracking-wider ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Quick Start Guide</h4>
                    <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {product.whereToUse}
                    </p>
                  </div>
                )}
                {product.guideBook && (
                  <div>
                    <h4 className={`text-xs font-bold uppercase mb-2 tracking-wider ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Reference Guide</h4>
                    <a
                      href={product.guideBook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#3373AB] hover:underline"
                    >
                      <i className="fa-solid fa-book-open"></i>
                      <span>Open Documentation / Guide Book</span>
                    </a>
                  </div>
                )}
                {!product.whereToUse && !product.guideBook && (
                  <p className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Click the play button to watch the product video.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className={`mt-16 pt-8 border-t ${borderCls}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="border-l-4 border-[#3373AB] pl-4">
                <p className="text-xs font-mono font-bold text-[#3373AB] uppercase tracking-widest">RELATED MODULES</p>
                <h3 className={`text-sm font-bold uppercase tracking-tight mt-0.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  Familiar Devices & Alternatives
                </h3>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-mono text-[#3373AB] hover:underline"
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
                  <span className={`text-xs font-mono mb-1 ${isDark ? 'text-gray-400' : 'text-[#768B9C]'}`}>{rp.category}</span>
                  <div className="h-20 flex items-center justify-center mb-2 overflow-hidden">
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <p className={`text-xs font-bold leading-tight line-clamp-2 ${isDark ? 'text-gray-200' : 'text-[#0062BD]'}`}>{rp.name}</p>
                  <p className={`text-xs font-mono mt-auto pt-1 ${isDark ? 'text-gray-400' : 'text-[#333E48]'}`}>RWF {rp.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showFixedBar && (
        <div className="fixed top-[116px] left-0 right-0 z-20 border-b shadow-sm pt-6" style={{backgroundColor: isDark ? '#1a1a1a' : 'white'}}>
          <div className="max-w-7xl mx-auto px-6">
            <div className={`border-t pt-6 pb-6 flex items-center justify-between ${borderCls}`}>
              <div>
                <span className="text-xs font-mono text-gray-400 uppercase block">{product.name}</span>
                <span className={`text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>RWF {product.price.toFixed(2)}</span>
                <span className={`text-xs font-mono block mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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
                  onClick={(e) => { setCartButtonRect(e.currentTarget.getBoundingClientRect()); setCartProduct(product); }}
                  className="bg-[#D95907]/80 hover:bg-[#D95907]/60 text-white font-semibold px-4 py-2 text-xs rounded-none transition-colors outline-none flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-cart-arrow-down" style={{fontSize:'12px'}}></i>
                  <span>Add to Cart</span>
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
          onAddToCart={(p, q) => { addToCart(p, q); setCartProduct(null); setCartButtonRect(null); }}
          onViewDetails={(id) => { setCartProduct(null); setCartButtonRect(null); onViewProduct(id); }}
        />
      )}
    </section>
  );
}
