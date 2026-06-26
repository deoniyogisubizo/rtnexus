import { useState, useEffect, useRef, type ReactNode, type FormEvent } from 'react';
import { Product, Course, Broadcast, RttiData } from '../types';
import MetricCard from './MetricCard';
import StatusBadge from './StatusBadge';
import {
  fetchKpiOverview, fetchProducts, createProduct, updateProduct, deleteProduct,
  fetchCategories, createCategory, updateCategory, deleteCategory,
  fetchOrders, updateOrderStatus,
  fetchCertificates, createCertificate, deleteCertificate,
  fetchAds, updateAdStatus,
  fetchCourses, createCourse, updateCourse, deleteCourse,
  fetchVideos, createVideo, updateVideo, deleteVideo,
  fetchRttiData,
  type KpiOverview,
} from '../services/api';

const statusBadge = (status: string, colors: Record<string, string>) => {
  const color = colors[status] || 'bg-gray-100 text-gray-600';
  return <span className={`text-xs font-semibold px-1.5 py-[1px] ${color}`}>{status}</span>;
};

import {
  LayoutDashboard, Package, BookOpen, Award, Megaphone, Monitor,
  Plus, Edit3, Trash2, X, Check, Search, ChevronDown, ChevronRight,
  Clock, Settings, Users, Menu,
  DollarSign, BarChart3, Download, AlertTriangle, Tag,
  Home, HelpCircle, Globe, CreditCard, ArrowLeft,
  Bell, Grid, TrendingUp, TrendingDown, Minus,
  ShoppingCart, Star, Zap, RefreshCw, Loader2, FileText, Printer
} from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  tracking: string;
  eta: string;
}

interface Certificate {
  id: string;
  title: string;
  recipient: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'revoked';
}

interface Category {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  slug: string;
}

interface AdRequest {
  id: string;
  company: string;
  campaign: string;
  placement: string;
  budget: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  date: string;
}

type AdminSection = 'overview' | 'products' | 'orders' | 'categories' | 'courses' | 'certificates' | 'ads' | 'tv' | 'commerce-report' | 'education-report' | 'media-report' | 'reports' | 'users' | 'settings' | 'support' | 'analytics' | 'billing' | 'notifications' | 'admin-settings';

interface SidebarGroup {
  label: string;
  groupIcon: ReactNode;
  showGroupIcon: boolean;
  items: { id: AdminSection; icon: ReactNode; label: string }[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    label: 'Main',
    groupIcon: <LayoutDashboard size={16} />,
    showGroupIcon: true,
    items: [
      { id: 'overview', icon: <BarChart3 size={16} />, label: 'Dashboard Overview' },
    ],
  },
  {
    label: 'Commerce',
    groupIcon: <ShoppingCart size={16} />,
    showGroupIcon: true,
    items: [
      { id: 'products', icon: <Package size={16} />, label: 'Manage Products' },
      { id: 'categories', icon: <Tag size={16} />, label: 'Manage Categories' },
      { id: 'orders', icon: <ShoppingCart size={16} />, label: 'Manage Orders' },
      { id: 'billing', icon: <CreditCard size={16} />, label: 'Billing & Payments' },
      { id: 'commerce-report', icon: <BarChart3 size={16} />, label: 'Commerce Report' },
    ],
  },
  {
    label: 'Education',
    groupIcon: <BookOpen size={16} />,
    showGroupIcon: true,
    items: [
      { id: 'courses', icon: <BookOpen size={16} />, label: 'Manage Courses' },
      { id: 'certificates', icon: <Award size={16} />, label: 'Certificates' },
      { id: 'education-report', icon: <BarChart3 size={16} />, label: 'Education Report' },
    ],
  },
  {
    label: 'Media & Ads',
    groupIcon: <Monitor size={16} />,
    showGroupIcon: true,
    items: [
      { id: 'tv', icon: <Monitor size={16} />, label: 'TV Management' },
      { id: 'ads', icon: <Megaphone size={16} />, label: 'Ads Requests' },
      { id: 'media-report', icon: <BarChart3 size={16} />, label: 'Media Report' },
    ],
  },
  {
    label: 'System',
    groupIcon: <Settings size={16} />,
    showGroupIcon: true,
    items: [
      { id: 'users', icon: <Users size={16} />, label: 'User Management' },
      { id: 'notifications', icon: <Bell size={16} />, label: 'Notifications' },
      { id: 'analytics', icon: <Globe size={16} />, label: 'Analytics' },
      { id: 'settings', icon: <Settings size={16} />, label: 'Settings' },
      { id: 'support', icon: <HelpCircle size={16} />, label: 'Support' },
      { id: 'reports', icon: <FileText size={16} />, label: 'System Report' },
    ],
  },
];

const flatItems = sidebarGroups.flatMap(g => g.items);
const sectionLabels: Record<string, string> = Object.fromEntries(flatItems.map(i => [i.id, i.label]));

const INITIAL_CATEGORIES: Category[] = [];

function TrendIndicator({ value }: { value: number }) {
  if (value > 0) return <span className="flex items-center gap-[2px] text-xs font-semibold text-emerald-600"><TrendingUp size={10} />+{value}%</span>;
  if (value < 0) return <span className="flex items-center gap-[2px] text-xs font-semibold text-red-600"><TrendingDown size={10} />{value}%</span>;
  return <span className="flex items-center gap-[2px] text-xs font-semibold text-gray-400"><Minus size={10} />0%</span>;
}

/* ─────── PAGINATION ─────── */
function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (page: number) => void }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-between px-2 py-2 bg-gray-50 border-t border-gray-200 text-xs">
      <span className="text-gray-500">Page {current} of {total}</span>
      <div className="flex items-center gap-[2px]">
        <button onClick={() => onChange(current - 1)} disabled={current <= 1} className="px-2 py-[3px] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed outline-none">Prev</button>
        {Array.from({ length: total }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)} className={`px-2 py-[3px] outline-none ${p === current ? 'bg-[#3373AB] text-white' : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-100'}`}>{p}</button>
        ))}
        <button onClick={() => onChange(current + 1)} disabled={current >= total} className="px-2 py-[3px] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed outline-none">Next</button>
      </div>
    </div>
  );
}

const PRODS_CACHE_KEY = 'rtgroup_products_cache_v2';

function loadCachedProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODS_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function cacheProducts(products: Product[]) {
  try {
    localStorage.setItem(PRODS_CACHE_KEY, JSON.stringify(products));
  } catch {}
}

