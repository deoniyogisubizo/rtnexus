import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Sun, Moon, Bell, ChevronDown, Mail, ShieldCheck, Heart, User,
  LogOut, CheckCircle, Package, ArrowRight, Menu, X, Home, Bot,
  ShoppingCart, LayoutDashboard,
} from 'lucide-react';
import { UserSession, CartItem } from '../types';
// searchAll(query) is the same search helper the previous version of this
// file used — keep whatever import you already have for it in your project,
// e.g. `import { searchAll } from '../utils/search';`

interface NavigationProps {
  currentView: string;
  setView: (view: string) => void;
  user: UserSession | null;
  logout: () => void;
  openAuth: (tab: 'login' | 'register') => void;
  cart: CartItem[];
  openCartDrawer: () => void;
  triggerSearch: (query: string) => void;
  onViewProduct?: (id: string) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

const NAV_LINKS: { key: string; label: string; mega?: 'shop' | 'rtti' | 'mttv' }[] = [
  { key: 'home', label: 'Home' },
  { key: 'shop', label: 'RT Shop', mega: 'shop' },
  { key: 'rtti', label: 'RTTI', mega: 'rtti' },
  { key: 'mttv', label: 'MTTV', mega: 'mttv' },
  { key: 'solutions', label: 'Solutions' },
  { key: 'adcenter', label: 'Ad Center' },
  { key: 'about', label: 'About Us' },
  { key: 'contact', label: 'Contact' },
];

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3373AB]/60 focus-visible:ring-offset-1';

