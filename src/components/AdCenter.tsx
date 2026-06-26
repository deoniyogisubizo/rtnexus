import React, { useState } from 'react';
import { Target, Calculator, FileText, Check, Layers, Sparkles, Send } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import { AdCampaignEstimate } from '../types';

interface AdCenterProps {
  theme?: 'light' | 'dark';
}

export default function AdCenter({ theme = 'light' }: AdCenterProps) {
  const isDark = theme === 'dark';
  const [placement, setPlacement] = useState<'homepage' | 'shop_featured' | 'mttv_video_roll' | 'newsletter'>('homepage');
  const [duration, setDuration] = useState<number>(30); // days
  const [budget, setBudget] = useState<number>(2500); // dollars
  
  // Submission Form State
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [targetNotes, setTargetNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const placementsMeta = {
    homepage: { title: 'Corporate Landing Banners', baseCpm: 45, desc: 'Highest visibility index, targeted directly to global engineering buyers.' },
    shop_featured: { title: 'RT Shop Category Intercepts', baseCpm: 60, desc: 'Maximum conversion rates, displaying products right next to related search components.' },
    mttv_video_roll: { title: 'MTTV Stream Rolling Video Ads', baseCpm: 50, desc: 'High visual impact pre-rolls, embedded directly on major semiconductor streaming events.' },
    newsletter: { title: 'Weekly Engineering Briefing', baseCpm: 35, desc: 'Direct access to 150K+ developer email nodes, with robust click parameters.' }
  };

  // Live calculation model
  const meta = placementsMeta[placement];
  const cpm = meta.baseCpm;
  const estimatedImpressions = Math.floor((budget / cpm) * 1000);
  const estimatedClicks = Math.floor(estimatedImpressions * (placement === 'shop_featured' ? 0.045 : 0.022));

  const handleApplyCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactEmail) return;
    setSubmitted(true);
  };

  const handleResetForm = () => {
    setCompanyName('');
    setContactEmail('');
    setTargetNotes('');
    setSubmitted(false);
  };

  return (
    <section className={`w-full select-none py-12 px-6 font-sans ${isDark ? 'bg-[#1a1a1a] text-gray-200' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        
        <Breadcrumb
          segments={[
            { label: 'Home', onClick: () => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); } },
            { label: 'Ad Center' },
          ]}
          theme={theme}
        />

        {/* Section Header */}
        <div className="border-l-4 border-[#3373AB] pl-5 mb-10 text-left">
          <p className="text-xs font-mono tracking-widest text-[#3373AB] uppercase font-bold">BUSINESS ADVERTISING PORTAL</p>
          <h2 className="text-xl lg:text-2xl font-bold uppercase tracking-tight mt-1">RT NEXUS CAMPAIGN BUILDER & SPONSORSHIPS</h2>
        </div>

        {/* Content split grid: Budget Estimator Left, Form Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INTERACTIVE PRICE & IMPRESSIONS ESTIMATOR ACCORDION (7 Cols) */}
          <div className="lg:col-span-7 bg-gray-50 border border-gray-200 p-6">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-6">
              <Calculator size={16} className="text-[#3373AB]" />
              <span className="font-sans font-bold text-xs uppercase tracking-wide text-gray-900">Campaign Pricing Estimator</span>
            </div>

            {/* Target Select Placement option */}
            <div className="mb-6 text-left">
              <label className="text-xs font-mono font-bold text-gray-400 uppercase block mb-2">Select Placement Zone</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(placementsMeta).map(([key, value]) => {
                  const isCur = placement === key;
                  return (
                    <div 
                      key={key}
                      onClick={() => setPlacement(key as any)}
                      className={`p-3.5 border text-left cursor-pointer transition-all ${isCur ? 'border-[#3373AB] bg-white text-[#111111] shadow-sm' : 'border-gray-200 bg-gray-100/50 hover:bg-white text-gray-500'}`}
                    >
                      <h5 className="font-bold text-xs uppercase tracking-tight font-sans text-gray-950">{value.title}</h5>
                      <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2">{value.desc}</p>
                      <span className="text-xs font-mono text-[#3373AB] font-bold block mt-2">CPM rate: RWF {value.baseCpm} per 1K impress</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Durations Slider */}
            <div className="mb-6 text-left">
              <div className="flex justify-between items-center text-xs font-mono text-gray-400 uppercase font-bold mb-1.5">
                <span>Deployment duration</span>
                <span className="text-[#3373AB] font-bold">{duration} Days</span>
              </div>
              <input 
                type="range" 
                min="7" 
                max="90" 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full justify-self-stretch h-1 bg-gray-200 rounded-none appearance-none cursor-pointer accent-[#3373AB]"
              />
              <div className="flex justify-between text-xs font-mono text-gray-400 mt-1">
                <span>7 Days</span>
                <span>90 Days (Quarterly)</span>
              </div>
            </div>

            {/* Budget Slider */}
            <div className="mb-8 text-left">
              <div className="flex justify-between items-center text-xs font-mono text-gray-400 uppercase font-bold mb-1.5">
                <span>Maximum Campaign Budget Limit</span>
                <span className="text-[#3373AB] text-sm font-semibold">RWF {budget.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="25000" 
                step="500"
                value={budget} 
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full justify-self-stretch h-1 bg-gray-200 rounded-none appearance-none cursor-pointer accent-[#3373AB]"
              />
              <div className="flex justify-between text-xs font-mono text-gray-400 mt-1">
                <span>RWF 500</span>
                <span>RWF 25,000 (Sponsor Enterprise)</span>
              </div>
            </div>

            {/* Live calculation results cards - Sharp grids rounded-none */}
            <div className="border border-neutral-300 bg-[#111111] text-white p-5 text-left">
              <span className="text-[#3373AB] font-mono text-xs font-bold tracking-wider uppercase">SIMULATED CONVERSION HUD</span>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="border-l-2 border-[#3373AB] pl-3">
                  <span className="text-xs font-mono text-gray-400 uppercase whitespace-nowrap">Est. Impressions</span>
                  <p className="text-xl font-bold font-mono text-white mt-1">{estimatedImpressions.toLocaleString()}</p>
                </div>

                <div className="border-l-2 border-[#3373AB] pl-3">
                  <span className="text-xs font-mono text-gray-400 uppercase whitespace-nowrap">Est. Clicks (Vetted CRM)</span>
                  <p className="text-xl font-bold font-mono text-amber-400 mt-1">{estimatedClicks.toLocaleString()}</p>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4 leading-relaxed font-mono font-light border-t border-neutral-800 pt-3">
                Disclaimer: Conversion ratios are based on average Q1-2026 performance loops over verified B2B foundry leads. Actual response parameters may float with hardware inventory levels.
              </p>
            </div>
          </div>

          {/* RIGHT: BUSINESS BRIEF INTAKE FORM (5 Cols) */}
          <div className="lg:col-span-5 border border-gray-200 p-6 bg-white text-left">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-6">
              <Target size={16} className="text-[#3373AB]" />
              <span className="font-sans font-bold text-xs uppercase tracking-wide text-gray-900">Campaign Submission Brief</span>
            </div>

            {!submitted ? (
              <form onSubmit={handleApplyCampaign} className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-bold text-gray-400 uppercase block mb-1.5">Registered Corporation Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Acme Semiconductor Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#3373AB]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-gray-400 uppercase block mb-1.5">Contact Corporate Email</label>
                  <input 
                    type="email" 
                    placeholder="e.g. operations@acme.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#3373AB]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-gray-400 uppercase block mb-1.5">Brief Campaign Targets</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe your targeting parameters, e.g., Looking to promote our certified LoRa transceiver module directly to sensor researchers..."
                    value={targetNotes}
                    onChange={(e) => setTargetNotes(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#3373AB] font-sans"
                  ></textarea>
                </div>

                {/* Pre-packaged selected info helper */}
                <div className="bg-gray-50 p-3 border border-gray-250 font-mono text-xs text-gray-600">
                  <span className="flex justify-between">
                    <span>Target Zone:</span>
                    <span className="font-bold text-gray-900 uppercase">{placement}</span>
                  </span>
                  <span className="flex justify-between mt-1">
                    <span>Duration Target:</span>
                    <span className="font-bold text-gray-900">{duration} Days</span>
                  </span>
                  <span className="flex justify-between mt-1">
                    <span>Nominated Budget:</span>
                    <span className="font-bold text-[#3373AB]">RWF {budget.toLocaleString()}</span>
                  </span>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-none transition-colors outline-none flex items-center justify-center gap-2"
                >
                  <Send size={12} />
                  <span>Onboard Campaign Proposal</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-6 animate-fade-in space-y-4">
                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h4 className="font-sans font-bold text-sm text-gray-900 uppercase">CAMPAIGN INGESTED SUCCESSFULLY</h4>
                
                <p className="text-xs text-gray-500 leading-relaxed font-sans font-light">
                  Acme proposal has been logged to the physical database. An RT marketing coordinator has queued the criteria and will emit an initial configuration audit email to <span className="font-semibold text-gray-700">{contactEmail}</span> within 4 hours.
                </p>

                <button 
                  onClick={handleResetForm}
                  className="mt-6 border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-semibold py-2 px-4 rounded-none outline-none"
                >
                  Configure alternative campaign
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
