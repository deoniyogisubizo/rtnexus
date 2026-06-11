import React, { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, Bell, ChevronDown, Mail, ShieldCheck, Heart, User, LogOut, CheckCircle, Package, ArrowRight, Menu, Home, Bot } from 'lucide-react';
import { UserSession, CartItem } from '../types';

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
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showControlPanelDropdown, setShowControlPanelDropdown] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
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
        setShowTopBar(false);
      } else if (currentScrollY < lastScrollY.current) {
        setShowTopBar(true);
      }
      setScrolled(currentScrollY > 0);
      lastScrollY.current = currentScrollY;
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchFocused(false);
      }
      if (!target.closest('.control-panel-dropdown') && !target.closest('.user-dropdown')) {
        setShowControlPanelDropdown(false);
        setShowUserDropdown(false);
        setShowThemeDropdown(false);
      }
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
    megaMenuTimeout.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(searchVal);
  };

  const systemNotifications = [
    { id: 1, title: "Hardware Dispatch", text: "IoT Gateway order has been packed and dispatched.", time: "10m ago" },
    { id: 2, title: "New Certification Track", text: "RTTI Cyber-Physical SCADA Course is officially live.", time: "1h ago" },
    { id: 3, title: "Campaign Assessment", text: "MTTV Campaign assessment is ready for review.", time: "3h ago" }
  ];

  return (
    <header className={`w-full fixed top-0 z-50 select-none font-sans text-sm outline-none transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'shadow-none'} ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
      {/* 1. TOP UTILITY NAVIGATION (Height: 40px) — hides on scroll down, shows on scroll up */}
      <div className={`w-full border-b text-xs flex items-center px-6 justify-between transition-all duration-200 ${showTopBar ? 'h-10' : 'h-0 border-b-0 overflow-hidden'} ${theme === 'dark' ? 'border-gray-800 bg-[#111111] text-gray-300' : 'border-gray-200 bg-[#111111] text-gray-300'}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden items-center justify-center hover:text-white transition-colors outline-none"
            aria-label="Toggle menu"
          >
            <Menu size={16} />
          </button>
          <span onClick={() => setView('home')} className="hover:text-white transition-colors cursor-pointer text-[11px] font-mono">Home</span>
          <div className="hidden md:flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Mail size={12} className="text-[#3373AB]" />
              <span className="font-mono text-[11px]">telemetry@rtnexus.enterprise</span>
            </span>
            <span onClick={() => setView('about')} className="hover:text-white transition-colors cursor-pointer block">Investor Relations</span>
            <span onClick={() => setView('careers')} className="hover:text-white transition-colors cursor-pointer block">Careers</span>
            <span onClick={() => setView('contact')} className="hover:text-white transition-colors cursor-pointer block">Support & Help Center</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Theme Toggle Dropdown */}
          <div className="relative">
            <div
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
              className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors"
            >
              {theme === 'dark' ? <Moon size={12} className="text-[#3373AB]" /> : <Sun size={12} className="text-[#3373AB]" />}
              <span className="text-[11px] font-mono">{theme === 'dark' ? 'DARK' : 'LIGHT'}</span>
              <ChevronDown size={10} />
            </div>
            {showThemeDropdown && (
              <div className="absolute right-0 mt-2 w-28 bg-white text-gray-800 border border-gray-200 z-[60] shadow-xl">
                <button
                  onClick={() => { setTheme('light'); setShowThemeDropdown(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-gray-50 ${theme === 'light' ? 'text-[#3373AB] bg-gray-50' : 'text-gray-700'}`}
                >
                  <Sun size={12} />
                  Light
                </button>
                <button
                  onClick={() => { setTheme('dark'); setShowThemeDropdown(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-gray-50 ${theme === 'dark' ? 'text-[#3373AB] bg-gray-50' : 'text-gray-700'}`}
                >
                  <Moon size={12} />
                  Dark
                </button>
              </div>
            )}
          </div>

          {/* Simple Auth Triggers */}
          {!user ? (
            <div className="flex items-center gap-4">
              <button onClick={() => openAuth('login')} className="hover:text-white transition-colors outline-none">Sign In</button>
              <button onClick={() => openAuth('register')} className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-3 py-1 font-semibold transition-colors outline-none rounded-none">Register Portal</button>
            </div>
          ) : (
            <div className="relative user-dropdown">
              <button 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1.5 hover:text-white transition-colors font-mono font-medium text-xs text-[#3373AB] outline-none"
              >
                <User size={12} />
                <span>{user.name} ({user.role.toUpperCase()})</span>
                <ChevronDown size={10} />
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 border border-gray-200 z-[60] shadow-xl">
                  <div className="p-3 bg-gray-50 border-b border-gray-100">
                    <p className="font-semibold text-xs text-gray-900 overflow-hidden text-ellipsis">{user.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setView('portals'); setShowUserDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-xs font-semibold flex items-center gap-2.5 border-b border-gray-100"
                  >
                    <User size={14} className="text-[#3373AB]" />
                    <span>Access Dashboard</span>
                  </button>
                  <button
                    onClick={() => { setView('portals'); setShowUserDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-xs font-semibold flex items-center gap-2.5 border-b border-gray-100"
                  >
                    <i className="fa-solid fa-cart-arrow-down text-[#3373AB]" style={{fontSize:'11px'}}></i>
                    <span>Track Orders</span>
                  </button>
                  <button
                    onClick={() => { setView('portals'); setShowUserDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-xs font-semibold flex items-center gap-2.5 border-b border-gray-100"
                  >
                    <Heart size={14} className="text-[#3373AB]" />
                    <span>Purchased Items</span>
                  </button>
                  <button
                    onClick={() => { setView('portals'); setShowUserDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-xs font-semibold flex items-center gap-2.5 border-b border-gray-100"
                  >
                    <CheckCircle size={14} className="text-[#3373AB]" />
                    <span>Billing & Payments</span>
                  </button>
                  <button
                    onClick={() => { logout(); setShowUserDropdown(false); setView('home'); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-xs font-semibold text-red-600 flex items-center gap-2.5"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Core Notifications System */}
          <div className="relative">
            <div 
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors relative py-1"
            >
              <Bell size={13} className="text-gray-300 hover:text-white" />
              <span className="absolute -top-1 -right-1 text-[9px] bg-[#3373AB] text-white w-3 h-3 flex items-center justify-center font-mono font-bold">3</span>
            </div>
            
            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 border border-gray-200 shadow-2xl z-[60] rounded-none overflow-hidden animate-fade-in">
                <div className="bg-[#111111] text-white py-2 px-4 flex justify-between items-center border-b border-gray-700">
                  <span className="font-mono text-xs tracking-wider uppercase">System Operations Log</span>
                  <span className="text-[10px] text-gray-400">3 Alerts</span>
                </div>
                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                  {systemNotifications.map(item => (
                    <div key={item.id} className="p-3 hover:bg-gray-50 flex items-start gap-2.5">
                      <div className="h-1.5 w-1.5 bg-[#3373AB] mt-1.5"></div>
                      <div>
                        <p className="font-medium text-xs text-gray-900">{item.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.text}</p>
                        <span className="text-[10px] text-gray-400 font-mono mt-1 block">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-2 text-center border-t border-gray-100">
                  <button onClick={() => { setView('portals'); setShowNotificationDropdown(false); }} className="text-xs text-[#3373AB] font-semibold hover:underline">Launch Diagnostic Portal</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE NAV DRAWER — slides up from bottom */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-[100] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-y-0' : 'translate-y-full'} ${theme === 'dark' ? 'bg-[#1a1a1a] border-t border-gray-800' : 'bg-white border-t border-gray-200'}`}
        style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.15)' }}
      >
        <div className="px-6 py-4 flex flex-col max-h-[70vh] overflow-y-auto">
          <button onClick={() => { setView('home'); setMobileMenuOpen(false); }} className={`w-full text-left px-3 py-3 text-sm font-semibold border-b transition-colors outline-none flex items-center justify-between ${currentView === 'home' ? 'text-[#3373AB] border-[#3373AB]/20' : `${theme === 'dark' ? 'text-gray-300 border-gray-800' : 'text-gray-700 border-gray-100'}`}`}>
            <span>Home</span>
            {currentView === 'home' && <span className="h-1.5 w-1.5 bg-[#3373AB]"></span>}
          </button>
          <button onClick={() => { setView('shop'); setMobileMenuOpen(false); }} className={`w-full text-left px-3 py-3 text-sm font-semibold border-b transition-colors outline-none flex items-center justify-between ${currentView === 'shop' ? 'text-[#3373AB] border-[#3373AB]/20' : `${theme === 'dark' ? 'text-gray-300 border-gray-800' : 'text-gray-700 border-gray-100'}`}`}>
            <span>RT Shop</span>
            {currentView === 'shop' && <span className="h-1.5 w-1.5 bg-[#3373AB]"></span>}
          </button>
          <button onClick={() => { setView('rtti'); setMobileMenuOpen(false); }} className={`w-full text-left px-3 py-3 text-sm font-semibold border-b transition-colors outline-none flex items-center justify-between ${currentView === 'rtti' || currentView === 'classroom' ? 'text-[#3373AB] border-[#3373AB]/20' : `${theme === 'dark' ? 'text-gray-300 border-gray-800' : 'text-gray-700 border-gray-100'}`}`}>
            <span>RTTI</span>
            {currentView === 'rtti' || currentView === 'classroom' ? <span className="h-1.5 w-1.5 bg-[#3373AB]"></span> : null}
          </button>
          <button onClick={() => { setView('mttv'); setMobileMenuOpen(false); }} className={`w-full text-left px-3 py-3 text-sm font-semibold border-b transition-colors outline-none flex items-center justify-between ${currentView === 'mttv' ? 'text-[#3373AB] border-[#3373AB]/20' : `${theme === 'dark' ? 'text-gray-300 border-gray-800' : 'text-gray-700 border-gray-100'}`}`}>
            <span>MTTV</span>
            {currentView === 'mttv' && <span className="h-1.5 w-1.5 bg-[#3373AB]"></span>}
          </button>
          <button onClick={() => { setView('solutions'); setMobileMenuOpen(false); }} className={`w-full text-left px-3 py-3 text-sm font-semibold border-b transition-colors outline-none flex items-center justify-between ${currentView === 'solutions' ? 'text-[#3373AB] border-[#3373AB]/20' : `${theme === 'dark' ? 'text-gray-300 border-gray-800' : 'text-gray-700 border-gray-100'}`}`}>
            <span>Solutions</span>
            {currentView === 'solutions' && <span className="h-1.5 w-1.5 bg-[#3373AB]"></span>}
          </button>
          <button onClick={() => { setView('adcenter'); setMobileMenuOpen(false); }} className={`w-full text-left px-3 py-3 text-sm font-semibold border-b transition-colors outline-none flex items-center justify-between ${currentView === 'adcenter' ? 'text-[#3373AB] border-[#3373AB]/20' : `${theme === 'dark' ? 'text-gray-300 border-gray-800' : 'text-gray-700 border-gray-100'}`}`}>
            <span>Ad Center</span>
            {currentView === 'adcenter' && <span className="h-1.5 w-1.5 bg-[#3373AB]"></span>}
          </button>
          <button onClick={() => { setView('about'); setMobileMenuOpen(false); }} className={`w-full text-left px-3 py-3 text-sm font-semibold border-b transition-colors outline-none flex items-center justify-between ${currentView === 'about' ? 'text-[#3373AB] border-[#3373AB]/20' : `${theme === 'dark' ? 'text-gray-300 border-gray-800' : 'text-gray-700 border-gray-100'}`}`}>
            <span>About Us</span>
            {currentView === 'about' && <span className="h-1.5 w-1.5 bg-[#3373AB]"></span>}
          </button>
          <button onClick={() => { setView('contact'); setMobileMenuOpen(false); }} className={`w-full text-left px-3 py-3 text-sm font-semibold transition-colors outline-none flex items-center justify-between ${currentView === 'contact' ? 'text-[#3373AB]' : `${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}`}>
            <span>Contact</span>
            {currentView === 'contact' && <span className="h-1.5 w-1.5 bg-[#3373AB]"></span>}
          </button>
        </div>
      </div>

      {/* 2. MAIN CORPORATE NAVIGATION (Sticky bar) */}
      <div className={`w-full border-b shadow-sm flex items-center justify-between h-18 px-6 ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-200'}`}>
        {/* Logo and Brand */}
        <div 
          onClick={() => setView('home')} 
          className="flex items-center cursor-pointer outline-none select-none"
        >
          <img src="/logo/logo.png" alt="RT Nexus" className="h-10 scale-300 ml-10 w-auto object-contain" />
        </div>

        {/* Corporate Menu Links (with Hover Mega menus) */}
        <nav className="hidden lg:flex items-center h-full">
          <button 
            onClick={() => setView('home')} 
            className={`h-full px-3.5 flex items-center font-semibold text-[13px] border-b-2 hover:text-[#3373AB] transition-colors outline-none ${currentView === 'home' ? 'border-[#3373AB] text-[#3373AB]' : `border-transparent ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}`}
          >
            Home
          </button>

          {/* RT Shop with Mega Menu dropdown */}
          <div 
            className="h-full"
            onMouseEnter={() => handleMouseEnter('shop')}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              onClick={() => setView('shop')}
              className={`h-full px-3.5 flex items-center gap-1 font-semibold text-[13px] border-b-2 hover:text-[#3373AB] transition-colors outline-none ${currentView === 'shop' ? 'border-[#3373AB] text-[#3373AB]' : `border-transparent ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}`}
            >
              <span>RT Shop</span>
              <ChevronDown size={11} className={`transition-transform duration-200 ${activeMegaMenu === 'shop' ? 'rotate-180 text-[#3373AB]' : ''}`} />
            </button>
          </div>

          {/* RTTI with Mega Menu dropdown */}
          <div 
            className="h-full"
            onMouseEnter={() => handleMouseEnter('rtti')}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              onClick={() => setView('rtti')}
              className={`h-full px-3.5 flex items-center gap-1 font-semibold text-[13px] border-b-2 hover:text-[#3373AB] transition-colors outline-none ${currentView === 'rtti' || currentView === 'classroom' ? 'border-[#3373AB] text-[#3373AB]' : `border-transparent ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}`}
            >
              <span>RTTI</span>
              <ChevronDown size={11} className={`transition-transform duration-200 ${activeMegaMenu === 'rtti' ? 'rotate-180 text-[#3373AB]' : ''}`} />
            </button>
          </div>

          {/* MTTV with Mega Menu dropdown */}
          <div 
            className="h-full"
            onMouseEnter={() => handleMouseEnter('mttv')}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              onClick={() => setView('mttv')}
              className={`h-full px-3.5 flex items-center gap-1 font-semibold text-[13px] border-b-2 hover:text-[#3373AB] transition-colors outline-none ${currentView === 'mttv' ? 'border-[#3373AB] text-[#3373AB]' : `border-transparent ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}`}
            >
              <span>MTTV</span>
              <ChevronDown size={11} className={`transition-transform duration-200 ${activeMegaMenu === 'mttv' ? 'rotate-180 text-[#3373AB]' : ''}`} />
            </button>
          </div>

          {/* Solutions Page Switcher */}
          <button 
            onClick={() => setView('solutions')}
            className={`h-full px-3.5 flex items-center font-semibold text-[13px] border-b-2 hover:text-[#3373AB] transition-colors outline-none ${currentView === 'solutions' ? 'border-[#3373AB] text-[#3373AB]' : `border-transparent ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}`}
          >
            Solutions
          </button>

          {/* Advertising Center */}
          <button 
            onClick={() => setView('adcenter')}
            className={`h-full px-3.5 flex items-center font-semibold text-[13px] border-b-2 hover:text-[#3373AB] transition-colors outline-none ${currentView === 'adcenter' ? 'border-[#3373AB] text-[#3373AB]' : `border-transparent ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}`}
          >
            Ad Center
          </button>

          {/* About us / Careers / Contact links in navbar */}
          <button 
            onClick={() => setView('about')}
            className={`h-full px-3.5 flex items-center font-semibold text-[13px] border-b-2 hover:text-[#3373AB] transition-colors outline-none ${currentView === 'about' ? 'border-[#3373AB] text-[#3373AB]' : `border-transparent ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}`}
          >
            About Us
          </button>
          
          <button 
            onClick={() => setView('contact')}
            className={`h-full px-3.5 flex items-center font-semibold text-[13px] border-b-2 hover:text-[#3373AB] transition-colors outline-none ${currentView === 'contact' ? 'border-[#3373AB] text-[#3373AB]' : `border-transparent ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}`}
          >
            Contact
          </button>
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {/* Search bar with dropdown */}
          <div ref={searchRef} className="relative hidden lg:block">
            <div className={`flex items-center px-3 py-1.5 border rounded-none w-52 focus-within:w-64 focus-within:border-[#3373AB] transition-all ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
              <input 
                type="text" 
                placeholder="Search ecosystem..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={(e) => { if (e.key === 'Enter') { triggerSearch(searchVal); setSearchFocused(false); } }}
                className={`bg-transparent text-xs outline-none w-full font-sans ${theme === 'dark' ? 'text-gray-200 placeholder-gray-500' : 'text-gray-900'}`}
              />
              <Search size={14} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>

            {searchFocused && searchVal.trim() && (() => {
              const { results, suggestion } = searchAll(searchVal);
              const cats = results.filter(r => r.type === 'category');
              const prods = results.filter(r => r.type === 'product');
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
                <div className={`absolute top-full left-0 right-0 mt-1 border shadow-lg z-[70] max-h-72 overflow-y-auto ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-900'}`}>
                  {noResults ? (
                    <div className="p-3 space-y-2">
                      <p className="text-xs text-gray-500">No results for "<span className="font-semibold">{searchVal}</span>"</p>
                      {suggestion && (
                        <button
                          onClick={() => setSearchVal(suggestion)}
                          className="text-xs text-[#3373AB] hover:underline block"
                        >
                          Are you looking for "<span className="font-semibold">{suggestion}</span>"?
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
                          <div className={`text-[9px] font-mono uppercase tracking-widest px-3 pt-2 pb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Categories</div>
                          {cats.map(r => (
                            <button
                              key={r.label}
                              onClick={() => handleNav(r.label)}
                              className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
                            >
                              <span>{r.label}</span>
                              <ArrowRight size={11} className="text-gray-400" />
                            </button>
                          ))}
                        </div>
                      )}
                      {prods.length > 0 && (
                        <div>
                          <div className={`text-[9px] font-mono uppercase tracking-widest px-3 pt-2 pb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Products</div>
                          {prods.slice(0, 5).map(r => (
                            <button
                              key={r.product.id}
                              onClick={() => handleProductNav(r.product.id)}
                              className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-3 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
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
                              className={`w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} transition-colors italic`}
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

          {/* Dynamic active cart icon for RT shop */}
          <button
            onClick={openCartDrawer}
            className={`p-2 relative hover:text-[#3373AB] transition-colors rounded-none outline-none ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
            title="Open RT Cart"
          >
            <i className="fa-solid fa-cart-arrow-down" style={{fontSize:'13px'}}></i>
            {totalCartCount > 0 && (
              <span className="absolute -top-[1px] -right-[1px] h-4 w-4 bg-[#3373AB] text-white text-[9px] font-mono font-bold flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative control-panel-dropdown">
              {/* Desktop: Control Panel button */}
              <button 
                onClick={() => setShowControlPanelDropdown(!showControlPanelDropdown)}
                className="hidden lg:flex bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 transition-all outline-none rounded-none items-center gap-1.5"
              >
                <span>Control Panel</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${showControlPanelDropdown ? 'rotate-180' : ''}`} />
              </button>
              {/* Mobile: User avatar with chevron */}
              <button 
                onClick={() => setShowControlPanelDropdown(!showControlPanelDropdown)}
                className="lg:hidden flex items-center gap-1.5 outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-[#3373AB] text-white flex items-center justify-center text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={12} className={`text-gray-600 transition-transform duration-200 ${showControlPanelDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showControlPanelDropdown && (
                <div className="absolute right-0 mt-1 w-52 bg-white text-gray-800 border border-gray-200 z-50 shadow-xl">
                  <button
                    onClick={() => { setView('portals'); setShowControlPanelDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-xs font-semibold flex items-center gap-2.5 border-b border-gray-100"
                  >
                    <User size={14} className="text-[#3373AB]" />
                    <span>Access Dashboard</span>
                  </button>
                  <button
                    onClick={() => { setView('portals'); setShowControlPanelDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-xs font-semibold flex items-center gap-2.5 border-b border-gray-100"
                  >
                    <i className="fa-solid fa-cart-arrow-down text-[#3373AB]" style={{fontSize:'11px'}}></i>
                    <span>Track Orders</span>
                  </button>
                  <button
                    onClick={() => { setView('portals'); setShowControlPanelDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-xs font-semibold flex items-center gap-2.5 border-b border-gray-100"
                  >
                    <Heart size={14} className="text-[#3373AB]" />
                    <span>Purchased Items</span>
                  </button>
                  <button
                    onClick={() => { setView('portals'); setShowControlPanelDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-xs font-semibold flex items-center gap-2.5 border-b border-gray-100"
                  >
                    <CheckCircle size={14} className="text-[#3373AB]" />
                    <span>Billing & Payments</span>
                  </button>
                  <button
                    onClick={() => { logout(); setShowControlPanelDropdown(false); setView('home'); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-xs font-semibold text-red-600 flex items-center gap-2.5"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => openAuth('login')}
              className="bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 transition-all outline-none rounded-none"
            >
              Get Started
            </button>
          )}
        </div>
      </div>

      {/* 3. MEGA MENUS SYSTEM REVEAL */}
      {activeMegaMenu === 'shop' && (
        <div 
          className="absolute left-0 w-full bg-white border-b border-gray-200 z-50 border-t border-gray-100 shadow-xl transition-all font-sans"
          onMouseEnter={() => handleMouseEnter('shop')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-12 gap-8">
            <div className="col-span-3">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">Enterprise Hardware Categories</h4>
              <ul className="space-y-2">
                <li><button onClick={() => { setView('shop'); triggerSearch('Embedded Systems'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Embedded Systems</button></li>
                <li><button onClick={() => { setView('shop'); triggerSearch('IoT Devices'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">IoT Devices</button></li>
                <li><button onClick={() => { setView('shop'); triggerSearch('Development Boards'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Development Boards</button></li>
                <li><button onClick={() => { setView('shop'); triggerSearch('Power Solutions'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Power Solutions & IP67 Grid</button></li>
                <li><button onClick={() => { setView('shop'); triggerSearch('Sensors'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Sensors & Biometric matrices</button></li>
                <li><button onClick={() => { setView('shop'); triggerSearch('Robotics'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Robotics & Autonomous chassis</button></li>
                <li><button onClick={() => { setView('shop'); triggerSearch('Electronics Components'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Electronics Components & Shields</button></li>
              </ul>
            </div>
            
            <div className="col-span-3">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">Vendor Operations</h4>
              <ul className="space-y-2">
                <li><button onClick={() => { setView('solutions'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] text-xs font-semibold text-left block">Become Verified Vendor</button></li>
                <li><button onClick={() => { setView('solutions'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] text-xs font-semibold text-left block">Vendor Logistics Benefits</button></li>
                <li><button onClick={() => { setView('about'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] text-xs font-semibold text-left block">Foundry Marketplace Regulations</button></li>
              </ul>
            </div>

            <div className="col-span-3">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">Engineering Documentation</h4>
              <ul className="space-y-2">
                <li><a href="#docs" onClick={(e) => { e.preventDefault(); setView('rtti'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] text-xs font-semibold block">Schematics & Datasheets Register</a></li>
                <li><a href="#catalogs" onClick={(e) => { e.preventDefault(); setView('shop'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] text-xs font-semibold block">Download Full Product Catalog (PDF)</a></li>
                <li><a href="#certification" onClick={(e) => { e.preventDefault(); setView('rtti'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] text-xs font-semibold block">Hardware Testing Standards</a></li>
              </ul>
            </div>

            <div className="col-span-3 bg-gray-50 p-4 border border-gray-100 flex flex-col justify-between">
              <div>
                <h5 className="text-[11px] font-mono text-[#3373AB] font-bold tracking-widest uppercase mb-1">Ecosystem Integration</h5>
                <p className="text-xs text-gray-600 leading-relaxed font-sans">
                  Purchase industrial devices from certified sellers, access telemetry catalogs directly, and synchronize devices using RTTI API specs.
                </p>
              </div>
              <button 
                onClick={() => { setView('shop'); setActiveMegaMenu(null); }}
                className="mt-4 bg-[#3373AB] hover:bg-[#255C8E] text-white text-[11px] font-semibold py-1.5 px-3 text-center transition-colors rounded-none outline-none"
              >
                Go to RT Shop
              </button>
            </div>
          </div>
        </div>
      )}

      {activeMegaMenu === 'rtti' && (
        <div 
          className="absolute left-0 w-full bg-white border-b border-gray-200 z-50 border-t border-gray-100 shadow-xl transition-all font-sans"
          onMouseEnter={() => handleMouseEnter('rtti')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-12 gap-8">
            <div className="col-span-4">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">RTTI Engineering Disciplines</h4>
              <div className="grid grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li><button onClick={() => { setView('rtti'); triggerSearch('Embedded Systems'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Embedded Engineering</button></li>
                  <li><button onClick={() => { setView('rtti'); triggerSearch('Software Development'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Advanced Software</button></li>
                  <li><button onClick={() => { setView('rtti'); triggerSearch('AI'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Edge AI / Neural Nets</button></li>
                </ul>
                <ul className="space-y-2">
                  <li><button onClick={() => { setView('rtti'); triggerSearch('Networking'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Telemetry Networks</button></li>
                  <li><button onClick={() => { setView('rtti'); triggerSearch('Cybersecurity'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Cybersecurity / SCADA</button></li>
                </ul>
              </div>
            </div>

            <div className="col-span-4">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">Professional Certifications</h4>
              <ul className="space-y-2.5">
                <li className="flex gap-2 items-center">
                  <ShieldCheck size={14} className="text-[#3373AB]" />
                  <span className="text-xs font-semibold text-gray-800">RT-Certified Microarchitect (RTC-M)</span>
                </li>
                <li className="flex gap-2 items-center">
                  <ShieldCheck size={14} className="text-[#3373AB]" />
                  <span className="text-xs font-semibold text-gray-800">Telemetry Networking Administrator (TNA-E)</span>
                </li>
                <li className="flex gap-2 items-center">
                  <ShieldCheck size={14} className="text-[#3373AB]" />
                  <span className="text-xs font-semibold text-gray-800">Vetted SCADA Threat Specialist (VSTS)</span>
                </li>
              </ul>
            </div>

            <div className="col-span-4 bg-gray-50 p-4 border border-gray-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] bg-red-600 text-white font-mono px-2 py-0.5 font-bold uppercase block w-max mb-2">Exclusive Interactive Tour</span>
                <h5 className="text-xs font-bold text-gray-900 font-sans">Simulate Live Classroom Sandboxes</h5>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Join our active remote sandbox. Explore vector whiteboards, live digital breakouts, and AI-powered notes directly in your browser.
                </p>
              </div>
              <button 
                onClick={() => { setView('classroom'); setActiveMegaMenu(null); }}
                className="mt-4 border border-[#3373AB] text-[#3373AB] hover:bg-[#3373AB] hover:text-white text-[11px] font-bold py-1.5 px-3 text-center transition-colors rounded-none outline-none"
              >
                Launch Live Classroom Sandbox
              </button>
            </div>
          </div>
        </div>
      )}

      {activeMegaMenu === 'mttv' && (
        <div 
          className="absolute left-0 w-full bg-white border-b border-gray-200 z-50 border-t border-gray-100 shadow-xl transition-all font-sans"
          onMouseEnter={() => handleMouseEnter('mttv')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-12 gap-8">
            <div className="col-span-4">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">Broadcasting Channels</h4>
              <ul className="space-y-2">
                <li><button onClick={() => { setView('mttv'); triggerSearch('Live Events'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Live Global Keynotes</button></li>
                <li><button onClick={() => { setView('mttv'); triggerSearch('Webinars'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Webinars & Tech Debates</button></li>
                <li><button onClick={() => { setView('mttv'); triggerSearch('Podcasts'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Scientific Core Podcasts</button></li>
                <li><button onClick={() => { setView('mttv'); triggerSearch('Tutorials'); setActiveMegaMenu(null); }} className="text-gray-700 hover:text-[#3373AB] font-semibold text-xs text-left block">Step-By-Step Developer Screencasts</button></li>
              </ul>
            </div>

            <div className="col-span-4">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">Live Broadcast Schedule</h4>
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

            <div className="col-span-4 bg-gray-50 p-4 border border-gray-100 flex flex-col justify-between">
              <div>
                <h5 className="text-xs font-bold text-[#111111] uppercase tracking-wide">Enterprise Sponsorship</h5>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed font-sans">
                  Target a specialized audience of 250k+ embedded builders. Run targeted streams and webinars sponsored directly by your hardware foundry.
                </p>
              </div>
              <button 
                onClick={() => { setView('adcenter'); setActiveMegaMenu(null); }}
                className="mt-4 bg-[#111111] hover:bg-gray-800 text-white text-[11px] font-semibold py-1.5 px-3 text-center transition-colors rounded-none outline-none"
              >
                Inquire Sponsorship
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around h-16 px-1">
          {/* Home */}
          <button onClick={() => { setView('home'); setMobileMenuOpen(false); }} className="flex flex-col items-center gap-0.5 px-2 py-1 text-gray-500">
            <Home size={20} />
            <span className="text-[8px] font-medium">Home</span>
          </button>

          {/* RT Shop */}
          <button onClick={() => { setView('shop'); setMobileMenuOpen(false); }} className="flex flex-col items-center gap-0.5 px-2 py-1 text-gray-500">
            <i className="fa-solid fa-cart-arrow-down" style={{fontSize:'18px'}}></i>
            <span className="text-[8px] font-medium">Shop</span>
          </button>

          {/* Center Search */}
          <button onClick={() => { setView('search'); setMobileMenuOpen(false); }} className="bg-[#3373AB] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg -mt-6 border-4 border-white hover:bg-[#255C8E] transition-colors">
            <Search size={24} />
          </button>

          {/* Chatbot AI */}
          <button onClick={() => { setShowChatbotMsg(true); setMobileMenuOpen(false); }} className="flex flex-col items-center gap-0.5 px-2 py-1 text-gray-500">
            <Bot size={20} />
            <span className="text-[8px] font-medium">AI Chat</span>
          </button>

          {/* Profile */}
          {user ? (
            <button onClick={() => { setView('portals'); setMobileMenuOpen(false); }} className="flex flex-col items-center gap-0.5 px-2 py-1">
              <div className="h-7 w-7 bg-gradient-to-br from-[#3373AB] to-[#1d4f7a] flex items-center justify-center text-white text-[9px] font-bold rounded-full">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-[8px] font-medium text-gray-500">Profile</span>
            </button>
          ) : (
            <button onClick={() => { openAuth('login'); setMobileMenuOpen(false); }} className="flex flex-col items-center gap-0.5 px-2 py-1 text-gray-500">
              <User size={20} />
              <span className="text-[8px] font-medium">Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Chatbot AI Message */}
      {showChatbotMsg && (
        <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowChatbotMsg(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white border border-gray-200 shadow-xl p-6 max-w-xs w-full text-center rounded-lg">
            <Bot size={32} className="mx-auto text-[#3373AB] mb-2" />
            <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">AI Assistant</p>
            <p className="text-[11px] text-gray-500 mt-1">AI Chatbot is currently under development.</p>
            <button onClick={() => setShowChatbotMsg(false)} className="mt-4 bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-semibold px-5 py-1.5 outline-none rounded transition-colors">OK</button>
          </div>
        </div>
      )}
    </header>
  );
}
