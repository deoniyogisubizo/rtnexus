import { ArrowRight, ShoppingBag, GraduationCap, Video, Workflow } from 'lucide-react';

interface HeroSectionProps {
  setView: (view: string) => void;
  theme: 'light' | 'dark';
}

export default function HeroSection({ setView, theme }: HeroSectionProps) {
  const isDark = theme === 'dark';
  return (
    <section className={`w-full py-16 lg:py-24 px-6 border-b-4 border-[#3373AB] relative overflow-hidden select-none ${isDark ? 'bg-[#111111] text-white' : 'bg-white text-gray-900'}`}>
      {/* Decorative corporate background grid */}
      <div className={`absolute inset-0 pointer-events-none ${isDark ? 'opacity-5' : 'opacity-10'}`}>
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle, #3373AB 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left column: Typography Copy */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <span className="font-mono text-xs tracking-[0.25em] text-[#3373AB] uppercase font-bold mb-3 border-l-2 border-[#3373AB] pl-3.5">
            CONVERGED ENTERPRISE CONTEXT
          </span>
          
          <h1 className={`font-bold font-sans leading-[1.1] mb-6 ${isDark ? 'text-white' : 'text-[#111111]'}`}>
            <span className="text-xl sm:text-2xl lg:text-3xl tracking-[0.15em]">_TECHNOLOGY, LEARNING, COMMERCE AND MEDIA_ </span>
            <span className="text-3xl sm:text-4xl lg:text-5xl text-[#3373AB]">Unified.</span>
          </h1>
          
          <p className={`text-sm sm:text-base max-w-2xl leading-relaxed mb-10 font-sans font-light ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            One platform connecting innovation, education, digital commerce and media broadcasting. RT Nexus bridges the physical supply-chain matrix with verified engineering certifications, live sub-second video broadcasts, and targeted operational diagnostics.
          </p>

          {/* Call to actions - Sharp Edged Buttons */}
          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            <button 
              onClick={() => setView('shop')}
              className="bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-bold uppercase tracking-wider px-6 py-4 flex items-center gap-2 group transition-all duration-150 rounded-none w-full sm:w-auto justify-center"
            >
              <ShoppingBag size={14} />
              <span>Explore RT Shop</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => setView('rtti')}
              className={`bg-transparent border text-xs font-bold uppercase tracking-wider px-6 py-4 flex items-center gap-2 transition-all duration-150 rounded-none w-full sm:w-auto justify-center ${isDark ? 'border-gray-400 hover:border-[#3373AB] hover:text-[#3373AB] text-white' : 'border-[#3373AB] text-[#3373AB] hover:bg-[#3373AB] hover:text-white'}`}
            >
              <GraduationCap size={14} />
              <span>Start Learning</span>
            </button>

            <button 
              onClick={() => setView('mttv')}
              className={`text-xs font-bold uppercase tracking-wider px-6 py-4 flex items-center gap-2 transition-all duration-150 rounded-none w-full sm:w-auto justify-center ${isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            >
              <Video size={14} />
              <span>Watch MTTV</span>
            </button>
          </div>

          {/* Quick status line */}
          <div className={`mt-8 hidden sm:flex flex-wrap gap-6 text-[11px] font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-emerald-500"></span>
              250K+ Connected Engineers
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-[#3373AB]"></span>
              Sub-second video delivery
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-indigo-400"></span>
              Hardware Escrow Guarantee
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[400px] border border-neutral-800 bg-[#161616e2] p-6 flex flex-col justify-between shadow-2xl shadow-black/40">
          <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-gray-500 tracking-wider">
            NEXUS_MATRIX_V1.1
          </div>

          {/* Layer Graphic mapping elements together */}
          <div className="relative flex-1 flex flex-col justify-center items-center gap-4">
            
            {/* Top tier - RT Shop */}
            <div className="w-11/12 border border-[#3373AB] bg-[#111111] p-3 text-left relative hover:bg-neutral-900 transition-colors cursor-pointer" onClick={() => setView('shop')}>
              <div className="absolute -top-[9px] left-3 bg-[#3373AB] text-white px-1.5 py-0.5 text-[10px] font-mono uppercase font-bold">
                COMMERCE GRID
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-sans font-extrabold text-sm text-white uppercase tracking-wide">RT Shop</h4>
                  <p className="text-xs text-gray-300 mt-0.5 font-medium">Microcontrollers, IoT Shields, Biometrics</p>
                </div>
                <Workflow className="text-[#3373AB]" size={16} />
              </div>
            </div>

            {/* Middle tier split: RTTI and MTTV */}
            <div className="w-11/12 grid grid-cols-2 gap-4">
              <div className="border border-neutral-700 bg-[#111111] p-3 text-left relative hover:border-[#3373AB] transition-colors cursor-pointer" onClick={() => setView('rtti')}>
                <div className="absolute -top-[9px] left-3 bg-neutral-700 text-white px-1.5 py-0.5 text-[10px] font-mono uppercase font-bold">
                  EDUCATION SYSTEM
                </div>
                <h4 className="font-sans font-extrabold text-sm text-white uppercase tracking-wide">RTTI Learn</h4>
                <p className="text-xs text-gray-300 mt-0.5 font-medium">Certifications & labs</p>
              </div>

              <div className="border border-neutral-700 bg-[#111111] p-3 text-left relative hover:border-[#3373AB] transition-colors cursor-pointer" onClick={() => setView('mttv')}>
                <div className="absolute -top-[9px] left-3 bg-neutral-700 text-white px-1.5 py-0.5 text-[10px] font-mono uppercase font-bold">
                  BROADCASTING NODE
                </div>
                <h4 className="font-sans font-extrabold text-sm text-white uppercase tracking-wide">MTTV Media</h4>
                <p className="text-xs text-gray-300 mt-0.5 font-medium">Webinars & podcasts</p>
              </div>
            </div>

            {/* Bottom tier - Integrated Portals workspace controller */}
            <div className="w-11/12 border border-dashed border-[#3373AB] bg-[#1a1a1a] p-3 text-left relative hover:bg-neutral-950 transition-colors cursor-pointer" onClick={() => setView('portals')}>
              <div className="absolute -top-[9px] left-3 bg-[#3373AB] text-white px-1.5 py-0.5 text-[10px] font-mono uppercase font-bold">
                ROLE WORKSPACES
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-mono text-xs font-extrabold text-[#3373AB] uppercase">RT-PORTAL CORE</h4>
                  <p className="text-xs text-gray-300 mt-0.5 font-sans font-medium leading-none">Diagnostic dashboards for all user types</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>

          </div>

          {/* Mini info overlay bar */}
          <div className="h-10 border-t border-neutral-800 hidden sm:flex items-center justify-between text-[10px] font-mono text-gray-400">
            <span className="text-[#3373AB]">STATUS: ESTABLISHED</span>
            <span>ENCRYPTION: SHIELD-CORE</span>
            <span>REGION: GBL-1</span>
          </div>
        </div>
      </div>
    </section>
  );
}
