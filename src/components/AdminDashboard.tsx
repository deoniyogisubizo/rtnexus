import { useState, type ReactNode, type FormEvent } from 'react';
import { Product, Course, Broadcast } from '../types';
import { FEATURED_PRODUCTS, COURSES, BROADCASTS } from '../data/mockData';

const statusBadge = (status: string, colors: Record<string, string>) => {
  const color = colors[status] || 'bg-gray-100 text-gray-600';
  return <span className={`text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider ${color}`}>{status}</span>;
};
import {
  LayoutDashboard, Package, ShoppingCart, BookOpen, Award, Megaphone, Monitor,
  Plus, Edit3, Trash2, Eye, X, Check, Search, ChevronRight, ChevronDown,
  ArrowUpDown, MoreHorizontal, Clock, Truck, MapPin, Settings, Users,
  DollarSign, BarChart3, Filter, FileText, Download, RefreshCw, AlertTriangle,
  Home, UserCheck, MessageSquare, HelpCircle, LogOut, Layers, Globe, CreditCard,
  Shield, Bell, Grid
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

interface AdRequest {
  id: string;
  company: string;
  campaign: string;
  placement: string;
  budget: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  date: string;
}

type AdminSection = 'overview' | 'products' | 'orders' | 'courses' | 'certificates' | 'ads' | 'tv' | 'users' | 'settings' | 'support' | 'analytics' | 'billing' | 'notifications';

interface SidebarGroup {
  label: string;
  items: { id: AdminSection; icon: ReactNode; label: string }[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    label: 'Main',
    items: [
      { id: 'overview', icon: <BarChart3 size={18} />, label: 'Dashboard Overview' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { id: 'products', icon: <Package size={18} />, label: 'Manage Products' },
      { id: 'orders', icon: <ShoppingCart size={18} />, label: 'Manage Orders' },
      { id: 'billing', icon: <CreditCard size={18} />, label: 'Billing & Payments' },
    ],
  },
  {
    label: 'Education',
    items: [
      { id: 'courses', icon: <BookOpen size={18} />, label: 'Manage Courses' },
      { id: 'certificates', icon: <Award size={18} />, label: 'Certificates' },
    ],
  },
  {
    label: 'Media & Ads',
    items: [
      { id: 'tv', icon: <Monitor size={18} />, label: 'TV Management' },
      { id: 'ads', icon: <Megaphone size={18} />, label: 'Ads Requests' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'users', icon: <Users size={18} />, label: 'User Management' },
      { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
      { id: 'analytics', icon: <Globe size={18} />, label: 'Analytics' },
      { id: 'settings', icon: <Settings size={18} />, label: 'Settings' },
      { id: 'support', icon: <HelpCircle size={18} />, label: 'Support' },
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

export default function AdminDashboard({ onBack }: { onBack?: () => void }) {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [hover, setHover] = useState(false);

  const [products, setProducts] = useState<Product[]>(FEATURED_PRODUCTS);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(BROADCASTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [ads, setAds] = useState<AdRequest[]>(INITIAL_ADS);

  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  const expanded = hover;

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans flex">
      {/* Hover trigger zone */}
      <div
        className="fixed left-0 top-0 w-2 h-full z-30"
        onMouseEnter={() => setHover(true)}
      />

      {/* Sidebar */}
      <aside
        className={`bg-[#111111] text-white flex flex-col border-r border-neutral-800 transition-all duration-200 ease-out z-20 ${
          expanded ? 'w-58' : 'w-16'
        }`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Logo / Brand */}
        <div className="h-14 flex items-center justify-center border-b border-neutral-800 shrink-0">
          {expanded ? (
            <div className="flex items-center gap-2.5 w-full px-4">
              <div className="h-7 w-7 bg-[#3373AB] flex items-center justify-center shrink-0">
                <Grid size={14} className="text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-[9px] font-mono text-[#3373AB] font-bold tracking-widest block">ADMIN</span>
                <span className="text-xs font-bold tracking-tight block">System Control</span>
              </div>
            </div>
          ) : (
            <div className="h-7 w-7 bg-[#3373AB] flex items-center justify-center">
              <Grid size={14} className="text-white" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-1">
          {sidebarGroups.map(group => (
            <div key={group.label}>
              {expanded && (
                <div className="px-4 pt-3 pb-1">
                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">{group.label}</span>
                </div>
              )}
              {group.items.map(item => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 outline-none text-left transition-all duration-150 ${
                      expanded ? 'px-4 py-2.5' : 'px-0 py-3 justify-center'
                    } ${
                      isActive
                        ? 'text-[#3373AB] bg-[#3373AB]/10 border-r-2 border-[#3373AB]'
                        : 'text-gray-400 hover:text-white hover:bg-neutral-900 border-r-2 border-transparent'
                    }`}
                    title={!expanded ? item.label : undefined}
                  >
                    <span className="shrink-0 flex items-center justify-center w-5">
                      {item.icon}
                    </span>
                    {expanded && (
                      <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Back to Page View */}
        <div className="border-t border-neutral-800">
          {onBack && (
            <button
              onClick={onBack}
              className={`w-full flex items-center gap-3 text-gray-400 hover:text-white hover:bg-neutral-900 outline-none text-left transition-colors border-r-2 border-transparent ${
                expanded ? 'px-4 py-3' : 'px-0 py-3 justify-center'
              }`}
              title={!expanded ? 'Back to Page View' : undefined}
            >
              <span className="shrink-0 flex items-center justify-center w-5">
                <Home size={18} />
              </span>
              {expanded && (
                <span className="text-xs font-medium whitespace-nowrap">Back to Page View</span>
              )}
            </button>
          )}
          {expanded && (
            <div className="px-4 py-2.5">
              <div className="flex items-center gap-2 text-[9px] font-mono text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span>System Online • v2.0.1</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Top Notification Bell */}
        <div className="absolute top-4 right-6 z-40">
          <button className="relative p-2 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors outline-none">
            <Bell size={16} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">3</span>
          </button>
        </div>

        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 pointer-events-none">
            <div className={`pointer-events-auto px-5 py-3 text-xs font-semibold flex items-center justify-between border-l-4 shadow-lg max-w-md w-full ${
              notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-500' : 'bg-red-50 text-red-800 border-red-500'
            }`}>
              <span className="flex items-center gap-2">
                {notification.type === 'success' ? <Check size={14} /> : <AlertTriangle size={14} />}
                {notification.message}
              </span>
              <button onClick={() => setNotification(null)} className="opacity-60 hover:opacity-100 outline-none ml-3">
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeSection === 'overview' && <OverviewSection stats={stats} />}
          {activeSection === 'products' && <ProductsSection products={products} setProducts={setProducts} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'orders' && <OrdersSection orders={orders} setOrders={setOrders} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'courses' && <CoursesSection courses={courses} setCourses={setCourses} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'certificates' && <CertificatesSection certificates={certificates} setCertificates={setCertificates} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'ads' && <AdsSection ads={ads} setAds={setAds} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'tv' && <TVSection broadcasts={broadcasts} setBroadcasts={setBroadcasts} searchQuery={searchQuery} notify={notify} />}
          {activeSection === 'users' && <PlaceholderSection title="User Management" icon={<Users size={18} />} />}
          {activeSection === 'settings' && <PlaceholderSection title="Settings" icon={<Settings size={18} />} />}
          {activeSection === 'support' && <PlaceholderSection title="Support" icon={<HelpCircle size={18} />} />}
          {activeSection === 'analytics' && <PlaceholderSection title="Analytics" icon={<Globe size={18} />} />}
          {activeSection === 'billing' && <PlaceholderSection title="Billing & Payments" icon={<CreditCard size={18} />} />}
          {activeSection === 'notifications' && <PlaceholderSection title="Notifications" icon={<Bell size={18} />} />}
        </div>
      </div>
    </div>
  );
}

/* ─────── PLACEHOLDER SECTION ─────── */
function PlaceholderSection({ title, icon }: { title: string; icon: ReactNode }) {
  return (
    <div className="p-8">
      <div className="bg-white border border-gray-200 p-8 text-center">
        <div className="text-gray-300 flex justify-center mb-4">{icon}</div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{title}</h3>
        <p className="text-xs text-gray-400 mt-2">This section is under development.</p>
      </div>
    </div>
  );
}

/* ─────── OVERVIEW DASHBOARD ─────── */
function OverviewSection({ stats }: { stats: Record<string, number> }) {
  const cards = [
    { label: 'Total Products', value: stats.totalProducts, icon: <Package size={20} />, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingCart size={20} />, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: <Clock size={20} />, color: 'text-amber-600 bg-amber-50' },
    { label: 'Total Courses', value: stats.totalCourses, icon: <BookOpen size={20} />, color: 'text-purple-600 bg-purple-50' },
    { label: 'Active Certificates', value: stats.activeCertificates, icon: <Award size={20} />, color: 'text-cyan-600 bg-cyan-50' },
    { label: 'Pending Ads', value: stats.pendingAds, icon: <Megaphone size={20} />, color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 size={20} className="text-[#3373AB]" />
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Dashboard Overview</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(card => (
          <div key={card.label} className="bg-white border border-gray-200 p-5 flex items-start gap-4 shadow-sm">
            <div className={`p-2.5 ${card.color}`}>{card.icon}</div>
            <div>
              <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 p-5 shadow-sm">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <DollarSign size={14} className="text-emerald-500" />
            Revenue Summary
          </h4>
          <div className="text-3xl font-bold text-gray-900">RWF ${stats.totalRevenue.toFixed(2)}</div>
          <p className="text-[11px] text-gray-400 mt-1">Total delivered order revenue</p>
          <div className="mt-4 h-2 bg-gray-100 overflow-hidden">
            <div className="h-full bg-emerald-500 w-3/5"></div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 shadow-sm">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users size={14} className="text-[#3373AB]" />
            Quick Actions
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {['products', 'orders', 'courses', 'ads'].map(s => (
              <div key={s} className="bg-gray-50 border border-gray-200 p-3 text-center text-xs font-semibold text-gray-700 hover:bg-[#3373AB] hover:text-white transition-colors cursor-pointer uppercase tracking-wider">
                {s === 'products' ? 'Add Product' : s === 'orders' ? 'View Orders' : s === 'courses' ? 'Add Course' : 'Manage Ads'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────── TABLE WRAPPER ─────── */
function TableWrapper({ title, icon, children, onAdd }: { title: string; icon: ReactNode; children: ReactNode; onAdd?: () => void }) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#3373AB]">{icon}</span>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{title}</h3>
        </div>
        {onAdd && (
          <button onClick={onAdd} className="bg-[#3373AB] hover:bg-[#255C8E] text-white text-[10px] font-bold px-3 py-1.5 flex items-center gap-1.5 transition-colors outline-none uppercase tracking-wider">
            <Plus size={12} />
            Add New
          </button>
        )}
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

  return (
    <div className="p-8 space-y-4">
      <TableWrapper title="Product Catalog" icon={<Package size={14} />} onAdd={openAdd}>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Name', 'Category', 'Price', 'Vendor', 'Stock', 'Rating', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-bold text-[10px] text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((p: Product) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.category}</td>
                <td className="px-4 py-3 font-mono font-bold text-gray-900">RWF ${p.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-500">{p.vendorName}</td>
                <td className="px-4 py-3"><span className="bg-gray-100 text-gray-700 px-2 py-0.5 text-[10px] font-mono">{p.stock}</span></td>
                <td className="px-4 py-3"><span className="flex items-center gap-1 text-amber-600 text-[10px]">{p.rating} ★</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-[#3373AB] hover:bg-blue-50 outline-none"><Edit3 size={13} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 outline-none"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>

      {showForm && (
        <Modal onClose={() => setShowForm(false)} title={editProduct ? 'Edit Product' : 'Add New Product'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB] bg-white">
                  {['IoT Devices', 'Development Boards', 'Sensors', 'Robotics', 'Power Solutions', 'Electronics Components'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Price (RWF)</label>
                <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Stock</label>
                <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Vendor</label>
                <input value={form.vendorName} onChange={e => setForm({ ...form, vendorName: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 px-4 py-2 text-xs font-semibold outline-none hover:bg-gray-50">Cancel</button>
              <button type="submit" className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-5 py-2 text-xs font-bold outline-none">
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

  const advanceOrder = (id: string) => {
    setOrders(orders.map((o: Order) => {
      if (o.id !== id) return o;
      const next = nextStatus[o.status];
      if (!next) return o;
      return { ...o, status: next, tracking: next === 'shipped' ? `TRK-${Math.floor(1000 + Math.random() * 9000)}${id.slice(-1)}` : o.tracking, eta: next === 'delivered' ? 'Delivered' : next === 'shipped' ? 'In Transit' : o.eta };
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

  return (
    <div className="p-8 space-y-4">
      <TableWrapper title="Order Management & Delivery Tracking" icon={<ShoppingCart size={14} />}>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Tracking', 'ETA', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-bold text-[10px] text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((o: Order) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-bold text-[#3373AB]">{o.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{o.customer}</td>
                <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{o.items}</td>
                <td className="px-4 py-3 font-mono font-bold text-gray-900">RWF ${o.total.toFixed(2)}</td>
                <td className="px-4 py-3">{statusBadge(o.status, statusColors)}</td>
                <td className="px-4 py-3 font-mono text-gray-500">{o.tracking}</td>
                <td className="px-4 py-3 text-gray-500">{o.eta}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {o.status !== 'delivered' && o.status !== 'cancelled' && (
                      <button onClick={() => advanceOrder(o.id)} className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 outline-none" title="Advance Status"><ChevronRight size={13} /></button>
                    )}
                    {o.status !== 'delivered' && o.status !== 'cancelled' && (
                      <button onClick={() => cancelOrder(o.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 outline-none" title="Cancel Order"><X size={13} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
    </div>
  );
}

/* ─────── COURSES SECTION ─────── */
function CoursesSection({ courses, setCourses, searchQuery, notify }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [form, setForm] = useState({ title: '', category: 'Embedded Systems', instructor: '', duration: '', price: '', level: 'Beginner' as Course['level'] });

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

  return (
    <div className="p-8 space-y-4">
      <TableWrapper title="Course Catalog" icon={<BookOpen size={14} />} onAdd={openAdd}>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Title', 'Category', 'Instructor', 'Duration', 'Price', 'Level', 'Students', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-bold text-[10px] text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((c: Course) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{c.title}</td>
                <td className="px-4 py-3 text-gray-500">{c.category}</td>
                <td className="px-4 py-3 text-gray-500">{c.instructor}</td>
                <td className="px-4 py-3 text-gray-500">{c.duration}</td>
                <td className="px-4 py-3 font-mono font-bold text-gray-900">RWF ${c.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 ${c.level === 'Beginner' ? 'bg-emerald-100 text-emerald-700' : c.level === 'Intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{c.level}</span>
                </td>
                <td className="px-4 py-3 font-mono text-gray-500">{c.studentsCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-[#3373AB] hover:bg-blue-50 outline-none"><Edit3 size={13} /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 outline-none"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>

      {showForm && (
        <Modal onClose={() => setShowForm(false)} title={editCourse ? 'Edit Course' : 'Add New Course'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB] bg-white">
                  {['Embedded Systems', 'Networking', 'AI', 'Cybersecurity'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Level</label>
                <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value as Course['level'] })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB] bg-white">
                  {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Instructor</label>
                <input value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Duration</label>
                <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 40 Hours" className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Price (RWF)</label>
                <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 px-4 py-2 text-xs font-semibold outline-none hover:bg-gray-50">Cancel</button>
              <button type="submit" className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-5 py-2 text-xs font-bold outline-none">
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

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    expired: 'bg-red-100 text-red-700',
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

  return (
    <div className="p-8 space-y-4">
      <TableWrapper title="Certificate Management" icon={<Award size={14} />} onAdd={openAdd}>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['ID', 'Title', 'Recipient', 'Issue Date', 'Expiry Date', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-bold text-[10px] text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((c: Certificate) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-[#3373AB] font-bold">{c.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{c.title}</td>
                <td className="px-4 py-3 text-gray-500">{c.recipient}</td>
                <td className="px-4 py-3 text-gray-500">{c.issueDate}</td>
                <td className="px-4 py-3 text-gray-500">{c.expiryDate || '—'}</td>
                <td className="px-4 py-3">{statusBadge(c.status, statusColors)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-[#3373AB] hover:bg-blue-50 outline-none"><Edit3 size={13} /></button>
                    <button onClick={() => toggleStatus(c.id)} className={`p-1.5 outline-none ${c.status === 'active' ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50'}`}>
                      {c.status === 'active' ? <X size={13} /> : <RefreshCw size={13} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>

      {showForm && (
        <Modal onClose={() => setShowForm(false)} title={editCert ? 'Edit Certificate' : 'Issue New Certificate'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Certificate Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Recipient</label>
                <input value={form.recipient} onChange={e => setForm({ ...form, recipient: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Issue Date</label>
                <input type="date" value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Expiry Date</label>
                <input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 px-4 py-2 text-xs font-semibold outline-none hover:bg-gray-50">Cancel</button>
              <button type="submit" className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-5 py-2 text-xs font-bold outline-none">
                {editCert ? 'Update Certificate' : 'Issue Certificate'}
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
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
    active: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-gray-100 text-gray-600',
  };

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

  return (
    <div className="p-8 space-y-4">
      <TableWrapper title="Advertising Requests" icon={<Megaphone size={14} />}>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['ID', 'Company', 'Campaign', 'Placement', 'Budget', 'Date', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-bold text-[10px] text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((a: AdRequest) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-bold text-[#3373AB]">{a.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{a.company}</td>
                <td className="px-4 py-3 text-gray-500">{a.campaign}</td>
                <td className="px-4 py-3"><span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 font-mono">{a.placement}</span></td>
                <td className="px-4 py-3 font-mono font-bold text-gray-900">RWF ${a.budget.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-500">{a.date}</td>
                <td className="px-4 py-3">{statusBadge(a.status, statusColors)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {(a.status === 'pending' || a.status === 'approved') && (
                      <button onClick={() => approveAd(a.id)} className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 outline-none" title="Approve"><Check size={13} /></button>
                    )}
                    {(a.status === 'pending' || a.status === 'approved') && (
                      <button onClick={() => rejectAd(a.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 outline-none" title="Reject"><X size={13} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
    </div>
  );
}

/* ─────── TV / BROADCAST SECTION ─────── */
function TVSection({ broadcasts, setBroadcasts, searchQuery, notify }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editBroadcast, setEditBroadcast] = useState<Broadcast | null>(null);
  const [form, setForm] = useState({ title: '', category: 'Live Events', host: '', description: '' });

  const typeColors: Record<string, string> = {
    live: 'bg-red-100 text-red-700',
    webinar: 'bg-blue-100 text-blue-700',
    podcast: 'bg-purple-100 text-purple-700',
    tutorial: 'bg-cyan-100 text-cyan-700',
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

  return (
    <div className="p-8 space-y-4">
      <TableWrapper title="MTTV Broadcast Management" icon={<Monitor size={14} />} onAdd={openAdd}>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Title', 'Type', 'Category', 'Host', 'Views', 'Scheduled', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-bold text-[10px] text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((b: Broadcast) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{b.title}</td>
                <td className="px-4 py-3">{statusBadge(b.type, typeColors)}</td>
                <td className="px-4 py-3 text-gray-500">{b.category}</td>
                <td className="px-4 py-3 text-gray-500">{b.host}</td>
                <td className="px-4 py-3 font-mono text-gray-500">{b.views.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500">{b.scheduledTime || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(b)} className="p-1.5 text-gray-400 hover:text-[#3373AB] hover:bg-blue-50 outline-none"><Edit3 size={13} /></button>
                    <button onClick={() => handleDelete(b.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 outline-none"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>

      {showForm && (
        <Modal onClose={() => setShowForm(false)} title={editBroadcast ? 'Edit Broadcast' : 'Add New Broadcast'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB] bg-white">
                  {['Live Events', 'Webinars', 'Podcasts', 'Tutorials'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Host</label>
                <input value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#3373AB]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 px-4 py-2 text-xs font-semibold outline-none hover:bg-gray-50">Cancel</button>
              <button type="submit" className="bg-[#3373AB] hover:bg-[#255C8E] text-white px-5 py-2 text-xs font-bold outline-none">
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        <div className="bg-[#111111] text-white px-5 py-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white outline-none"><X size={16} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
