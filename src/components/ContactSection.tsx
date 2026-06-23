import React, { useState } from 'react';
import { Mail, Phone, MapPin, Search, ChevronDown, Check, Send, ShieldAlert } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

interface ContactSectionProps {
  theme?: 'light' | 'dark';
  standalone?: boolean;
}

export default function ContactSection({ theme = 'light', standalone }: ContactSectionProps) {
  const isDark = theme === 'dark';
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [kbQuery, setKbQuery] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [ticketLogged, setTicketLogged] = useState(false);

  const globalOffices = [
    { city: 'Boston, USA', address: '42 Patriot Way, Technology Square, Boston, MA 02139', phone: '+1 (617) 555-0192', map: 'B' },
    { city: 'Munich, Germany', address: 'Kaiserstraße 18, Leopold-Quadrant, 80801 Munich', phone: '+49 (89) 2115-9920', map: 'M' },
    { city: 'Singapore', address: '8 Marina Avenue, Level 44, Tower 1, Singapore 018981', phone: '+65 6710-8500', map: 'S' },
    { city: 'Tokyo, Japan', address: 'Sub-Giga Precinct, Shibuya-ku, Tokyo 150-0002', phone: '+81 (3) 5450-1011', map: 'T' }
  ];

  const faqList = [
    { q: 'How long are RTTI certifications archived on the physical blockchain?', a: 'All core engineer and microarchitect credentials are programmatically archived permanently using a secure asymmetric HSM network ledger.' },
    { q: 'What is the standard lead time for RT Shop hardware deliveries?', a: 'Standard B2B dispatcher protocols take 3-5 days. Priority freight logistics are deployed within 24 hours of RTTI stress calibrations clearance.' },
    { q: 'Can my institution license multiple student workspace logs?', a: 'Yes. Universities and institutional nodes can claim shared multi-seat sandboxes through the Solutions page proposal tracker.' },
    { q: 'How does vendor escrow hold secure cross-border hardware foundries?', a: 'RT Shop retains unit funds in safe escrow until the receiving engineer uploads calibration telemetry logs satisfying CE / FCC interference validations.' }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;
    setTicketLogged(true);
  };

  const filteredFaqs = faqList.filter(item => 
    item.q.toLowerCase().includes(kbQuery.toLowerCase()) || 
    item.a.toLowerCase().includes(kbQuery.toLowerCase())
  );

  return (
    <section className={`w-full select-none py-12 px-6 font-sans relative ${isDark ? 'bg-[#1a1a1a] text-gray-200' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        
        {standalone && (
          <Breadcrumb
            segments={[
              { label: 'Home', onClick: () => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); } },
              { label: 'Contact' },
            ]}
            theme={theme}
          />
        )}

        {/* Section Header */}
        <div className="border-l-4 border-[#3373AB] pl-5 mb-10 text-left">
          <p className="text-[10px] font-mono tracking-widest text-[#3373AB] uppercase font-bold text-left">SUPPORT & CONTACT SYSTEM</p>
          <h2 className="text-xl lg:text-2xl font-bold uppercase tracking-tight mt-1 text-left">ESTABLISH CHANNELS WITH RT NEXUS GLOBALLY</h2>
        </div>

        {/* Support Grid split 12 cols */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* LEFT: DIRECT DEBUT BOARD TICKET FORM (5 Cols) */}
          <div className="lg:col-span-5 border border-gray-200 p-6 bg-gray-50 text-left">
            <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider mb-5">Open Operations Ticket</h4>
            
            {!ticketLogged ? (
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1">Corporate Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Alistair Miller"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#3373AB]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1">Contact Email node</label>
                  <input 
                    type="email" 
                    placeholder="e.g. operations@foundry.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#3373AB]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1">Detailed Technical Query</label>
                  <textarea 
                    rows={4}
                    placeholder="Provide diagnostic logs, order IDs, or syllabus tracking details..."
                    value={formMsg}
                    onChange={(e) => setFormMsg(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#3373AB] font-sans"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#111111] hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest py-3 transition-colors rounded-none outline-none flex items-center justify-center gap-2"
                >
                  <Send size={12} />
                  <span>Log Operational Ticket</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-6 animate-fade-in space-y-4">
                <Check className="mx-auto text-emerald-600 h-10 w-10 bg-emerald-50 p-2" />
                <h5 className="font-sans font-bold text-xs uppercase text-gray-900">TICKET DETECTED & REGISTERED</h5>
                <p className="text-[11px] text-gray-500 leading-relaxed font-sans font-light">
                  Successfully registered the query under hash address <span className="font-mono text-gray-800">#RT-{Math.floor(Math.random()	* 890000 + 100000)}</span>. An operational engineer in regional support will review inputs and emit a diagnostic response file to <span className="font-semibold">{formEmail}</span> within 2 hours.
                </p>
                <button 
                  onClick={() => setTicketLogged(false)}
                  className="mt-4 border border-gray-300 hover:border-gray-400 text-gray-700 text-xs px-3 py-1.5 rounded-none outline-none"
                >
                  Log separate technical issue
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: KNOWLEDGE BASE SEARCH + FAQ ACCORDIONS (7 Cols) */}
          <div className="lg:col-span-7 bg-white text-left space-y-6">
            <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider">Interactive Support Base Query</h4>
            
            {/* Direct query input */}
            <div className="flex items-center bg-gray-50 border border-gray-200 px-3 py-2">
              <input 
                type="text" 
                placeholder="Query FAQ base (e.g., escrow, certifications, deliveries)..." 
                value={kbQuery}
                onChange={(e) => setKbQuery(e.target.value)}
                className="bg-transparent text-xs text-gray-800 outline-none w-full"
              />
              <Search size={14} className="text-gray-400" />
            </div>

            {/* Accordion List */}
            <div className="border border-gray-250 divide-y divide-gray-200">
              {filteredFaqs.map((faq, idx) => {
                const isCur = activeFaq === idx;
                return (
                  <div key={idx} className="bg-white">
                    <button 
                      onClick={() => setActiveFaq(isCur ? null : idx)}
                      className="w-full text-left p-4 flex justify-between items-center outline-none hover:bg-gray-50"
                    >
                      <span className="text-xs font-bold font-sans text-gray-900 uppercase leading-snug">{faq.q}</span>
                      <ChevronDown size={14} className={`text-[#3373AB] transition-transform duration-200 ${isCur ? 'rotate-180' : ''}`} />
                    </button>
                    {isCur && (
                      <div className="p-4 bg-gray-50 font-sans text-xs text-gray-600 border-t border-gray-100 font-light leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredFaqs.length === 0 && (
                <div className="p-8 text-center text-xs text-gray-400">
                  No matching microarchitecture FAQs logged. Try search keys like &quot;escrow&quot; or &quot;accredited&quot;.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* OFFICE MAPS ADDRESS TILES GRID (4 Cols) */}
        <div className="text-left border-t border-gray-200 pt-12">
          <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider mb-8">Worldwide Operational Centers Registry</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {globalOffices.map((office, index) => (
              <div key={index} className="bg-gray-50 border border-gray-205 p-5 text-left flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-3">
                    <span className="font-sans font-bold text-xs uppercase tracking-tight text-gray-950">{office.city}</span>
                    <MapPin size={12} className="text-[#3373AB]" />
                  </div>
                  <p className="text-[11px] text-gray-500 font-light leading-relaxed">{office.address}</p>
                </div>
                <div className="mt-4 border-t border-gray-200 pt-3 flex justify-between items-center font-mono text-[10px]">
                  <span className="text-gray-400">Direct Link</span>
                  <a href={`tel:${office.phone.replace(/\s+/g, '')}`} className="font-bold text-[#3373AB] hover:underline whitespace-nowrap">{office.phone}</a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
