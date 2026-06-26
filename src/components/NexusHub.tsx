import { BookOpen, Radio, ArrowRight, GraduationCap, Wrench } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

interface NexusHubProps {
  setView: (view: string) => void;
  theme?: 'light' | 'dark';
}

export default function NexusHub({ setView, theme = 'light' }: NexusHubProps) {
  const isDark = theme === 'dark';

  const goTo = (view: string) => {
    setView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className={`w-full select-none py-12 px-6 font-sans ${isDark ? 'bg-[#1a1a1a] text-gray-200' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">

        <Breadcrumb
          segments={[
            { label: 'Home', onClick: () => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); } },
            { label: 'RTNEXUS HUB' },
          ]}
          theme={theme}
        />

        {/* Hero */}
        <div className="border-l-4 border-[#3373AB] pl-5 mb-10">
          <p className="text-xs font-mono font-bold tracking-widest text-[#3373AB]">RTNEXUS HUB</p>
          <h2 className={`text-xl lg:text-2xl font-bold uppercase tracking-tight mt-1 ${isDark ? 'text-white' : 'text-[#111111]'}`}>
            THE RT GROUP E-LEARNING & MEDIA HUB
          </h2>
          <p className={`text-xs mt-2 max-w-2xl leading-relaxed font-light ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            RTNEXUS HUB is the central access point for all RT Group educational and media services.
            This branch oversees the RTTI e-learning platform and the MTTV broadcast network —
            delivering accredited engineering courses and low-latency technical media worldwide.
          </p>
        </div>

        {/* Status Bar */}
        <div className={`border ${isDark ? 'border-gray-700 bg-[#222]' : 'border-gray-200 bg-gray-50'} p-4 mb-12 flex flex-wrap items-center gap-4 text-xs font-mono`}>
          <span className={`font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Platform Status:</span>
          <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            RTNEXUS HUB — Active
          </span>
          <span className="text-gray-400">|</span>
          <span className="flex items-center gap-1.5 text-amber-500 font-bold">
            <Wrench size={12} />
            RTTI — Under Development
          </span>
          <span className="text-gray-400">|</span>
          <span className="flex items-center gap-1.5 text-amber-500 font-bold">
            <Wrench size={12} />
            MTTV — Under Development
          </span>
        </div>

        {/* Two column cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* RTTI Card */}
          <div className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-all hover:shadow-lg group`}>
            <div className="h-[3px] w-full bg-gradient-to-r from-[#3373AB] via-[#5B9BD5] to-[#3373AB]" />
            <div className="p-8 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 ${isDark ? 'bg-[#222]' : 'bg-[#3373AB]/10'} text-[#3373AB]`}>
                  <BookOpen size={24} />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-100 text-amber-700 px-2 py-1">
                  Under Development
                </span>
              </div>
              <h3 className={`font-bold text-sm uppercase tracking-wide mb-2 ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                RTTI — Real-Time Technical Instruction
              </h3>
              <p className={`text-xs leading-relaxed font-light flex-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                RTTI is the e-learning division of RT Group, offering accredited certification tracks
                in embedded engineering, cybersecurity, edge AI, and telemetry networking.
                Features include digital sandbox labs, interactive syllabi, and certification simulators.
              </p>
              <button
                onClick={() => goTo('rtti')}
                className="mt-6 bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-bold uppercase tracking-wider py-3 px-5 transition-colors flex items-center justify-center gap-2 outline-none"
              >
                <span>Visit RTTI Portal</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* MTTV Card */}
          <div className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-all hover:shadow-lg group`}>
            <div className="h-[3px] w-full bg-gradient-to-r from-[#3373AB] via-[#5B9BD5] to-[#3373AB]" />
            <div className="p-8 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 ${isDark ? 'bg-[#222]' : 'bg-[#3373AB]/10'} text-[#3373AB]`}>
                  <Radio size={24} />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-100 text-amber-700 px-2 py-1">
                  Under Development
                </span>
              </div>
              <h3 className={`font-bold text-sm uppercase tracking-wide mb-2 ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                MTTV — Matrix TeleVision Broadcast Network
              </h3>
              <p className={`text-xs leading-relaxed font-light flex-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                MTTV is the media broadcasting arm, delivering live global keynotes, engineering webinars,
                technical podcasts, and step-by-step developer screencasts.
                Stay aligned with silicon innovations and verified hardware case studies.
              </p>
              <button
                onClick={() => goTo('mttv')}
                className="mt-6 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider py-3 px-5 transition-colors flex items-center justify-center gap-2 outline-none"
              >
                <span>Visit MTTV Portal</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom info */}
        <div className={`mt-12 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-8 text-center`}>
          <GraduationCap size={20} className="mx-auto text-[#3373AB] mb-3" />
          <p className={`text-xs font-mono max-w-xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            RTNEXUS HUB consolidates all RT Group learning and media under one interface.
            Check back for updates as RTTI and MTTV portals are actively being restructured.
          </p>
        </div>

      </div>
    </section>
  );
}
