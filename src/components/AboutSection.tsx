
import { Target, Compass, Milestone, ShieldCheck, UserPlus, Heart } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

interface AboutSectionProps {
  theme?: 'light' | 'dark';
  standalone?: boolean;
}

export default function AboutSection({ theme = 'light', standalone }: AboutSectionProps) {
  const isDark = theme === 'dark';
  const leadership: any[] = [];

  const milestones = [
    { year: '2021', title: 'Silicon Registry Launch', desc: 'Registered 20,000 active device designs and formed European smart grid councils.' },
    { year: '2023', title: 'RTTI Academic Certification standard', desc: 'Syllabus accredited globally. Enabled remote hardware lab sandboxing pipelines.' },
    { year: '2025', title: 'Convergence of MTTV Streams', desc: 'Sub-second streaming servers launched. Unified RT Shop under physical ledger escrows.' }
  ];

  return (
    <section className={`w-full select-none py-12 px-6 font-sans ${isDark ? 'bg-[#1a1a1a] text-gray-200' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        
        {standalone && (
          <Breadcrumb
            segments={[
              { label: 'Home', onClick: () => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); } },
              { label: 'About Us' },
            ]}
            theme={theme}
          />
        )}

        {/* Section Header */}
        <div className="border-l-4 border-[#3373AB] pl-5 mb-10 text-left">
          <p className="text-xs font-mono tracking-widest text-[#3373AB] uppercase font-bold text-left">COMPANY BIOGRAPHY AND FOCUS</p>
          <h2 className={`text-xl lg:text-2xl font-bold uppercase tracking-tight mt-1 text-left ${isDark ? 'text-white' : ''}`}>RT GROUP CORPORATE PHILOSOPHY & LEADERSHIP</h2>
        </div>

        {/* Story Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gray-50 border border-gray-200 p-8 mb-12 text-left">
          
          <div className="lg:col-span-4 flex flex-col gap-3 font-mono">
            <div className="bg-[#3373AB] text-white p-4 font-mono font-bold uppercase tracking-wider">
              <span className="text-xs text-gray-100 block tracking-widest font-normal">Sovereignty Target</span>
              <span>ESTABLISHED 2021</span>
            </div>
            
            <div className="bg-neutral-900 text-white p-4">
              <p className="text-xs text-gray-300">Vetted original hardware, accredited instruction, live streams, and diagnostic nodes converged.</p>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col justify-center">
            <h3 className="font-sans font-bold text-base text-gray-950 uppercase tracking-tight mb-3">Bridging Industry Needs with Academic Rigors</h3>
            <p className="text-xs text-gray-600 font-light leading-relaxed">
              RT Group was chartered to address the severe fragmentation across the microarchitecture industry. Traditionally, engineers spent months qualifying unvetted suppliers, while academic students received outdated curricula. By converging e-commerce, research labs, real-time broadcasts, and role-based diagnostic panels, RT Group establishes an integrated technical sovereign digital territory.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="flex gap-2">
                <Target size={14} className="text-[#3373AB] mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-tight">Enterprise Vision</h4>
                  <p className="text-xs text-gray-500 mt-1">Accelerate silicon telemetry and guarantee the supply-chain ledger securely.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Compass size={14} className="text-[#3373AB] mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-tight">Trust Standard</h4>
                  <p className="text-xs text-gray-500 mt-1">Every component unit undergoes dynamic physical testing before freight courier logging.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Milestones timeline */}
        <div className="mb-16 text-left">
          <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider mb-6">Historical Milestones Evolution</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 pt-6">
            {milestones.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="text-xl font-bold font-mono text-[#3373AB] leading-none">{item.year}</div>
                <h5 className="font-sans font-bold text-xs text-gray-900 uppercase tracking-tight">{item.title}</h5>
                <p className="text-xs text-gray-500 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Section */}
        <div className="text-left">
          <h4 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider mb-8">Ecosystem Directors Registry</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((member, index) => (
              <div key={index} className="border border-gray-200">
                <div className="h-48 bg-gray-100 overflow-hidden relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale contrast-125"
                  />
                  <span className="absolute top-2 left-2 bg-[#111111] text-white font-mono text-xs px-2 py-0.5 uppercase font-bold tracking-wider">
                    DEAN_DIR
                  </span>
                </div>
                
                <div className="p-4 bg-white">
                  <h5 className="font-bold text-xs text-gray-900 uppercase tracking-tight">{member.name}</h5>
                  <p className="text-xs font-mono text-[#3373AB] uppercase font-bold mt-0.5">{member.role}</p>
                  <p className="text-xs text-gray-500 font-light mt-3 leading-relaxed border-t border-gray-100 pt-3">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
