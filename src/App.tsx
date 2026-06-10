import React, { useState, useEffect } from 'react';
import { UserRole, UserSession, Product, CartItem } from './types';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';

import ShopSection from './components/ShopSection';
import RTTISection from './components/RTTISection';
import LiveClassroom from './components/LiveClassroom';
import MTTVSection from './components/MTTVSection';
import AdCenter from './components/AdCenter';
import SolutionsSection from './components/SolutionsSection';
import RTShopShowcase from './components/RTShopShowcase';
import MarketplaceLayers from './components/MarketplaceLayers';
import AboutSection from './components/AboutSection';
import CareersSection from './components/CareersSection';
import ContactSection from './components/ContactSection';
import AuthExperience from './components/AuthExperience';
import UserPortals from './components/UserPortals';
import { X, ShoppingBag, ShieldCheck, CreditCard, ChevronRight, Check, Sparkles, User, LogIn } from 'lucide-react';

export default function App() {
  // Navigation View Router
  const [view, setView] = useState<string>('home');
  const [user, setUser] = useState<UserSession | null>(null);
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: 'login' | 'register' }>({ open: false, tab: 'login' });
  
  // Cart escrow states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [checkoutSuccessMessage, setCheckoutSuccessMessage] = useState('');

  // Theme state (dark / light)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Global search bridging
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Shop preselect product from showcase navigation
  const [shopPreselectProductId, setShopPreselectProductId] = useState<string | null>(null);
  const handleShowcaseSelectProduct = (id: string) => {
    setShopPreselectProductId(id);
    setView('shop');
  };

  // Handle OAuth callback from social SSO
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/auth/callback') {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      if (accessToken) {
        fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then(r => r.json())
          .then(data => {
            if (data.email) {
              const session: UserSession = {
                email: data.email,
                name: data.name || data.email,
                role: 'customer',
              };
              setUser(session);
              setView('portals');
            }
          })
          .catch(() => {});
      }
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleUpdateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity: qty } : item));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Auth Operations
  const handleLoginSuccess = (session: UserSession) => {
    setUser(session);
    setAuthModal({ open: false, tab: 'login' });
    setView('portals'); // launch corresponding portal immediately
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
  };

  // Handle Search submit from Navigation bar
  const handleSearchTrigger = (query: string) => {
    setGlobalSearchQuery(query);
    // If we search, let's route to appropriate context
    if (query) {
      // Let's decide view based on current or keywords
      const qLower = query.toLowerCase();
      if (qLower.includes('course') || qLower.includes('syllabus') || qLower.includes('exam') || qLower.includes('rtti')) {
        setView('rtti');
      } else if (qLower.includes('live') || qLower.includes('broadcast') || qLower.includes('webinar') || qLower.includes('mttv') || qLower.includes('podcast')) {
        setView('mttv');
      } else {
        setView('shop');
      }
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutSuccessMessage(`Secure Escrow Ledger Validated. Locked RWF ${cartTotal.toFixed(2)} in Trust. RTTI Calibration Dispatch initialized.`);
    setCheckoutStep('success');
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans selection:bg-[#3373AB]/30 tracking-normal antialiased ${theme === 'dark' ? 'bg-[#111111]' : 'bg-gray-100'}`}>
      
      {/* GLOBAL 3-LAYER NAVIGATION — hidden on admin dashboard */}
      {!(view === 'portals' && user?.role === 'admin') && (
        <Navigation 
          currentView={view}
          setView={(v) => { setView(v); setGlobalSearchQuery(''); }}
          user={user}
          logout={handleLogout}
          openAuth={(tab) => setAuthModal({ open: true, tab })}
          cart={cart}
          openCartDrawer={() => { setCartOpen(true); setCheckoutStep('cart'); }}
          triggerSearch={handleSearchTrigger}
          theme={theme}
          setTheme={setTheme}
        />
      )}



      {/* CORE ROUTING SECTION SWITCHES */}
      <main className={`flex-1 w-full pt-[112px] ${theme === 'dark' ? 'bg-[#111111]' : 'bg-white'}`}>
        {view === 'home' && (
          <div className="w-full">
            <HeroSection setView={setView} theme={theme} />
            <SolutionsSection setView={setView} theme={theme} />
            <RTShopShowcase setView={setView} theme={theme} onSelectProduct={handleShowcaseSelectProduct} />
            <MarketplaceLayers addToCart={handleAddToCart} theme={theme} onSelectProduct={handleShowcaseSelectProduct} setView={setView} />
            <AboutSection theme={theme} />
            <ContactSection theme={theme} />
          </div>
        )}

        {view === 'shop' && (
          <ShopSection 
            addToCart={handleAddToCart}
            searchQuery={globalSearchQuery}
            cartItems={cart}
            theme={theme}
            preselectProductId={shopPreselectProductId}
            onClearPreselectProductId={() => setShopPreselectProductId(null)}
          />
        )}

        {view === 'rtti' && (
          <RTTISection 
            searchQuery={globalSearchQuery}
            theme={theme}
          />
        )}

        {view === 'classroom' && (
          <LiveClassroom theme={theme} />
        )}

        {view === 'mttv' && (
          <MTTVSection 
            searchQuery={globalSearchQuery}
            theme={theme}
          />
        )}

        {view === 'adcenter' && (
          <AdCenter theme={theme} />
        )}

        {view === 'solutions' && (
          <SolutionsSection setView={setView} theme={theme} />
        )}

        {view === 'about' && (
          <AboutSection theme={theme} />
        )}

        {view === 'careers' && (
          <CareersSection theme={theme} />
        )}

        {view === 'contact' && (
          <ContactSection theme={theme} />
        )}

        {view === 'portals' && (
          user ? (
            <UserPortals user={user} setView={setView} />
          ) : (
            <div className="py-20 flex justify-center px-6">
              <div className="max-w-md w-full bg-white border border-gray-200 p-8 text-center space-y-4">
                <LogIn className="mx-auto text-[#3373AB]" size={42} />
                <h3 className="font-sans font-bold text-sm text-gray-950 uppercase tracking-wide">Secure Console Authorization Required</h3>
                
                <p className="text-xs text-gray-500 leading-relaxed font-sans font-light">
                  Please trigger the sign-in keys interface or use the prototype controller row above to simulate immediate diagnostic console credentials.
                </p>

                <button 
                  onClick={() => setAuthModal({ open: true, tab: 'login' })}
                  className="bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-bold uppercase tracking-widest py-3 px-6 w-full rounded-none transition-colors outline-none"
                >
                  Onboard Session Portal
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* DETAILED BRUTALIST ENTERPRISE FOOTER — hidden on admin dashboard */}
      {!(view === 'portals' && user?.role === 'admin') && (
      <footer className="w-full bg-[#111111] text-gray-400 text-xs py-12 px-6 border-t border-neutral-800 select-none font-sans text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center group">
              <img src="/logo/logo.png" alt="RT Nexus" className="h-10 scale-300 ml-10 w-auto object-contain" />
            </div>
            
            <p className="text-[11px] font-sans font-light text-gray-400 leading-relaxed max-w-sm">
              RT Nexus represents a multi-functional technological federation combining validated cross-border foundries, accredited certification courses, low-latency streaming networks, and custom role workspaces.
            </p>

            <p className="text-[10px] text-gray-500 font-mono">
              STATUS OVERRIDE: ACTIVE • REGENT 2026-AISTUDIO
            </p>
          </div>

          <div className="md:col-span-2 text-left">
            <h5 className="font-bold text-xs uppercase tracking-wider text-white mb-4">Core Modules</h5>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => setView('shop')} className="hover:text-white text-left block">RT Shop Directory</button></li>
              <li><button onClick={() => setView('rtti')} className="hover:text-white text-left block">RTTI Instructions</button></li>
              <li><button onClick={() => setView('classroom')} className="hover:text-white text-left block">Live Classroom</button></li>
              <li><button onClick={() => setView('mttv')} className="hover:text-white text-left block">MTTV Broadcasting</button></li>
            </ul>
          </div>

          <div className="md:col-span-2 text-left">
            <h5 className="font-bold text-xs uppercase tracking-wider text-white mb-4">Integrations</h5>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => setView('solutions')} className="hover:text-white text-left block">Solutions Outline</button></li>
              <li><button onClick={() => setView('adcenter')} className="hover:text-white text-left block">Advertising Center</button></li>
              <li><button onClick={() => setView('careers')} className="hover:text-white text-left block">Recruiting Registry</button></li>
              <li><button onClick={() => setView('contact')} className="hover:text-white text-left block">Help & FAQ Base</button></li>
            </ul>
          </div>

          <div className="md:col-span-4 text-left">
            <h5 className="font-bold text-xs uppercase tracking-wider text-white mb-4">Accreditation Disclaimer</h5>
            <p className="text-[10px] leading-relaxed font-mono font-light text-gray-500">
              All telemetry, certification badges, drawing canvases, escrow dispatches, and diagnostics are simulated for prototyping purposes in the Google AI Studio container sandbox. Zero actual bank balances, certifications, or foundries liabilities are implied.
            </p>
            <div className="mt-4 flex gap-4 text-[10px] font-mono text-gray-400">
              <span>LEDGER: CERTIFIED-256</span>
              <span>REGS: CE/FCC Part15</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-neutral-800 pt-8 mt-8 text-center text-gray-500 text-[10px] font-mono">
          © 2026 RT Nexus Enterprise Ltd • Converged Matrix Solutions. Sharp edges rounded-none design layout. All rights reserved.
        </div>
      </footer>
      )}

      {/* DIALOG MODAL: SECURE KEY AUTHENTICATION OVERLAY */}
      {authModal.open && (
        <div className="fixed inset-0 bg-[#111111]/85 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={() => setAuthModal({ open: false, tab: 'login' })}
              className="absolute -top-10 right-0 bg-[#3373AB] hover:bg-[#255C8E] p-2 text-white font-bold outline-none cursor-pointer"
            >
              <X size={18} />
            </button>
            <AuthExperience 
              initialTab={authModal.tab}
              onLoginSuccess={handleLoginSuccess}
              closeAuth={() => setAuthModal({ open: false, tab: 'login' })}
            />
          </div>
        </div>
      )}

      {/* SLIDE CART DRAWER PANEL (For RT shop escrow) */}
      {cartOpen && (
        <div className="fixed inset-0 bg-[#111111]/85 z-50 flex justify-end">
          <div className="w-full max-w-md bg-white border-l border-gray-250 h-full flex flex-col justify-between text-left text-gray-900 font-sans shadow-2xl">
            
            {/* Drawer Head */}
            <div className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-[#3373AB] font-bold uppercase tracking-wider">SECURE ESCROW REGISTER</span>
                <span className="text-sm font-bold uppercase tracking-tight mt-1">RT Shop Escrow Basket</span>
              </div>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-white cursor-pointer outline-none">
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body switches based on checkout steps */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {checkoutStep === 'cart' && (
                <div className="space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 flex flex-col items-center">
                      <ShoppingBag size={48} className="text-[#3373AB]/30 mb-4" />
                      <p className="text-xs font-sans">Your escrow basket contains zero vetted components currently.</p>
                      <button 
                        onClick={() => { setCartOpen(false); setView('shop'); }} 
                        className="mt-4 bg-[#3373AB] hover:bg-[#255C8E] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2"
                      >
                        Browse RT Shop
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-150">
                      {cart.map((item) => (
                        <div key={item.product.id} className="py-3 flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h5 className="font-bold text-xs uppercase text-gray-900 leading-tight">{item.product.name}</h5>
                            <span className="text-[10px] text-gray-500 font-mono">OEM: {item.product.vendorName}</span>
                            
                            <div className="flex items-center gap-3 mt-2 pr-4 justify-start">
                              <button 
                                onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity - 1)}
                                className="px-1.5 py-0.5 border border-gray-200 text-xs hover:bg-gray-100 font-mono"
                              >-</button>
                              <span className="font-mono text-xs">{item.quantity}</span>
                              <button 
                                onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity + 1)}
                                className="px-1.5 py-0.5 border border-gray-200 text-xs hover:bg-gray-100 font-mono"
                              >+</button>
                            </div>
                          </div>

                          <div className="text-right">
                            <button 
                              onClick={() => handleRemoveFromCart(item.product.id)}
                              className="text-[10px] font-mono text-gray-400 hover:text-red-500"
                            >[De-list]</button>
                            <p className="font-mono text-xs font-bold text-gray-950 mt-2">
                              RWF {(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {checkoutStep === 'checkout' && (
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 font-bold block mb-1">CHOOSE DISPATCH CREDENTIALS</span>
                    <p className="text-xs text-gray-600 mb-3">Please nominate your shipping and escrow release accounts:</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1">Corporate Delivery Address</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 42 Patriot Square, Lab B"
                      className="w-full bg-white border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#3373AB]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1">Vetted Account Key ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. NX-DEVEL-ROW-42"
                      className="w-full bg-white border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#3373AB] font-mono"
                      required
                    />
                  </div>

                  <div className="bg-gray-50 p-4 border border-gray-200 space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center">
                      <span>Total Units Escrow:</span>
                      <span className="font-bold font-sans text-gray-900">RWF {cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#3373AB]">
                      <span>Interference Checks cost:</span>
                      <span className="font-bold">INCLUDED</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-none transition-colors outline-none flex items-center justify-center gap-2"
                  >
                    <CreditCard size={12} />
                    <span>Onboard Escrow & Lockheed Payout</span>
                  </button>
                </form>
              )}

              {checkoutStep === 'success' && (
                <div className="text-center py-8 space-y-4 font-sans animate-fade-in text-gray-900">
                  <div className="h-12 w-12 bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <h4 className="font-sans font-bold text-sm uppercase">ESCROW DEPOSIT TRANSITED</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    {checkoutSuccessMessage}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono mt-4 leading-relaxed font-light bg-gray-50 p-3 border border-gray-200">
                    Your shipment token order is permanently logged. Access your Customer Profile (Workspace portal) to examine live dispatch coordinates.
                  </p>
                  <button 
                    onClick={() => { setCartOpen(false); setView('portals'); }}
                    className="mt-6 bg-[#111111] text-white text-xs font-mono uppercase tracking-widest py-2.5 px-6 rounded-none outline-none"
                  >
                    LAUNCH PORTAL DASHBOARD
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Footer pricing summary */}
            {checkoutStep === 'cart' && cart.length > 0 && (
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col gap-4">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase block">Consolidated Escrow Balance</span>
                    <span className="text-base font-bold font-mono text-gray-950">RWF {cartTotal.toFixed(2)}</span>
                  </div>
                  <span className="text-[9px] bg-[#3373AB]/10 text-[#3373AB] px-1.5 py-0.5 uppercase tracking-wide font-mono">HSM Secure Escrow</span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={handleClearCart} 
                    className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold text-xs py-2 px-4 rounded-none outline-none font-mono"
                  >
                    [ERASE]
                  </button>
                  <button 
                    onClick={() => setCheckoutStep('checkout')}
                    className="flex-1 bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-bold uppercase tracking-wider py-2.5 text-center rounded-none outline-none flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Dispatch</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
