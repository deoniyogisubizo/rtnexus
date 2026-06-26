import React, { useState, useEffect, useRef } from 'react';
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
import ProductDetailPage from './components/ProductDetailPage';
import AboutSection from './components/AboutSection';
import CareersSection from './components/CareersSection';
import ContactSection from './components/ContactSection';
import AuthExperience from './components/AuthExperience';
import UserPortals from './components/UserPortals';
import SearchPage from './components/SearchPage';
import NexusHub from './components/NexusHub';
import MacbookLoader from './components/MacbookLoader';
import './components/MacbookLoader.css';
import NavLoader from './components/NavLoader';
import { X, ShieldCheck, CreditCard, ChevronRight, Check, Sparkles, User, LogIn, Bot, Send } from 'lucide-react';
import { encodeId, decodeId } from './utils/idUtils';

const SESSION_KEY = 'rt_nexus_session';

function loadSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.email && parsed.name && parsed.role && parsed.token) return parsed as UserSession;
    return null;
  } catch {
    return null;
  }
}

function saveSession(session: UserSession | null): void {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export default function App() {
  // Navigation View Router
  const [view, setView] = useState<string>(() => {
    const saved = loadSession();
    return saved ? 'portals' : 'home';
  });
  const [user, setUser] = useState<UserSession | null>(() => loadSession());
  const [authOverlay, setAuthOverlay] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [splashFadeOut, setSplashFadeOut] = useState(false);
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('rtn_splash_shown'));

  useEffect(() => {
    if (!showSplash) return;
    sessionStorage.setItem('rtn_splash_shown', '1');
    const timer = setTimeout(() => setSplashFadeOut(true), 6800);
    const removeTimer = setTimeout(() => setShowSplash(false), 7200);
    return () => { clearTimeout(timer); clearTimeout(removeTimer); };
  }, []);
  
  // Cart escrow states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [checkoutSuccessMessage, setCheckoutSuccessMessage] = useState('');

  // Theme state (dark / light)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Global search bridging
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Navigation loading bar + scroll-to-top on view change
  const [isNavigating, setIsNavigating] = useState(false);
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) { initialRender.current = false; return; }
    setIsNavigating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const t = setTimeout(() => setIsNavigating(false), 1800);
    return () => clearTimeout(t);
  }, [view]);

  const navigateTo = (v: string) => {
    setView(v);
    setGlobalSearchQuery('');
    setShopPreselectCategory(null);
    setProductDetailId(null);
  };



  // Product detail page routing
  const [productDetailId, setProductDetailId] = useState<string | null>(null);
  const navRef = useRef(false);
  const handleViewProduct = (id: string) => {
    setProductDetailId(id);
    setView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Shop preselect category from showcase navigation
  const [shopPreselectCategory, setShopPreselectCategory] = useState<string | null>(null);

  // URL sync helpers
  function getPathFromView(v: string, pid?: string | null, cat?: string | null): string {
    switch (v) {
      case 'home': return '/';
      case 'shop': {
        if (cat) return `/shop/category/${encodeURIComponent(cat)}`;
        return '/shop';
      }
      case 'product': {
        if (pid) return `/shop/product/${encodeId(pid)}`;
        return '/shop';
      }
      case 'rtti': return '/courses';
      case 'classroom': return '/classroom';
      case 'mttv': return '/broadcasts';
      case 'nexushub': return '/nexus-hub';
      case 'solutions': return '/solutions';
      case 'about': return '/about';
      case 'careers': return '/careers';
      case 'contact': return '/contact';
      case 'adcenter': return '/adcenter';
      case 'search': return '/search';
      case 'portals': return '/portals';
      case 'login': return '/login';
      case 'signup': return '/signup';
      default: return '/';
    }
  }

  function parseViewFromPath(path: string): { v: string; pid?: string | null; cat?: string | null } {
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return { v: 'home' };
    const main = parts[0].toLowerCase();
    if (main === 'shop') {
      if (parts[1] === 'product' && parts[2]) {
        const decoded = decodeId(parts[2]);
        if (decoded) return { v: 'product', pid: decoded };
      }
      if (parts[1] === 'category' && parts[2]) {
        return { v: 'shop', cat: decodeURIComponent(parts[2]) };
      }
      return { v: 'shop' };
    }
    if (main === 'courses' || main === 'rtti') return { v: 'rtti' };
    if (main === 'broadcasts' || main === 'mttv') return { v: 'mttv' };
    if (main === 'nexus-hub' || main === 'nexushub') return { v: 'nexushub' };
    if (main === 'classroom') return { v: 'classroom' };
    if (main === 'solutions') return { v: 'solutions' };
    if (main === 'about') return { v: 'about' };
    if (main === 'careers') return { v: 'careers' };
    if (main === 'contact') return { v: 'contact' };
    if (main === 'adcenter') return { v: 'adcenter' };
    if (main === 'search') return { v: 'search' };
    if (main === 'portals') return { v: 'portals' };
    if (main === 'login' || main === 'signup') return { v: 'login' };
    return { v: 'home' };
  }

  // Sync view state → URL
  useEffect(() => {
    if (navRef.current) { navRef.current = false; return; }
    const path = getPathFromView(view, productDetailId, shopPreselectCategory);
    window.history.pushState({ view, productDetailId, shopPreselectCategory }, '', path);
  }, [view, productDetailId, shopPreselectCategory]);

  // Sync URL → view state (popstate + initial load)
  useEffect(() => {
    const handlePop = () => {
      const parsed = parseViewFromPath(window.location.pathname);
      navRef.current = true;
      if (parsed.v === 'login') {
        setView('home');
        setAuthTab('login');
        setAuthOverlay(true);
      } else {
        setView(parsed.v);
      }
      setProductDetailId(parsed.pid ?? null);
      setShopPreselectCategory(parsed.cat ?? null);
    };
    // initial parse
    handlePop();
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const handleShowcaseSelectCategory = (category: string) => {
    setShopPreselectCategory(category);
    setProductDetailId(null);
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
                token: generateToken(),
              };
              setUser(session);
              saveSession(session);
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
    const sessionWithToken: UserSession = { ...session, token: generateToken() };
    setUser(sessionWithToken);
    saveSession(sessionWithToken);
    setView('portals');
  };

  const handleLogout = () => {
    setUser(null);
    saveSession(null);
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Search submit from Navigation bar
  const handleSearchTrigger = (query: string) => {
    setGlobalSearchQuery(query);
    setShopPreselectCategory(null);
    setProductDetailId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (query) {
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

  // Global AI Chatbot
  const pageDescriptions: Record<string, { title: string; desc: string }> = {
    home: { title: 'Home', desc: 'RT Group industrial ecosystem — hardware, courses, broadcasts & more.' },
    shop: { title: 'RT Shop', desc: 'Browse 5K+ industrial components, dev boards & embedded systems.' },
    rtti: { title: 'RTTI Courses', desc: 'Accredited engineering certifications with live sandbox labs.' },
    classroom: { title: 'Live Classroom', desc: 'Interactive sandbox sessions with AI-powered whiteboards.' },
    mttv: { title: 'MTTV Broadcasts', desc: 'Low-latency engineering streams, webinars & tech debates.' },
    solutions: { title: 'Solutions', desc: 'Who we serve — engineers, businesses, creators & students.' },
    nexushub: { title: 'RTNEXUS HUB', desc: 'The RT Group e-learning & media hub — RTTI courses & MTTV broadcasts.' },
    adcenter: { title: 'Ad Center', desc: 'Promote your brand to 250K+ engineering builders worldwide.' },
    about: { title: 'About Us', desc: 'RT Group — converging foundries, education & media.' },
    careers: { title: 'Careers', desc: 'Join the federation building the future of hardware engineering.' },
    contact: { title: 'Contact', desc: 'Open support tickets, explore FAQ base & global office registry.' },
    search: { title: 'Search', desc: 'Find products, courses & broadcasts across the ecosystem.' },
    portals: { title: 'Dashboard', desc: 'Your workspace — orders, courses, streams & billing.' },
    product: { title: 'Product Detail', desc: 'View specifications, pricing & documentation for this component.' },
    login: { title: 'Sign In', desc: 'Secure access portal — sign in or create an account.' },
    signup: { title: 'Create Account', desc: 'Register for a secure workspace account.' },
  };
  const [showGlobalChat, setShowGlobalChat] = useState(false);
  const [showGlobalChatPopup, setShowGlobalChatPopup] = useState(false);
  const [globalChatMessages, setGlobalChatMessages] = useState([
    { sender: 'system', text: 'You are connected with Nexus AI Core Assist. Please declare your telemetry query.' }
  ]);
  const [globalChatInput, setGlobalChatInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setShowGlobalChatPopup(true), 300000);
    return () => clearTimeout(timer);
  }, []);
  const handleGlobalChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalChatInput.trim()) return;
    setGlobalChatMessages(prev => [
      ...prev,
      { sender: 'user', text: globalChatInput },
      { sender: 'system', text: 'Acknowledge: Logging chat parameters internally. Your active telemetry index is #' + Math.floor(Math.random() * 900 + 100) + '. An associate will take over.' }
    ]);
    setGlobalChatInput('');
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans selection:bg-[#3373AB]/30 tracking-normal antialiased ${theme === 'dark' ? 'bg-[#111111]' : 'bg-gray-100'}`}>
      
      {/* GLOBAL 3-LAYER NAVIGATION — hidden on admin dashboard */}
      {!(view === 'portals' && user?.role === 'admin') && (
        <Navigation 
          currentView={view}
          setView={navigateTo}
          user={user}
          logout={handleLogout}
          openAuth={(tab) => { setAuthTab(tab); setAuthOverlay(true); }}
          cart={cart}
          openCartDrawer={() => { setCartOpen(true); setCheckoutStep('cart'); }}
          triggerSearch={handleSearchTrigger}
          onViewProduct={handleViewProduct}
          theme={theme}
          setTheme={setTheme}
        />
      )}



      <NavLoader visible={isNavigating} />

      {/* AUTH OVERLAY */}
      {authOverlay && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setAuthOverlay(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AuthExperience
              initialTab={authTab}
              onLoginSuccess={(session) => { setAuthOverlay(false); handleLoginSuccess(session); }}
              closeAuth={() => setAuthOverlay(false)}
            />
          </div>
        </div>
      )}

      {/* CORE ROUTING SECTION SWITCHES */}
      <main className={`flex-1 w-full ${view !== 'portals' ? 'pt-[128px] lg:pt-[176px] pb-16 md:pb-0' : ''} ${theme === 'dark' ? 'bg-[#111111]' : 'bg-white'}`}>
        <div key={view} className="animate-fade-in-up w-full">
        {view === 'home' && (
          <div className="w-full">
            <HeroSection setView={navigateTo} theme={theme} />
            <SolutionsSection setView={navigateTo} theme={theme} />
            <RTShopShowcase setView={navigateTo} theme={theme} onSelectProduct={handleViewProduct} onSelectCategory={handleShowcaseSelectCategory} />
            <MarketplaceLayers addToCart={handleAddToCart} theme={theme} onSelectProduct={handleViewProduct} setView={navigateTo} />
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
            onViewProduct={handleViewProduct}
            preselectCategory={shopPreselectCategory}
            onClearPreselectCategory={() => setShopPreselectCategory(null)}
          />
        )}

        {view === 'product' && productDetailId && (
          <ProductDetailPage
            productId={productDetailId}
            addToCart={handleAddToCart}
            cartItems={cart}
            theme={theme}
            onBack={() => setView('shop')}
            onViewProduct={handleViewProduct}
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

        {view === 'nexushub' && (
          <NexusHub setView={navigateTo} theme={theme} />
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
          <SolutionsSection setView={navigateTo} theme={theme} standalone />
        )}

        {view === 'about' && (
          <AboutSection theme={theme} standalone />
        )}

        {view === 'careers' && (
          <CareersSection theme={theme} />
        )}

        {view === 'contact' && (
          <ContactSection theme={theme} standalone />
        )}

        {view === 'search' && (
          <SearchPage
            onBack={() => setView('home')}
            onSearch={handleSearchTrigger}
            onViewProduct={handleViewProduct}
            setView={navigateTo}
          />
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
                  onClick={() => { setAuthTab('login'); setAuthOverlay(true); }}
                  className="bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-bold uppercase tracking-widest py-3 px-6 w-full rounded-none transition-colors outline-none"
                >
                  Onboard Session Portal
                </button>
              </div>
            </div>
          )
        )}
        </div>
      </main>

      {/* DETAILED BRUTALIST ENTERPRISE FOOTER — hidden on admin dashboard */}
      {!(view === 'portals' && user?.role === 'admin') && (
      <footer className="w-full bg-[#111111] text-gray-400 text-xs py-12 px-6 border-t border-neutral-800 select-none font-pro text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center group">
              <img src="/logo/logo.png" alt="RT Group" className="h-10 scale-300 ml-10 w-auto object-contain" />
            </div>
            
            <p className="text-xs font-sans font-light text-gray-400 leading-relaxed max-w-sm">
              RT Group represents a multi-functional technological federation combining validated cross-border foundries, accredited certification courses, low-latency streaming networks, and custom role workspaces.
            </p>

            <p className="text-xs text-gray-500 font-mono">
              STATUS OVERRIDE: ACTIVE • REGENT 2026-AISTUDIO
            </p>
          </div>

          <div className="md:col-span-2 text-left">
            <h5 className="font-bold text-xs uppercase tracking-wider text-white mb-4">Core Modules</h5>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => setView('nexushub')} className="hover:text-white text-left block">RTNEXUS HUB</button></li>
              <li><button onClick={() => setView('shop')} className="hover:text-white text-left block">RT Shop Directory</button></li>
              <li><button onClick={() => setView('classroom')} className="hover:text-white text-left block">Live Classroom</button></li>
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
            <p className="text-xs leading-relaxed font-mono font-light text-gray-500">
              All telemetry, certification badges, drawing canvases, escrow dispatches, and diagnostics are simulated for prototyping purposes in the Google AI Studio container sandbox. Zero actual bank balances, certifications, or foundries liabilities are implied.
            </p>
            <div className="mt-4 flex gap-4 text-xs font-mono text-gray-400">
              <span>LEDGER: CERTIFIED-256</span>
              <span>REGS: CE/FCC Part15</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-neutral-800 pt-8 mt-8 text-center text-gray-500 text-xs font-mono">
          © 2026 RT Group Enterprise Ltd • Converged Matrix Solutions. Sharp edges rounded-none design layout. All rights reserved.
        </div>
      </footer>
      )}

      {/* SLIDE CART DRAWER PANEL (For RT shop escrow) */}
      {cartOpen && (
        <div className="fixed inset-0 bg-[#111111]/85 z-50 flex justify-end">
          <div className="w-full max-w-md bg-white border-l border-gray-250 h-full flex flex-col justify-between text-left text-gray-900 font-pro shadow-2xl">
            
            {/* Drawer Head */}
            <div className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-[#3373AB] font-bold uppercase tracking-wider">SECURE ESCROW REGISTER</span>
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
                      <i className="fa-solid fa-cart-arrow-down text-[#3373AB]/20 mb-3" style={{fontSize:'28px'}}></i>
                      <p className="text-xs font-sans">Your escrow basket contains zero vetted components currently.</p>
                      <button 
                        onClick={() => { setCartOpen(false); setView('shop'); }} 
                        className="mt-3 bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-semibold uppercase tracking-widest px-3 py-1.5"
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
                            <span className="text-xs text-gray-500 font-mono">OEM: {item.product.vendorName}</span>
                            
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
                              className="text-xs font-mono text-gray-400 hover:text-red-500"
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
                    <span className="text-xs font-mono text-gray-400 font-bold block mb-1">CHOOSE DISPATCH CREDENTIALS</span>
                    <p className="text-xs text-gray-600 mb-3">Please nominate your shipping and escrow release accounts:</p>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-gray-400 uppercase block mb-1">Corporate Delivery Address</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 42 Patriot Square, Lab B"
                      className="w-full bg-white border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#3373AB]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-gray-400 uppercase block mb-1">Vetted Account Key ID</label>
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
                  <p className="text-xs text-gray-400 font-mono mt-4 leading-relaxed font-light bg-gray-50 p-3 border border-gray-200">
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
                    <span className="text-xs font-mono text-gray-400 uppercase block">Consolidated Escrow Balance</span>
                    <span className="text-base font-bold font-mono text-gray-950">RWF {cartTotal.toFixed(2)}</span>
                  </div>
                  <span className="text-xs bg-[#3373AB]/10 text-[#3373AB] px-1.5 py-0.5 uppercase tracking-wide font-mono">HSM Secure Escrow</span>
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

      {/* GLOBAL AI CHATBOT — fixed bottom-right on every page */}
      <div className="fixed lg:bottom-6 bottom-24 right-6 z-50 flex flex-col items-end gap-2">
        {!showGlobalChat && showGlobalChatPopup && (
          <div className="relative bg-[#111111] text-white px-4 py-2.5 shadow-2xl max-w-[200px] text-xs font-mono animate-fade-in">
            <span>this is nexus ai ask every thing</span>
            <button
              onClick={() => setShowGlobalChatPopup(false)}
              className="absolute -top-1.5 -right-1.5 bg-[#3373AB] hover:bg-[#255C8E] text-white w-4 h-4 flex items-center justify-center outline-none"
            >
              <X size={10} />
            </button>
          </div>
        )}
        {!showGlobalChat ? (
          <button
            onClick={() => setShowGlobalChat(true)}
            className="bg-[#3373AB] hover:bg-[#255C8E] text-white p-3 shadow-2xl transition-all hover:scale-105 rounded-full outline-none ring-2 ring-white/60"
            style={{ borderRadius: '50%' }}
          >
            <Bot size={22} />
          </button>
        ) : (
          <div className="w-80 bg-white border border-gray-200 shadow-2xl z-50 rounded-none overflow-hidden text-left flex flex-col max-h-[480px]">
            {/* Chat head */}
            <div className="bg-[#111111] text-white px-4 py-3 flex items-center justify-between border-b border-gray-800 font-sans">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">NEXUS AI</span>
              </div>
              <button onClick={() => setShowGlobalChat(false)} className="text-gray-400 hover:text-white outline-none">
                <X size={15} />
              </button>
            </div>

            {/* Page context greeting */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-mono text-gray-500">
                You are on <span className="font-bold text-gray-900">{pageDescriptions[view]?.title || view}</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                {pageDescriptions[view]?.desc || 'Explore the RT Group ecosystem.'}
              </p>
              <p className="text-xs font-mono text-[#3373AB] mt-2 font-semibold">
                What is in your agenda with nexus today?
              </p>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-55/30 max-h-[240px]">
              {globalChatMessages.map((msg, idx) => (
                <div key={idx} className={`text-left p-2.5 max-w-[85%] text-xs ${msg.sender === 'user' ? 'bg-[#3373AB]/15 text-gray-800 ml-auto border-r-2 border-[#3373AB]' : 'bg-gray-100 text-gray-700'}`}>
                  <p className="leading-relaxed font-sans">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <form onSubmit={handleGlobalChatSend} className="p-2 border-t border-gray-150 bg-gray-50 flex gap-1">
              <input
                type="text"
                placeholder="Ask Nexus AI..."
                value={globalChatInput}
                onChange={(e) => setGlobalChatInput(e.target.value)}
                className="bg-white border border-gray-200 text-xs px-3 py-1.5 text-gray-800 w-full outline-none focus:border-[#3373AB] font-sans rounded-none"
              />
              <button type="submit" className="bg-[#3373AB] text-white p-2 rounded-none hover:bg-[#255C8E] outline-none">
                <Send size={11} />
              </button>
            </form>
          </div>
        )}
      </div>

      {showSplash && <MacbookLoader fadeOut={splashFadeOut} />}

    </div>
  );
}