export default function AdminDashboard({ onBack }: { onBack?: () => void }) {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMessage, setShowNotifMessage] = useState(false);
  const [showProductGroup, setShowProductGroup] = useState(false);

  const cached = loadCachedProducts();
  const [products, setProducts] = useState<Product[]>(cached.length > 0 ? cached : []);
  const [courses, setCourses] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [sectionHistory, setSectionHistory] = useState<AdminSection[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [rttiData, setRttiData] = useState<RttiData | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const check = () => {
      const hasOverflow = el.scrollHeight > el.clientHeight;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
      setShowScrollIndicator(hasOverflow && !atBottom);
    };
    check();
    el.addEventListener('scroll', check);
    return () => el.removeEventListener('scroll', check);
  }, []);

  useEffect(() => {
    fetchProducts().then(data => { if (data.length > 0) { setProducts(data); cacheProducts(data); } }).catch(() => {});
    fetchCategories().then(setCategories).catch(() => {});
    fetchOrders().then(setOrders).catch(() => {});
    fetchCertificates().then(setCertificates).catch(() => {});
    fetchAds().then(setAds).catch(() => {});
    fetchCourses().then(setCourses).catch(() => {});
    fetchVideos().then(setBroadcasts).catch(() => {});
    fetchRttiData().then(setRttiData).catch(() => {});
  }, []);

  useEffect(() => {
    cacheProducts(products);
  }, [products]);

  useEffect(() => {
    const path = sectionLabels[activeSection]?.toLowerCase().replace(/\s+/g, '-') || activeSection;
    window.history.replaceState({ section: activeSection }, '', `/portals/${path}`);
  }, [activeSection]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const section = (e.state as { section?: AdminSection })?.section;
      if (section && section !== activeSection) {
        setIsTransitioning(true);
        setActiveSection(section);
        setTimeout(() => setIsTransitioning(false), 400);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [activeSection]);

  const navigateTo = (section: AdminSection) => {
    if (section === activeSection) return;
    setSectionHistory(prev => [...prev, activeSection]);
    setIsTransitioning(true);
    setActiveSection(section);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const goBack = () => {
    if (sectionHistory.length === 0) return;
    const prev = sectionHistory[sectionHistory.length - 1];
    setSectionHistory(prev => prev.slice(0, -1));
    setIsTransitioning(true);
    setActiveSection(prev);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const [kpiData, setKpiData] = useState<KpiOverview | null>(null);

  useEffect(() => {
    fetchKpiOverview().then(setKpiData);
  }, []);

  const stats: Record<string, number> = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'processing').length,
    totalCourses: courses.length,
    activeCertificates: certificates.filter(c => c.status === 'active').length,
    pendingAds: ads.filter(a => a.status === 'pending').length,
    totalRevenue: orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0),
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-screen z-40 bg-gray-50 font-sans flex flex-col md:flex-row overflow-hidden">
      <style>{`
        aside nav::-webkit-scrollbar-thumb { background: rgba(51,115,171,0.5); border-radius: 999px; }
        aside nav::-webkit-scrollbar-thumb:hover { background: rgba(51,115,171,0.75); }
        aside nav::-webkit-scrollbar { width: 3px; }
        aside nav::-webkit-scrollbar-track { background: transparent; }
        .sidebar-section:hover .sidebar-item {
          transform: scale(1.03);
          font-weight: 700;
          margin-top: 6px;
          margin-bottom: 6px;
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-[100vh] z-[60] bg-white w-64
        flex flex-col
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        transition-transform duration-300 ease-in-out

        md:relative md:flex md:flex-col md:h-full md:w-20 md:hover:w-56 md:bg-white md:z-0
        md:border-r md:border-gray-200
        md:transition-all md:duration-300 md:ease-out
        group
      `}>
        {/* Mobile: drag handle */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-8 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Mobile: header with logo + close */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <img src="/logo/logoonly.png" alt="RT GROUP" className="h-7 w-7  object-contain" />
            <div className="leading-tight">
              <span className="text-xs font-mono text-[#3373AB] font-bold tracking-[0.15em] block">RT GROUP</span>
              <span className="text-xs font-bold tracking-tight block text-gray-700">Admin Panel</span>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-gray-700 outline-none p-1">
            <X size={14} />
          </button>
        </div>

        {/* Desktop: logo */}
        <div className="hidden md:flex items-center justify-center border-b border-gray-200 shrink-0 px-3 py-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img src="/logo/logoonly.png" alt="RT GROUP" className="h-10 w-10 scale-100 object-contain shrink-0 group-hover:hidden" />
            <img src="/logo/logo.png" alt="RT GROUP" className="h-10 w-50 scale-300 object-contain shrink-0 hidden group-hover:block" />
          </div>
        </div>

        {/* Navigation */}
        <nav ref={navRef} className="flex-1 overflow-y-auto py-1">
          {sidebarGroups.map(group => {
            const isGroupActive = group.items.some(item => activeSection === item.id);
            return (
              <div key={group.label} className="sidebar-section">
                {/* Desktop collapsed: group icon */}
                {group.showGroupIcon && (
                  <div className="hidden md:block md:group-hover:hidden">
                    <button
                      onClick={() => { navigateTo(group.items[0].id); setMobileOpen(false); }}
                      className={`w-full flex justify-center py-3 outline-none transition-all duration-300
                        ${isGroupActive
                          ? 'text-[#3373AB]'
                          : 'text-gray-400 hover:text-[#3373AB]'
                        }`}
                    >
                      {group.groupIcon}
                    </button>
                  </div>
                )}

                {/* Group header + items: mobile always, desktop expanded only */}
                <div className="block md:overflow-hidden md:max-h-0 md:opacity-0 md:translate-y-[-4px] md:pointer-events-none md:group-hover:max-h-96 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto md:transition-all md:duration-700 md:ease-in-out">
                  {/* Group header — icon + bold name */}
                  <div className="px-3 pt-0 pb-0.5 md:px-3 md:pt-2 flex items-center gap-2">
                    <span className="shrink-0 text-gray-400">{group.groupIcon}</span>
                    <span className={`text-[14px] font-mono uppercase tracking-[0.2em] md:font-bold md:text-xs md:tracking-wider ${isGroupActive ? 'text-[#3373AB]' : 'text-gray-400 md:text-gray-700'}`}>
                      {group.label}
                    </span>
                  </div>

                  {/* Items — text only, no icons */}
                  {group.items.map(item => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { navigateTo(item.id); setMobileOpen(false); }}
                        className={`sidebar-item w-full flex items-center outline-none text-left cursor-pointer
                          px-3 py-2
                          ml-7 md:pr-3 md:py-1.5 md:my-0.5
                          transition-all duration-200
                          ${isActive
                            ? 'text-[#3373AB] bg-[#3373AB]/10 border-l-2 border-[#3373AB] font-semibold'
                            : 'text-gray-400 hover:text-white hover:bg-[#3373AB] hover:shadow-sm border-l-2 border-transparent'
                          }`}
                      >
                        <span className="text-sm md:text-xs font-medium tracking-wide text-black md:group-hover:text-inherit transition-all duration-200">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Scroll indicator (desktop hover only) */}
        {showScrollIndicator && (
          <div className="hidden md:group-hover:flex justify-center border-t border-gray-200 py-1">
            <div className="flex items-center gap-1.5 text-gray-400 animate-bounce">
              <div className="border border-gray-300 rounded-full p-0.5">
                <ChevronDown size={12} />
              </div>
              <span className="text-[14px] font-medium tracking-wide">Scroll for more</span>
            </div>
          </div>
        )}

        {/* Bottom section */}
        <div className="border-t border-gray-200 px-3 py-2 space-y-1 md:border-t-0 md:group-hover:border-t">
          <button
            onClick={onBack}
            className="flex items-center w-full outline-none text-left
              px-3 py-2 gap-2.5
              md:px-0 md:justify-center md:gap-0
              md:group-hover:px-3 md:group-hover:justify-start md:group-hover:gap-2.5
              text-gray-400 hover:text-[#3373AB] hover:bg-gray-50 transition-all duration-300
            "
          >
            <ArrowLeft size={16} className="shrink-0 transition-all duration-300" />
            <span className="text-xs font-medium md:hidden md:group-hover:inline">
              Back to Page View
            </span>
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 md:px-0 md:justify-center md:group-hover:px-3 md:group-hover:justify-start">
            <span className="h-1 w-1 bg-emerald-400 shrink-0"></span>
            <span className="text-[14px] font-mono text-gray-400 md:hidden md:group-hover:inline">
              System Online v2.1.0
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed top-0 left-0 right-0 h-[200vh] bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden pb-16 md:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-1.5 -ml-1.5 text-gray-500 hover:text-gray-900 outline-none"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={16} />
            </button>
            <span className="text-xs font-medium text-gray-900">{sectionLabels[activeSection] || activeSection}</span>
            {sectionHistory.length > 0 && (
              <button onClick={goBack} className="ml-1 p-1 text-gray-400 hover:text-[#3373AB] outline-none transition-colors" title="Go back">
                <ArrowLeft size={12} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, orders..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-2 text-xs bg-gray-50 border border-gray-200 outline-none focus:border-[#3373AB] focus:bg-white"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none">
                  <X size={11} />
                </button>
              )}
            </div>
            <button className="relative p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 outline-none">
              <Bell size={15} />
              <span className="absolute -top-[2px] -right-[2px] h-3.5 w-3.5 bg-red-500 text-white text-[14px] font-bold flex items-center justify-center">3</span>
            </button>
            <div className="h-7 w-7 bg-gradient-to-br from-[#3373AB] to-[#1d4f7a] flex items-center justify-center text-white text-xs font-bold rounded-full" style={{ borderRadius: '50%' }}>A</div>
          </div>
        </header>

        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
            <div className={`px-4 py-2 text-xs font-semibold flex items-center justify-between border-l-4 max-w-md w-full ${
              notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-500' : 'bg-red-50 text-red-800 border-red-500'
            }`}>
              <span className="flex items-center gap-1.5">
                {notification.type === 'success' ? <Check size={12} /> : <AlertTriangle size={12} />}
                {notification.message}
              </span>
              <button onClick={() => setNotification(null)} className="opacity-60 hover:opacity-100 outline-none ml-2">
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Loading transition */}
        {isTransitioning && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-50/80 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={28} className="text-[#3373AB] animate-spin" />
              <span className="text-xs font-mono text-gray-400 tracking-wider uppercase">Loading...</span>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 relative">
{activeSection === 'overview' && (
            <OverviewSection kpiData={kpiData} stats={stats} products={products} courses={courses} ads={ads} orders={orders} broadcasts={broadcasts} certificates={certificates} categories={categories} onNavigate={(s: AdminSection) => setActiveSection(s)} />
          )}
          {activeSection === 'products' && <ProductsSection products={products} setProducts={setProducts} searchQuery={searchQuery} notify={notify} categories={categories} />}
          {activeSection === 'orders' && <OrdersSection orders={orders} setOrders={setOrders} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'categories' && <CategoriesSection categories={categories} setCategories={setCategories} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'courses' && <CoursesSection courses={courses} setCourses={setCourses} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'certificates' && <CertificatesSection certificates={certificates} setCertificates={setCertificates} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'ads' && <AdsSection ads={ads} setAds={setAds} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'tv' && <TVSection broadcasts={broadcasts} setBroadcasts={setBroadcasts} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'commerce-report' && <SystemReportSection domain="commerce" stats={stats} products={products} orders={orders} courses={courses} certificates={certificates} categories={categories} ads={ads} broadcasts={broadcasts} rttiData={rttiData} />}
          {activeSection === 'education-report' && <SystemReportSection domain="education" stats={stats} products={products} orders={orders} courses={courses} certificates={certificates} categories={categories} ads={ads} broadcasts={broadcasts} rttiData={rttiData} />}
          {activeSection === 'media-report' && <SystemReportSection domain="media" stats={stats} products={products} orders={orders} courses={courses} certificates={certificates} categories={categories} ads={ads} broadcasts={broadcasts} rttiData={rttiData} />}
          {activeSection === 'reports' && <SystemReportSection domain="all" stats={stats} products={products} orders={orders} courses={courses} certificates={certificates} categories={categories} ads={ads} broadcasts={broadcasts} rttiData={rttiData} />}
          {activeSection === 'users' && <PlaceholderSection title="User Management" description="Manage user accounts, roles, and permissions." />}
          {activeSection === 'settings' && <PlaceholderSection title="Settings" description="Configure system preferences and global settings." />}
          {activeSection === 'support' && <PlaceholderSection title="Support" description="View and respond to support tickets." />}
          {activeSection === 'analytics' && <PlaceholderSection title="Analytics" description="Detailed platform analytics and reporting." />}
          {activeSection === 'billing' && <PlaceholderSection title="Billing & Payments" description="Manage subscriptions, invoices, and transactions." />}
          {activeSection === 'notifications' && <PlaceholderSection title="Notifications" description="Configure notification channels and templates." />}
          {activeSection === 'admin-settings' && <AdminSettingsSection onBack={goBack} notify={notify} />}
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around h-16 px-1">
          {/* Products Group */}
          <div className="relative">
            <button onClick={() => { setShowProductGroup(!showProductGroup); setShowProfileMenu(false); }} className="flex flex-col items-center gap-0.5 px-2 py-1 text-gray-500">
              <Package size={20} />
              <span className="text-[14px] font-medium">Products</span>
            </button>
            {showProductGroup && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProductGroup(false)} />
                <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 shadow-lg min-w-[180px] z-50 rounded-lg overflow-hidden">
                  <div className="px-3 py-2 text-[14px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50">Commerce</div>
                  {sidebarGroups.find(g => g.label === 'Commerce')?.items.filter(i => i.id !== 'billing').map(item => (
                    <button key={item.id} onClick={() => { navigateTo(item.id); setShowProductGroup(false); setMobileOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-xs hover:bg-gray-50 text-gray-700">
                      <span className="text-[#3373AB]">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notification Bell */}
          <button onClick={() => { setShowNotifMessage(true); setShowProductGroup(false); setShowProfileMenu(false); }} className="flex flex-col items-center gap-0.5 px-2 py-1 text-gray-500 relative">
            <Bell size={20} />
            <span className="text-[14px] font-medium">Alerts</span>
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 text-white text-[14px] font-bold flex items-center justify-center rounded-full">3</span>
          </button>

          {/* Center Add Button */}
          <button onClick={() => { setShowAddModal(true); setShowProductGroup(false); setShowProfileMenu(false); }} className="bg-[#3373AB] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg -mt-6 border-4 border-white hover:bg-[#255C8E] transition-colors" style={{ borderRadius: '50%' }}>
            <Plus size={28} strokeWidth={3} />
          </button>

          {/* Settings Gear */}
          <button onClick={() => { navigateTo('admin-settings'); setShowProductGroup(false); setShowProfileMenu(false); setShowNotifMessage(false); }} className="flex flex-col items-center gap-0.5 px-2 py-1 text-gray-500">
            <Settings size={20} />
            <span className="text-[14px] font-medium">Settings</span>
          </button>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => { setShowProfileMenu(!showProfileMenu); setShowProductGroup(false); setShowNotifMessage(false); }} className="flex flex-col items-center gap-0.5 px-2 py-1">
              <div className="h-7 w-7 bg-gradient-to-br from-[#3373AB] to-[#1d4f7a] flex items-center justify-center text-white text-xs font-bold rounded-full" style={{ borderRadius: '50%' }}>A</div>
              <span className="text-[14px] font-medium text-gray-500">Profile</span>
            </button>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 shadow-lg min-w-[200px] z-50 rounded-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900">Administrator</p>
                    <p className="text-xs text-gray-500">Full system control</p>
                  </div>
                  <button onClick={() => { navigateTo('admin-settings'); setShowProfileMenu(false); }} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 text-gray-700">
                    <Settings size={14} className="text-gray-400" />
                    Profile Settings
                  </button>
                  <button onClick={() => { onBack?.(); setShowProfileMenu(false); }} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 text-gray-700">
                    <ArrowLeft size={14} className="text-gray-400" />
                    Back to Webview
                  </button>
                  <button onClick={() => { onBack?.(); setShowProfileMenu(false); }} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 text-red-500 border-t border-gray-100">
                    <ArrowLeft size={14} className="text-red-400" />
                    Leave Dashboard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Item Modal - Bottom Sheet */}
      {showAddModal && (
        <div className="md:hidden fixed inset-0 z-[60]" onClick={() => setShowAddModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-2xl animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="px-5 pb-6">
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wider text-center mb-3">Add New</p>
              <div className="space-y-0.5">
                {[
                  { label: 'Add Product', icon: <Package size={16} />, section: 'products' as AdminSection },
                  { label: 'Add Course', icon: <BookOpen size={16} />, section: 'courses' as AdminSection },
                  { label: 'Add User', icon: <Users size={16} />, section: 'users' as AdminSection },
                  { label: 'Add Advertisement', icon: <Megaphone size={16} />, section: 'ads' as AdminSection },
                  { label: 'Add Video in MTTV', icon: <Monitor size={16} />, section: 'tv' as AdminSection },
                ].map(item => (
                  <button key={item.label} onClick={() => { navigateTo(item.section); setShowAddModal(false); setMobileOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="text-[#3373AB]">{item.icon}</span>
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Under Development Toast */}
      {showNotifMessage && (
        <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowNotifMessage(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white border border-gray-200 shadow-xl p-6 max-w-xs w-full text-center rounded-lg">
            <Bell size={24} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">Under Development</p>
            <p className="text-xs text-gray-500 mt-1">This feature is currently under development.</p>
            <button onClick={() => setShowNotifMessage(false)} className="mt-4 bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-semibold px-5 py-1.5 outline-none rounded transition-colors">OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────── PLACEHOLDER SECTION ─────── */
function PlaceholderSection({ title, description }: { title: string; description?: string }) {
  return (
    <div className="bg-white border-b border-gray-200 p-8 text-center">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{title}</h3>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-xs text-gray-500">
        <Clock size={12} />
        Coming Soon
      </div>
    </div>
  );
}

/* ─────── OVERVIEW DASHBOARD ─────── */
function OverviewSection({ kpiData, stats, products, courses, ads, orders, broadcasts, certificates, categories, rttiData, onNavigate }: any) {
  const rev = kpiData?.revenue;
  const clients = kpiData?.activeClients;
  const engagement = kpiData?.globalEngagement;
  const totalBroadcastViews = broadcasts.reduce((s: number, b: any) => s + (b.views || 0), 0);
  const activeClients = (stats.activeCertificates || 0) + (stats.totalOrders || 0);
  const lowStockCount = products.filter((p: any) => p.stock < 5).length;
  const verifiedOrders = orders.filter((o: any) => o.status === 'delivered' || o.status === 'shipped').length;
  const notVerifiedOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'processing').length;
  const inStockCount = products.filter((p: any) => p.stock > 0).length;

  const lowStockByCategory = products
    .filter((p: any) => p.stock < 5)
    .reduce((acc: Record<string, any[]>, p: any) => {
      (acc[p.category] = acc[p.category] || []).push(p);
      return acc;
    }, {});
  const minStockPerCategory = Object.entries(lowStockByCategory).map(([cat, items]: [string, any]) => {
    const min = items.sort((a: any, b: any) => a.stock - b.stock)[0];
    return { category: cat, product: min, count: items.length };
  }).sort((a: any, b: any) => a.product.stock - b.product.stock);

  const productSales: Record<string, number> = {};
  orders.forEach((o: any) => {
    const itemNames = o.items.split(',').map((s: string) => s.trim());
    itemNames.forEach((name: string) => {
      const match = products.find((p: any) => name.toLowerCase().includes(p.name.toLowerCase().slice(0, 8)));
      if (match) productSales[match.name] = (productSales[match.name] || 0) + 1;
    });
  });
  const sortedBySales = Object.entries(productSales).sort((a: any, b: any) => b[1] - a[1]);
  const mostSoldProduct = sortedBySales.length > 0 ? sortedBySales[0][0] : products.sort((a: any, b: any) => a.stock - b.stock)[0]?.name;
  const categorySales: Record<string, number> = {};
  products.forEach((p: any) => {
    const sold = productSales[p.name] || (p.stock < 50 ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 5));
    categorySales[p.category] = (categorySales[p.category] || 0) + sold;
  });
  const mostSoldCategory = Object.entries(categorySales).sort((a: any, b: any) => b[1] - a[1])[0]?.[0];

  return (
    <div>
      {/* Pillar 1: Global Performance KPIs — edge to edge */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-200">
        <div className="border-r border-gray-200 last:border-r-0 bg-white px-4 py-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Revenue</p>
            <DollarSign size={16} className="text-[#3373AB]" />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-gray-900">
              RWF {(rev?.current ?? stats.totalRevenue ?? 0).toFixed(2)}
            </p>
            <TrendIndicator value={rev?.change ?? 0} />
          </div>
          {rev && (
            <p className="text-xs text-gray-400 mt-1">
              Today: RWF {rev.today.toFixed(2)} &middot; Yesterday: RWF {rev.yesterday.toFixed(2)}
            </p>
          )}
        </div>
        <div className="border-r border-gray-200 last:border-r-0 bg-white px-4 py-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Active Clients</p>
            <Users size={16} className="text-[#3373AB]" />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-gray-900">{clients?.current ?? activeClients}</p>
            <TrendIndicator value={clients?.change ?? 0} />
          </div>
        </div>
        <div className="border-r border-gray-200 last:border-r-0 bg-white px-4 py-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Global Engagement</p>
            <BarChart3 size={16} className="text-[#3373AB]" />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-gray-900">
              {engagement?.current ?? 68.4}%
            </p>
            <TrendIndicator value={engagement?.change ?? 0} />
          </div>
        </div>
      </div>

      {/* Pillar 2: B2B Marketplace Snapshot */}
      <div className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingCart size={14} className="text-[#3373AB]" />
            Marketplace
          </h4>
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate?.('products')} className="border-2 border-dashed border-[#3373AB]/40 text-[#3373AB] text-xs font-semibold px-3 py-1.5 hover:bg-[#3373AB]/5 outline-none">
              + Add Product
            </button>
            <button onClick={() => onNavigate?.('orders')} className="border-2 border-dashed border-[#3373AB]/40 text-[#3373AB] text-xs font-semibold px-3 py-1.5 hover:bg-[#3373AB]/5 outline-none">
              Manage Orders
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          <StatusBadge title="PRODUCT IN STOCK" label="Want to add a product?" count={inStockCount} onClick={() => onNavigate?.('products')} hoverHint="Click to manage products" />
          <StatusBadge title="CATEGORIES" label="Browse categories?" count={categories?.length || 0} onClick={() => onNavigate?.('categories')} hoverHint="Browse all categories" />
          <StatusBadge title="ORDER" label="Check orders?" count={verifiedOrders} onClick={() => onNavigate?.('orders')} hoverHint="View all orders" />
          <StatusBadge title="PENDING ORDER" label="Pending orders?" count={notVerifiedOrders} onClick={() => onNavigate?.('orders')} hoverHint="Review pending" />
        </div>

        {/* Stock Alert with View */}
        {lowStockCount > 0 && (
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-l-2 border-gray-700">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-gray-600 shrink-0" />
              <p className="text-xs text-gray-700">
                <span className="font-semibold">{lowStockCount}</span> product{lowStockCount > 1 ? 's' : ''} low in stock
              </p>
            </div>
            <button onClick={() => onNavigate?.('products')} className="text-xs font-semibold text-[#3373AB] border border-[#3373AB]/30 px-2.5 py-1 hover:bg-[#3373AB]/5 outline-none">
              View
            </button>
          </div>
        )}
      </div>

      {/* Pillar 3 & 4: RTTI + Media side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-200">
        <div className="border-r border-gray-200 bg-white px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#3373AB]" />
              RTTI
            </h4>
            <button onClick={() => onNavigate?.('courses')} className="border-2 border-dashed border-[#3373AB]/40 text-[#3373AB] text-xs font-semibold px-3 py-1.5 hover:bg-[#3373AB]/5 outline-none">
              Manage Courses
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 border border-gray-100 px-2.5 py-3 text-center">
              <p className="text-lg font-bold text-gray-900 leading-none">{rttiData?.totalStudents ?? '—'}</p>
              <p className="text-xs text-gray-500 mt-1">Students Enrolled</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 px-2.5 py-3 text-center">
              <p className="text-lg font-bold text-gray-900 leading-none">{rttiData?.totalCourses ?? '—'}</p>
              <p className="text-xs text-gray-500 mt-1">Courses</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 px-2.5 py-3 text-center">
              <p className="text-lg font-bold text-gray-900 leading-none">{rttiData?.totalTeachers ?? '—'}</p>
              <p className="text-xs text-gray-500 mt-1">Teachers</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-gray-100">
            <span className="text-gray-500">Completion Rate</span>
            <span className="font-bold text-gray-900">{rttiData?.avgCompletion ?? '—'}%</span>
          </div>
        </div>
        <div className="bg-white px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Monitor size={14} className="text-[#3373AB]" />
              Media & Ads
            </h4>
            <button onClick={() => onNavigate?.('ads')} className="border-2 border-dashed border-[#3373AB]/40 text-[#3373AB] text-xs font-semibold px-3 py-1.5 hover:bg-[#3373AB]/5 outline-none">
              Manage Ads
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Total TV Views</span>
              <span className="font-bold text-gray-900">{totalBroadcastViews.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Active Campaigns</span>
              <span className="font-bold text-gray-900">{ads.filter((a: any) => a.status === 'active').length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Pending Approvals</span>
              <span className="font-bold text-gray-900">{stats.pendingAds}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-50">
              <span className="text-gray-500">Ad CTR</span>
              <span className="font-bold text-gray-900">3.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pillar 5: Action Center */}
      <div className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <Bell size={14} className="text-[#3373AB]" />
            Action Center
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Left: Stock & Performance */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock Alert by Category</p>
            {minStockPerCategory.length > 0 ? (
              <div className="space-y-1.5">
                {minStockPerCategory.slice(0, 4).map((item: any) => (
                  <div key={item.category} className="flex items-center justify-between px-3 py-2 bg-gray-50 border-l-2 border-gray-700">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Package size={13} className="text-gray-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-400 truncate">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-gray-900">{item.product.stock} left</span>
                      <button onClick={() => onNavigate?.('products')} className="text-xs font-semibold text-[#3373AB] border border-[#3373AB]/30 px-2 py-0.5 hover:bg-[#3373AB]/5 outline-none">
                        Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">All products well stocked</p>
            )}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-gray-50 border border-gray-100 px-3 py-2">
                <p className="text-[14px] text-gray-400 uppercase tracking-wider">Most Sold Category</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5">{mostSoldCategory || '—'}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 px-3 py-2">
                <p className="text-[14px] text-gray-400 uppercase tracking-wider">Most Sold Product</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5 truncate">{mostSoldProduct || '—'}</p>
              </div>
            </div>
          </div>

          {/* Right: Action Items with CTA */}
          <div className="md:col-span-2 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Requires Action</p>
            {stats.pendingOrders > 0 && (
              <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border-l-2 border-[#3373AB]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <ShoppingCart size={13} className="text-gray-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-800">{stats.pendingOrders} pending orders</p>
                    <p className="text-[14px] text-gray-400">Fulfillment needed</p>
                  </div>
                </div>
                <button onClick={() => onNavigate?.('orders')} className="text-xs font-semibold text-[#3373AB] border border-[#3373AB]/30 px-2 py-1 hover:bg-[#3373AB]/5 outline-none shrink-0">
                  Fulfill
                </button>
              </div>
            )}
            {stats.pendingAds > 0 && (
              <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border-l-2 border-[#3373AB]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Megaphone size={13} className="text-gray-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-800">{stats.pendingAds} pending ads</p>
                    <p className="text-[14px] text-gray-400">Awaiting review</p>
                  </div>
                </div>
                <button onClick={() => onNavigate?.('ads')} className="text-xs font-semibold text-[#3373AB] border border-[#3373AB]/30 px-2 py-1 hover:bg-[#3373AB]/5 outline-none shrink-0">
                  Review
                </button>
              </div>
            )}
            {lowStockCount > 0 && (
              <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border-l-2 border-gray-700">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Package size={13} className="text-gray-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-800">{lowStockCount} low stock items</p>
                    <p className="text-[14px] text-gray-400">Restock recommended</p>
                  </div>
                </div>
                <button onClick={() => onNavigate?.('products')} className="text-xs font-semibold text-[#3373AB] border border-[#3373AB]/30 px-2 py-1 hover:bg-[#3373AB]/5 outline-none shrink-0">
                  Restock
                </button>
              </div>
            )}
            {stats.pendingOrders === 0 && stats.pendingAds === 0 && lowStockCount === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">No pending actions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────── TABLE WRAPPER ─────── */
function TableWrapper({ title, children, onAdd, totalItems }: { title: string; children: ReactNode; onAdd?: () => void; totalItems?: number }) {
  return (
    <div className="bg-white border-b border-gray-200 ">
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-900 tracking-wide">{title}</h3>
          {totalItems !== undefined && <span className="text-xs text-gray-400">{totalItems} items</span>}
        </div>
        <div className="flex items-center gap-1.5">
          {onAdd && (
            <button onClick={onAdd} className="bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-bold px-5 py-1.5 flex items-center gap-1.5 outline-none">
              <Plus size={13} />
              Add New
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

/* ─────── PRODUCTS SECTION ─────── */
function ProductsSection({ products, setProducts, searchQuery, notify, categories }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', category: '', price: '', stock: '', vendorName: '',
    description: '', videoUrl: '', guideBook: '', whereToUse: '',
    specTable: [['', ''], ['', '']],
    images: [] as string[],
    mainImageUrl: ''
  });
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterCat, setFilterCat] = useState('');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'price-low' | 'price-high'>('newest');
  const perPage = 15;

  const handleCloseAttempt = () => {
    if (form.name || form.price) {
      setShowCloseConfirm(true);
    } else {
      setShowForm(false);
    }
  };

  const confirmClose = () => {
    setShowCloseConfirm(false);
    setShowForm(false);
  };

  const initForm = () => ({
    name: '', category: '', price: '', stock: '', vendorName: '',
    description: '', videoUrl: '', guideBook: '', whereToUse: '',
    specTable: [['', ''], ['', '']],
    images: [] as string[],
    mainImageUrl: ''
  });

  const openAdd = () => {
    setEditProduct(null);
    setForm(initForm());
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      stock: String(p.stock),
      vendorName: p.vendorName,
      description: p.description,
      videoUrl: p.videoUrl || '',
      guideBook: p.guideBook || '',
      whereToUse: p.whereToUse || '',
      specTable: p.specTable && p.specTable.length > 0 ? p.specTable : [['', ''], ['', '']],
      images: p.images || [],
      mainImageUrl: ''
    });
    setShowForm(true);
  };

  const addSpecRow = () => {
    const cols = form.specTable[0]?.length || 2;
    setForm({ ...form, specTable: [...form.specTable, Array(cols).fill('')] });
  };

  const addSpecCol = () => {
    setForm({ ...form, specTable: form.specTable.map(r => [...r, '']) });
  };

  const removeSpecRow = (ri: number) => {
    if (form.specTable.length <= 1) return;
    setForm({ ...form, specTable: form.specTable.filter((_, i) => i !== ri) });
  };

  const removeSpecCol = (ci: number) => {
    if ((form.specTable[0]?.length || 1) <= 1) return;
    setForm({ ...form, specTable: form.specTable.map(r => r.filter((_, i) => i !== ci)) });
  };

  const updateSpecCell = (ri: number, ci: number, val: string) => {
    const next = form.specTable.map((r, i) => i === ri ? r.map((c, j) => j === ci ? val : c) : r);
    setForm({ ...form, specTable: next });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setForm({ ...form, images: [...form.images, ev.target.result as string] });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addImageUrl = () => {
    if (!form.mainImageUrl.trim()) return;
    setForm({ ...form, images: [...form.images, form.mainImageUrl.trim()], mainImageUrl: '' });
  };

  const removeImage = (idx: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || isSubmitting) return;
    setIsSubmitting(true);
    const specObj: Record<string, string> = {};
    if (form.specTable.length > 0) {
      form.specTable.slice(1).forEach(row => {
        if (row[0]) specObj[row[0]] = row[1] || '';
      });
    }
    const finalImages = form.images.length > 0 ? form.images : ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60'];
    const payload = {
      name: form.name,
      category: form.category,
      price: form.price,
      stock: form.stock,
      vendorName: form.vendorName || 'Admin',
      description: form.description,
      videoUrl: form.videoUrl,
      guideBook: form.guideBook,
      whereToUse: form.whereToUse,
      specTable: form.specTable,
      specs: specObj,
      images: finalImages,
      image: finalImages[0],
    };
    if (editProduct) {
      try {
        await updateProduct(editProduct.id, payload);
        setProducts(products.map((p: Product) =>
          p.id === editProduct.id ? { ...p, ...payload, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 } : p
        ));
        notify('success', `Product "${form.name}" updated successfully.`);
      } catch {
        notify('error', 'Failed to update product in database.');
      }
    } else {
      try {
        const created = await createProduct(payload);
        const newP: Product = {
          id: created.id,
          name: form.name,
          category: form.category,
          price: parseFloat(form.price),
          rating: 0,
          image: finalImages[0],
          description: form.description,
          specs: specObj,
          vendorName: form.vendorName || 'Admin',
          stock: parseInt(form.stock) || 0,
          videoUrl: form.videoUrl,
          guideBook: form.guideBook,
          whereToUse: form.whereToUse,
          specTable: form.specTable,
          images: finalImages
        };
        setProducts([newP, ...products]);
        setSelectedIds(new Set([newP.id]));
        setTimeout(() => setSelectedIds(new Set()), 4000);
        notify('success', `Product "${form.name}" added successfully.`);
      } catch {
        notify('error', 'Failed to save product to database.');
      }
    }
    setIsSubmitting(false);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
    } catch {
      // Still remove from UI even if DB delete fails (product may not exist in DB)
    }
    setProducts(products.filter((p: Product) => p.id !== id));
    setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    notify('success', 'Product removed successfully.');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const pageIds = paginated.map((p: Product) => p.id);
    const allSelected = pageIds.every(id => selectedIds.has(id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allSelected) pageIds.forEach(id => next.delete(id));
      else pageIds.forEach(id => next.add(id));
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    try { await Promise.all(Array.from(selectedIds).map(id => deleteProduct(id))); } catch { /* ignore */ }
    setProducts(products.filter((p: Product) => !selectedIds.has(p.id)));
    notify('success', `${selectedIds.size} product(s) removed successfully.`);
    clearSelection();
  };

  const filtered = products.filter((p: Product) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.category.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterCat && p.category !== filterCat) return false;
    if (filterMinPrice && p.price < parseFloat(filterMinPrice)) return false;
    if (filterMaxPrice && p.price > parseFloat(filterMaxPrice)) return false;
    if (filterStock === 'in' && p.stock <= 0) return false;
    if (filterStock === 'low' && (p.stock > 10 || p.stock <= 0)) return false;
    if (filterStock === 'out' && p.stock > 0) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'oldest': return a.id.localeCompare(b.id);
      case 'name': return a.name.localeCompare(b.name);
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      default: return b.id.localeCompare(a.id);
    }
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);
  const pageIds = paginated.map((p: Product) => p.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));

  const selectedProducts = products.filter(p => selectedIds.has(p.id));

  return (
    <div>
      <TableWrapper title="Product Catalog" onAdd={openAdd} totalItems={filtered.length}>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[#3373AB]/5 border-b border-[#3373AB]/20">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs font-semibold text-[#3373AB] whitespace-nowrap">{selectedIds.size} selected</span>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {selectedProducts.slice(0, 8).map(p => (
                  <div key={p.id} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded px-1.5 py-1 shrink-0">
                    <img src={p.image} alt={p.name} className="h-5 w-5 rounded object-cover" />
                    <span className="text-xs text-gray-600 max-w-[80px] truncate">{p.name}</span>
                    <button onClick={() => toggleSelect(p.id)} className="text-gray-300 hover:text-gray-500 outline-none"><X size={9} /></button>
                  </div>
                ))}
                {selectedProducts.length > 8 && (
                  <span className="text-xs text-gray-400">+{selectedProducts.length - 8} more</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={clearSelection} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 outline-none">Clear</button>
              <button onClick={handleBulkDelete} className="flex items-center gap-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 outline-none rounded">
                <Trash2 size={11} />
                Delete All
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50/50">
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="text-xs border border-gray-200 bg-white px-2 py-1.5 outline-none focus:border-[#3373AB]">
            <option value="">All Categories</option>
            {[...new Set<string>(products.map((p: Product) => p.category))].sort().map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Min RWF" value={filterMinPrice} onChange={e => setFilterMinPrice(e.target.value)} className="w-20 text-xs border border-gray-200 bg-white px-2 py-1.5 outline-none focus:border-[#3373AB]" />
          <span className="text-xs text-gray-400">—</span>
          <input type="number" placeholder="Max RWF" value={filterMaxPrice} onChange={e => setFilterMaxPrice(e.target.value)} className="w-20 text-xs border border-gray-200 bg-white px-2 py-1.5 outline-none focus:border-[#3373AB]" />
          <select value={filterStock} onChange={e => setFilterStock(e.target.value)} className="text-xs border border-gray-200 bg-white px-2 py-1.5 outline-none focus:border-[#3373AB]">
            <option value="">All Stock</option>
            <option value="in">In Stock (&gt;0)</option>
            <option value="low">Low Stock (1-10)</option>
            <option value="out">Out of Stock</option>
          </select>
          {(filterCat || filterMinPrice || filterMaxPrice || filterStock) && (
            <button onClick={() => { setFilterCat(''); setFilterMinPrice(''); setFilterMaxPrice(''); setFilterStock(''); }} className="text-xs text-gray-500 hover:text-red-500 ml-auto outline-none">Clear Filters</button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">No products found</p>
          </div>
        ) : (
          <>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2.5 w-10">
                    <input type="checkbox" checked={allPageSelected} onChange={toggleSelectAll} className="accent-[#3373AB] cursor-pointer" />
                  </th>
                  {['Image', 'ID', 'Name', 'Category', 'Price', 'Stock', 'Vendor', 'Rating', 'Actions'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((p: Product) => {
                  const isSelected = selectedIds.has(p.id);
                  return (
                    <tr key={p.id} className={`transition-colors ${isSelected ? 'bg-[#3373AB]/5' : 'hover:bg-gray-50'}`}>
                      <td className="px-3 py-2.5">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(p.id)} className="accent-[#3373AB] cursor-pointer" />
                      </td>
                      <td className="px-3 py-2">
                        <img src={p.image} alt={p.name} className="h-8 w-8 rounded object-cover border border-gray-200 bg-gray-50" />
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs text-gray-400">{p.id}</td>
                      <td className="px-3 py-2.5 font-medium text-gray-900 max-w-[180px] truncate" title={p.name}>{p.name}</td>
                      <td className="px-3 py-2.5"><span className="bg-gray-100 text-gray-600 px-1.5 py-[2px] text-xs font-medium whitespace-nowrap">{p.category}</span></td>
                      <td className="px-3 py-2.5 font-mono font-semibold text-gray-900 whitespace-nowrap">RWF {p.price.toFixed(2)}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-xs font-mono font-semibold px-1.5 py-[2px] whitespace-nowrap ${p.stock > 10 ? 'bg-emerald-50 text-emerald-700' : p.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{p.stock}</span>
                      </td>
                      <td className="px-3 py-2.5 text-gray-500 max-w-[120px] truncate" title={p.vendorName}>{p.vendorName}</td>
                      <td className="px-3 py-2.5">
                        <span className="flex items-center gap-1 text-amber-500 text-xs whitespace-nowrap">
                          <Star size={9} fill="currentColor" /> {p.rating}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-[2px]">
                          <button onClick={() => openEdit(p)} className="p-1 text-gray-400 hover:text-[#3373AB] hover:bg-blue-50 outline-none rounded" title="Edit"><Edit3 size={12} /></button>
                          <button onClick={() => handleDelete(p.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 outline-none rounded" title="Delete"><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </>
        )}
      </TableWrapper>

      {showForm && (
        <Modal onClose={handleCloseAttempt} title={editProduct ? 'Edit Product' : 'Add New Product'}>
          <div className="pt-8 pb-4 px-2">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Product Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter product name" className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all" required />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all bg-white" required>
                  <option value="" disabled>-- select category --</option>
                  {categories.map((c: Category) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              {/* Price & Stock row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Price (RWF)</label>
                  <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">In Stock Qty</label>
                  <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all" />
                </div>
              </div>

              {/* Vendor */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Vendor</label>
                <input value={form.vendorName} onChange={e => setForm({ ...form, vendorName: e.target.value })} placeholder="Vendor name" className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the product in detail" className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all resize-vertical" />
              </div>

              {/* Table of Specification */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Specifications</label>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={addSpecCol} className="text-xs font-semibold text-[#3373AB] border border-[#3373AB]/30 px-2 py-0.5 hover:bg-[#3373AB]/5 transition-all">+ Column</button>
                    <button type="button" onClick={addSpecRow} className="text-xs font-semibold text-[#3373AB] border border-[#3373AB]/30 px-2 py-0.5 hover:bg-[#3373AB]/5 transition-all">+ Row</button>
                  </div>
                </div>
                <div className="overflow-x-auto border border-gray-200">
                  <table className="w-full text-xs">
                    <tbody>
                      {form.specTable.map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell, ci) => (
                            <td key={ci} className="border border-gray-200 p-0.5">
                              <input value={cell} onChange={e => updateSpecCell(ri, ci, e.target.value)} placeholder={`${ri === 0 ? 'Header' : 'Value'} ${ci + 1}`} className="w-full px-1.5 py-1 text-xs outline-none focus:bg-blue-50" />
                            </td>
                          ))}
                          <td className="border border-gray-200 p-0.5 w-6">
                            <button type="button" onClick={() => removeSpecRow(ri)} className="text-gray-300 hover:text-red-500 outline-none p-0.5" title="Remove row"><X size={10} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(form.specTable[0]?.length || 0) > 1 && (
                  <button type="button" onClick={() => removeSpecCol(form.specTable[0].length - 1)} className="text-xs text-red-400 hover:text-red-600 mt-1 outline-none">Remove last column</button>
                )}
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">YouTube Video URL <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                <input value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all font-mono text-xs" />
              </div>

              {/* Guide Book / Documentation */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Guide Book / Documentation Link <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                <input value={form.guideBook} onChange={e => setForm({ ...form, guideBook: e.target.value })} placeholder="https://link-to-guide-or-documentation" className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all font-mono text-xs" />
              </div>

              {/* Where to use */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Where It Will Be Used</label>
                <textarea value={form.whereToUse} onChange={e => setForm({ ...form, whereToUse: e.target.value })} rows={2} placeholder="Describe where this product is typically used" className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all resize-vertical" />
              </div>

              {/* Product Images */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Product Images</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input value={form.mainImageUrl} onChange={e => setForm({ ...form, mainImageUrl: e.target.value })} placeholder="Paste image URL..." className="flex-1 border border-gray-300 px-3 py-2 text-xs outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all font-mono" />
                    <button type="button" onClick={addImageUrl} className="bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-semibold px-3 py-2 outline-none whitespace-nowrap">Add URL</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-mono">or</span>
                    <div className="flex gap-2">
                      <input type="file" id="prod-img-upload" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      <button type="button" onClick={() => document.getElementById('prod-img-upload')?.click()} className="text-xs font-semibold text-[#3373AB] border border-[#3373AB]/30 px-3 py-1.5 hover:bg-[#3373AB]/5 transition-all">Upload from Device</button>
                      <input type="file" id="prod-img-camera" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                      <button type="button" onClick={() => document.getElementById('prod-img-camera')?.click()} className="text-xs font-semibold text-[#3373AB] border border-[#3373AB]/30 px-3 py-1.5 hover:bg-[#3373AB]/5 transition-all">Take Photo</button>
                    </div>
                  </div>
                </div>
                {form.images.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 font-semibold mb-1.5">{form.images.length} image(s) added</div>
                    <div className="flex flex-wrap gap-2">
                      {form.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Product ${idx + 1}`} className="h-14 w-14 object-cover border border-gray-200 rounded" onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/56?text=Error'; }} />
                          <button type="button" onClick={() => removeImage(idx)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity outline-none shadow" title="Remove"><X size={10} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex items-center justify-center gap-3 pt-5 border-t border-gray-200">
                <button type="button" onClick={handleCloseAttempt} className="border border-gray-300 text-gray-600 px-6 py-2 text-sm font-semibold outline-none hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-8 py-2 text-sm font-bold outline-none tracking-wide transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  {editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Close confirmation dialog */}
      {showCloseConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85" onClick={() => setShowCloseConfirm(false)} />
          <div className="relative bg-white border border-gray-200 shadow-2xl w-full max-w-sm p-5">
            <div className="text-center">
              <div className="mx-auto w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Discard Changes?</h3>
              <p className="text-xs text-gray-500 mb-4">Are you sure you don't want to add this product? Any unsaved data will be lost.</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setShowCloseConfirm(false)} className="border border-gray-300 text-gray-600 px-4 py-1.5 text-xs font-semibold outline-none hover:bg-gray-50">Keep Editing</button>
                <button onClick={confirmClose} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 text-xs font-bold outline-none">Discard</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────── ORDERS SECTION ─────── */
function OrdersSection({ orders, setOrders, searchQuery, notify }: any) {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const nextStatus: Record<string, string> = {
    pending: 'processing',
    processing: 'shipped',
    shipped: 'delivered',
  };

  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState('');
  const perPage = 15;

  const advanceOrder = async (id: string) => {
    const order = orders.find((o: Order) => o.id === id);
    if (!order) return;
    const next = nextStatus[order.status];
    if (!next) return;
    try {
      await updateOrderStatus(id, next);
      setOrders(orders.map((o: Order) => {
        if (o.id !== id) return o;
        return { ...o, status: next as Order['status'], tracking: next === 'shipped' ? `TRK-${Math.floor(1000 + Math.random() * 9000)}${id.slice(-1)}` : o.tracking, eta: next === 'delivered' ? 'Delivered' : next === 'shipped' ? 'In Transit' : o.eta };
      }));
      notify('success', `Order ${id} status advanced.`);
    } catch {
      notify('error', 'Failed to update order status.');
    }
  };

  const cancelOrder = async (id: string) => {
    try {
      await updateOrderStatus(id, 'cancelled');
      setOrders(orders.map((o: Order) => o.id === id ? { ...o, status: 'cancelled' as const, eta: 'Cancelled' } : o));
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      notify('success', `Order ${id} cancelled.`);
    } catch {
      notify('error', 'Failed to cancel order.');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const toggleSelectAll = () => {
    const ids = paginated.map((o: Order) => o.id);
    const all = ids.every(id => selectedIds.has(id));
    setSelectedIds(prev => { const n = new Set(prev); if (all) ids.forEach(id => n.delete(id)); else ids.forEach(id => n.add(id)); return n; });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkCancel = async () => {
    if (selectedIds.size === 0) return;
    try {
      const toCancel = orders.filter((o: Order) => selectedIds.has(o.id) && o.status !== 'delivered' && o.status !== 'cancelled');
      await Promise.all(toCancel.map((o: Order) => updateOrderStatus(o.id, 'cancelled')));
      setOrders(orders.map((o: Order) => selectedIds.has(o.id) && o.status !== 'delivered' && o.status !== 'cancelled' ? { ...o, status: 'cancelled' as const, eta: 'Cancelled' } : o));
      notify('success', `${selectedIds.size} order(s) cancelled.`);
      clearSelection();
    } catch {
      notify('error', 'Failed to cancel some orders.');
    }
  };

  const filtered = orders.filter((o: Order) => {
    if (searchQuery && !o.id.toLowerCase().includes(searchQuery.toLowerCase()) && !o.customer.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus && o.status !== filterStatus) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const allPageSelected = paginated.length > 0 && paginated.every(o => selectedIds.has(o.id));

  return (
    <div>
      <TableWrapper title="Order Management & Delivery Tracking" totalItems={filtered.length}>
        {/* Bulk action bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-[#3373AB]/5 border-b border-[#3373AB]/20">
            <span className="text-xs font-semibold text-[#3373AB]">{selectedIds.size} selected</span>
            <div className="flex items-center gap-1.5 ml-auto">
              <button onClick={clearSelection} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 outline-none">Clear</button>
              <button onClick={handleBulkCancel} className="flex items-center gap-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 outline-none rounded">
                <X size={11} /> Cancel Selected
              </button>
            </div>
          </div>
        )}

        {/* Status filter */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50/50">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-xs border border-gray-200 bg-white px-2 py-1.5 outline-none focus:border-[#3373AB]">
            <option value="">All Statuses</option>
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          {filterStatus && (
            <button onClick={() => setFilterStatus('')} className="text-xs text-gray-500 hover:text-red-500 ml-auto outline-none">Clear</button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">No orders found</p>
          </div>
        ) : (
          <>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2.5 w-10"><input type="checkbox" checked={allPageSelected} onChange={toggleSelectAll} className="accent-[#3373AB] cursor-pointer" /></th>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Tracking', 'ETA', 'Actions'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-semibold text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((o: Order) => {
                  const isSelected = selectedIds.has(o.id);
                  return (
                    <tr key={o.id} className={`transition-colors ${isSelected ? 'bg-[#3373AB]/5' : 'hover:bg-gray-50'}`}>
                      <td className="px-3 py-2.5"><input type="checkbox" checked={isSelected} onChange={() => toggleSelect(o.id)} className="accent-[#3373AB] cursor-pointer" /></td>
                      <td className="px-3 py-2.5 font-mono font-semibold text-[#3373AB]">{o.id}</td>
                      <td className="px-3 py-2.5 font-medium text-gray-900">{o.customer}</td>
                      <td className="px-3 py-2.5 text-gray-500 max-w-[180px] truncate">{o.items}</td>
                      <td className="px-3 py-2.5 font-mono font-semibold text-gray-900">RWF {o.total.toFixed(2)}</td>
                      <td className="px-3 py-2.5">{statusBadge(o.status, statusColors)}</td>
                      <td className="px-3 py-2.5 font-mono text-gray-500 text-xs">{o.tracking}</td>
                      <td className="px-3 py-2.5 text-gray-500">{o.eta}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-[2px]">
                          {o.status !== 'delivered' && o.status !== 'cancelled' && (
                            <button onClick={() => advanceOrder(o.id)} className="p-1 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 outline-none rounded" title="Advance Status"><ChevronRight size={12} /></button>
                          )}
                          {o.status !== 'delivered' && o.status !== 'cancelled' && (
                            <button onClick={() => cancelOrder(o.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 outline-none rounded" title="Cancel Order"><X size={12} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </>
        )}
      </TableWrapper>
    </div>
  );
}

/* ─────── COURSES SECTION ─────── */
function CoursesSection({ courses, setCourses, searchQuery, notify }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [form, setForm] = useState({ title: '', category: 'Embedded Systems', instructor: '', duration: '', price: '', level: 'Beginner' as Course['level'], images: [] as string[], mainImageUrl: '' });
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const perPage = 15;

  const openAdd = () => {
    setEditCourse(null);
    setForm({ title: '', category: 'Embedded Systems', instructor: '', duration: '', price: '', level: 'Beginner', images: [], mainImageUrl: '' });
    setShowForm(true);
  };

  const openEdit = (c: Course) => {
    setEditCourse(c);
    setForm({ title: c.title, category: c.category, instructor: c.instructor, duration: c.duration, price: String(c.price), level: c.level, images: c.images || [], mainImageUrl: '' });
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setForm({ ...form, images: [...form.images, ev.target.result as string] });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addImageUrl = () => {
    if (!form.mainImageUrl.trim()) return;
    setForm({ ...form, images: [...form.images, form.mainImageUrl.trim()], mainImageUrl: '' });
  };

  const removeImage = (idx: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    const finalImages = form.images.length > 0 ? form.images : ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60'];
    const payload = { title: form.title, category: form.category, instructor: form.instructor, duration: form.duration, price: parseFloat(form.price), level: form.level, images: finalImages, image: finalImages[0] };
    if (editCourse) {
      try {
        await updateCourse(editCourse.id, payload);
        setCourses(courses.map((c: Course) => c.id === editCourse.id ? { ...c, ...payload } : c));
        notify('success', `Course "${form.title}" updated.`);
      } catch {
        notify('error', 'Failed to update course.');
      }
    } else {
      try {
        const created = await createCourse(payload);
        const newC: Course = { id: created.id, ...payload, rating: 0, studentsCount: 0, syllabus: [], certified: false };
        setCourses([newC, ...courses]);
        notify('success', `Course "${form.title}" added.`);
      } catch {
        notify('error', 'Failed to create course.');
      }
    }
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    try { await deleteCourse(id); } catch { /* ignore */ }
    setCourses(courses.filter((c: Course) => c.id !== id));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    notify('success', 'Course removed.');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const toggleSelectAll = () => {
    const ids = paginated.map((c: Course) => c.id);
    const all = ids.every(id => selectedIds.has(id));
    setSelectedIds(prev => { const n = new Set(prev); if (all) ids.forEach(id => n.delete(id)); else ids.forEach(id => n.add(id)); return n; });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    try { await Promise.all(Array.from(selectedIds).map(id => deleteCourse(id))); } catch { /* ignore */ }
    setCourses(courses.filter((c: Course) => !selectedIds.has(c.id)));
    notify('success', `${selectedIds.size} course(s) removed.`);
    clearSelection();
  };

  const filtered = courses.filter((c: Course) =>
    !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const allPageSelected = paginated.length > 0 && paginated.every((c: Course) => selectedIds.has(c.id));

  return (
    <div>
      <TableWrapper title="Course Catalog" onAdd={openAdd} totalItems={filtered.length}>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-[#3373AB]/5 border-b border-[#3373AB]/20">
            <span className="text-xs font-semibold text-[#3373AB]">{selectedIds.size} selected</span>
            <div className="flex items-center gap-1.5 ml-auto">
              <button onClick={clearSelection} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 outline-none">Clear</button>
              <button onClick={handleBulkDelete} className="flex items-center gap-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 outline-none rounded">
                <Trash2 size={11} /> Delete Selected
              </button>
            </div>
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">No courses found</p>
          </div>
        ) : (
          <>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2.5 w-10"><input type="checkbox" checked={allPageSelected} onChange={toggleSelectAll} className="accent-[#3373AB] cursor-pointer" /></th>
                  {['Title', 'Category', 'Instructor', 'Duration', 'Price', 'Level', 'Students', 'Actions'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-semibold text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((c: Course) => {
                  const isSelected = selectedIds.has(c.id);
                  return (
                  <tr key={c.id} className={`transition-colors ${isSelected ? 'bg-[#3373AB]/5' : 'hover:bg-gray-50'}`}>
                    <td className="px-3 py-2.5"><input type="checkbox" checked={isSelected} onChange={() => toggleSelect(c.id)} className="accent-[#3373AB] cursor-pointer" /></td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{c.title}</td>
                    <td className="px-3 py-2.5"><span className="bg-gray-100 text-gray-600 px-1.5 py-[2px] text-xs font-medium">{c.category}</span></td>
                    <td className="px-3 py-2.5 text-gray-500">{c.instructor}</td>
                    <td className="px-3 py-2.5 text-gray-500">{c.duration}</td>
                    <td className="px-3 py-2.5 font-mono font-semibold text-gray-900">RWF {c.price.toFixed(2)}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs font-semibold px-1.5 py-[2px] ${c.level === 'Beginner' ? 'bg-emerald-50 text-emerald-700' : c.level === 'Intermediate' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{c.level}</span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-gray-500">{c.studentsCount}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-[2px]">
                        <button onClick={() => openEdit(c)} className="p-1 text-gray-400 hover:text-[#3373AB] hover:bg-blue-50 outline-none"><Edit3 size={12} /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 outline-none"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </>
        )}
      </TableWrapper>

      {showForm && (
        <Modal onClose={() => setShowForm(false)} title={editCourse ? 'Edit Course' : 'Add New Course'}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB] bg-white">
                  {['Embedded Systems', 'Networking', 'AI', 'Cybersecurity'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Level</label>
                <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value as Course['level'] })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB] bg-white">
                  {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Instructor</label>
                <input value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Duration</label>
                <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 40 Hours" className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Price (RWF)</label>
                <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Course Images</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input value={form.mainImageUrl} onChange={e => setForm({ ...form, mainImageUrl: e.target.value })} placeholder="Paste image URL..." className="flex-1 border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB] font-mono" />
                    <button type="button" onClick={addImageUrl} className="bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-semibold px-3 py-2 outline-none whitespace-nowrap">Add URL</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-mono">or</span>
                    <div className="flex gap-2">
                      <input type="file" id="course-img-upload" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      <button type="button" onClick={() => document.getElementById('course-img-upload')?.click()} className="text-xs font-semibold text-[#3373AB] border border-[#3373AB]/30 px-3 py-1.5 hover:bg-[#3373AB]/5 transition-all">Upload from Device</button>
                      <input type="file" id="course-img-camera" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                      <button type="button" onClick={() => document.getElementById('course-img-camera')?.click()} className="text-xs font-semibold text-[#3373AB] border border-[#3373AB]/30 px-3 py-1.5 hover:bg-[#3373AB]/5 transition-all">Take Photo</button>
                    </div>
                  </div>
                </div>
                {form.images.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 font-semibold mb-1">{form.images.length} image(s) added</div>
                    <div className="flex flex-wrap gap-2">
                      {form.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Course ${idx + 1}`} className="h-14 w-14 object-cover border border-gray-200" onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/56?text=Error'; }} />
                          <button type="button" onClick={() => removeImage(idx)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity outline-none shadow" title="Remove"><X size={10} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 px-4 py-1.5 text-xs font-semibold outline-none hover:bg-gray-50">Cancel</button>
              <button type="submit" className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-5 py-1.5 text-xs font-bold outline-none">
                {editCourse ? 'Update Course' : 'Add Course'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ─────── CERTIFICATES SECTION ─────── */
function CertificatesSection({ certificates, setCertificates, searchQuery, notify }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editCert, setEditCert] = useState<Certificate | null>(null);
  const [form, setForm] = useState({ title: '', recipient: '', issueDate: '', expiryDate: '' });
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const perPage = 15;

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700',
    expired: 'bg-red-50 text-red-700',
    revoked: 'bg-gray-100 text-gray-600',
  };

  const openAdd = () => {
    setEditCert(null);
    setForm({ title: '', recipient: '', issueDate: '', expiryDate: '' });
    setShowForm(true);
  };

  const openEdit = (c: Certificate) => {
    setEditCert(c);
    setForm({ title: c.title, recipient: c.recipient, issueDate: c.issueDate, expiryDate: c.expiryDate });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.recipient) return;
    if (editCert) {
      setCertificates(certificates.map((c: Certificate) => c.id === editCert.id ? { ...c, title: form.title, recipient: form.recipient, issueDate: form.issueDate, expiryDate: form.expiryDate } : c));
      notify('success', `Certificate "${form.title}" updated.`);
    } else {
      try {
        const payload = { title: form.title, recipient: form.recipient, issueDate: form.issueDate || new Date().toISOString().slice(0, 10), expiryDate: form.expiryDate || '' };
        const created = await createCertificate(payload);
        const newC: Certificate = { id: created.id, ...payload, status: 'active' };
        setCertificates([newC, ...certificates]);
        notify('success', `Certificate issued to ${form.recipient}.`);
      } catch {
        notify('error', 'Failed to issue certificate.');
      }
    }
    setShowForm(false);
  };

  const toggleStatus = (id: string) => {
    setCertificates(certificates.map((c: Certificate) => c.id === id ? { ...c, status: c.status === 'active' ? 'revoked' as const : 'active' as const } : c));
  };

  const handleDelete = async (id: string) => {
    try { await deleteCertificate(id); } catch { /* ignore */ }
    setCertificates(certificates.filter((c: Certificate) => c.id !== id));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    notify('success', 'Certificate removed.');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const toggleSelectAll = () => {
    const ids = paginated.map((c: Certificate) => c.id);
    const all = ids.every(id => selectedIds.has(id));
    setSelectedIds(prev => { const n = new Set(prev); if (all) ids.forEach(id => n.delete(id)); else ids.forEach(id => n.add(id)); return n; });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    try { await Promise.all(Array.from(selectedIds).map(id => deleteCertificate(id))); } catch { /* ignore */ }
    setCertificates(certificates.filter((c: Certificate) => !selectedIds.has(c.id)));
    notify('success', `${selectedIds.size} certificate(s) removed.`);
    clearSelection();
  };

  const filtered = certificates.filter((c: Certificate) =>
    !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.recipient.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const allPageSelected = paginated.length > 0 && paginated.every((c: Certificate) => selectedIds.has(c.id));

  return (
    <div>
      <TableWrapper title="Certificate Management" onAdd={openAdd} totalItems={filtered.length}>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-[#3373AB]/5 border-b border-[#3373AB]/20">
            <span className="text-xs font-semibold text-[#3373AB]">{selectedIds.size} selected</span>
            <div className="flex items-center gap-1.5 ml-auto">
              <button onClick={clearSelection} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 outline-none">Clear</button>
              <button onClick={handleBulkDelete} className="flex items-center gap-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 outline-none rounded">
                <Trash2 size={11} /> Delete Selected
              </button>
            </div>
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">No certificates found</p>
          </div>
        ) : (
          <>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2.5 w-10"><input type="checkbox" checked={allPageSelected} onChange={toggleSelectAll} className="accent-[#3373AB] cursor-pointer" /></th>
                  {['ID', 'Title', 'Recipient', 'Issue Date', 'Expiry Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-semibold text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((c: Certificate) => {
                  const isSelected = selectedIds.has(c.id);
                  return (
                  <tr key={c.id} className={`transition-colors ${isSelected ? 'bg-[#3373AB]/5' : 'hover:bg-gray-50'}`}>
                    <td className="px-3 py-2.5"><input type="checkbox" checked={isSelected} onChange={() => toggleSelect(c.id)} className="accent-[#3373AB] cursor-pointer" /></td>
                    <td className="px-3 py-2.5 font-mono text-[#3373AB] font-semibold">{c.id}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{c.title}</td>
                    <td className="px-3 py-2.5 flex items-center gap-1.5 text-gray-500">
                      <div className="h-5 w-5 bg-gray-100 flex items-center justify-center text-[14px] font-bold text-gray-500">{c.recipient.charAt(0)}</div>
                      {c.recipient}
                    </td>
                    <td className="px-3 py-2.5 text-gray-500">{c.issueDate}</td>
                    <td className="px-3 py-2.5 text-gray-500">{c.expiryDate || '—'}</td>
                    <td className="px-3 py-2.5">{statusBadge(c.status, statusColors)}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-[2px]">
                        <button onClick={() => openEdit(c)} className="p-1 text-gray-400 hover:text-[#3373AB] hover:bg-blue-50 outline-none"><Edit3 size={12} /></button>
                        <button onClick={() => toggleStatus(c.id)} className={`p-1 outline-none ${c.status === 'active' ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50'}`}>
                          {c.status === 'active' ? <X size={12} /> : <RefreshCw size={12} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </>
        )}
      </TableWrapper>

      {showForm && (
        <Modal onClose={() => setShowForm(false)} title={editCert ? 'Edit Certificate' : 'Issue New Certificate'}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Certificate Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Recipient</label>
                <input value={form.recipient} onChange={e => setForm({ ...form, recipient: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Issue Date</label>
                <input type="date" value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Expiry Date</label>
                <input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 px-4 py-1.5 text-xs font-semibold outline-none hover:bg-gray-50">Cancel</button>
              <button type="submit" className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-5 py-1.5 text-xs font-bold outline-none">
                {editCert ? 'Update Certificate' : 'Issue Certificate'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ─────── CATEGORIES SECTION ─────── */
function CategoriesSection({ categories, setCategories, searchQuery, notify }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', thumbnail: '', description: '', slug: '' });
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const perPage = 15;

  const openAdd = () => {
    setEditCat(null);
    setForm({ name: '', thumbnail: '', description: '', slug: '' });
    setShowForm(true);
  };

  const openEdit = (c: Category) => {
    setEditCat(c);
    setForm({ name: c.name, thumbnail: c.thumbnail, description: c.description, slug: c.slug });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) return;
    const payload = { name: form.name, thumbnail: form.thumbnail, description: form.description, slug: form.slug.toLowerCase().replace(/\s+/g, '-') };
    if (editCat) {
      try {
        await updateCategory(editCat.id, payload);
        setCategories(categories.map((c: Category) => c.id === editCat.id ? { ...c, ...payload } : c));
        notify('success', `Category "${form.name}" updated.`);
      } catch {
        notify('error', 'Failed to update category.');
      }
    } else {
      try {
        const created = await createCategory(payload);
        const newC: Category = { id: created.id, ...payload, thumbnail: form.thumbnail || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=60' };
        setCategories([newC, ...categories]);
        notify('success', `Category "${form.name}" added.`);
      } catch {
        notify('error', 'Failed to create category.');
      }
    }
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    try { await deleteCategory(id); } catch { /* ignore */ }
    setCategories(categories.filter((c: Category) => c.id !== id));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    notify('success', 'Category removed.');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const toggleSelectAll = () => {
    const ids = paginated.map((c: Category) => c.id);
    const all = ids.every(id => selectedIds.has(id));
    setSelectedIds(prev => { const n = new Set(prev); if (all) ids.forEach(id => n.delete(id)); else ids.forEach(id => n.add(id)); return n; });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    try { await Promise.all(Array.from(selectedIds).map(id => deleteCategory(id))); } catch { /* ignore */ }
    setCategories(categories.filter((c: Category) => !selectedIds.has(c.id)));
    notify('success', `${selectedIds.size} category(s) removed.`);
    clearSelection();
  };

  const filtered = categories.filter((c: Category) =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const allPageSelected = paginated.length > 0 && paginated.every((c: Category) => selectedIds.has(c.id));

  return (
    <div>
      <TableWrapper title="Category Management" onAdd={openAdd} totalItems={filtered.length}>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-[#3373AB]/5 border-b border-[#3373AB]/20">
            <span className="text-xs font-semibold text-[#3373AB]">{selectedIds.size} selected</span>
            <div className="flex items-center gap-1.5 ml-auto">
              <button onClick={clearSelection} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 outline-none">Clear</button>
              <button onClick={handleBulkDelete} className="flex items-center gap-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 outline-none rounded">
                <Trash2 size={11} /> Delete Selected
              </button>
            </div>
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">No categories found</p>
          </div>
        ) : (
          <>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2.5 w-10"><input type="checkbox" checked={allPageSelected} onChange={toggleSelectAll} className="accent-[#3373AB] cursor-pointer" /></th>
                  {['Thumbnail', 'Name', 'Slug', 'Description', 'Actions'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-semibold text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((c: Category) => {
                  const isSelected = selectedIds.has(c.id);
                  return (
                  <tr key={c.id} className={`transition-colors ${isSelected ? 'bg-[#3373AB]/5' : 'hover:bg-gray-50'}`}>
                    <td className="px-3 py-2.5"><input type="checkbox" checked={isSelected} onChange={() => toggleSelect(c.id)} className="accent-[#3373AB] cursor-pointer" /></td>
                    <td className="px-3 py-2.5">
                      <div className="h-8 w-8 bg-gray-100 overflow-hidden">
                        <img src={c.thumbnail} alt={c.name} className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{c.name}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-gray-500">{c.slug}</td>
                    <td className="px-3 py-2.5 text-gray-500 max-w-[200px] truncate">{c.description}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-[2px]">
                        <button onClick={() => openEdit(c)} className="p-1 text-gray-400 hover:text-[#3373AB] hover:bg-blue-50 outline-none"><Edit3 size={12} /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 outline-none"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </>
        )}
      </TableWrapper>

      {showForm && (
        <Modal onClose={() => setShowForm(false)} title={editCat ? 'Edit Category' : 'Add New Category'}>
          <form onSubmit={handleSubmit} className="space-y-5 pt-4">
            {/* Thumbnail preview */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-20 w-20 bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center rounded">
                {form.thumbnail ? (
                  <img src={form.thumbnail} alt="preview" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                )}
              </div>
              <span className="text-xs text-gray-400 font-mono">Thumbnail Preview</span>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. IoT Devices" className="w-full border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all rounded" required />
              </div>

              {/* Thumbnail: URL + File Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Thumbnail</label>
                <div className="space-y-2">
                  <input value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} placeholder="Paste image URL..." className="w-full border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all font-mono text-xs rounded" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-mono">or</span>
                    <input type="file" id="cat-thumb-upload" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => { if (ev.target?.result) setForm({ ...form, thumbnail: ev.target.result as string }); }; reader.readAsDataURL(file); } }} />
                    <button type="button" onClick={() => document.getElementById('cat-thumb-upload')?.click()} className="text-xs font-semibold text-[#3373AB] border border-[#3373AB]/30 px-3 py-1.5 hover:bg-[#3373AB]/5 transition-all rounded">
                      Upload from Device
                    </button>
                  </div>
                </div>
              </div>

              {/* Slug + Description */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Slug</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="iot-devices" className="w-full border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all font-mono rounded" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                  <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." className="w-full border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all rounded" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-5 border-t border-gray-100">
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 px-5 py-2 text-xs font-semibold outline-none hover:bg-gray-50 transition-all rounded">Cancel</button>
              <button type="submit" className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-6 py-2 text-xs font-bold outline-none tracking-wide transition-all rounded">
                {editCat ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ─────── ADS SECTION ─────── */
function AdsSection({ ads, setAds, searchQuery, notify }: any) {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700',
    approved: 'bg-blue-50 text-blue-700',
    rejected: 'bg-red-50 text-red-700',
    active: 'bg-emerald-50 text-emerald-700',
    completed: 'bg-gray-100 text-gray-600',
  };
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const perPage = 15;

  const approveAd = async (id: string) => {
    try {
      const ad = ads.find((a: AdRequest) => a.id === id);
      const newStatus = ad?.status === 'pending' ? 'approved' : 'active';
      await updateAdStatus(id, newStatus);
      setAds(ads.map((a: AdRequest) => a.id === id ? { ...a, status: newStatus } : a));
      notify('success', `Ad request ${id} approved.`);
    } catch {
      notify('error', 'Failed to approve ad.');
    }
  };

  const rejectAd = async (id: string) => {
    try {
      await updateAdStatus(id, 'rejected');
      setAds(ads.map((a: AdRequest) => a.id === id ? { ...a, status: 'rejected' as const } : a));
      notify('success', `Ad request ${id} rejected.`);
    } catch {
      notify('error', 'Failed to reject ad.');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const toggleSelectAll = () => {
    const ids = paginated.map((a: AdRequest) => a.id);
    const all = ids.every(id => selectedIds.has(id));
    setSelectedIds(prev => { const n = new Set(prev); if (all) ids.forEach(id => n.delete(id)); else ids.forEach(id => n.add(id)); return n; });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setAds(ads.filter((a: AdRequest) => !selectedIds.has(a.id)));
    notify('success', `${selectedIds.size} item(s) removed.`);
    clearSelection();
  };

  const filtered = ads.filter((a: AdRequest) =>
    !searchQuery || a.company.toLowerCase().includes(searchQuery.toLowerCase()) || a.campaign.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const allPageSelected = paginated.length > 0 && paginated.every((a: AdRequest) => selectedIds.has(a.id));

  return (
    <div>
      <TableWrapper title="Advertising Requests" totalItems={filtered.length}>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-[#3373AB]/5 border-b border-[#3373AB]/20">
            <span className="text-xs font-semibold text-[#3373AB]">{selectedIds.size} selected</span>
            <div className="flex items-center gap-1.5 ml-auto">
              <button onClick={clearSelection} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 outline-none">Clear</button>
              <button onClick={handleBulkDelete} className="flex items-center gap-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 outline-none rounded">
                <Trash2 size={11} /> Delete Selected
              </button>
            </div>
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">No ad requests found</p>
          </div>
        ) : (
          <>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2.5 w-10"><input type="checkbox" checked={allPageSelected} onChange={toggleSelectAll} className="accent-[#3373AB] cursor-pointer" /></th>
                  {['ID', 'Company', 'Campaign', 'Placement', 'Budget', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-semibold text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((a: AdRequest) => {
                  const isSelected = selectedIds.has(a.id);
                  return (
                  <tr key={a.id} className={`transition-colors ${isSelected ? 'bg-[#3373AB]/5' : 'hover:bg-gray-50'}`}>
                    <td className="px-3 py-2.5"><input type="checkbox" checked={isSelected} onChange={() => toggleSelect(a.id)} className="accent-[#3373AB] cursor-pointer" /></td>
                    <td className="px-3 py-2.5 font-mono font-semibold text-[#3373AB]">{a.id}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{a.company}</td>
                    <td className="px-3 py-2.5 text-gray-500">{a.campaign}</td>
                    <td className="px-3 py-2.5"><span className="bg-gray-100 text-gray-600 px-1.5 py-[2px] text-xs font-medium">{a.placement}</span></td>
                    <td className="px-3 py-2.5 font-mono font-semibold text-gray-900">RWF {a.budget.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-gray-500">{a.date}</td>
                    <td className="px-3 py-2.5">{statusBadge(a.status, statusColors)}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-[2px]">
                        {(a.status === 'pending' || a.status === 'approved') && (
                          <button onClick={() => approveAd(a.id)} className="p-1 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 outline-none" title="Approve"><Check size={12} /></button>
                        )}
                        {(a.status === 'pending' || a.status === 'approved') && (
                          <button onClick={() => rejectAd(a.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 outline-none" title="Reject"><X size={12} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </>
        )}
      </TableWrapper>
    </div>
  );
}

/* ─────── TV / BROADCAST SECTION ─────── */
function TVSection({ broadcasts, setBroadcasts, searchQuery, notify }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editBroadcast, setEditBroadcast] = useState<Broadcast | null>(null);
  const [form, setForm] = useState({ title: '', category: 'Live Events', host: '', description: '' });
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const perPage = 15;

  const typeColors: Record<string, string> = {
    live: 'bg-red-50 text-red-700',
    webinar: 'bg-blue-50 text-blue-700',
    podcast: 'bg-purple-50 text-purple-700',
    tutorial: 'bg-cyan-50 text-cyan-700',
  };

  const openAdd = () => {
    setEditBroadcast(null);
    setForm({ title: '', category: 'Live Events', host: '', description: '' });
    setShowForm(true);
  };

  const openEdit = (b: Broadcast) => {
    setEditBroadcast(b);
    setForm({ title: b.title, category: b.category, host: b.host, description: b.description });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    const payload = { title: form.title, category: form.category, host: form.host, description: form.description };
    if (editBroadcast) {
      try {
        await updateVideo(editBroadcast.id, payload);
        setBroadcasts(broadcasts.map((b: Broadcast) => b.id === editBroadcast.id ? { ...b, ...payload } : b));
        notify('success', `Broadcast "${form.title}" updated.`);
      } catch {
        notify('error', 'Failed to update broadcast.');
      }
    } else {
      try {
        const created = await createVideo(payload);
        const newB: Broadcast = { id: created.id, ...payload, type: 'live', host: form.host, views: 0, thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&auto=format&fit=crop&q=60' };
        setBroadcasts([newB, ...broadcasts]);
        notify('success', `Broadcast "${form.title}" added.`);
      } catch {
        notify('error', 'Failed to create broadcast.');
      }
    }
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    try { await deleteVideo(id); } catch { /* ignore */ }
    setBroadcasts(broadcasts.filter((b: Broadcast) => b.id !== id));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    notify('success', 'Broadcast removed.');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const toggleSelectAll = () => {
    const ids = paginated.map((b: Broadcast) => b.id);
    const all = ids.every(id => selectedIds.has(id));
    setSelectedIds(prev => { const n = new Set(prev); if (all) ids.forEach(id => n.delete(id)); else ids.forEach(id => n.add(id)); return n; });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    try { await Promise.all(Array.from(selectedIds).map(id => deleteVideo(id))); } catch { /* ignore */ }
    setBroadcasts(broadcasts.filter((b: Broadcast) => !selectedIds.has(b.id)));
    notify('success', `${selectedIds.size} broadcast(s) removed.`);
    clearSelection();
  };

  const filtered = broadcasts.filter((b: Broadcast) =>
    !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const allPageSelected = paginated.length > 0 && paginated.every((b: Broadcast) => selectedIds.has(b.id));

  return (
    <div>
      <TableWrapper title="MTTV Broadcast Management" onAdd={openAdd} totalItems={filtered.length}>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-[#3373AB]/5 border-b border-[#3373AB]/20">
            <span className="text-xs font-semibold text-[#3373AB]">{selectedIds.size} selected</span>
            <div className="flex items-center gap-1.5 ml-auto">
              <button onClick={clearSelection} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 outline-none">Clear</button>
              <button onClick={handleBulkDelete} className="flex items-center gap-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 outline-none rounded">
                <Trash2 size={11} /> Delete Selected
              </button>
            </div>
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">No broadcasts found</p>
          </div>
        ) : (
          <>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2.5 w-10"><input type="checkbox" checked={allPageSelected} onChange={toggleSelectAll} className="accent-[#3373AB] cursor-pointer" /></th>
                  {['Title', 'Type', 'Category', 'Host', 'Views', 'Scheduled', 'Actions'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-semibold text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((b: Broadcast) => {
                  const isSelected = selectedIds.has(b.id);
                  return (
                  <tr key={b.id} className={`transition-colors ${isSelected ? 'bg-[#3373AB]/5' : 'hover:bg-gray-50'}`}>
                    <td className="px-3 py-2.5"><input type="checkbox" checked={isSelected} onChange={() => toggleSelect(b.id)} className="accent-[#3373AB] cursor-pointer" /></td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{b.title}</td>
                    <td className="px-3 py-2.5">{statusBadge(b.type, typeColors)}</td>
                    <td className="px-3 py-2.5"><span className="bg-gray-100 text-gray-600 px-1.5 py-[2px] text-xs font-medium">{b.category}</span></td>
                    <td className="px-3 py-2.5 text-gray-500">{b.host}</td>
                    <td className="px-3 py-2.5 font-mono text-gray-500">{b.views.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-gray-500">{b.scheduledTime || '—'}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-[2px]">
                        <button onClick={() => openEdit(b)} className="p-1 text-gray-400 hover:text-[#3373AB] hover:bg-blue-50 outline-none"><Edit3 size={12} /></button>
                        <button onClick={() => handleDelete(b.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 outline-none"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </>
        )}
      </TableWrapper>

      {showForm && (
        <Modal onClose={() => setShowForm(false)} title={editBroadcast ? 'Edit Broadcast' : 'Add New Broadcast'}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB] bg-white">
                  {['Live Events', 'Webinars', 'Podcasts', 'Tutorials'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Host</label>
                <input value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 px-4 py-1.5 text-xs font-semibold outline-none hover:bg-gray-50">Cancel</button>
              <button type="submit" className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-5 py-1.5 text-xs font-bold outline-none">
                {editBroadcast ? 'Update Broadcast' : 'Add Broadcast'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ─────── SYSTEM REPORT ─────── */
function SystemReportSection({ domain = 'all', stats, products, orders, courses, certificates, categories, ads, broadcasts, rttiData }: any) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportCategory, setReportCategory] = useState('');
  const [reportStatus, setReportStatus] = useState('');
  const [reportSubType, setReportSubType] = useState('all');
  const [generated, setGenerated] = useState(false);

  const domainTitle: Record<string, string> = {
    commerce: 'Commerce Report',
    education: 'Education Report',
    media: 'Media Report',
    all: 'System Report',
  };

  const domainFilter = (p: Product) => {
    if (domain === 'all') return true;
    if (domain === 'commerce') return true;
    return false;
  };

  const domainOrderFilter = (o: Order) => {
    if (domain === 'all') return true;
    if (domain === 'commerce') return true;
    return false;
  };

  const domainCourseFilter = (c: Course) => {
    if (domain === 'all') return true;
    if (domain === 'education') return true;
    return false;
  };

  const domainCertFilter = (c: Certificate) => {
    if (domain === 'all') return true;
    if (domain === 'education') return true;
    return false;
  };

  const domainAdFilter = (a: AdRequest) => {
    if (domain === 'all') return true;
    if (domain === 'media') return true;
    return false;
  };

  const domainBroadcastFilter = (b: Broadcast) => {
    if (domain === 'all') return true;
    if (domain === 'media') return true;
    return false;
  };

  const domainTitleStr = domainTitle[domain] || 'System Report';

  const today = new Date().toISOString().slice(0, 10);
  const defaultFrom = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const setQuickRange = (range: 'today' | 'week' | 'month' | 'session') => {
    const now = new Date();
    const to = now.toISOString().slice(0, 10);
    let from: string;
    switch (range) {
      case 'today':
        from = to;
        break;
      case 'week':
        const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
        from = weekAgo.toISOString().slice(0, 10);
        break;
      case 'month':
        const monthAgo = new Date(now); monthAgo.setMonth(monthAgo.getMonth() - 1);
        from = monthAgo.toISOString().slice(0, 10);
        break;
      case 'session':
        const sessionAgo = new Date(now); sessionAgo.setMonth(sessionAgo.getMonth() - 3);
        from = sessionAgo.toISOString().slice(0, 10);
        break;
    }
    setDateFrom(from);
    setDateTo(to);
    setGenerated(true);
  };

  const generateReport = () => {
    if (!dateFrom) setDateFrom(defaultFrom);
    if (!dateTo) setDateTo(today);
    setGenerated(true);
  };

  const filteredProducts = products.filter((p: Product) => {
    if (!domainFilter(p)) return false;
    if (reportCategory && p.category !== reportCategory) return false;
    return true;
  });

  const filteredOrders = orders.filter((o: Order) => {
    if (!domainOrderFilter(o)) return false;
    if (reportStatus && o.status !== reportStatus) return false;
    return true;
  });

  const filteredCourses = courses.filter((c: Course) => domainCourseFilter(c));
  const filteredCertificates = certificates.filter((c: Certificate) => domainCertFilter(c));
  const filteredAds = ads.filter((a: AdRequest) => domainAdFilter(a));
  const filteredBroadcasts = broadcasts.filter((b: Broadcast) => domainBroadcastFilter(b));

  const completedOrders = filteredOrders.filter((o: Order) => o.status === 'delivered');
  const totalRevenue = completedOrders.reduce((s: number, o: Order) => s + o.total, 0);
  const pendingOrders = filteredOrders.filter((o: Order) => o.status === 'pending' || o.status === 'processing');
  const lowStockItems = filteredProducts.filter((p: Product) => p.stock < 5);
  const activeCerts = filteredCertificates.filter((c: Certificate) => c.status === 'active').length;
  const pendingAds = filteredAds.filter((a: AdRequest) => a.status === 'pending').length;
  const totalBroadcastViews = filteredBroadcasts.reduce((s: number, b: Broadcast) => s + (b.views || 0), 0);

  const domainTasks: Record<string, { task: string; desc: string; status: string; date: string; owner: string; details: string }[]> = {
    commerce: [
      { task: 'Product Catalog Management', desc: 'Added, updated, and removed product listings across categories. Synced inventory levels and vendor data.', status: 'Active', date: today, owner: 'System Admin', details: `${filteredProducts.length} products managed, ${lowStockItems.length} low stock alerts` },
      { task: 'Order Fulfillment & Tracking', desc: 'Processed orders from pending through delivery. Updated tracking codes and delivery ETAs.', status: completedOrders.length > 0 ? 'Completed' : 'Pending', date: today, owner: 'Fulfillment Team', details: `${completedOrders.length} delivered, ${pendingOrders.length} pending fulfillment` },
    ],
    education: [
      { task: 'Course Catalog Updates', desc: 'Added new courses, updated syllabi, and adjusted pricing structures for RTTI programs.', status: 'Active', date: today, owner: 'Education Team', details: `${filteredCourses.length} courses available` },
      { task: 'Certificate Issuance & Management', desc: 'Issued new certificates to students upon course completion. Revoked expired or fraudulent certificates.', status: 'Active', date: today, owner: 'RTTI Admin', details: `${activeCerts} active certificates` },
    ],
    media: [
      { task: 'Ad Campaign Approvals', desc: 'Reviewed and approved/rejected ad submissions from OEM partners. Monitored campaign performance metrics.', status: pendingAds > 0 ? 'Pending Review' : 'Completed', date: today, owner: 'Media Team', details: `${pendingAds} pending approvals` },
      { task: 'Broadcast & TV Scheduling', desc: 'Scheduled live streams, webinars, and tutorials. Monitored viewership and engagement analytics.', status: 'Active', date: today, owner: 'Media Team', details: `${filteredBroadcasts.length} broadcasts scheduled, ${totalBroadcastViews.toLocaleString()} total views` },
    ],
    all: [
      { task: 'Product Catalog Management', desc: 'Added, updated, and removed product listings across categories. Synced inventory levels and vendor data.', status: 'Active', date: today, owner: 'System Admin', details: `${filteredProducts.length} products managed, ${lowStockItems.length} low stock alerts` },
      { task: 'Order Fulfillment & Tracking', desc: 'Processed orders from pending through delivery. Updated tracking codes and delivery ETAs.', status: completedOrders.length > 0 ? 'Completed' : 'Pending', date: today, owner: 'Fulfillment Team', details: `${completedOrders.length} delivered, ${pendingOrders.length} pending fulfillment` },
      { task: 'Course Catalog Updates', desc: 'Added new courses, updated syllabi, and adjusted pricing structures for RTTI programs.', status: 'Active', date: today, owner: 'Education Team', details: `${filteredCourses.length} courses available` },
      { task: 'Certificate Issuance & Management', desc: 'Issued new certificates to students upon course completion. Revoked expired or fraudulent certificates.', status: 'Active', date: today, owner: 'RTTI Admin', details: `${activeCerts} active certificates` },
      { task: 'Ad Campaign Approvals', desc: 'Reviewed and approved/rejected ad submissions from OEM partners. Monitored campaign performance metrics.', status: pendingAds > 0 ? 'Pending Review' : 'Completed', date: today, owner: 'Media Team', details: `${pendingAds} pending approvals` },
      { task: 'Broadcast & TV Scheduling', desc: 'Scheduled live streams, webinars, and tutorials. Monitored viewership and engagement analytics.', status: 'Active', date: today, owner: 'Media Team', details: `${filteredBroadcasts.length} broadcasts scheduled, ${totalBroadcastViews.toLocaleString()} total views` },
    ],
  };

  const tasksPerformed = domainTasks[domain] || domainTasks.all;

  const domainHowTasks: Record<string, { method: string; description: string }[]> = {
    commerce: [
      { method: 'Automated Inventory Sync', description: 'Products are synced in real-time from the database. Low stock thresholds trigger alerts in the Action Center.' },
      { method: 'Order Status Pipeline', description: 'Orders progress through a defined pipeline: Pending → Processing → Shipped → Delivered. Each step updates tracking info and notifies the customer.' },
    ],
    education: [
      { method: 'Course Management Interface', description: 'Courses are created with syllabi, pricing, and instructor assignments. Completion rates and student counts are tracked per course.' },
      { method: 'Certificate Lifecycle', description: 'Certificates are issued upon course completion, tracked by expiry dates, and can be revoked by admin for policy violations.' },
    ],
    media: [
      { method: 'Ad Review Workflow', description: 'Ads submitted by OEM partners enter a review queue. Admins approve, reject, or flag them for revision based on content guidelines.' },
      { method: 'Broadcast Scheduling Pipeline', description: 'Live streams, webinars, and tutorials are scheduled and published. Viewership metrics are tracked in real-time.' },
    ],
    all: [
      { method: 'Automated Inventory Sync', description: 'Products are synced in real-time from the database. Low stock thresholds trigger alerts in the Action Center.' },
      { method: 'Order Status Pipeline', description: 'Orders progress through a defined pipeline: Pending → Processing → Shipped → Delivered. Each step updates tracking info and notifies the customer.' },
      { method: 'Certificate Lifecycle', description: 'Certificates are issued upon course completion, tracked by expiry dates, and can be revoked by admin for policy violations.' },
      { method: 'Ad Review Workflow', description: 'Ads submitted by OEM partners enter a review queue. Admins approve, reject, or flag them for revision based on content guidelines.' },
      { method: 'Course Management Interface', description: 'Courses are created with syllabi, pricing, and instructor assignments. Completion rates and student counts are tracked per course.' },
      { method: 'Broadcast Scheduling Pipeline', description: 'Live streams, webinars, and tutorials are scheduled and published. Viewership metrics are tracked in real-time.' },
    ],
  };

  const howTasksDone = domainHowTasks[domain] || domainHowTasks.all;

  const pricingNeeds = filteredProducts
    .filter((p: Product) => p.price === 0 || p.stock === 0)
    .map((p: Product) => ({
      name: p.name,
      category: p.category,
      currentPrice: p.price,
      stock: p.stock,
      suggestedPrice: p.price === 0 ? Math.floor(Math.random() * 50000) + 5000 : p.price,
      reason: p.price === 0 ? 'Price not set — requires pricing input' : 'Out of stock — review before restocking',
    }));

  if (pricingNeeds.length === 0) {
    pricingNeeds.push({ name: 'All products priced', category: '—', currentPrice: 0, stock: 0, suggestedPrice: 0, reason: 'No pricing adjustments needed at this time' });
  }

  const uniqueCategories: string[] = Array.from(new Set(products.map((p: Product) => p.category))).sort() as string[];

  const reportDateRange = `${dateFrom || defaultFrom} to ${dateTo || today}`;

  /* ── Sub-type specific data ── */
  const showProducts = domain === 'all' || (domain === 'commerce' && (reportSubType === 'all' || reportSubType === 'products'));
  const showCategories = domain === 'all' || (domain === 'commerce' && (reportSubType === 'all' || reportSubType === 'categories'));
  const showOrders = domain === 'all' || (domain === 'commerce' && (reportSubType === 'all' || reportSubType === 'orders'));
  const showPayments = domain === 'all' || (domain === 'commerce' && (reportSubType === 'all' || reportSubType === 'payments'));

  const categoryBreakdown = categories.map((cat: Category) => {
    const catProducts = products.filter((p: Product) => p.category === cat.name);
    const totalValue = catProducts.reduce((s: number, p: Product) => s + p.price * p.stock, 0);
    const avgPrice = catProducts.length > 0 ? catProducts.reduce((s: number, p: Product) => s + p.price, 0) / catProducts.length : 0;
    return { category: cat.name, productCount: catProducts.length, totalStock: catProducts.reduce((s: number, p: Product) => s + p.stock, 0), totalValue, avgPrice };
  });

  const paymentSummary = {
    totalRevenue,
    totalOrders: filteredOrders.length,
    avgOrderValue: filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0,
    pendingPayments: pendingOrders.reduce((s: number, o: Order) => s + o.total, 0),
    completedCount: completedOrders.length,
    cancelledCount: filteredOrders.filter((o: Order) => o.status === 'cancelled').length,
  };

  return (
    <div className="bg-white min-h-full">
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: sans-serif; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          aside, header, .md\\:w-20, [class*='sidebar'], nav, .z-40, .fixed { display: none !important; }
          #system-report-content { margin: 0; padding: 0; }
          .report-print-header { display: flex !important; align-items: center; gap: 16px; border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 20px; }
          .report-print-header img { height: 40px; width: auto; }
          .report-print-header div h1 { font-size: 18pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
          .report-print-header div p { font-size: 9pt; color: #555; margin: 4px 0 0 0; }
          .report-section { page-break-inside: avoid; break-inside: avoid; margin-bottom: 24px; }
          .report-section h3 { font-size: 11pt; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 6px; margin-bottom: 12px; }
          .report-section table { width: 100%; font-size: 9pt; border-collapse: collapse; }
          .report-section table thead th { background: #f3f4f6; text-align: left; padding: 6px 8px; font-size: 7pt; text-transform: uppercase; letter-spacing: 0.05em; color: #555; border-bottom: 1px solid #ddd; }
          .report-section table tbody td { padding: 5px 8px; border-bottom: 1px solid #eee; }
          .report-section table tbody tr:nth-child(even) { background: #fafafa; }
          .report-kpi-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-bottom: 16px; }
          .report-kpi-grid .kpi-card { border: 1px solid #ddd; padding: 8px; background: #f9fafb; }
          .report-kpi-grid .kpi-card .kpi-label { font-size: 7pt; font-weight: 600; text-transform: uppercase; color: #888; }
          .report-kpi-grid .kpi-card .kpi-value { font-size: 14pt; font-weight: 700; color: #111; }
          .report-footer { border-top: 2px solid #111; padding-top: 12px; margin-top: 24px; text-align: center; font-size: 8pt; color: #888; }
          .report-footer .page-number:after { content: "Page " counter(page); }
          @page { margin: 20mm 15mm; }
          @page :first { margin-top: 15mm; }
        }
        .print-only { display: none; }
        .report-kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; margin-bottom: 16px; }
        .report-kpi-grid .kpi-card { border: 1px solid #e5e7eb; padding: 10px; background: #f9fafb; }
        .report-kpi-grid .kpi-card .kpi-label { font-size: 8px; font-weight: 600; text-transform: uppercase; color: #888; }
        .report-kpi-grid .kpi-card .kpi-value { font-size: 16px; font-weight: 700; color: #111; }
      `}</style>

      {/* Header with Print button */}
      <div className="no-print border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <FileText size={18} className="text-[#3373AB]" />
            {domainTitleStr}
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">{domain === 'all' ? 'Comprehensive system-wide performance & operational report' : `Focused ${domainTitleStr.toLowerCase()} — performance metrics and operational data`}</p>
        </div>
        <div className="flex items-center gap-2">
          {generated && (
            <button onClick={() => window.print()} className="flex items-center gap-1.5 bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-semibold px-4 py-2 outline-none">
              <Printer size={14} />
              Print Report
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="no-print border-b border-gray-200 px-6 py-4 bg-gray-50/50">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex items-end gap-1">
            {[
              { key: 'today', label: 'Today' },
              { key: 'week', label: 'Week' },
              { key: 'month', label: 'Month' },
              { key: 'session', label: 'Session' },
            ].map(r => (
              <button key={r.key} onClick={() => setQuickRange(r.key as any)}
                className={`text-xs font-semibold px-2.5 py-1.5 border outline-none transition-colors ${
                  dateFrom && dateTo && ((r.key === 'today' && dateFrom === today) ||
                    (r.key === 'week' && dateFrom === new Date(Date.now() - 7*86400000).toISOString().slice(0,10)) ||
                    (r.key === 'month' && dateFrom === new Date(Date.now() - 30*86400000).toISOString().slice(0,10)))
                    ? 'bg-[#3373AB] text-white border-[#3373AB]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#3373AB]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">From</label>
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setGenerated(true); }} className="border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-[#3373AB] bg-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">To</label>
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setGenerated(true); }} className="border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-[#3373AB] bg-white" />
          </div>
          {(domain === 'all' || domain === 'commerce') && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
              <select value={reportCategory} onChange={e => setReportCategory(e.target.value)} className="border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-[#3373AB] bg-white">
                <option value="">All Categories</option>
                {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
          {(domain === 'all' || domain === 'commerce') && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Order Status</label>
              <select value={reportStatus} onChange={e => setReportStatus(e.target.value)} className="border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-[#3373AB] bg-white">
                <option value="">All Statuses</option>
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          )}
          {(domain === 'all' || domain === 'commerce') && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Report Type</label>
              <select value={reportSubType} onChange={e => setReportSubType(e.target.value)} className="border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-[#3373AB] bg-white">
                <option value="all">All Commerce</option>
                <option value="products">Products</option>
                <option value="categories">Categories</option>
                <option value="orders">Orders</option>
                <option value="payments">Payments / Billing</option>
              </select>
            </div>
          )}
          <button onClick={generateReport} className="bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-semibold px-5 py-2 outline-none flex items-center gap-1.5">
            <BarChart3 size={14} />
            Generate Report
          </button>
          {(dateFrom || dateTo || reportCategory || reportStatus || reportSubType !== 'all') && (
            <button onClick={() => { setDateFrom(''); setDateTo(''); setReportCategory(''); setReportStatus(''); setReportSubType('all'); setGenerated(false); }} className="text-xs text-gray-500 hover:text-red-500 outline-none ml-2">
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {!generated && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <div className="text-center">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Set filters and click "Generate Report"</p>
            <p className="text-xs mt-1">Select a date range and category to view the system report</p>
          </div>
        </div>
      )}

      {generated && (
        <div className="p-6 space-y-8" id="system-report-content">

          {/* Report Header for Print */}
          <div className="print-only report-print-header">
            <img src="/logo/logo.png" alt="RTNEXUS" />
            <div>
              <h1>RTNEXUS {domainTitleStr.toUpperCase()}</h1>
              <p>Period: {reportDateRange} &middot; Generated: {today}</p>
            </div>
          </div>

          {/* Section 1: Summary KPIs */}
          <div className="report-section">
            <h3>Executive Summary</h3>
            <div className="report-kpi-grid">
              {[
                ...(domain === 'all' || (domain === 'commerce' && reportSubType !== 'categories' && reportSubType !== 'orders') ? [
                  { label: 'Total Revenue', value: `RWF ${totalRevenue.toFixed(2)}`, icon: <DollarSign size={14} />, color: 'text-emerald-600' },
                ] : []),
                ...((showProducts || showPayments) && !showOrders && !showCategories ? [
                  { label: 'Products', value: filteredProducts.length, icon: <Package size={14} />, color: 'text-[#3373AB]' },
                ] : []),
                ...(showProducts ? [
                  { label: 'Low Stock', value: lowStockItems.length, icon: <AlertTriangle size={14} />, color: 'text-red-600' },
                  { label: 'In Stock', value: filteredProducts.filter((p: Product) => p.stock > 0).length, icon: <Package size={14} />, color: 'text-emerald-600' },
                ] : []),
                ...((showOrders || showPayments) ? [
                  { label: 'Orders', value: filteredOrders.length, icon: <ShoppingCart size={14} />, color: 'text-purple-600' },
                ] : []),
                ...(showOrders ? [
                  { label: 'Delivered', value: completedOrders.length, icon: <Check size={14} />, color: 'text-emerald-600' },
                  { label: 'Pending', value: pendingOrders.length, icon: <Clock size={14} />, color: 'text-amber-600' },
                ] : []),
                ...(showPayments ? [
                  { label: 'Avg Order Value', value: `RWF ${paymentSummary.avgOrderValue.toFixed(2)}`, icon: <DollarSign size={14} />, color: 'text-[#3373AB]' },
                  { label: 'Pending Revenue', value: `RWF ${paymentSummary.pendingPayments.toFixed(2)}`, icon: <Clock size={14} />, color: 'text-amber-600' },
                ] : []),
                ...(showCategories ? [
                  { label: 'Categories', value: categories.length, icon: <Tag size={14} />, color: 'text-[#3373AB]' },
                  { label: 'Total Products', value: filteredProducts.length, icon: <Package size={14} />, color: 'text-purple-600' },
                  { label: 'Avg Products/Cat', value: categories.length > 0 ? (filteredProducts.length / categories.length).toFixed(1) : '0', icon: <BarChart3 size={14} />, color: 'text-amber-600' },
                ] : []),
                ...(domain === 'all' || domain === 'education' ? [
                  { label: 'Students', value: rttiData?.totalStudents ?? '—', icon: <Users size={14} />, color: 'text-amber-600' },
                  { label: 'Active Certificates', value: activeCerts, icon: <Award size={14} />, color: 'text-emerald-600' },
                  { label: 'Courses', value: filteredCourses.length, icon: <BookOpen size={14} />, color: 'text-blue-600' },
                ] : []),
                ...(domain === 'all' || domain === 'media' ? [
                  { label: 'Total Views', value: totalBroadcastViews.toLocaleString(), icon: <Monitor size={14} />, color: 'text-purple-600' },
                  { label: 'Active Campaigns', value: filteredAds.filter((a: AdRequest) => a.status === 'active').length, icon: <Megaphone size={14} />, color: 'text-orange-600' },
                  { label: 'Pending Ads', value: pendingAds, icon: <Bell size={14} />, color: 'text-red-600' },
                ] : []),
                ...(domain === 'all' ? [
                  { label: 'Pending Actions', value: pendingOrders.length + pendingAds + lowStockItems.length, icon: <Bell size={14} />, color: 'text-red-600' },
                ] : []),
              ].map(kpi => (
                <div key={kpi.label} className="kpi-card">
                  <div className="flex items-center justify-between mb-1">
                    <span className="kpi-label">{kpi.label}</span>
                    <span className={kpi.color}>{kpi.icon}</span>
                  </div>
                  <p className="kpi-value">{kpi.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Tasks Performed */}
          <div className="report-section">
            <h3>Tasks Performed</h3>
            <div className="overflow-x-auto border border-gray-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {['Task', 'Description', 'Method', 'Status', 'Owner', 'Date', 'Details'].map(h => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tasksPerformed.map((t, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{t.task}</td>
                      <td className="px-3 py-2 text-gray-600 max-w-[250px]">{t.desc}</td>
                      <td className="px-3 py-2 text-gray-500">{howTasksDone[i]?.method || 'Automated'}</td>
                      <td className="px-3 py-2">
                        <span className={`text-xs font-semibold px-1.5 py-[2px] ${
                          t.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                          t.status === 'Active' ? 'bg-blue-50 text-blue-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>{t.status}</span>
                      </td>
                      <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{t.owner}</td>
                      <td className="px-3 py-2 font-mono text-gray-500 text-xs whitespace-nowrap">{t.date}</td>
                      <td className="px-3 py-2 text-gray-500 max-w-[180px]">{t.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: How Tasks Were Done */}
          <div className="report-section">
            <h3>How Tasks Were Done — Methodology</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {howTasksDone.map((m, i) => (
                <div key={i} className="border border-gray-200 p-3 bg-gray-50/30">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-5 w-5 bg-[#3373AB]/10 text-[#3373AB] flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <h4 className="text-xs font-bold text-gray-900">{m.method}</h4>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{m.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Pricing Generation — products / all */}
          {showProducts && (
            <div className="report-section">
              <h3>Pricing Generation — Items Requiring Attention</h3>
              <div className="overflow-x-auto border border-gray-200">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {['Product', 'Category', 'Current Price', 'Stock', 'Suggested Price', 'Reason'].map(h => (
                        <th key={h} className="text-left px-3 py-2 font-semibold text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pricingNeeds.map((p, i) => (
                      <tr key={i} className={p.stock === 0 && p.currentPrice !== 0 ? 'bg-red-50/30' : ''}>
                        <td className="px-3 py-2 font-medium text-gray-900 max-w-[180px] truncate">{p.name}</td>
                        <td className="px-3 py-2"><span className="bg-gray-100 text-gray-600 px-1.5 py-[2px] text-xs">{p.category}</span></td>
                        <td className="px-3 py-2 font-mono text-gray-900">RWF {p.currentPrice.toFixed(2)}</td>
                        <td className="px-3 py-2">
                          <span className={`text-xs font-mono font-semibold ${p.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>{p.stock}</span>
                        </td>
                        <td className="px-3 py-2 font-mono text-[#3373AB] font-semibold">
                          {p.suggestedPrice > 0 ? `RWF ${p.suggestedPrice.toFixed(2)}` : '—'}
                        </td>
                        <td className="px-3 py-2 text-gray-500 max-w-[200px] text-xs">{p.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 5: Detailed Data Tables — sub-type specific */}
          {/* Products table */}
          {showProducts && (
            <div className="report-section">
              <h3>Product Inventory Detail</h3>
              <div className="overflow-x-auto border border-gray-200 max-h-72 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr className="border-b border-gray-200">
                      {['Name', 'Category', 'Price', 'Stock', 'Vendor', 'Rating'].map(h => (
                        <th key={h} className="text-left px-3 py-2 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.slice(0, 80).map((p: Product) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-3 py-1.5 font-medium text-gray-900 max-w-[180px] truncate">{p.name}</td>
                        <td className="px-3 py-1.5"><span className="bg-gray-100 text-gray-600 px-1.5 py-[1px] text-xs">{p.category}</span></td>
                        <td className="px-3 py-1.5 font-mono text-gray-900">RWF {p.price.toFixed(2)}</td>
                        <td className="px-3 py-1.5"><span className={`text-xs font-mono font-semibold ${p.stock > 10 ? 'text-emerald-600' : p.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>{p.stock}</span></td>
                        <td className="px-3 py-1.5 text-gray-500 max-w-[120px] truncate">{p.vendorName}</td>
                        <td className="px-3 py-1.5"><span className="flex items-center gap-1 text-amber-500 text-xs"><Star size={9} fill="currentColor" />{p.rating}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length > 80 && <p className="text-xs text-gray-400 mt-1">Showing 80 of {filteredProducts.length} products</p>}
            </div>
          )}

          {/* Categories table */}
          {showCategories && (
            <div className="report-section">
              <h3>Category Breakdown</h3>
              <div className="overflow-x-auto border border-gray-200 max-h-72 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr className="border-b border-gray-200">
                      {['Category', 'Products', 'Total Stock', 'Avg Price', 'Total Value', 'Actions'].map(h => (
                        <th key={h} className="text-left px-3 py-2 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categoryBreakdown.map((cat: any) => (
                      <tr key={cat.category} className="hover:bg-gray-50">
                        <td className="px-3 py-1.5 font-medium text-gray-900">{cat.category}</td>
                        <td className="px-3 py-1.5 font-mono font-semibold text-gray-900">{cat.productCount}</td>
                        <td className="px-3 py-1.5 font-mono text-gray-600">{cat.totalStock}</td>
                        <td className="px-3 py-1.5 font-mono text-gray-900">RWF {cat.avgPrice.toFixed(2)}</td>
                        <td className="px-3 py-1.5 font-mono font-semibold text-[#3373AB]">RWF {cat.totalValue.toFixed(2)}</td>
                        <td className="px-3 py-1.5">
                          <button onClick={() => { setReportCategory(cat.category); setReportSubType('products'); }} className="text-xs text-[#3373AB] border border-[#3373AB]/30 px-2 py-0.5 hover:bg-[#3373AB]/5 outline-none">View Products</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders table */}
          {showOrders && (
            <div className="report-section">
              <h3>Order Tracking Detail</h3>
              <div className="overflow-x-auto border border-gray-200 max-h-72 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr className="border-b border-gray-200">
                      {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Tracking', 'ETA'].map(h => (
                        <th key={h} className="text-left px-3 py-2 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.slice(0, 80).map((o: Order) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="px-3 py-1.5 font-mono font-semibold text-[#3373AB]">{o.id}</td>
                        <td className="px-3 py-1.5 font-medium text-gray-900">{o.customer}</td>
                        <td className="px-3 py-1.5 text-gray-500 max-w-[150px] truncate">{o.items}</td>
                        <td className="px-3 py-1.5 font-mono text-gray-900">RWF {o.total.toFixed(2)}</td>
                        <td className="px-3 py-1.5">{statusBadge(o.status, { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700' })}</td>
                        <td className="px-3 py-1.5 font-mono text-gray-500 text-xs">{o.tracking}</td>
                        <td className="px-3 py-1.5 text-gray-500">{o.eta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments / Billing table */}
          {showPayments && (
            <div className="report-section">
              <h3>Payments & Billing Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Total Revenue', value: `RWF ${paymentSummary.totalRevenue.toFixed(2)}`, color: 'text-emerald-600' },
                  { label: 'Total Orders', value: paymentSummary.totalOrders, color: 'text-[#3373AB]' },
                  { label: 'Avg Order Value', value: `RWF ${paymentSummary.avgOrderValue.toFixed(2)}`, color: 'text-purple-600' },
                  { label: 'Pending Revenue', value: `RWF ${paymentSummary.pendingPayments.toFixed(2)}`, color: 'text-amber-600' },
                  { label: 'Completed', value: paymentSummary.completedCount, color: 'text-emerald-600' },
                  { label: 'Cancelled', value: paymentSummary.cancelledCount, color: 'text-red-600' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 border border-gray-200 p-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{s.label}</p>
                    <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto border border-gray-200 max-h-72 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr className="border-b border-gray-200">
                      {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                        <th key={h} className="text-left px-3 py-2 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.slice(0, 80).map((o: Order) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="px-3 py-1.5 font-mono font-semibold text-[#3373AB]">{o.id}</td>
                        <td className="px-3 py-1.5 font-medium text-gray-900">{o.customer}</td>
                        <td className="px-3 py-1.5 text-gray-500 max-w-[150px] truncate">{o.items}</td>
                        <td className="px-3 py-1.5 font-mono text-gray-900">RWF {o.total.toFixed(2)}</td>
                        <td className="px-3 py-1.5">{statusBadge(o.status, { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700' })}</td>
                        <td className="px-3 py-1.5 text-gray-500 font-mono text-xs">{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Education data tables */}
          {(domain === 'all' || domain === 'education') && (
            <div className="report-section">
              <h3>Course Catalog Detail</h3>
              <div className="overflow-x-auto border border-gray-200 max-h-60 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr className="border-b border-gray-200">
                      {['Title', 'Category', 'Instructor', 'Duration', 'Price', 'Level', 'Students'].map(h => (
                        <th key={h} className="text-left px-3 py-2 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCourses.slice(0, 50).map((c: Course) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-3 py-1.5 font-medium text-gray-900 max-w-[180px] truncate">{c.title}</td>
                        <td className="px-3 py-1.5"><span className="bg-gray-100 text-gray-600 px-1.5 py-[1px] text-xs">{c.category}</span></td>
                        <td className="px-3 py-1.5 text-gray-500">{c.instructor}</td>
                        <td className="px-3 py-1.5 text-gray-500">{c.duration}</td>
                        <td className="px-3 py-1.5 font-mono text-gray-900">RWF {c.price.toFixed(2)}</td>
                        <td className="px-3 py-1.5"><span className={`text-xs font-semibold px-1.5 py-[1px] ${c.level === 'Beginner' ? 'bg-emerald-50 text-emerald-700' : c.level === 'Intermediate' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{c.level}</span></td>
                        <td className="px-3 py-1.5 font-mono text-gray-500">{c.studentsCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Media data tables */}
          {(domain === 'all' || domain === 'media') && (
            <div className="report-section">
              <h3>Broadcast & Ad Campaign Detail</h3>
              <div className="overflow-x-auto border border-gray-200 max-h-60 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr className="border-b border-gray-200">
                      {['Title', 'Type', 'Category', 'Host', 'Views', 'Status'].map(h => (
                        <th key={h} className="text-left px-3 py-2 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBroadcasts.slice(0, 50).map((b: Broadcast) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-3 py-1.5 font-medium text-gray-900 max-w-[180px] truncate">{b.title}</td>
                        <td className="px-3 py-1.5"><span className="bg-gray-100 text-gray-600 px-1.5 py-[1px] text-xs">{b.type}</span></td>
                        <td className="px-3 py-1.5"><span className="bg-gray-100 text-gray-600 px-1.5 py-[1px] text-xs">{b.category}</span></td>
                        <td className="px-3 py-1.5 text-gray-500">{b.host}</td>
                        <td className="px-3 py-1.5 font-mono text-gray-500">{b.views.toLocaleString()}</td>
                        <td className="px-3 py-1.5">{statusBadge(b.type, { live: 'bg-red-50 text-red-700', webinar: 'bg-blue-50 text-blue-700', podcast: 'bg-purple-50 text-purple-700', tutorial: 'bg-emerald-50 text-emerald-700' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Report Footer for Print */}
          <div className="print-only report-footer">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <img src="/logo/logoonly.png" alt="RTNEXUS" style={{ height: 24 }} />
              <span className="page-number"></span>
            </div>
            <p>RTNEXUS {domainTitleStr} — {reportDateRange}</p>
            <p>Generated {today} &middot; Confidential — Internal Use Only</p>
          </div>

        </div>
      )}
    </div>
  );
}

/* ─────── ADMIN SETTINGS ─────── */
function AdminSettingsSection({ onBack, notify }: { onBack: () => void; notify: (type: 'success' | 'error', message: string) => void }) {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  useEffect(() => {
    try {
      const users = JSON.parse(localStorage.getItem('rt_nexus_users') || '[]');
      const admin = users.find((u: any) => u.role === 'admin');
      if (admin) {
        setCurrentAdmin(admin);
        setUsername(admin.username || '');
        setFullName(admin.fullName || '');
      }
    } catch {}
  }, []);

  const handleUpdate = () => {
    if (!username.trim()) {
      notify('error', 'Username cannot be empty.');
      return;
    }
    try {
      const users = JSON.parse(localStorage.getItem('rt_nexus_users') || '[]');
      const idx = users.findIndex((u: any) => u.id === currentAdmin?.id);
      if (idx === -1) {
        notify('error', 'Admin account not found.');
        return;
      }
      if (newPassword && oldPassword !== currentAdmin.password) {
        notify('error', 'Old password is incorrect.');
        return;
      }
      users[idx].username = username;
      users[idx].fullName = fullName;
      if (newPassword) {
        users[idx].password = newPassword;
      }
      localStorage.setItem('rt_nexus_users', JSON.stringify(users));
      notify('success', 'Admin settings updated successfully.');
      onBack();
    } catch {
      notify('error', 'Failed to update admin settings.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 md:p-6">
      <div className="bg-white border border-gray-200">
        <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Admin Settings</h3>
          <button onClick={onBack} className="text-gray-400 hover:text-gray-700 outline-none p-1 transition-colors"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all rounded" placeholder="Enter full name" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all rounded" placeholder="Enter username" />
          </div>
          <hr className="border-gray-100" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Change Password</p>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Current Password</label>
            <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all rounded" placeholder="Enter current password" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all rounded" placeholder="Leave blank to keep current" />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button onClick={onBack} className="border border-gray-300 text-gray-600 px-4 py-1.5 text-xs font-semibold outline-none hover:bg-gray-50 transition-all rounded">Cancel</button>
            <button onClick={handleUpdate} className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-5 py-1.5 text-xs font-bold outline-none transition-all rounded flex items-center gap-1.5">
              <Check size={12} />
              Update Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────── MODAL ─────── */
function Modal({ children, onClose, title }: { children: ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-x-0 top-0 h-[calc(100vh+100px)] bg-black/85 z-50 flex items-start justify-center pt-12 pb-8 px-4 animate-fadeIn overflow-hidden">
      <div className="bg-white w-full max-w-lg border border-gray-200 shadow-2xl flex flex-col max-h-[calc(100vh-5rem)]">
        <div className="bg-[#0f1419] text-white px-4 py-3 flex items-center justify-between shrink-0">
          <h3 className="text-xs font-bold uppercase tracking-wider">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white outline-none p-0.5"><X size={14} /></button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
