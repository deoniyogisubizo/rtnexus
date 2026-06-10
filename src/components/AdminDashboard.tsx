import { useState, useEffect, type ReactNode, type FormEvent } from 'react';
import { Product, Course, Broadcast } from '../types';
import { FEATURED_PRODUCTS, COURSES, BROADCASTS } from '../data/mockData';
import { fetchProducts } from '../services/api';
import MetricCard from './MetricCard';
import StatusBadge from './StatusBadge';

const statusBadge = (status: string, colors: Record<string, string>) => {
  const color = colors[status] || 'bg-gray-100 text-gray-600';
  return <span className={`text-[10px] font-semibold px-1.5 py-[1px] ${color}`}>{status}</span>;
};

import {
  LayoutDashboard, Package, BookOpen, Award, Megaphone, Monitor,
  Plus, Edit3, Trash2, X, Check, Search, ChevronRight,
  Clock, Settings, Users, Menu,
  DollarSign, BarChart3, Download, AlertTriangle, Tag,
  Home, HelpCircle, Globe, CreditCard, ArrowLeft,
  Bell, Grid, TrendingUp, TrendingDown, Minus,
  ShoppingCart, Star, Zap, RefreshCw
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

type AdminSection = 'overview' | 'products' | 'orders' | 'categories' | 'courses' | 'certificates' | 'ads' | 'tv' | 'users' | 'settings' | 'support' | 'analytics' | 'billing' | 'notifications';

interface SidebarGroup {
  label: string;
  items: { id: AdminSection; icon: ReactNode; label: string }[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    label: 'Main',
    items: [
      { id: 'overview', icon: <BarChart3 size={16} />, label: 'Dashboard Overview' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { id: 'products', icon: <Package size={16} />, label: 'Manage Products' },
      { id: 'categories', icon: <Tag size={16} />, label: 'Manage Categories' },
      { id: 'orders', icon: <ShoppingCart size={16} />, label: 'Manage Orders' },
      { id: 'billing', icon: <CreditCard size={16} />, label: 'Billing & Payments' },
    ],
  },
  {
    label: 'Education',
    items: [
      { id: 'courses', icon: <BookOpen size={16} />, label: 'Manage Courses' },
      { id: 'certificates', icon: <Award size={16} />, label: 'Certificates' },
    ],
  },
  {
    label: 'Media & Ads',
    items: [
      { id: 'tv', icon: <Monitor size={16} />, label: 'TV Management' },
      { id: 'ads', icon: <Megaphone size={16} />, label: 'Ads Requests' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'users', icon: <Users size={16} />, label: 'User Management' },
      { id: 'notifications', icon: <Bell size={16} />, label: 'Notifications' },
      { id: 'analytics', icon: <Globe size={16} />, label: 'Analytics' },
      { id: 'settings', icon: <Settings size={16} />, label: 'Settings' },
      { id: 'support', icon: <HelpCircle size={16} />, label: 'Support' },
    ],
  },
];

const flatItems = sidebarGroups.flatMap(g => g.items);
const sectionLabels: Record<string, string> = Object.fromEntries(flatItems.map(i => [i.id, i.label]));

const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-001', customer: 'Alice Chen', items: 'Nexus IoT Gateway Hub X1', total: 349.99, status: 'delivered', date: '2026-05-12', tracking: 'TRK-8812A', eta: 'Delivered' },
  { id: 'ORD-002', customer: 'Bob Martinez', items: 'RT-SOC Core Evolution Board', total: 189.50, status: 'shipped', date: '2026-05-28', tracking: 'TRK-8914B', eta: 'Jun 02, 2026' },
  { id: 'ORD-003', customer: 'Clara Dupont', items: 'Precision Biosensing Matrix Module (x2)', total: 158.00, status: 'processing', date: '2026-06-01', tracking: 'TRK-9012C', eta: 'Jun 06, 2026' },
  { id: 'ORD-004', customer: 'David Kim', items: 'Autonomous Mecanum Drive-Train Pod', total: 520.00, status: 'pending', date: '2026-06-03', tracking: '—', eta: 'Pending' },
  { id: 'ORD-005', customer: 'Elena Rossi', items: 'Smart Grid Din-Rail Power Core', total: 210.00, status: 'shipped', date: '2026-06-02', tracking: 'TRK-9115E', eta: 'Jun 05, 2026' },
  { id: 'ORD-006', customer: 'Frank Okafor', items: 'Sub-Giga Range Telemetry Shield (x3)', total: 135.00, status: 'cancelled', date: '2026-05-20', tracking: '—', eta: 'Cancelled' },
];

const INITIAL_CERTIFICATES: Certificate[] = [
  { id: 'CERT-001', title: 'Advanced Embedded Systems Architecture', recipient: 'Clara Dupont', issueDate: '2026-04-15', expiryDate: '2028-04-15', status: 'active' },
  { id: 'CERT-002', title: 'Enterprise IoT Infrastructure Deployment', recipient: 'Alex Miller', issueDate: '2026-05-01', expiryDate: '2028-05-01', status: 'active' },
  { id: 'CERT-003', title: 'Cybersecurity Protocols for Industrial SCADA', recipient: 'Sarah Jenkins', issueDate: '2025-11-10', expiryDate: '2027-11-10', status: 'active' },
  { id: 'CERT-004', title: 'Applied AI for Embedded Vision Systems', recipient: 'Kenzo Tanaka', issueDate: '2024-06-20', expiryDate: '2026-06-20', status: 'expired' },
];

const INITIAL_ADS: AdRequest[] = [
  { id: 'AD-001', company: 'Acme Semiconductor', campaign: 'Transceivers Roll Ad', placement: 'homepage', budget: 2500, status: 'active', date: '2026-05-01' },
  { id: 'AD-002', company: 'OmniDrive Robotics', campaign: 'Mecanum Launch', placement: 'shop_featured', budget: 1800, status: 'approved', date: '2026-05-20' },
  { id: 'AD-003', company: 'Matrix Transducers', campaign: 'Sensor Week', placement: 'mttv_video_roll', budget: 3200, status: 'pending', date: '2026-06-01' },
  { id: 'AD-004', company: 'Nexus Embedded Corp', campaign: 'Gateway X1 Promo', placement: 'newsletter', budget: 950, status: 'completed', date: '2026-04-10' },
  { id: 'AD-005', company: 'Silicon Ventures Ltd', campaign: 'Board Series', placement: 'homepage', budget: 1500, status: 'rejected', date: '2026-05-28' },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'CAT-001', name: 'IoT Devices', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=60', description: 'Internet of Things hardware and modules', slug: 'iot-devices' },
  { id: 'CAT-002', name: 'Development Boards', thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=100&auto=format&fit=crop&q=60', description: 'Prototyping and evaluation platforms', slug: 'dev-boards' },
  { id: 'CAT-003', name: 'Sensors', thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&auto=format&fit=crop&q=60', description: 'Environmental and industrial sensing solutions', slug: 'sensors' },
];

function TrendIndicator({ value }: { value: number }) {
  if (value > 0) return <span className="flex items-center gap-[2px] text-[10px] font-semibold text-emerald-600"><TrendingUp size={10} />+{value}%</span>;
  if (value < 0) return <span className="flex items-center gap-[2px] text-[10px] font-semibold text-red-600"><TrendingDown size={10} />{value}%</span>;
  return <span className="flex items-center gap-[2px] text-[10px] font-semibold text-gray-400"><Minus size={10} />0%</span>;
}

/* ─────── PAGINATION ─────── */
function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (page: number) => void }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-between px-2 py-2 bg-gray-50 border-t border-gray-200 text-[10px]">
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

export default function AdminDashboard({ onBack }: { onBack?: () => void }) {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>(FEATURED_PRODUCTS);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(BROADCASTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [ads, setAds] = useState<AdRequest[]>(INITIAL_ADS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchProducts().then(data => {
      if (data.length > 0) setProducts(data);
    });
  }, []);

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

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
      <style>{`aside nav::-webkit-scrollbar-thumb { background: rgba(51,115,171,0.5); border-radius: 999px; } aside nav::-webkit-scrollbar-thumb:hover { background: rgba(51,115,171,0.75); } aside nav::-webkit-scrollbar { width: 3px; } aside nav::-webkit-scrollbar-track { background: transparent; }`}</style>

      {/* Sidebar */}
      <aside className={`
        /* Mobile: bottom sheet */
        fixed inset-x-0 bottom-0 z-50
        bg-white border-t border-gray-200
        transition-transform duration-300 ease-out
        max-h-[85vh] overflow-y-auto
        ${mobileOpen ? 'translate-y-0' : 'translate-y-full'}
        /* Desktop: in-flow, hover expand */
        md:relative md:inset-auto md:translate-y-0
        md:flex md:flex-col md:h-full md:max-h-none
        md:border-t-0 md:border-r md:border-gray-200
        md:w-20 md:hover:w-56
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
            <img src="/logo/logo.png" alt="RTNEXUS" className="h-7 w-7 object-contain" />
            <div className="leading-tight">
              <span className="text-[9px] font-mono text-[#3373AB] font-bold tracking-[0.15em] block">RTNEXUS</span>
              <span className="text-xs font-bold tracking-tight block text-gray-700">Admin Panel</span>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-gray-700 outline-none p-1">
            <X size={14} />
          </button>
        </div>

        {/* Desktop: logo */}
        <div className="hidden md:flex items-center border-b border-gray-200 shrink-0 px-3 py-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img src="/logo/logo.png" alt="RTNEXUS" className="h-1 w-50  scale-200 object-contain shrink-0" />
            
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-1">
          {sidebarGroups.map(group => (
            <div key={group.label}>
              <div className="px-3 pt-0 pb-0.5 md:px-0 md:text-center md:group-hover:px-3 md:group-hover:text-left">
                <span className="text-[7px] font-mono text-gray-400 uppercase tracking-[0.2em] md:hidden md:group-hover:inline">
                  {group.label}
                </span>
              </div>
              {group.items.map(item => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setMobileOpen(false); }}
                    className={`w-full flex items-center outline-none text-left
                      px-3 py-2 gap-2.5
                      md:px-0 md:justify-center md:gap-0
                      md:group-hover:px-3 md:group-hover:justify-start md:group-hover:gap-2.5
                      transition-all duration-300
                      ${isActive
                        ? 'text-[#3373AB] bg-[#3373AB]/5 border-l-2 border-[#3373AB]'
                        : 'text-gray-400 hover:text-[#3373AB] hover:bg-gray-50 border-l-2 border-transparent'
                      }`}
                  >
                    <span className={`shrink-0 flex items-center justify-center w-5 md:w-4 md:scale-75 md:group-hover:w-5 md:group-hover:scale-100 transition-all duration-300 ${isActive ? 'text-[#3373AB]' : ''}`}>
                      {item.icon}
                    </span>
                    <span className="text-[11px] font-medium tracking-wide text-gray-700 md:hidden md:group-hover:inline">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

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
            <span className="text-[11px] font-medium md:hidden md:group-hover:inline">
              Back to Page View
            </span>
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 md:px-0 md:justify-center md:group-hover:px-3 md:group-hover:justify-start">
            <span className="h-1 w-1 bg-emerald-400 shrink-0"></span>
            <span className="text-[7px] font-mono text-gray-400 md:hidden md:group-hover:inline">
              System Online v2.1.0
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-1.5 -ml-1.5 text-gray-500 hover:text-gray-900 outline-none"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={16} />
            </button>
            <span className="text-[11px] font-medium text-gray-900">{sectionLabels[activeSection] || activeSection}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-48">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 text-[11px] bg-gray-50 border border-gray-200 outline-none focus:border-[#3373AB] focus:bg-white"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none">
                  <X size={11} />
                </button>
              )}
            </div>
            <button className="relative p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 outline-none">
              <Bell size={15} />
              <span className="absolute -top-[2px] -right-[2px] h-3.5 w-3.5 bg-red-500 text-white text-[7px] font-bold flex items-center justify-center">3</span>
            </button>
            <div className="h-7 w-7 bg-gradient-to-br from-[#3373AB] to-[#1d4f7a] flex items-center justify-center text-white text-[10px] font-bold">A</div>
          </div>
        </header>

        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
            <div className={`px-4 py-2 text-[11px] font-semibold flex items-center justify-between border-l-4 max-w-md w-full ${
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

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {activeSection === 'overview' && (
            <OverviewSection stats={stats} products={products} courses={courses} ads={ads} orders={orders} broadcasts={broadcasts} certificates={certificates} categories={categories} onNavigate={(s: AdminSection) => setActiveSection(s)} />
          )}
          {activeSection === 'products' && <ProductsSection products={products} setProducts={setProducts} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'orders' && <OrdersSection orders={orders} setOrders={setOrders} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'categories' && <CategoriesSection categories={categories} setCategories={setCategories} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'courses' && <CoursesSection courses={courses} setCourses={setCourses} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'certificates' && <CertificatesSection certificates={certificates} setCertificates={setCertificates} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'ads' && <AdsSection ads={ads} setAds={setAds} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'tv' && <TVSection broadcasts={broadcasts} setBroadcasts={setBroadcasts} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'users' && <PlaceholderSection title="User Management" description="Manage user accounts, roles, and permissions." />}
          {activeSection === 'settings' && <PlaceholderSection title="Settings" description="Configure system preferences and global settings." />}
          {activeSection === 'support' && <PlaceholderSection title="Support" description="View and respond to support tickets." />}
          {activeSection === 'analytics' && <PlaceholderSection title="Analytics" description="Detailed platform analytics and reporting." />}
          {activeSection === 'billing' && <PlaceholderSection title="Billing & Payments" description="Manage subscriptions, invoices, and transactions." />}
          {activeSection === 'notifications' && <PlaceholderSection title="Notifications" description="Configure notification channels and templates." />}
        </main>
      </div>
    </div>
  );
}

/* ─────── PLACEHOLDER SECTION ─────── */
function PlaceholderSection({ title, description }: { title: string; description?: string }) {
  return (
    <div className="bg-white border-b border-gray-200 p-8 text-center">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{title}</h3>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-[11px] text-gray-500">
        <Clock size={12} />
        Coming Soon
      </div>
    </div>
  );
}

/* ─────── OVERVIEW DASHBOARD ─────── */
function OverviewSection({ stats, products, courses, ads, orders, broadcasts, certificates, categories, onNavigate }: any) {
  const totalEnrollments = courses.reduce((s: number, c: any) => s + (c.studentsCount || 0), 0);
  const totalBroadcastViews = broadcasts.reduce((s: number, b: any) => s + (b.views || 0), 0);
  const activeClients = (stats.activeCertificates || 0) + (stats.totalOrders || 0);
  const lowStockProducts = products.filter((p: any) => p.stock < 5).length;
  const verifiedOrders = orders.filter((o: any) => o.status === 'delivered' || o.status === 'shipped').length;
  const notVerifiedOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'processing').length;
  const inStockCount = products.filter((p: any) => p.stock > 0).length;

  return (
    <div>
      {/* Pillar 1: Global Performance KPIs — edge to edge */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-200">
        <div className="border-r border-gray-200 last:border-r-0 bg-white px-4 py-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Total Revenue</p>
            <DollarSign size={16} className="text-[#3373AB]" />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-gray-900">RWF {(stats.totalRevenue || 0).toFixed(2)}</p>
            <TrendIndicator value={12.5} />
          </div>
        </div>
        <div className="border-r border-gray-200 last:border-r-0 bg-white px-4 py-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Active Clients</p>
            <Users size={16} className="text-[#3373AB]" />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-gray-900">{activeClients}</p>
            <TrendIndicator value={5.2} />
          </div>
        </div>
        <div className="border-r border-gray-200 last:border-r-0 bg-white px-4 py-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Global Engagement</p>
            <BarChart3 size={16} className="text-[#3373AB]" />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-gray-900">68.4%</p>
            <TrendIndicator value={-2.1} />
          </div>
        </div>
      </div>

      {/* Pillar 2: B2B Marketplace Snapshot */}
      <div className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingCart size={14} className="text-[#3373AB]" />
            Marketplace
          </h4>
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate?.('products')} className="border-2 border-dashed border-[#3373AB]/40 text-[#3373AB] text-[10px] font-semibold px-3 py-1.5 hover:bg-[#3373AB]/5 outline-none">
              + Add Product
            </button>
            <button onClick={() => onNavigate?.('orders')} className="border-2 border-dashed border-[#3373AB]/40 text-[#3373AB] text-[10px] font-semibold px-3 py-1.5 hover:bg-[#3373AB]/5 outline-none">
              Manage Orders
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <StatusBadge label="In Stock" count={inStockCount} color="bg-[#3373AB]" />
          <StatusBadge label="Categories" count={categories?.length || 0} color="bg-gray-500" />
          <StatusBadge label="Verified" count={verifiedOrders} color="bg-gray-700" />
          <StatusBadge label="Not Verified" count={notVerifiedOrders} color="bg-gray-400" />
        </div>

        {/* Stock Alert with View */}
        {lowStockProducts > 0 && (
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-l-2 border-gray-700">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-gray-600 shrink-0" />
              <p className="text-[11px] text-gray-700">
                <span className="font-semibold">{lowStockProducts}</span> product{lowStockProducts > 1 ? 's' : ''} low in stock
              </p>
            </div>
            <button onClick={() => onNavigate?.('products')} className="text-[10px] font-semibold text-[#3373AB] border border-[#3373AB]/30 px-2.5 py-1 hover:bg-[#3373AB]/5 outline-none">
              View
            </button>
          </div>
        )}
      </div>

      {/* Pillar 3 & 4: EdTech + Media side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-200">
        <div className="border-r border-gray-200 bg-white px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#3373AB]" />
              EdTech
            </h4>
            <button onClick={() => onNavigate?.('courses')} className="border-2 border-dashed border-[#3373AB]/40 text-[#3373AB] text-[10px] font-semibold px-3 py-1.5 hover:bg-[#3373AB]/5 outline-none">
              Manage Courses
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-gray-500">Total Enrollments</span>
                <span className="font-bold text-gray-900">{totalEnrollments}</span>
              </div>
              <div className="h-2 bg-gray-100">
                <div className="h-full bg-[#3373AB]" style={{ width: `${Math.min(100, (totalEnrollments / 50) * 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-gray-500">Course Completion</span>
                <span className="font-bold text-gray-900">{stats.activeCertificates > 0 ? '72%' : '—'}</span>
              </div>
              <div className="h-2 bg-gray-100">
                <div className="h-full bg-gray-700" style={{ width: '72%' }} />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-50">
              <span className="text-gray-500">Active Certificates</span>
              <span className="font-bold text-gray-900">{stats.activeCertificates}</span>
            </div>
          </div>
        </div>
        <div className="bg-white px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Monitor size={14} className="text-[#3373AB]" />
              Media & Ads
            </h4>
            <button onClick={() => onNavigate?.('ads')} className="border-2 border-dashed border-[#3373AB]/40 text-[#3373AB] text-[10px] font-semibold px-3 py-1.5 hover:bg-[#3373AB]/5 outline-none">
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

      {/* Pillar 5: Action Items Feed */}
      <div className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <Bell size={14} className="text-[#3373AB]" />
            Action Items
          </h4>
          <button onClick={() => onNavigate?.('notifications')} className="border-2 border-dashed border-[#3373AB]/40 text-[#3373AB] text-[10px] font-semibold px-3 py-1.5 hover:bg-[#3373AB]/5 outline-none">
            View All
          </button>
        </div>
        <div className="space-y-2">
          {stats.pendingOrders > 0 && (
            <div className="flex items-start gap-3 px-3 py-2.5 bg-gray-50 border-l-2 border-[#3373AB]">
              <ShoppingCart size={14} className="text-gray-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-gray-800">{stats.pendingOrders} orders pending processing</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Requires fulfillment attention</p>
              </div>
            </div>
          )}
          {stats.pendingAds > 0 && (
            <div className="flex items-start gap-3 px-3 py-2.5 bg-gray-50 border-l-2 border-[#3373AB]">
              <Megaphone size={14} className="text-gray-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-gray-800">{stats.pendingAds} ad creatives pending review</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Approve or reject campaign</p>
              </div>
            </div>
          )}
          {lowStockProducts > 0 && (
            <div className="flex items-start gap-3 px-3 py-2.5 bg-gray-50 border-l-2 border-gray-700">
              <Package size={14} className="text-gray-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-gray-800">{lowStockProducts} products low in stock</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Restock needed</p>
              </div>
            </div>
          )}
          {totalEnrollments === 0 && stats.pendingOrders === 0 && stats.pendingAds === 0 && lowStockProducts === 0 && (
            <p className="text-xs text-gray-400 text-center py-6">No pending action items</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────── TABLE WRAPPER ─────── */
function TableWrapper({ title, children, onAdd, totalItems }: { title: string; children: ReactNode; onAdd?: () => void; totalItems?: number }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-900 tracking-wide">{title}</h3>
          {totalItems !== undefined && <span className="text-[10px] text-gray-400">{totalItems} items</span>}
        </div>
        <div className="flex items-center gap-1.5">
          {onAdd && (
            <button onClick={onAdd} className="bg-[#3373AB] hover:bg-[#255C8E] text-white text-[10px] font-semibold px-3 py-1.5 flex items-center gap-1 outline-none">
              <Plus size={11} />
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
function ProductsSection({ products, setProducts, searchQuery, notify }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', category: 'IoT Devices', price: '', description: '', vendorName: '', stock: '' });
  const [page, setPage] = useState(1);
  const perPage = 5;

  const openAdd = () => {
    setEditProduct(null);
    setForm({ name: '', category: 'IoT Devices', price: '', description: '', vendorName: '', stock: '' });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ name: p.name, category: p.category, price: String(p.price), description: p.description, vendorName: p.vendorName, stock: String(p.stock) });
    setShowForm(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    if (editProduct) {
      setProducts(products.map((p: Product) => p.id === editProduct.id ? { ...p, name: form.name, category: form.category, price: parseFloat(form.price), description: form.description, vendorName: form.vendorName, stock: parseInt(form.stock) || 0 } : p));
      notify('success', `Product "${form.name}" updated successfully.`);
    } else {
      const newP: Product = { id: `prod-${Date.now()}`, name: form.name, category: form.category, price: parseFloat(form.price), rating: 0, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60', description: form.description, specs: {}, vendorName: form.vendorName || 'Admin', stock: parseInt(form.stock) || 0 };
      setProducts([newP, ...products]);
      notify('success', `Product "${form.name}" added successfully.`);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p: Product) => p.id !== id));
    notify('success', 'Product removed successfully.');
  };

  const filtered = products.filter((p: Product) =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <TableWrapper title="Product Catalog" onAdd={openAdd} totalItems={filtered.length}>
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">No products found</p>
          </div>
        ) : (
          <>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Name', 'Category', 'Price', 'Vendor', 'Stock', 'Rating', 'Actions'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-semibold text-[10px] text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((p: Product) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">{p.name}</td>
                    <td className="px-3 py-2.5"><span className="bg-gray-100 text-gray-600 px-1.5 py-[2px] text-[9px] font-medium">{p.category}</span></td>
                    <td className="px-3 py-2.5 font-mono font-semibold text-gray-900">RWF ${p.price.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-gray-500">{p.vendorName}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-mono font-semibold px-1.5 py-[2px] ${p.stock > 10 ? 'bg-emerald-50 text-emerald-700' : p.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{p.stock}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="flex items-center gap-1 text-amber-500 text-[10px]">
                        <Star size={9} fill="currentColor" /> {p.rating}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-[2px]">
                        <button onClick={() => openEdit(p)} className="p-1 text-gray-400 hover:text-[#3373AB] hover:bg-blue-50 outline-none"><Edit3 size={12} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 outline-none"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </>
        )}
      </TableWrapper>

      {showForm && (
        <Modal onClose={() => setShowForm(false)} title={editProduct ? 'Edit Product' : 'Add New Product'}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB] bg-white">
                  {['IoT Devices', 'Development Boards', 'Sensors', 'Robotics', 'Power Solutions', 'Electronics Components'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Price (RWF)</label>
                <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Stock</label>
                <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Vendor</label>
                <input value={form.vendorName} onChange={e => setForm({ ...form, vendorName: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 px-4 py-1.5 text-[11px] font-semibold outline-none hover:bg-gray-50">Cancel</button>
              <button type="submit" className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-5 py-1.5 text-[11px] font-bold outline-none">
                {editProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </Modal>
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
  const perPage = 5;

  const advanceOrder = (id: string) => {
    setOrders(orders.map((o: Order) => {
      if (o.id !== id) return o;
      const next = nextStatus[o.status];
      if (!next) return o;
      return { ...o, status: next as Order['status'], tracking: next === 'shipped' ? `TRK-${Math.floor(1000 + Math.random() * 9000)}${id.slice(-1)}` : o.tracking, eta: next === 'delivered' ? 'Delivered' : next === 'shipped' ? 'In Transit' : o.eta };
    }));
    notify('success', `Order ${id} status advanced.`);
  };

  const cancelOrder = (id: string) => {
    setOrders(orders.map((o: Order) => o.id === id ? { ...o, status: 'cancelled' as const, eta: 'Cancelled' } : o));
    notify('success', `Order ${id} cancelled.`);
  };

  const filtered = orders.filter((o: Order) =>
    !searchQuery || o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <TableWrapper title="Order Management & Delivery Tracking" totalItems={filtered.length}>
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">No orders found</p>
          </div>
        ) : (
          <>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Tracking', 'ETA', 'Actions'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-semibold text-[10px] text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((o: Order) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-mono font-semibold text-[#3373AB]">{o.id}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{o.customer}</td>
                    <td className="px-3 py-2.5 text-gray-500 max-w-[180px] truncate">{o.items}</td>
                    <td className="px-3 py-2.5 font-mono font-semibold text-gray-900">RWF ${o.total.toFixed(2)}</td>
                    <td className="px-3 py-2.5">{statusBadge(o.status, statusColors)}</td>
                    <td className="px-3 py-2.5 font-mono text-gray-500 text-[10px]">{o.tracking}</td>
                    <td className="px-3 py-2.5 text-gray-500">{o.eta}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-[2px]">
                        {o.status !== 'delivered' && o.status !== 'cancelled' && (
                          <button onClick={() => advanceOrder(o.id)} className="p-1 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 outline-none" title="Advance Status"><ChevronRight size={12} /></button>
                        )}
                        {o.status !== 'delivered' && o.status !== 'cancelled' && (
                          <button onClick={() => cancelOrder(o.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 outline-none" title="Cancel Order"><X size={12} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
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
  const [form, setForm] = useState({ title: '', category: 'Embedded Systems', instructor: '', duration: '', price: '', level: 'Beginner' as Course['level'] });
  const [page, setPage] = useState(1);
  const perPage = 5;

  const openAdd = () => {
    setEditCourse(null);
    setForm({ title: '', category: 'Embedded Systems', instructor: '', duration: '', price: '', level: 'Beginner' });
    setShowForm(true);
  };

  const openEdit = (c: Course) => {
    setEditCourse(c);
    setForm({ title: c.title, category: c.category, instructor: c.instructor, duration: c.duration, price: String(c.price), level: c.level });
    setShowForm(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    if (editCourse) {
      setCourses(courses.map((c: Course) => c.id === editCourse.id ? { ...c, title: form.title, category: form.category, instructor: form.instructor, duration: form.duration, price: parseFloat(form.price), level: form.level } : c));
      notify('success', `Course "${form.title}" updated.`);
    } else {
      const newC: Course = { id: `course-${Date.now()}`, title: form.title, category: form.category, instructor: form.instructor, duration: form.duration, rating: 0, studentsCount: 0, price: parseFloat(form.price), image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60', level: form.level, syllabus: [], certified: false };
      setCourses([newC, ...courses]);
      notify('success', `Course "${form.title}" added.`);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setCourses(courses.filter((c: Course) => c.id !== id));
    notify('success', 'Course removed.');
  };

  const filtered = courses.filter((c: Course) =>
    !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <TableWrapper title="Course Catalog" onAdd={openAdd} totalItems={filtered.length}>
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">No courses found</p>
          </div>
        ) : (
          <>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Title', 'Category', 'Instructor', 'Duration', 'Price', 'Level', 'Students', 'Actions'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-semibold text-[10px] text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((c: Course) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">{c.title}</td>
                    <td className="px-3 py-2.5"><span className="bg-gray-100 text-gray-600 px-1.5 py-[2px] text-[9px] font-medium">{c.category}</span></td>
                    <td className="px-3 py-2.5 text-gray-500">{c.instructor}</td>
                    <td className="px-3 py-2.5 text-gray-500">{c.duration}</td>
                    <td className="px-3 py-2.5 font-mono font-semibold text-gray-900">RWF ${c.price.toFixed(2)}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-semibold px-1.5 py-[2px] ${c.level === 'Beginner' ? 'bg-emerald-50 text-emerald-700' : c.level === 'Intermediate' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{c.level}</span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-gray-500">{c.studentsCount}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-[2px]">
                        <button onClick={() => openEdit(c)} className="p-1 text-gray-400 hover:text-[#3373AB] hover:bg-blue-50 outline-none"><Edit3 size={12} /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 outline-none"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB] bg-white">
                  {['Embedded Systems', 'Networking', 'AI', 'Cybersecurity'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Level</label>
                <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value as Course['level'] })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB] bg-white">
                  {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Instructor</label>
                <input value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Duration</label>
                <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 40 Hours" className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Price (RWF)</label>
                <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 px-4 py-1.5 text-[11px] font-semibold outline-none hover:bg-gray-50">Cancel</button>
              <button type="submit" className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-5 py-1.5 text-[11px] font-bold outline-none">
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
  const perPage = 5;

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.recipient) return;
    if (editCert) {
      setCertificates(certificates.map((c: Certificate) => c.id === editCert.id ? { ...c, title: form.title, recipient: form.recipient, issueDate: form.issueDate, expiryDate: form.expiryDate } : c));
      notify('success', `Certificate "${form.title}" updated.`);
    } else {
      const newC: Certificate = { id: `CERT-${Date.now()}`, title: form.title, recipient: form.recipient, issueDate: form.issueDate || new Date().toISOString().slice(0, 10), expiryDate: form.expiryDate || '', status: 'active' };
      setCertificates([newC, ...certificates]);
      notify('success', `Certificate issued to ${form.recipient}.`);
    }
    setShowForm(false);
  };

  const toggleStatus = (id: string) => {
    setCertificates(certificates.map((c: Certificate) => c.id === id ? { ...c, status: c.status === 'active' ? 'revoked' as const : 'active' as const } : c));
  };

  const filtered = certificates.filter((c: Certificate) =>
    !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.recipient.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <TableWrapper title="Certificate Management" onAdd={openAdd} totalItems={filtered.length}>
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">No certificates found</p>
          </div>
        ) : (
          <>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['ID', 'Title', 'Recipient', 'Issue Date', 'Expiry Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-semibold text-[10px] text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((c: Certificate) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-mono text-[#3373AB] font-semibold">{c.id}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{c.title}</td>
                    <td className="px-3 py-2.5 flex items-center gap-1.5 text-gray-500">
                      <div className="h-5 w-5 bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500">{c.recipient.charAt(0)}</div>
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
                ))}
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
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Certificate Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Recipient</label>
                <input value={form.recipient} onChange={e => setForm({ ...form, recipient: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Issue Date</label>
                <input type="date" value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Expiry Date</label>
                <input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 px-4 py-1.5 text-[11px] font-semibold outline-none hover:bg-gray-50">Cancel</button>
              <button type="submit" className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-5 py-1.5 text-[11px] font-bold outline-none">
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
  const perPage = 5;

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) return;
    if (editCat) {
      setCategories(categories.map((c: Category) => c.id === editCat.id ? { ...c, name: form.name, thumbnail: form.thumbnail, description: form.description, slug: form.slug } : c));
      notify('success', `Category "${form.name}" updated.`);
    } else {
      const newC: Category = { id: `CAT-${Date.now()}`, name: form.name, thumbnail: form.thumbnail || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=60', description: form.description, slug: form.slug.toLowerCase().replace(/\s+/g, '-') };
      setCategories([newC, ...categories]);
      notify('success', `Category "${form.name}" added.`);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c: Category) => c.id !== id));
    notify('success', 'Category removed.');
  };

  const filtered = categories.filter((c: Category) =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <TableWrapper title="Category Management" onAdd={openAdd} totalItems={filtered.length}>
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">No categories found</p>
          </div>
        ) : (
          <>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Thumbnail', 'Name', 'Slug', 'Description', 'Actions'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-semibold text-[10px] text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((c: Category) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5">
                      <div className="h-8 w-8 bg-gray-100 overflow-hidden">
                        <img src={c.thumbnail} alt={c.name} className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{c.name}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-gray-500">{c.slug}</td>
                    <td className="px-3 py-2.5 text-gray-500 max-w-[200px] truncate">{c.description}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-[2px]">
                        <button onClick={() => openEdit(c)} className="p-1 text-gray-400 hover:text-[#3373AB] hover:bg-blue-50 outline-none"><Edit3 size={12} /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 outline-none"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
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
              <span className="text-[9px] text-gray-400 font-mono">Thumbnail Preview</span>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. IoT Devices" className="w-full border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all rounded" required />
              </div>

              {/* Thumbnail: URL + File Upload */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Thumbnail</label>
                <div className="space-y-2">
                  <input value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} placeholder="Paste image URL..." className="w-full border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all font-mono text-[10.5px] rounded" />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-mono">or</span>
                    <input type="file" id="cat-thumb-upload" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => { if (ev.target?.result) setForm({ ...form, thumbnail: ev.target.result as string }); }; reader.readAsDataURL(file); } }} />
                    <button type="button" onClick={() => document.getElementById('cat-thumb-upload')?.click()} className="text-[10px] font-semibold text-[#3373AB] border border-[#3373AB]/30 px-3 py-1.5 hover:bg-[#3373AB]/5 transition-all rounded">
                      Upload from Device
                    </button>
                  </div>
                </div>
              </div>

              {/* Slug + Description */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Slug</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="iot-devices" className="w-full border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all font-mono rounded" required />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                  <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." className="w-full border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-[#3373AB] focus:ring-1 focus:ring-[#3373AB]/20 transition-all rounded" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-5 border-t border-gray-100">
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 px-5 py-2 text-[11px] font-semibold outline-none hover:bg-gray-50 transition-all rounded">Cancel</button>
              <button type="submit" className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-6 py-2 text-[11px] font-bold outline-none tracking-wide transition-all rounded">
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
  const perPage = 5;

  const approveAd = (id: string) => {
    setAds(ads.map((a: AdRequest) => a.id === id ? { ...a, status: a.status === 'pending' ? 'approved' as const : a.status === 'approved' ? 'active' as const : a.status } : a));
    notify('success', `Ad request ${id} approved.`);
  };

  const rejectAd = (id: string) => {
    setAds(ads.map((a: AdRequest) => a.id === id ? { ...a, status: 'rejected' as const } : a));
    notify('success', `Ad request ${id} rejected.`);
  };

  const filtered = ads.filter((a: AdRequest) =>
    !searchQuery || a.company.toLowerCase().includes(searchQuery.toLowerCase()) || a.campaign.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <TableWrapper title="Advertising Requests" totalItems={filtered.length}>
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">No ad requests found</p>
          </div>
        ) : (
          <>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['ID', 'Company', 'Campaign', 'Placement', 'Budget', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-semibold text-[10px] text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((a: AdRequest) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-mono font-semibold text-[#3373AB]">{a.id}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{a.company}</td>
                    <td className="px-3 py-2.5 text-gray-500">{a.campaign}</td>
                    <td className="px-3 py-2.5"><span className="bg-gray-100 text-gray-600 px-1.5 py-[2px] text-[9px] font-medium">{a.placement}</span></td>
                    <td className="px-3 py-2.5 font-mono font-semibold text-gray-900">RWF ${a.budget.toFixed(2)}</td>
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
                ))}
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
  const perPage = 5;

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    if (editBroadcast) {
      setBroadcasts(broadcasts.map((b: Broadcast) => b.id === editBroadcast.id ? { ...b, title: form.title, category: form.category, host: form.host, description: form.description } : b));
      notify('success', `Broadcast "${form.title}" updated.`);
    } else {
      const newB: Broadcast = { id: `vid-${Date.now()}`, title: form.title, type: 'live', host: form.host, views: 0, thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&auto=format&fit=crop&q=60', description: form.description, category: form.category };
      setBroadcasts([newB, ...broadcasts]);
      notify('success', `Broadcast "${form.title}" added.`);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setBroadcasts(broadcasts.filter((b: Broadcast) => b.id !== id));
    notify('success', 'Broadcast removed.');
  };

  const filtered = broadcasts.filter((b: Broadcast) =>
    !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <TableWrapper title="MTTV Broadcast Management" onAdd={openAdd} totalItems={filtered.length}>
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">No broadcasts found</p>
          </div>
        ) : (
          <>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Title', 'Type', 'Category', 'Host', 'Views', 'Scheduled', 'Actions'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-semibold text-[10px] text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((b: Broadcast) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">{b.title}</td>
                    <td className="px-3 py-2.5">{statusBadge(b.type, typeColors)}</td>
                    <td className="px-3 py-2.5"><span className="bg-gray-100 text-gray-600 px-1.5 py-[2px] text-[9px] font-medium">{b.category}</span></td>
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
                ))}
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
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB] bg-white">
                  {['Live Events', 'Webinars', 'Podcasts', 'Tutorials'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Host</label>
                <input value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 px-4 py-1.5 text-[11px] font-semibold outline-none hover:bg-gray-50">Cancel</button>
              <button type="submit" className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-5 py-1.5 text-[11px] font-bold outline-none">
                {editBroadcast ? 'Update Broadcast' : 'Add Broadcast'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ─────── MODAL ─────── */
function Modal({ children, onClose, title }: { children: ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        <div className="bg-[#0f1419] text-white px-4 py-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white outline-none p-0.5"><X size={14} /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
