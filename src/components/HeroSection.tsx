import { useState, useEffect } from 'react';
import { Workflow } from 'lucide-react';

interface HeroSectionProps {
  setView: (view: string) => void;
  theme: 'light' | 'dark';
}

const HERO_SLIDES = ['/animation/rtshop.png', '/animation/rtlearn.png'];

export default function HeroSection({ setView, theme }: HeroSectionProps) {
  const isDark = theme === 'dark';
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((p) => (p + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative w-full h-[75vh] lg:h-screen border-b-4 border-[#3373AB] overflow-hidden select-none">
      <style>{`
        @font-face {
          font-family: 'Jarvane';
          src: url('/jarvane-display-font/Jarvane-BF6814d55045491.woff') format('woff'),
               url('/jarvane-display-font/Jarvane-BF6814d5504a5e3.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @keyframes heroOverlayIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .hero-overlay-in { animation: heroOverlayIn 0.6s ease-out both; }
        .fancy-btn {
          background-color: transparent;
          border: 2px solid #fff;
          box-sizing: border-box;
          cursor: pointer;
          display: inline-block;
          font-weight: 700;
          letter-spacing: 0.05em;
          outline: none;
          overflow: visible;
          padding: 1em 1.5em;
          position: relative;
          text-align: center;
          text-decoration: none;
          text-transform: uppercase;
          transition: all 0.3s ease-in-out;
          user-select: none;
          font-size: 12px;
        }
        .fancy-btn::before {
          content: " ";
          width: 1.25rem;
          height: 2px;
          background: white;
          top: 50%;
          left: 1.2em;
          position: absolute;
          transform: translateY(-50%);
          transition: background 0.3s linear, width 0.3s linear;
        }
        .fancy-btn .f-text {
          font-size: 1em;
          line-height: 1.3;
          padding-left: 1.8em;
          display: block;
          text-align: left;
          transition: all 0.3s ease-in-out;
          color: white;
        }
        .fancy-btn .f-top-key {
          height: 2px;
          width: 1.25rem;
          top: -2px;
          left: 0.5rem;
          position: absolute;
          background: rgba(255,255,255,0.5);
          transition: width 0.5s ease-out, left 0.3s ease-out;
        }
        .fancy-btn .f-bot-key-1 {
          height: 2px;
          width: 1.25rem;
          right: 1.5rem;
          bottom: -2px;
          position: absolute;
          background: rgba(255,255,255,0.5);
          transition: width 0.5s ease-out, right 0.3s ease-out;
        }
        .fancy-btn .f-bot-key-2 {
          height: 2px;
          width: 0.5rem;
          right: 0.5rem;
          bottom: -2px;
          position: absolute;
          background: rgba(255,255,255,0.5);
          transition: width 0.5s ease-out, right 0.3s ease-out;
        }
        .fancy-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.9);
          box-shadow: 0 0 20px rgba(232,197,71,0.15);
          transform: translateY(-1px);
        }
        .fancy-btn:hover::before {
          width: 0.75rem;
          background: #E8C547;
        }
        .fancy-btn:hover .f-text {
          color: #E8C547;
          padding-left: 1.5em;
        }
        .fancy-btn:hover .f-top-key {
          left: -2px;
          width: 0px;
        }
        .fancy-btn:hover .f-bot-key-1,
        .fancy-btn:hover .f-bot-key-2 {
          right: 0;
          width: 0;
        }
        .fancy-btn-solid {
          background-color: #3373AB;
          border-color: #3373AB;
        }
        .fancy-btn-solid:hover {
          background: rgba(255,255,255,0.1);
          border-color: #E8C547;
          box-shadow: 0 0 25px rgba(232,197,71,0.2), 0 4px 12px rgba(0,0,0,0.3);
          transform: translateY(-2px);
        }
        .fancy-btn-solid:hover::before {
          background: #E8C547;
        }
        .fancy-btn-solid:hover .f-text {
          color: #E8C547;
        }
      `}</style>

      {/* Full‑width background crossfade */}
      <div className={`absolute inset-0 ${isDark ? 'bg-black' : 'bg-white'}`}>
        {HERO_SLIDES.map((src, i) => (
          <div key={src} className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div
              className="absolute inset-0 bg-cover md:bg-contain bg-top bg-no-repeat"
              style={{ backgroundImage: `url(${src})` }}
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {i === 0 ? (
              <div className="absolute left-1/2 -translate-x-1/2 md:left-16 md:translate-x-0 bottom-[30%] md:bottom-[38%] w-full px-4 md:px-0">
                <div className="border-2 border-dashed border-white/50 bg-black/30 p-4 md:p-8 max-w-2xl text-center mx-auto md:mx-0">
                  <h2 className="text-[#E8C547] text-lg sm:text-2xl md:text-3xl font-bold tracking-wide leading-tight [font-family:'Jarvane',serif]" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
                    GETS OUR PRODUCT ON SHELF PRICE & QUALITY
                  </h2>
                  <div className="flex flex-wrap gap-3 mt-6 justify-center">
                    <button onClick={() => setView('shop')} className="fancy-btn fancy-btn-solid shadow-lg">
                      <span className="f-top-key" />
                      <span className="f-text">Shop Your IOT Device</span>
                      <span className="f-bot-key-1" />
                      <span className="f-bot-key-2" />
                    </button>
                    <button onClick={() => setView('shop')} className="fancy-btn shadow-lg">
                      <span className="f-top-key" />
                      <span className="f-text">Jump To Categories</span>
                      <span className="f-bot-key-1" />
                      <span className="f-bot-key-2" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute left-1/2 -translate-x-1/2 md:left-16 md:translate-x-0 bottom-[30%] md:bottom-[38%] w-full px-4 md:px-0">
                <div className="border-2 border-dashed border-white/50 bg-black/30 p-4 md:p-8 max-w-2xl text-center mx-auto md:mx-0">
                  <h2 className="text-[#E8C547] text-lg sm:text-2xl md:text-3xl font-bold tracking-wide leading-tight [font-family:'Jarvane',serif]" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
                    LEARN WITH BEST TRACK AND GETS CERTIFIED WITH RTB OFFER
                  </h2>
                  <div className="flex flex-wrap gap-3 mt-6 justify-center">
                    <button onClick={() => setView('rtti')} className="fancy-btn fancy-btn-solid shadow-lg">
                      <span className="f-top-key" />
                      <span className="f-text">Gets Certified</span>
                      <span className="f-bot-key-1" />
                      <span className="f-bot-key-2" />
                    </button>
                    <button onClick={() => setView('rtti')} className="fancy-btn shadow-lg">
                      <span className="f-top-key" />
                      <span className="f-text">Get Started</span>
                      <span className="f-bot-key-1" />
                      <span className="f-bot-key-2" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {/* Dimming overlay */}
        <div className={`absolute inset-0 ${isDark ? 'bg-black/50' : 'bg-black/10'}`} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #3373AB 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>

      {/* Slide indicator circles */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
              i === slide ? 'bg-[#3373AB] scale-110' : isDark ? 'bg-white/40 hover:bg-white/70' : 'bg-gray-400 hover:bg-gray-600'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Card overlay — hidden on mobile */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 flex items-start pt-20 lg:pt-24 h-[75vh] lg:h-screen">
        <div className="hidden md:flex mx-auto md:ml-auto md:mr-12 w-full max-w-sm border border-white/40 bg-white/70 backdrop-blur-lg p-4 md:p-6 flex-col justify-between shadow-[0_8px_40px_rgba(0,0,0,0.12)] min-h-[300px] md:min-h-[400px]" style={{ transform: 'perspective(800px) rotateX(-5deg) rotate(3deg)' }}>
          <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-gray-400 tracking-wider">
            NEXUS_MATRIX_V1.1
          </div>

          {/* Layer Graphic mapping elements together */}
          <div className="relative flex-1 flex flex-col justify-center items-center gap-4">
            
            {/* Top tier - RT Shop */}
            <div className="w-11/12 border border-[#3373AB]/30 bg-white/60 p-3 text-left relative hover:bg-white/90 transition-colors cursor-pointer" onClick={() => setView('shop')}>
              <div className="absolute -top-[9px] left-3 bg-[#3373AB] text-white px-1.5 py-0.5 text-[10px] font-mono uppercase font-bold">
                COMMERCE GRID
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-sans font-extrabold text-sm text-gray-900 uppercase tracking-wide">RT Shop</h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Microcontrollers, IoT Shields, Biometrics</p>
                </div>
                <Workflow className="text-[#3373AB]" size={16} />
              </div>
            </div>

            {/* Middle tier split: RTTI and MTTV */}
            <div className="w-11/12 grid grid-cols-2 gap-4">
              <div className="border border-gray-200 bg-white/60 p-3 text-left relative hover:border-[#3373AB]/50 transition-colors cursor-pointer" onClick={() => setView('rtti')}>
                <div className="absolute -top-[9px] left-3 bg-gray-500 text-white px-1.5 py-0.5 text-[10px] font-mono uppercase font-bold">
                  EDUCATION SYSTEM
                </div>
                <h4 className="font-sans font-extrabold text-sm text-gray-900 uppercase tracking-wide">RTTI Learn</h4>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">Certifications & labs</p>
              </div>

              <div className="border border-gray-200 bg-white/60 p-3 text-left relative hover:border-[#3373AB]/50 transition-colors cursor-pointer" onClick={() => setView('mttv')}>
                <div className="absolute -top-[9px] left-3 bg-gray-500 text-white px-1.5 py-0.5 text-[10px] font-mono uppercase font-bold">
                  BROADCASTING NODE
                </div>
                <h4 className="font-sans font-extrabold text-sm text-gray-900 uppercase tracking-wide">MTTV Media</h4>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">Webinars & podcasts</p>
              </div>
            </div>

            {/* Bottom tier - Integrated Portals workspace controller */}
            <div className="w-11/12 border border-dashed border-[#3373AB]/30 bg-white/60 p-3 text-left relative hover:bg-white/90 transition-colors cursor-pointer" onClick={() => setView('portals')}>
              <div className="absolute -top-[9px] left-3 bg-[#3373AB] text-white px-1.5 py-0.5 text-[10px] font-mono uppercase font-bold">
                ROLE WORKSPACES
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-mono text-xs font-extrabold text-[#3373AB] uppercase">RT-PORTAL CORE</h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-sans font-medium leading-none">Diagnostic dashboards for all user types</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>

          </div>

          {/* Mini info overlay bar */}
          <div className="h-10 border-t border-gray-200 hidden sm:flex items-center justify-between text-[10px] font-mono text-gray-400">
            <span className="text-[#3373AB]">STATUS: ESTABLISHED</span>
            <span>ENCRYPTION: SHIELD-CORE</span>
            <span>REGION: GBL-1</span>
          </div>
        </div>
      </div>
    </section>
  );
}