export default function Navigation({
  currentView,
  setView,
  user,
  logout,
  openAuth,
  cart,
  openCartDrawer,
  triggerSearch,
  onViewProduct,
  theme,
  setTheme,
}: NavigationProps) {
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showCategoryBar, setShowCategoryBar] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showChatbotMsg, setShowChatbotMsg] = useState(false);
  const lastScrollY = useRef(0);
  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setShowCategoryBar(false);
      } else if (currentScrollY < lastScrollY.current) {
        setShowCategoryBar(true);
      }
      setScrolled(currentScrollY > 0);
      lastScrollY.current = currentScrollY;
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchFocused(false);
      }
      if (!target.closest('.account-dropdown')) setShowAccountMenu(false);
      if (!target.closest('.notification-dropdown')) setShowNotifications(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleMouseEnter = (menuName: string) => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setActiveMegaMenu(menuName);
  };

  const handleMouseLeave = () => {
    megaMenuTimeout.current = setTimeout(() => setActiveMegaMenu(null), 150);
  };

  const goTo = (view: string) => {
    setView(view);
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
  };

  const systemNotifications = [
    { id: 1, title: 'Hardware Dispatch', text: 'IoT Gateway order has been packed and dispatched.', time: '10m ago' },
    { id: 2, title: 'New Certification Track', text: 'RTTI Cyber-Physical SCADA Course is officially live.', time: '1h ago' },
    { id: 3, title: 'Campaign Assessment', text: 'MTTV Campaign assessment is ready for review.', time: '3h ago' },
  ];

  const accountMenuItems = [
    { icon: LayoutDashboard, label: 'Access Dashboard' },
    { icon: Package, label: 'Track Orders' },
    { icon: Heart, label: 'Purchased Items' },
    { icon: CheckCircle, label: 'Billing & Payments' },
  ];

  return (
    <header
      className={`w-full fixed top-0 z-50 select-none font-sans text-sm transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-none'
      } ${
        theme === 'dark'
          ? scrolled ? 'bg-[#1a1a1a]/95 backdrop-blur-md' : 'bg-[#1a1a1a]'
          : scrolled ? 'bg-white/95 backdrop-blur-md' : 'bg-white'
      }`}
    >
      <style>{`
        @keyframes navFadeSlide { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes badgePulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(51,115,171,0.55); } 70% { box-shadow: 0 0 0 5px rgba(51,115,171,0); } }
        .mega-menu-enter { animation: navFadeSlide 200ms ease-out; }
        .badge-pulse { animation: badgePulse 2.2s infinite; }
      `}</style>

      {/* Brand accent strip */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#3373AB] via-[#5B9BD5] to-[#3373AB]" />

      {/* ============================================================ */}
      {/* LAYER 1 — Brand bar: logo, search, account & cart controls    */}
      {/* ============================================================ */}
      <div className={`w-full border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="h-[72px] px-4 md:px-6 flex items-center gap-3 md:gap-6">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className={`lg:hidden flex items-center justify-center p-2 -ml-2 rounded-none ${focusRing} ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <div
            onClick={() => goTo('home')}
            className={`flex items-center gap-3 cursor-pointer shrink-0 group ${focusRing}`}
            role="button"
            tabIndex={0}
          >
            <img
              src="/logo/logo.png"
              alt="RT Nexus"
              className="h-16 scale-200 ml-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>

          {/* Search — primary, flex-grow */}
          <div ref={searchRef} className="relative flex-1 hidden md:flex max-w-xl mx-auto">
            <div
              className={`flex items-center w-full px-3.5 h-10 border rounded-none transition-all duration-200 focus-within:border-[#3373AB] focus-within:shadow-[0_0_0_3px_rgba(51,115,171,0.15)] ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
              }`}
            >
              <Search size={15} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              <input
                type="text"
                placeholder="Search products, categories, docs..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    triggerSearch(searchVal);
                    setSearchFocused(false);
                  }
                }}
                className={`bg-transparent text-xs outline-none w-full font-sans ml-2.5 ${
                  theme === 'dark' ? 'text-gray-200 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            {searchFocused && searchVal.trim() && (() => {
              const { results, suggestion } = searchAll(searchVal);
              const cats = results.filter((r) => r.type === 'category');
              const prods = results.filter((r) => r.type === 'product');
              const noResults = results.length === 0;

              const handleNav = (q: string) => {
                setSearchVal(q);
                setSearchFocused(false);
                triggerSearch(q);
              };
              const handleProductNav = (id: string) => {
                setSearchVal('');
                setSearchFocused(false);
                onViewProduct?.(id);
              };

              return (
                <div
                  className={`absolute top-full left-0 right-0 mt-1.5 border shadow-lg z-[70] max-h-80 overflow-y-auto ${
                    theme === 'dark' ? 'bg-[#1a1a1a] border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-900'
                  }`}
                >
                  {noResults ? (
                    <div className="p-3 space-y-2">
                      <p className="text-xs text-gray-500">
                        No results for &ldquo;<span className="font-semibold">{searchVal}</span>&rdquo;
                      </p>
                      {suggestion && (
                        <button onClick={() => setSearchVal(suggestion)} className="text-xs text-[#3373AB] hover:underline block">
                          Did you mean &ldquo;<span className="font-semibold">{suggestion}</span>&rdquo;?
                        </button>
                      )}
                      <button
                        onClick={() => handleNav(searchVal)}
                        className="text-xs text-[#3373AB] border border-[#3373AB]/30 hover:border-[#3373AB] px-2.5 py-1 inline-flex items-center gap-1 transition-colors mt-1"
                      >
                        <Package size={12} /> Search in products <ArrowRight size={10} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      {cats.length > 0 && (
                        <div>
                          <div className={`text-[9px] font-mono uppercase tracking-widest px-3 pt-2 pb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Categories
                          </div>
                          {cats.map((r) => (
                            <button
                              key={r.label}
                              onClick={() => handleNav(r.label)}
                              className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                              }`}
                            >
                              <span>{r.label}</span>
                              <ArrowRight size={11} className="text-gray-400" />
                            </button>
                          ))}
                        </div>
                      )}
                      {prods.length > 0 && (
                        <div>
                          <div className={`text-[9px] font-mono uppercase tracking-widest px-3 pt-2 pb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Products
                          </div>
                          {prods.slice(0, 5).map((r) => (
                            <button
                              key={r.product.id}
                              onClick={() => handleProductNav(r.product.id)}
                              className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-3 transition-colors ${
                                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                              }`}
                            >
                              <span className="font-mono font-bold text-[11px] text-[#D95907] whitespace-nowrap w-24 text-right">
                                RWF {r.product.price.toFixed(2)}
                              </span>
                              <span className="truncate">{r.label}</span>
                            </button>
                          ))}
                          {prods.length > 5 && (
                            <button
                              onClick={() => handleNav(searchVal)}
                              className={`w-full text-left px-3 py-1.5 text-xs text-gray-400 italic transition-colors ${
                                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                              }`}
                            >
                              +{prods.length - 5} more products...
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Right cluster: theme, notifications, cart, account */}
          <div className="flex items-center gap-1 md:gap-2 ml-auto shrink-0">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2.5 rounded-none transition-all duration-150 hover:scale-105 active:scale-95 ${focusRing} ${
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Toggle color theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notifications */}
            <div className="relative notification-dropdown">
              <button
                onClick={() => setShowNotifications((v) => !v)}
                className={`relative p-2.5 rounded-none transition-all duration-150 hover:scale-105 active:scale-95 ${focusRing} ${
                  theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Notifications"
              >
                <Bell size={16} />
                <span className="badge-pulse absolute top-1 right-1 h-3.5 w-3.5 flex items-center justify-center bg-[#3373AB] text-white text-[9px] font-mono font-bold">
                  3
                </span>
              </button>

              {showNotifications && (
                <div className="mega-menu-enter absolute right-0 mt-2 w-80 bg-white text-gray-800 border border-gray-200 shadow-2xl z-[60] overflow-hidden">
                  <div className="bg-[#111111] text-white py-2 px-4 flex justify-between items-center border-b border-gray-700">
                    <span className="font-mono text-xs tracking-wider uppercase">System Operations Log</span>
                    <span className="text-[10px] text-gray-400">3 Alerts</span>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                    {systemNotifications.map((item) => (
                      <div key={item.id} className="p-3 hover:bg-gray-50 flex items-start gap-2.5">
                        <div className="h-1.5 w-1.5 bg-[#3373AB] mt-1.5 shrink-0" />
                        <div>
                          <p className="font-medium text-xs text-gray-900">{item.title}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.text}</p>
                          <span className="text-[10px] text-gray-400 font-mono mt-1 block">{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 p-2 text-center border-t border-gray-100">
                    <button
                      onClick={() => { goTo('portals'); setShowNotifications(false); }}
                      className="text-xs text-[#3373AB] font-semibold hover:underline"
                    >
                      Launch Diagnostic Portal
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={openCartDrawer}
              className={`relative p-2.5 rounded-none transition-all duration-150 hover:scale-105 active:scale-95 ${focusRing} ${
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Open RT Cart"
              aria-label="Cart"
            >
              <ShoppingCart size={17} />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-[#3373AB] text-white text-[9px] font-mono font-bold flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Account */}
            {user ? (
              <div className="relative account-dropdown ml-1">
                <button
                  onClick={() => setShowAccountMenu((v) => !v)}
                  className={`group flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-none transition-colors ${focusRing} ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="w-7 h-7 bg-[#3373AB] text-white flex items-center justify-center text-xs font-bold shrink-0 ring-2 ring-transparent group-hover:ring-[#3373AB]/30 transition-all">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`hidden md:block text-xs font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {user.name}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`hidden md:block transition-transform duration-200 ${showAccountMenu ? 'rotate-180' : ''} ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                </button>

                {showAccountMenu && (
                  <div className="mega-menu-enter absolute right-0 mt-2 w-56 bg-white text-gray-800 border border-gray-200 z-[60] shadow-xl">
                    <div className="p-3 bg-gray-50 border-b border-gray-100">
                      <p className="font-semibold text-xs text-gray-900 overflow-hidden text-ellipsis">{user.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{user.email}</p>
                    </div>
                    {accountMenuItems.map(({ icon: Icon, label }) => (
                      <button
                        key={label}
                        onClick={() => { goTo('portals'); setShowAccountMenu(false); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-xs font-semibold flex items-center gap-2.5 border-b border-gray-100"
                      >
                        <Icon size={14} className="text-[#3373AB]" />
                        <span>{label}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => { logout(); setShowAccountMenu(false); goTo('home'); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-xs font-semibold text-red-600 flex items-center gap-2.5"
                    >
                      <LogOut size={14} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <button
                  onClick={() => openAuth('login')}
                  className={`hidden md:inline-flex text-xs font-semibold px-3 py-2 rounded-none transition-colors ${focusRing} ${
                    theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-[#3373AB]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className={`group flex items-center gap-1.5 bg-gradient-to-r from-[#3373AB] to-[#255C8E] hover:from-[#3a82c2] hover:to-[#2a6699] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-none transition-all shadow-sm hover:shadow-md ${focusRing}`}
                >
                  <span>Get Started</span>
                  <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* LAYER 2 — Three-column category bar: primary nav | platform | secondary */}
      {/* ============================================================ */}
      <div
        className={`hidden lg:block w-full bg-[#111111] overflow-hidden transition-all duration-200 ${
          showCategoryBar ? 'h-12' : 'h-0'
        }`}
      >
        <div className="h-12 px-5 flex items-center justify-between">
          {/* LEFT — primary navigation (Home, RT Shop, RTTI, MTTV, Solutions) */}
          <nav className="flex items-center h-full">
            {NAV_LINKS.filter((link) => !['adcenter', 'about', 'contact'].includes(link.key)).map((link) => {
              const isActive =
                currentView === link.key || (link.key === 'rtti' && currentView === 'classroom');
              return (
                <div
                  key={link.key}
                  className="h-full"
                  onMouseEnter={() => link.mega && handleMouseEnter(link.mega)}
                  onMouseLeave={() => link.mega && handleMouseLeave()}
                >
                  <button
                    onClick={() => goTo(link.key)}
                    className={`group relative h-full px-3 flex items-center gap-1 font-semibold text-[12.5px] tracking-wide transition-colors ${focusRing} ${
                      isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.mega && (
                      <ChevronDown
                        size={11}
                        className={`transition-transform duration-200 ${activeMegaMenu === link.mega ? 'rotate-180 text-[#3373AB]' : ''}`}
                      />
                    )}
                    <span
                      className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] bg-[#3373AB] transition-all duration-200 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </nav>

          {/* MIDDLE — platform highlights that make users stop and explore */}
          <div className="flex items-center gap-2.5 text-[11px] text-gray-400 font-mono">
            <span className="flex items-center gap-1.5 text-[#5B9BD5] font-bold">
              <span className="text-white text-xs">⚙</span>
              <span className="text-white">250K+</span> Builders
            </span>
            <span className="text-gray-700">|</span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <Mail size={11} className="text-[#3373AB]" />
              telemetry@rtnexus.enterprise
            </span>
            <span className="text-gray-700">|</span>
            <button
              onClick={() => goTo('careers')}
              className={`hover:text-white transition-colors flex items-center gap-1.5 ${focusRing}`}
            >
              Careers
              <span className="text-[8px] bg-green-700 text-white px-1 py-0.5 font-bold leading-none">HIRING</span>
            </button>
            <span className="text-gray-700">|</span>
            <button onClick={() => goTo('about')} className={`hover:text-white transition-colors ${focusRing}`}>
              Investor Relations
            </button>
          </div>

          {/* RIGHT — secondary navigation (Ad Center, About Us, Contact) */}
          <nav className="flex items-center h-full">
            {NAV_LINKS.filter((link) => ['adcenter', 'about', 'contact'].includes(link.key)).map((link) => {
              const isActive = currentView === link.key;
              return (
                <div key={link.key} className="h-full">
                  <button
                    onClick={() => goTo(link.key)}
                    className={`group relative h-full px-3 flex items-center gap-1 font-semibold text-[12.5px] tracking-wide transition-colors ${focusRing} ${
                      isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span
                      className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] bg-[#3373AB] transition-all duration-200 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MEGA MENUS                                                    */}
      {/* ============================================================ */}
      {activeMegaMenu === 'shop' && (
        <div
          className="mega-menu-enter absolute left-0 w-full bg-white border-b border-gray-100 z-50 shadow-xl font-sans"
          onMouseEnter={() => handleMouseEnter('shop')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="h-[2px] w-full bg-gradient-to-r from-[#3373AB] via-[#5B9BD5] to-[#3373AB]" />
          <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-12 gap-8">
            <div className="col-span-3">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">
                Enterprise Hardware Categories
              </h4>
              <ul className="space-y-1">
                {[
                  'Embedded Systems',
                  'IoT Devices',
                  'Development Boards',
                  'Power Solutions & IP67 Grid',
                  'Sensors & Biometric Matrices',
                  'Robotics & Autonomous Chassis',
                  'Electronics Components & Shields',
                ].map((label) => (
                  <li key={label}>
                    <button
                      onClick={() => { goTo('shop'); triggerSearch(label.split(' & ')[0]); }}
                      className="w-full text-left block pl-2 py-1 border-l-2 border-transparent text-gray-700 hover:border-[#3373AB] hover:bg-gray-50 hover:text-[#3373AB] font-semibold text-xs transition-all"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-3">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">
                Vendor Operations
              </h4>
              <ul className="space-y-2">
                <li><button onClick={() => goTo('solutions')} className="text-gray-700 hover:text-[#3373AB] text-xs font-semibold text-left block">Become Verified Vendor</button></li>
                <li><button onClick={() => goTo('solutions')} className="text-gray-700 hover:text-[#3373AB] text-xs font-semibold text-left block">Vendor Logistics Benefits</button></li>
                <li><button onClick={() => goTo('about')} className="text-gray-700 hover:text-[#3373AB] text-xs font-semibold text-left block">Foundry Marketplace Regulations</button></li>
              </ul>
            </div>

            <div className="col-span-3">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">
                Engineering Documentation
              </h4>
              <ul className="space-y-2">
                <li><button onClick={() => goTo('rtti')} className="text-gray-700 hover:text-[#3373AB] text-xs font-semibold text-left block">Schematics & Datasheets Register</button></li>
                <li><button onClick={() => goTo('shop')} className="text-gray-700 hover:text-[#3373AB] text-xs font-semibold text-left block">Download Full Product Catalog (PDF)</button></li>
                <li><button onClick={() => goTo('rtti')} className="text-gray-700 hover:text-[#3373AB] text-xs font-semibold text-left block">Hardware Testing Standards</button></li>
              </ul>
            </div>

            <div className="col-span-3 bg-gray-50 p-4 border border-gray-100 flex flex-col justify-between transition-shadow hover:shadow-md">
              <div>
                <h5 className="text-[11px] font-mono text-[#3373AB] font-bold tracking-widest uppercase mb-1">Ecosystem Integration</h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Purchase industrial devices from certified sellers, access telemetry catalogs directly, and synchronize devices using RTTI API specs.
                </p>
              </div>
              <button onClick={() => goTo('shop')} className="mt-4 bg-gradient-to-r from-[#3373AB] to-[#255C8E] hover:from-[#3a82c2] hover:to-[#2a6699] text-white text-[11px] font-semibold py-1.5 px-3 text-center transition-all">
                Go to RT Shop
              </button>
            </div>
          </div>
        </div>
      )}

      {activeMegaMenu === 'rtti' && (
        <div
          className="mega-menu-enter absolute left-0 w-full bg-white border-b border-gray-100 z-50 shadow-xl font-sans"
          onMouseEnter={() => handleMouseEnter('rtti')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="h-[2px] w-full bg-gradient-to-r from-[#3373AB] via-[#5B9BD5] to-[#3373AB]" />
          <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-12 gap-8">
            <div className="col-span-4">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">
                RTTI Engineering Disciplines
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li><button onClick={() => { goTo('rtti'); triggerSearch('Embedded Systems'); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Embedded Engineering</button></li>
                  <li><button onClick={() => { goTo('rtti'); triggerSearch('Software Development'); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Advanced Software</button></li>
                  <li><button onClick={() => { goTo('rtti'); triggerSearch('AI'); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Edge AI / Neural Nets</button></li>
                </ul>
                <ul className="space-y-2">
                  <li><button onClick={() => { goTo('rtti'); triggerSearch('Networking'); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Telemetry Networks</button></li>
                  <li><button onClick={() => { goTo('rtti'); triggerSearch('Cybersecurity'); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Cybersecurity / SCADA</button></li>
                </ul>
              </div>
            </div>

            <div className="col-span-4">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">
                Professional Certifications
              </h4>
              <ul className="space-y-2.5">
                {[
                  'RT-Certified Microarchitect (RTC-M)',
                  'Telemetry Networking Administrator (TNA-E)',
                  'Vetted SCADA Threat Specialist (VSTS)',
                ].map((cert) => (
                  <li key={cert} className="flex gap-2 items-center">
                    <ShieldCheck size={14} className="text-[#3373AB] shrink-0" />
                    <span className="text-xs font-semibold text-gray-800">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-4 bg-gray-50 p-4 border border-gray-100 flex flex-col justify-between transition-shadow hover:shadow-md">
              <div>
                <span className="text-[10px] bg-red-600 text-white font-mono px-2 py-0.5 font-bold uppercase block w-max mb-2">
                  Exclusive Interactive Tour
                </span>
                <h5 className="text-xs font-bold text-gray-900">Simulate Live Classroom Sandboxes</h5>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Join our active remote sandbox. Explore vector whiteboards, live digital breakouts, and AI-powered notes directly in your browser.
                </p>
              </div>
              <button onClick={() => goTo('classroom')} className="mt-4 border border-[#3373AB] text-[#3373AB] hover:bg-[#3373AB] hover:text-white text-[11px] font-bold py-1.5 px-3 text-center transition-colors">
                Launch Live Classroom Sandbox
              </button>
            </div>
          </div>
        </div>
      )}

      {activeMegaMenu === 'mttv' && (
        <div
          className="mega-menu-enter absolute left-0 w-full bg-white border-b border-gray-100 z-50 shadow-xl font-sans"
          onMouseEnter={() => handleMouseEnter('mttv')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="h-[2px] w-full bg-gradient-to-r from-[#3373AB] via-[#5B9BD5] to-[#3373AB]" />
          <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-12 gap-8">
            <div className="col-span-4">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">
                Broadcasting Channels
              </h4>
              <ul className="space-y-2">
                <li><button onClick={() => { goTo('mttv'); triggerSearch('Live Events'); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Live Global Keynotes</button></li>
                <li><button onClick={() => { goTo('mttv'); triggerSearch('Webinars'); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Webinars & Tech Debates</button></li>
                <li><button onClick={() => { goTo('mttv'); triggerSearch('Podcasts'); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Scientific Core Podcasts</button></li>
                <li><button onClick={() => { goTo('mttv'); triggerSearch('Tutorials'); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Step-By-Step Developer Screencasts</button></li>
              </ul>
            </div>

            <div className="col-span-4">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">
                Live Broadcast Schedule
              </h4>
              <ul className="space-y-3 font-mono text-[11px] text-gray-600">
                <li className="flex justify-between items-center border-b border-gray-50 pb-1">
                  <span className="text-[#3373AB] font-bold">LIVE NOW</span>
                  <span className="text-gray-800">Semiconductor Alliance 2026 Keynote</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-50 pb-1">
                  <span>Today, 18:00</span>
                  <span className="text-gray-800">Edge AI Case Studies</span>
                </li>
                <li className="flex justify-between items-center pb-1">
                  <span>Tomorrow, 14:00</span>
                  <span className="text-gray-800">SCADA Micro-patch Audit</span>
                </li>
              </ul>
            </div>

            <div className="col-span-4 bg-gray-50 p-4 border border-gray-100 flex flex-col justify-between transition-shadow hover:shadow-md">
              <div>
                <h5 className="text-xs font-bold text-[#111111] uppercase tracking-wide">Enterprise Sponsorship</h5>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Target a specialized audience of 250k+ embedded builders. Run targeted streams and webinars sponsored directly by your hardware foundry.
                </p>
              </div>
              <button onClick={() => goTo('adcenter')} className="mt-4 bg-[#111111] hover:bg-gray-800 text-white text-[11px] font-semibold py-1.5 px-3 text-center transition-colors">
                Inquire Sponsorship
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MOBILE NAV DRAWER                                             */}
      {/* ============================================================ */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-[100] transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
        } ${theme === 'dark' ? 'bg-[#1a1a1a] border-t border-gray-800' : 'bg-white border-t border-gray-200'}`}
        style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.15)' }}
      >
        <div className="px-6 py-4 flex flex-col max-h-[70vh] overflow-y-auto">
          {NAV_LINKS.map((link) => {
            const isActive = currentView === link.key || (link.key === 'rtti' && currentView === 'classroom');
            return (
              <button
                key={link.key}
                onClick={() => goTo(link.key)}
                className={`w-full text-left px-3 py-3 text-sm font-semibold border-b transition-colors flex items-center justify-between ${focusRing} ${
                  isActive
                    ? 'text-[#3373AB] border-[#3373AB]/20'
                    : theme === 'dark' ? 'text-gray-300 border-gray-800' : 'text-gray-700 border-gray-100'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="h-1.5 w-1.5 bg-[#3373AB]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE BOTTOM NAV                                             */}
      {/* ============================================================ */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t shadow-[0_-2px_10px_rgba(0,0,0,0.08)] ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-around h-16 px-1">
          <button onClick={() => goTo('home')} className={`flex flex-col items-center gap-0.5 px-2 py-1 ${focusRing} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <Home size={20} />
            <span className="text-[8px] font-medium">Home</span>
          </button>

          <button onClick={() => goTo('shop')} className={`flex flex-col items-center gap-0.5 px-2 py-1 ${focusRing} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <ShoppingCart size={18} />
            <span className="text-[8px] font-medium">Shop</span>
          </button>

          <button
            onClick={() => goTo('search')}
            className={`bg-[#3373AB] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg -mt-6 border-4 ${focusRing} hover:bg-[#255C8E] transition-colors ${theme === 'dark' ? 'border-[#1a1a1a]' : 'border-white'}`}
          >
            <Search size={24} />
          </button>

          <button onClick={() => { setShowChatbotMsg(true); setMobileMenuOpen(false); }} className={`flex flex-col items-center gap-0.5 px-2 py-1 ${focusRing} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <Bot size={20} />
            <span className="text-[8px] font-medium">AI Chat</span>
          </button>

          {user ? (
            <button onClick={() => goTo('portals')} className={`flex flex-col items-center gap-0.5 px-2 py-1 ${focusRing}`}>
              <div className="h-7 w-7 bg-[#3373AB] flex items-center justify-center text-white text-[9px] font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className={`text-[8px] font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Profile</span>
            </button>
          ) : (
            <button onClick={() => { openAuth('login'); setMobileMenuOpen(false); }} className={`flex flex-col items-center gap-0.5 px-2 py-1 ${focusRing} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <User size={20} />
              <span className="text-[8px] font-medium">Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Chatbot placeholder modal */}
      {showChatbotMsg && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowChatbotMsg(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white border border-gray-200 shadow-xl p-6 max-w-xs w-full text-center">
            <Bot size={32} className="mx-auto text-[#3373AB] mb-2" />
            <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">AI Assistant</p>
            <p className="text-[11px] text-gray-500 mt-1">AI Chatbot is currently under development.</p>
            <button onClick={() => setShowChatbotMsg(false)} className="mt-4 bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-semibold px-5 py-1.5 transition-colors">
              OK
            </button>
          </div>
        </div>
      )}
    </header>
  );
}