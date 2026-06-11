import { useState, useEffect } from 'react';
import { Play, Calendar, Headset, Eye, FileText, ArrowUpRight, Search, Clock, Bell, Radio, Check } from 'lucide-react';
import { Broadcast } from '../types';
import { fetchVideos } from '../services/api';
import Breadcrumb from './Breadcrumb';

const ITEMS_PER_PAGE = 4;

interface MTTVSectionProps {
  searchQuery: string;
  theme?: 'light' | 'dark';
}

export default function MTTVSection({ searchQuery, theme = 'light' }: MTTVSectionProps) {
  const isDark = theme === 'dark';
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [subscribedEvent, setSubscribedEvent] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState<Broadcast | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchVideos().then(data => {
      setBroadcasts(data);
      if (data.length > 0) setActiveMedia(data[0]);
    }).catch(() => {});
  }, []);

  // Categories
  const categories = ['All', 'Live Events', 'Webinars', 'Podcasts', 'Tutorials'];

  const filteredMedia = broadcasts.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes((searchQuery || localSearch).toLowerCase()) ||
      item.description.toLowerCase().includes((searchQuery || localSearch).toLowerCase()) ||
      item.host.toLowerCase().includes((searchQuery || localSearch).toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredMedia.length / ITEMS_PER_PAGE);
  const paginatedMedia = filteredMedia.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, localSearch, selectedCategory]);

  const handleSubscribe = (eventTitle: string) => {
    setSubscribedEvent(eventTitle);
    setTimeout(() => setSubscribedEvent(null), 3000);
  };

  return (
    <section className={`w-full select-none py-12 px-6 font-sans ${isDark ? 'bg-[#1a1a1a] text-gray-200' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        
        <Breadcrumb
          segments={[
            { label: 'Home', onClick: () => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); } },
            { label: 'Broadcasts' },
            ...(selectedCategory !== 'All' ? [{ label: selectedCategory } as { label: string; onClick?: () => void }] : []),
          ]}
          theme={theme}
        />

        {/* Section Header */}
        <div className="border-l-4 border-[#3373AB] pl-5 mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono tracking-widest text-[#3373AB] uppercase font-bold">MTTV MEDIA BROADCAST NETWORK</p>
            <h2 className="text-xl lg:text-2xl font-bold uppercase tracking-tight mt-1">THE VOICE OF ENTERPRISE MICROARCHITECTURE</h2>
          </div>
          <p className="text-xs text-gray-500 max-w-sm font-light">
            Stay aligned with actual silicon innovations, watch verified global case studies, and tune into certified hardware podcast modules.
          </p>
        </div>

        {/* Dynamic Subscribe Alert popup */}
        {subscribedEvent && (
          <div className="bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500 p-3 mb-6 text-xs font-semibold flex items-center gap-2">
            <Check size={14} />
            <span>Success: Onboarded notification vector for event: &quot;{subscribedEvent}&quot;.</span>
          </div>
        )}

        {/* GRID LAYOUT: ACTIVE VIDEO SPOTLIGHT + GENERAL INVENTORY (col span 12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CHANNELS BAR & BROADCAST MEDIA DIRECTORY (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Active video player focus display */}
            {activeMedia && (
              <div className="border border-gray-200 bg-[#111111] text-white">
                <div className="h-[280px] sm:h-[360px] bg-neutral-900 relative">
                  <img 
                    src={activeMedia.thumbnail} 
                    alt={activeMedia.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-50"
                  />
                  
                  {/* Floating badge */}
                  <span className="absolute top-4 left-4 bg-red-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest flex items-center gap-1">
                    <Radio size={10} className="animate-pulse" />
                    {activeMedia.type === 'live' ? 'VLC LIVE FEED' : activeMedia.type.toUpperCase()}
                  </span>

                  {/* Play circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="h-14 w-14 bg-[#3373AB] hover:bg-[#255C8E] rounded-full text-white flex items-center justify-center outline-none transition-transform hover:scale-105 shadow-lg">
                      <Play size={20} className="fill-white translate-x-0.5" />
                    </button>
                  </div>

                  {/* View count summary tag */}
                  <span className="absolute bottom-4 right-4 bg-neutral-950/80 px-2 py-0.5 text-[10px] font-mono border border-neutral-800 text-gray-300">
                    {activeMedia.views.toLocaleString()} active views
                  </span>
                </div>

                <div className="p-6 text-left">
                  <span className="text-[#3373AB] font-mono text-xs font-bold uppercase tracking-wider">{activeMedia.category}</span>
                  <h3 className="font-sans font-bold text-lg text-white mt-1 uppercase tracking-tight">{activeMedia.title}</h3>
                  <p className="text-xs text-gray-400 mt-2 font-mono">BROADCASTER HOST: {activeMedia.host} {activeMedia.scheduledTime ? `• SCHEDULED: ${activeMedia.scheduledTime}` : `• DURATION: ${activeMedia.duration}`}</p>
                  <p className="text-xs text-gray-300 mt-3 font-sans font-light leading-relaxed">{activeMedia.description}</p>
                </div>
              </div>
            )}

            {/* General Filters + Grid Listings */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-3 mb-6 gap-3">
                <div className="flex flex-wrap gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs py-1 px-3.5 transition-colors font-sans rounded-none ${selectedCategory === cat ? 'bg-[#3373AB] text-white font-semibold' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center bg-gray-50 border border-gray-200 px-2 py-1 max-w-xs w-full sm:w-60">
                  <input 
                    type="text" 
                    placeholder="Search Broadcasts..." 
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="bg-transparent text-xs text-gray-800 outline-none w-full"
                  />
                  <Search size={12} className="text-gray-400" />
                </div>
              </div>

              {/* Feed Grid cards - Sharp corners mandated */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedMedia.map((media) => (
                  <div 
                    key={media.id} 
                    onClick={() => setActiveMedia(media)}
                    className="border border-gray-200 hover:border-[#3373AB] p-3.5 bg-white transition-all cursor-pointer text-left flex flex-col justify-between group h-full"
                  >
                    <div>
                      <div className="h-32 bg-gray-50 relative overflow-hidden mb-3">
                        <img 
                          src={media.thumbnail} 
                          alt={media.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 bg-neutral-900 text-white font-mono text-[9px] px-1.5 py-0.5 uppercase">
                          {media.type}
                        </span>
                      </div>
                      
                      <span className="text-[10px] font-mono text-[#3373AB] font-bold uppercase">{media.category}</span>
                      <h4 className="font-bold font-sans text-xs text-gray-900 mt-1 line-clamp-1 group-hover:text-[#3373AB] leading-tight-none">{media.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-2 font-light leading-relaxed line-clamp-2">{media.description}</p>
                    </div>

                    <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center text-[10px] font-mono text-gray-400">
                      <span>Host: {media.host}</span>
                      <span className="text-gray-800 font-semibold">{media.views.toLocaleString()} Plays</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs font-mono border border-gray-200 hover:border-[#3373AB] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`px-3 py-1.5 text-xs font-mono border transition-colors ${currentPage === p ? 'bg-[#3373AB] text-white border-[#3373AB]' : 'border-gray-200 hover:border-[#3373AB]'}`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs font-mono border border-gray-200 hover:border-[#3373AB] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDEBAR: UPCOMING LIVE EVENTS SCHEDULE (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live broadcast timeline */}
            <div className="border border-gray-200 bg-gray-50 p-6">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-5">
                <Calendar size={14} className="text-[#3373AB]" />
                <span className="font-sans font-bold text-xs uppercase tracking-wide text-gray-900">Live Webinar Schedules</span>
              </div>

              <div className="space-y-4 text-left">
                {broadcasts.filter(b => b.scheduledTime).slice(0, 3).map((webinar, idx) => (
                  <div key={webinar.id || idx} className="bg-white border border-gray-200 p-4">
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#3373AB] font-bold">
                      <span>{webinar.scheduledTime?.split('T')[0] || 'TBD'}</span>
                      <span>{webinar.scheduledTime?.split('T')[1] || 'TBD'}</span>
                    </div>
                    
                    <h5 className="font-sans font-bold text-xs mt-1.5 text-gray-950 uppercase tracking-tight leading-snug line-clamp-2">
                      {webinar.title}
                    </h5>
                    
                    <p className="text-[10px] text-gray-500 font-mono mt-1">Host Associate: {webinar.host}</p>
                    
                    <button 
                      onClick={() => handleSubscribe(webinar.title)}
                      className="mt-4 w-full bg-[#111111] hover:bg-neutral-800 text-white font-mono text-[9px] uppercase tracking-wider py-1.5 transition-colors rounded-none outline-none"
                    >
                      ADD REGISTRATION ALERT
                    </button>
                  </div>
                ))}
                {broadcasts.filter(b => b.scheduledTime).length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">No scheduled events at this time.</p>
                )}
              </div>
            </div>

            {/* Advertising promo block inside sidebar */}
            <div className="bg-[#111111] text-white p-6 border-b-4 border-[#3373AB] text-left">
              <span className="text-[#3373AB] font-mono text-[9px] tracking-wider uppercase font-bold">MTTV BROADCAST ADVERTISING</span>
              <h5 className="font-sans font-bold text-xs text-white uppercase tracking-wide mt-1.5">Sponsor Our Tech Podcasts</h5>
              <p className="text-xs text-gray-400 font-light mt-2 leading-relaxed">
                Unlock direct marketing sponsorship banners on MTTV channels. Capture verified microarchitecture leads directly on the live video rolling reel.
              </p>
              
              <button 
                onClick={() => {}} 
                className="mt-5 text-[10px] font-bold font-mono hover:underline uppercase text-white flex items-center gap-1.5 group"
              >
                <span>Read Advertising Packs</span>
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
