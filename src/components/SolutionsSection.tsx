import { TrendingUp, Building2, Radio, GraduationCap, ArrowRight } from 'lucide-react';

interface SolutionsSectionProps {
  setView: (view: string) => void;
  theme?: 'light' | 'dark';
}

export default function SolutionsSection({ setView, theme = 'light' }: SolutionsSectionProps) {
  const isDark = theme === 'dark';
  const users = [
    {
      id: 'engineers',
      label: 'Individual Engineers',
      painPoint: 'Level up your hardware skills',
      story: 'Access 186+ tools to go from Junior to Lead. Used by 500+ top tier firms.',
      icon: <TrendingUp size={22} />,
      count: 186,
      countLabel: 'tools & courses',
      cta: 'Browse Shop',
      ctaView: 'shop',
    },
    {
      id: 'businesses',
      label: 'Businesses',
      painPoint: 'Scale your production faster',
      story: 'Source 182+ industrial components in one click. Trusted by leading manufacturers.',
      icon: <Building2 size={22} />,
      count: 182,
      countLabel: 'components available',
      cta: 'Explore Catalog',
      ctaView: 'shop',
    },
    {
      id: 'creators',
      label: 'Creators',
      painPoint: 'Broadcast your expertise',
      story: 'Monetize your content on MTTV. Reach 10K+ engineering viewers worldwide.',
      icon: <Radio size={22} />,
      count: 104,
      countLabel: 'active streams',
      cta: 'Start Streaming',
      ctaView: 'mttv',
    },
    {
      id: 'students',
      label: 'Training Students',
      painPoint: 'Get hired faster',
      story: 'Join 104+ expert courses with the industry-standard certifications recruiters look for.',
      icon: <GraduationCap size={22} />,
      count: 104,
      countLabel: 'courses offered',
      cta: 'View Courses',
      ctaView: 'rtti',
    },
  ];

  const bg = isDark ? 'bg-[#1a1a1a] text-gray-200 border-gray-800' : 'bg-[#FAFAFA] text-gray-900 border-gray-200';
  const cardBg = isDark ? 'bg-[#222] border-gray-700' : 'bg-white border-gray-200';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderCls = isDark ? 'border-gray-700' : 'border-gray-100';

  return (
    <section className={`w-full select-none py-12 px-6 font-sans border-b ${bg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="border-l-4 border-[#3373AB] pl-5 mb-10 text-left">
          <p className="text-[10px] font-mono tracking-widest text-[#3373AB] uppercase font-bold">WHO WE SERVE</p>
          <h2 className="text-xl lg:text-2xl font-bold uppercase tracking-tight mt-1">FIND YOUR PATH</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className={`group relative border ${cardBg} p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-3 bg-[#3373AB]/10 text-[#3373AB] group-hover:bg-[#3373AB] group-hover:text-white transition-all duration-300">{user.icon}</span>
                  <h3 className={`font-bold text-xs uppercase tracking-wider ${isDark ? 'text-white' : ''}`}>{user.label}</h3>
                </div>

                <p className="text-sm font-black leading-snug mb-1">{user.painPoint}</p>

                <div className="overflow-hidden max-h-0 group-hover:max-h-24 transition-all duration-300">
                  <p className={`text-[11px] leading-relaxed mt-2 ${textMuted}`}>{user.story}</p>
                </div>

                <div className={`border-t ${borderCls} pt-4 mt-4`}>
                  <span className={`text-3xl sm:text-4xl font-black font-mono ${isDark ? 'text-white' : 'text-[#111111]'}`}>{user.count}</span>
                  <span className={`text-[10px] ${textMuted} font-mono ml-2 uppercase`}>{user.countLabel}</span>
                </div>
              </div>

              <button
                onClick={() => setView(user.ctaView)}
                className="mt-4 bg-[#3373AB] group-hover:bg-[#255C8E] text-white text-xs font-bold uppercase tracking-wider py-3 px-4 w-full flex items-center justify-center gap-2 transition-all duration-200 rounded-none"
              >
                <span>{user.cta}</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
