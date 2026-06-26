import React, { useState } from 'react';
import styled from 'styled-components';
import { UserSession, Product, Course, Broadcast, OpenPosition, AdCampaignEstimate } from '../types';
import { Sliders, Monitor, Terminal, FileCode, CheckCircle, Ship, Plus, Play, Users, BookOpen, ShieldCheck, RefreshCw, AlertTriangle, Cpu, DollarSign, BarChart2, Layers, Settings } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import { useEffect } from 'react';
import { fetchProducts, fetchCourses, fetchVideos } from '../services/api';
import AdminDashboard from './AdminDashboard';

interface UserPortalsProps {
  user: UserSession;
  setView?: (view: string) => void;
}

export default function UserPortals({ user, setView }: UserPortalsProps) {
  const [activeWorkspace, setActiveWorkspace] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const workspaceOptions = [
    { role: 'customer', label: 'Marketplace Buyer', icon: <i className="fa-solid fa-cart-arrow-down" style={{fontSize:'14px'}}></i>, desc: 'Browse products, manage orders and escrow shipments.' },
    { role: 'student', label: 'RTTI Student Node', icon: <BookOpen size={18} />, desc: 'Enroll in courses, take exams, view certifications.' },
    { role: 'instructor', label: 'Research Instructor', icon: <Monitor size={18} />, desc: 'Manage courses, grade exams, schedule live webinars.' },
    { role: 'vendor', label: 'OEM Foundry Seller', icon: <Ship size={18} />, desc: 'List products, manage inventory, track logistics.' },
    { role: 'advertiser', label: 'Sponsorship Partner', icon: <BarChart2 size={18} />, desc: 'Create campaigns, track impressions, manage budgets.' },
    { role: 'admin', label: 'System Administrator', icon: <Settings size={18} />, desc: 'Full system control: manage products, orders, courses, certs, ads & TV settings.' },
  ];

  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [fetchedCourses, setFetchedCourses] = useState<Course[]>([]);
  const [fetchedBroadcasts, setFetchedBroadcasts] = useState<Broadcast[]>([]);

  useEffect(() => {
    fetchProducts().then(setFetchedProducts).catch(() => {});
    fetchCourses().then(setFetchedCourses).catch(() => {});
    fetchVideos().then(setFetchedBroadcasts).catch(() => {});
  }, []);

  // Vendor specific products adding state
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCat, setNewProdCat] = useState('IoT Devices');
  const [vendorSuccess, setVendorSuccess] = useState(false);

  // Instructor webinar schedules state
  const [instructorBroadcasts, setInstructorBroadcasts] = useState<Broadcast[]>([]);
  const [newBroadTitle, setNewBroadTitle] = useState('');
  const [newBroadCat, setNewBroadCat] = useState('Webinars');
  const [broadSuccess, setBroadSuccess] = useState(false);

  // Submit vendor element
  const handleAddProductVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    const newPr: Product = {
      id: `prod-0${vendorProducts.length + 10}`,
      name: newProdName,
      category: newProdCat,
      price: parseFloat(newProdPrice),
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60',
      description: 'Custom foundry component submitted via OEM Vendor dashboard panel under calibration standards.',
      specs: { 'Telemetry Check': 'True', 'Frequency Range': 'Standard Gbl Band' },
      vendorName: user.name,
      stock: 100
    };
    setVendorProducts(prev => [newPr, ...prev]);
    setNewProdName('');
    setNewProdPrice('');
    setVendorSuccess(true);
    setTimeout(() => setVendorSuccess(false), 3000);
  };

  // Submit instructor class element
  const handleAddLiveStreamInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBroadTitle) return;
    const newBr: Broadcast = {
      id: `vid-0${instructorBroadcasts.length + 10}`,
      title: newBroadTitle,
      type: 'webinar',
      host: user.name,
      views: 0,
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format&fit=crop&q=60',
      description: 'Scheduled on-demand certification webinar review compiled by RTTI lead.',
      category: newBroadCat
    };
    setInstructorBroadcasts(prev => [newBr, ...prev]);
    setNewBroadTitle('');
    setBroadSuccess(true);
    setTimeout(() => setBroadSuccess(false), 3000);
  };

  // Core Render switches
  return (
    <section className="w-full bg-white text-gray-900 select-none py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <Breadcrumb
          segments={[
            { label: 'Home', onClick: () => setView?.('home') },
            { label: 'Dashboard' },
          ]}
        />

        {showWelcome && (
          <StyledWelcome>
            <div className="animation">welcome back to rt group portals</div>
          </StyledWelcome>
        )}

        {/* Portal top workspace identification */}
        <div className="border-b border-gray-200 pb-6 mb-10 text-left flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-[#3373AB] font-mono text-xs font-bold uppercase tracking-[0.2em]">CONNECTED CENTRAL OVERWATCH HUD</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight mt-1 font-sans text-gray-900">
              RT NEXUS CONSOLE • {user.role === 'all' ? (activeWorkspace ? `${activeWorkspace.toUpperCase()} WORKSPACE` : 'ALL IN ONE') : `${user.role.toUpperCase()} WORKSPACE`}
            </h2>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-3 flex items-center gap-3.5">
            <div className={`h-2 w-2 rounded-full bg-emerald-400 animate-pulse`}></div>
            <div className="text-left">
              <p className="text-xs font-sans font-bold text-gray-900 line-clamp-1">{user.name}</p>
              <p className="text-xs text-gray-500 font-mono tracking-wide leading-none uppercase mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>

        {/* ALL-IN-ONE WORKSPACE PICKER */}
        {(user.role === 'all') && !activeWorkspace && (
          <div className="text-left">
            <div className="flex items-center gap-2 mb-6">
              <Layers size={16} className="text-[#3373AB]" />
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wider font-bold">Select your active workspace</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaceOptions.map((ws) => (
                <button
                  key={ws.role}
                  onClick={() => setActiveWorkspace(ws.role)}
                  className="bg-white border border-gray-200 hover:border-[#3373AB] p-5 text-left transition-all group outline-none shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30"
                >
                  <div className="text-[#3373AB] mb-3 group-hover:scale-110 transition-transform">{ws.icon}</div>
                  <h4 className="font-bold text-sm text-gray-900 uppercase tracking-tight">{ws.label}</h4>
                  <p className="text-xs text-gray-500 font-sans mt-1.5 leading-relaxed">{ws.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ALL-IN-ONE: show workspace header + role content */}
        {user.role === 'all' && activeWorkspace && (
          <>
            <div className="border-b border-gray-200 pb-4 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveWorkspace(null)}
                  className="text-xs font-mono text-gray-500 hover:text-gray-900 border border-gray-200 px-2.5 py-1 outline-none"
                >
                  ← Switch Workspace
                </button>
                <span className="text-sm font-bold uppercase tracking-wider text-[#3373AB]">
                  {workspaceOptions.find(w => w.role === activeWorkspace)?.label} MODE
                </span>
              </div>
            </div>
            {/* Role sections render below via their existing conditions */}
          </>
        )}

        {/* 1. CUSTOMER WORKSPACE PORTAL */}
        {(user.role === 'customer' || activeWorkspace === 'customer') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Orders summary */}
            <div className="lg:col-span-8 space-y-6">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">Escrow Freight Shipments Ledger</h3>
              
              <div className="border border-gray-200 bg-white p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-xs font-mono text-[#3373AB] font-bold">
                  TRACKING: NX-9812A
                </div>
                
                <h4 className="font-sans font-bold text-sm text-gray-900 uppercase tracking-tight">IoT Gateway Core Hub X1</h4>
                <p className="text-xs font-mono text-gray-500">VENDOR HUB: Nexus Embedded Corp • CALIBRATED: Yes</p>
                
                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs font-mono select-none">
                  <div className="bg-gray-100 p-2 text-emerald-400 border border-emerald-500/20">
                    <span className="block font-bold">● DONE</span>
                    <span className="text-gray-500 mt-1 block">Escrow Paid</span>
                  </div>
                  <div className="bg-gray-100 p-2 text-emerald-400 border border-emerald-500/20">
                    <span className="block font-bold">● DONE</span>
                    <span className="text-gray-500 mt-1 block">Stress Test</span>
                  </div>
                  <div className="bg-blue-50 p-2 text-[#3373AB] border border-[#3373AB]/30 animate-pulse">
                    <span className="block font-bold">▶ IN TRANSIT</span>
                    <span className="text-gray-600 mt-1 block font-sans">Freight Truck</span>
                  </div>
                  <div className="bg-gray-100 p-2 text-gray-500">
                    <span className="block">PENDING</span>
                    <span className="text-gray-600 mt-1 block">Receiving OK</span>
                  </div>
                </div>
              </div>

              {/* Invoices list */}
              <div className="border border-gray-200 bg-white">
                <div className="bg-gray-100 p-3 border-b border-gray-200 font-mono text-xs uppercase font-bold tracking-wider text-gray-500">
                  Historical Procurement Logs
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="p-4 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold">Matrix Transducers calibration pack</p>
                      <span className="text-xs text-gray-500 font-mono">Invoice hash: #IN-44281X • May 14, 2026</span>
                    </div>
                    <span className="font-mono text-[#3373AB] font-bold">RWF 79.00</span>
                  </div>

                  <div className="p-4 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold">Autonomous Mecanum Drive-Train Pod</p>
                      <span className="text-xs text-gray-500 font-mono">Invoice hash: #IN-31012Y • Mar 10, 2026</span>
                    </div>
                    <span className="font-mono text-[#3373AB] font-bold">RWF 520.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar quick indicators */}
            <div className="lg:col-span-4 bg-gray-100 border border-gray-200 p-6 space-y-6">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-900">Escrow Escutcheon Summary</h4>
              <p className="text-xs text-gray-500 font-sans font-light leading-relaxed">
                Your portal logs hold verified developer funds in trust. Once freight arrivals are compiled, upload calibrations criteria to clear foundry payouts.
              </p>

              <div className="bg-gray-50 p-4 border border-gray-100 font-mono text-xs text-gray-500 uppercase">
                <span className="flex justify-between">
                  <span>Sovereign Limit:</span>
                  <span className="text-emerald-400">RWF 10,000 / RWF 10,000</span>
                </span>
                <span className="flex justify-between mt-1">
                  <span>Locked Escrow:</span>
                  <span className="text-amber-400">RWF 349.99</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. STUDENT WORKSPACE PORTAL */}
        {(user.role === 'student' || activeWorkspace === 'student') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Certifications and scores */}
            <div className="lg:col-span-8 space-y-6">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">Academic Certification Locker</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 bg-white p-5 text-left flex flex-col justify-between h-[160px]">
                  <div>
                    <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider block mb-1">✓ PASSED ACCREDITED EXAM</span>
                    <h4 className="font-sans font-bold text-xs text-gray-900 uppercase tracking-tight">Advanced Embedded Systems</h4>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-4 flex justify-between items-center text-xs font-mono text-gray-500">
                    <span>SCORE: 100%</span>
                    <span>BADGE ID: #RTTI-MEM-001</span>
                  </div>
                </div>

                <div className="border border-[#3373AB]/50 bg-white p-5 text-left flex flex-col justify-between h-[160px]">
                  <div>
                    <span className="text-[#3373AB] font-mono text-xs font-bold uppercase tracking-wider block mb-1">▶ CURRENT SYLLABUS TRACK</span>
                    <h4 className="font-sans font-bold text-xs text-gray-900 uppercase tracking-tight leading-snug">Applied AI for Embedded Vision Systems</h4>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-4 flex justify-between items-center text-xs font-mono text-gray-500">
                    <span>PROGRESS: 40%</span>
                    <span className="text-[#3373AB] font-bold hover:underline cursor-pointer">LAUNCH LESSONS</span>
                  </div>
                </div>
              </div>

              {/* Simulated active remote software lab controller */}
              <div className="border border-gray-200 bg-white p-5">
                <span className="text-amber-400 font-mono text-xs font-bold block mb-1">CONNECTIVITY OVERRIDE</span>
                <h4 className="font-sans font-bold text-xs uppercase tracking-wide">Dynamic Software Sandboxes Console</h4>
                <p className="text-xs text-gray-500 font-light mt-1.5 leading-relaxed">
                  Remote server development boards are available to compile programs. Hardware boards matrix regional ID and address are logged below. Use compiler keys to test memory limits.
                </p>

                <div className="bg-gray-100 p-3 border border-gray-200 font-mono text-xs text-gray-600 mt-4 leading-relaxed space-y-1">
                  <div>SYS-LINK STATUS: ESTABLISHED</div>
                  <div>RACK ADDRESS : GBL-MEM-ROW42-B7</div>
                  <div>DEVICE CHIP  : CORTEX-A72 NEURAL INFERENCE BLOCK</div>
                  <div className="text-[#3373AB]">READY: [SSH DIRECT CORE HUB ROOT INITIALIZED]</div>
                </div>
              </div>
            </div>

            {/* student info sidebar */}
            <div className="lg:col-span-4 bg-gray-100 border border-gray-200 p-6 space-y-6">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-900">Student Progress Summary</h4>
              
              <ul className="space-y-4 font-mono text-xs text-gray-500">
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Academic Rank:</span>
                  <span className="text-gray-900 font-bold">Principal Scholar</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Enrolled Tracks:</span>
                  <span className="text-gray-900 font-bold">2 Paths</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Completed Exams:</span>
                  <span className="text-gray-900 font-bold">1 Accredited</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* 3. INSTRUCTOR WORKSPACE PORTAL */}
        {(user.role === 'instructor' || activeWorkspace === 'instructor') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Master webinars stream schedule controller */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="border border-gray-200 bg-white p-5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2 mb-4">Orchestrate Scheduled Streams on MTTV</h3>
                
                {broadSuccess && (
                  <div className="bg-emerald-50 text-emerald-700 p-2.5 mb-4 text-xs font-mono">
                    ✓ BROADCAST: Log compiled to the MTTV transmission servers database registry correctly.
                  </div>
                )}

                <form onSubmit={handleAddLiveStreamInstructor} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input 
                      type="text" 
                      placeholder="Title of live webinar event..." 
                      value={newBroadTitle}
                      onChange={(e) => setNewBroadTitle(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-xs px-3 py-2 text-gray-900 outline-none focus:border-[#3373AB] rounded-none font-sans"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select 
                      value={newBroadCat}
                      onChange={(e) => setNewBroadCat(e.target.value)}
                      className="bg-white border border-gray-200 text-xs px-2 text-gray-900 outline-none rounded-none w-full font-sans"
                    >
                      <option value="Webinars">Webinars</option>
                      <option value="Live Events">Live Events</option>
                      <option value="Podcasts">Podcasts</option>
                    </select>

                    <button 
                      type="submit"
                      className="bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs px-4 rounded-none font-bold"
                    >
                      POST
                    </button>
                  </div>
                </form>
              </div>

              {/* Live listings */}
              <div className="border border-gray-200 bg-white">
                <div className="bg-gray-100 p-3 border-b border-gray-200 font-mono text-xs uppercase text-gray-500 block font-bold tracking-wider">
                  My Active Curricula Channels
                </div>
                <div className="divide-y divide-gray-100 text-xs">
                  {instructorBroadcasts.map((b) => (
                    <div key={b.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{b.title}</p>
                        <span className="text-xs text-gray-500 font-mono">{b.category} • Host: {b.host}s</span>
                      </div>
                      <span className="text-xs bg-gray-200 border border-gray-300 text-gray-600 px-1.5 font-mono">views: {b.views}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sidebar audit tracks */}
            <div className="lg:col-span-4 bg-gray-100 border border-gray-200 p-6 space-y-6">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-900">Student Exam Credentials Validation</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-sans font-light">
                Verify student code submissions satisfying advanced cryptographic registers or sensory matrix criteria before certifying their profile.
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="bg-gray-50 p-2 border border-gray-100 flex justify-between items-center text-gray-600">
                  <span>Clara Dupont (Exam score 100%)</span>
                  <span className="text-emerald-400 font-bold">APPROVED</span>
                </div>
                <div className="bg-gray-50 p-2 border border-gray-100 flex justify-between items-center text-gray-600">
                  <span>Alex Miller (SCADA Threat 90%)</span>
                  <button className="text-[#3373AB] font-bold hover:underline">[VALIDATE]</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. VENDOR WORKSPACE PORTAL */}
        {(user.role === 'vendor' || activeWorkspace === 'vendor') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Catalog management */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="border border-gray-200 bg-white p-5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2 mb-4">Post Calibrated OEM Component</h3>
                
                {vendorSuccess && (
                  <div className="bg-emerald-50 text-emerald-700 p-2.5 mb-4 text-xs font-mono">
                    ✓ EX-LEDGER: Validated component profile and submitted unit details to the B2B catalog directory.
                  </div>
                )}

                <form onSubmit={handleAddProductVendor} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Component Name..." 
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-xs px-3 py-2 text-gray-900 outline-none focus:border-[#3373AB] rounded-none font-sans"
                    />
                  </div>
                  <div>
                    <input 
                      type="number" 
                      placeholder="Price in USD..." 
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-xs px-3 py-2 text-gray-900 outline-none focus:border-[#3373AB] rounded-none font-sans"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select 
                      value={newProdCat}
                      onChange={(e) => setNewProdCat(e.target.value)}
                      className="bg-white border border-gray-200 text-xs px-2 text-gray-900 outline-none rounded-none w-full font-sans"
                    >
                      <option value="IoT Devices">IoT Devices</option>
                      <option value="Development Boards">Development Boards</option>
                      <option value="Sensors">Sensors</option>
                      <option value="Power Solutions">Power Solutions</option>
                    </select>

                    <button 
                      type="submit"
                      className="bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs px-4 rounded-none font-bold whitespace-nowrap"
                    >
                      POST UNIT
                    </button>
                  </div>
                </form>
              </div>

              {/* Items listing */}
              <div className="border border-gray-200 bg-white">
                <div className="bg-gray-100 p-3 border-b border-gray-200 font-mono text-xs uppercase text-gray-500 block font-bold tracking-wider">
                  Sellers Catalog Inventory Registry
                </div>
                <div className="divide-y divide-gray-100 text-xs">
                  {vendorProducts.map((p) => (
                    <div key={p.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{p.name}</p>
                        <span className="text-xs text-gray-500 font-mono">{p.category} • Original Equiper: {p.vendorName}</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">RWF ${p.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sidebar logistics validation */}
            <div className="lg:col-span-4 bg-gray-100 border border-gray-200 p-6 space-y-6">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-900">Escrow Disbursements Tracker</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-sans font-light">
                Secure unit deposits are validated locally using HSM keys. Fund releases resolve instantly upon custom telemetry receipts uploads by the receiving developers.
              </p>

              <div className="bg-gray-50 p-4 border border-gray-100 space-y-3 font-mono text-xs text-gray-500 uppercase">
                <div className="flex justify-between">
                  <span>Sellers Rating:</span>
                  <span className="text-amber-400">★ 4.8</span>
                </div>
                <div className="flex justify-between">
                  <span>Locked Escrow Funds:</span>
                  <span className="text-gray-900 font-bold">RWF 12,450.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Disbursed May:</span>
                  <span className="text-emerald-400 font-bold">RWF 3,120.00</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. ADVERTISER WORKSPACE PORTAL */}
        {(user.role === 'advertiser' || activeWorkspace === 'advertiser') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* View indicators and campaigns */}
            <div className="lg:col-span-8 space-y-6">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">Active MTTV Sponsorship Campaigns Ledger</h3>
              
              <div className="border border-gray-200 bg-white p-5 text-left relative overflow-hidden">
                <span className="text-[#3373AB] font-mono text-xs font-bold block mb-1">CAMPAIGN: NX-BANNER-442</span>
                <h4 className="font-sans font-bold text-sm text-gray-900 uppercase tracking-tight">Acme Semiconductor transceivers roll ad</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 font-mono text-xs">
                  <div className="border-l border-gray-300 pl-3">
                    <span className="text-xs text-gray-500 block uppercase">Estimated Impressions</span>
                    <span className="text-lg font-bold text-gray-900 mt-1 block">50,000</span>
                  </div>
                  
                  <div className="border-l border-gray-300 pl-3">
                    <span className="text-xs text-gray-500 block uppercase">Realized views (Logs)</span>
                    <span className="text-lg font-bold text-emerald-400 mt-1 block">51,210</span>
                  </div>

                  <div className="border-l border-gray-300 pl-3">
                    <span className="text-xs text-gray-500 block uppercase">Realized clicks conversion</span>
                    <span className="text-lg font-bold text-amber-500 mt-1 block">1,410 Clicks</span>
                  </div>
                </div>
              </div>

              {/* Campaign budget allocator slider link */}
              <div className="border border-gray-200 bg-white p-5">
                <span className="text-[#3373AB] font-mono text-xs font-bold block mb-1">LIVE OPTIMIZATION ENGINE</span>
                <h4 className="font-sans font-bold text-xs text-gray-900 uppercase tracking-wide">Adjust Allocation parameters</h4>
                <p className="text-xs text-gray-600 font-light mt-1.5 leading-relaxed">
                  Modify rolling budget bids directly over the physical ledger parameters. Real-time impressions recalculate automatically on the active MTTV stream networks.
                </p>
                <div className="mt-4 flex gap-4">
                  <span className="text-xs font-mono text-gray-500">Active allocation: RWF 2,500 Monthly • CTR Index: Vetted Q1</span>
                </div>
              </div>
            </div>

            {/* Sidebar advertiser details */}
            <div className="lg:col-span-4 bg-gray-100 border border-gray-200 p-6 space-y-6">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-900">Sponsors Billing Wallet</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-sans font-light">
                Billing hashes correspond with corporate standard single sign-on variables.
              </p>

              <div className="bg-gray-50 p-4 border border-gray-100 space-y-2 font-mono text-xs text-gray-500 uppercase">
                <span className="flex justify-between">
                  <span>Registered account:</span>
                  <span className="text-gray-900">Acme Corp</span>
                </span>
                <span className="flex justify-between">
                  <span>Disbursed May:</span>
                  <span className="text-emerald-400">RWF 2,500.00</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 6. ADMIN WORKSPACE PORTAL - Full System Control Dashboard */}
        {(user.role === 'admin' || activeWorkspace === 'admin') && (
          <AdminDashboard onBack={setView ? () => setView('home') : undefined} />
        )}

      </div>
    </section>
  );
}

const StyledWelcome = styled.div`
  @keyframes typing {
    from {
      width: 0;
    }
  }

  @keyframes blink-caret {
    50% {
      border-color: transparent;
    }
  }

  .animation {
    font:
      bold 150% Consolas,
      Monaco,
      monospace;
    border-right: 0.1em solid #3373AB;
    width: 31ch;
    margin: 0 0 1em 0;
    white-space: nowrap;
    overflow: hidden;
    color: #3373AB;
    animation:
      typing 4s steps(31, end),
      blink-caret 0.5s step-end infinite alternate;
  }
`;








