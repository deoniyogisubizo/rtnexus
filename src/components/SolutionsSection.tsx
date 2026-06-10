import { FEATURED_PRODUCTS, COURSES, BROADCASTS } from '../data/mockData';
import { Users, Building2, Disc, GraduationCap, ArrowRight } from 'lucide-react';

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
      desc: 'Buy embedded system tools and study online with RT Group.',
      icon: <Users size={18} />,
      count: 100 + COURSES.length + FEATURED_PRODUCTS.length,
      countLabel: 'Tools & Courses',
      cta: 'Browse Shop',
      ctaView: 'shop',
    },
    {
      id: 'businesses',
      label: 'Businesses',
      desc: 'Get robots, machines, and electronic components from RT Shop.',
      icon: <Building2 size={18} />,
      count: 100 + FEATURED_PRODUCTS.length,
      countLabel: 'Products Available',
      cta: 'Explore Catalog',
      ctaView: 'shop',
    },
    {
      id: 'creators',
      label: 'Creators',
      desc: 'Advertise with RT Nexus or stream your activity on MTTV.',
      icon: <Disc size={18} />,
      count: 100 + BROADCASTS.length,
      countLabel: 'Active Streams',
      cta: 'Start Streaming',
      ctaView: 'mttv',
    },
    {
      id: 'students',
      label: 'Training Students',
      desc: 'Attend RT Group training spots and earn certifications.',
      icon: <GraduationCap size={18} />,
      count: 100 + COURSES.length,
      countLabel: 'Courses Offered',
      cta: 'View Courses',
      ctaView: 'rtti',
    },
  ];

  return (
    <section className={`w-full select-none py-12 px-6 font-sans border-b ${isDark ? 'bg-[#1a1a1a] text-gray-200 border-gray-800' : 'bg-[#FAFAFA] text-gray-900 border-gray-200'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="border-l-4 border-[#3373AB] pl-5 mb-10 text-left">
          <p className="text-[10px] font-mono tracking-widest text-[#3373AB] uppercase font-bold">WHO WE SERVE</p>
          <h2 className="text-xl lg:text-2xl font-bold uppercase tracking-tight mt-1">RT NEXUS USERS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <div key={user.id} className={`border p-6 flex flex-col justify-between ${isDark ? 'bg-[#222] border-gray-700' : 'bg-white border-gray-200'}`}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-2 bg-[#3373AB]/10 text-[#3373AB]">{user.icon}</span>
                  <h3 className={`font-bold text-xs uppercase tracking-wider ${isDark ? 'text-white' : ''}`}>{user.label}</h3>
                </div>
                <p className={`text-[11px] leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.desc}</p>
                <div className={`border-t pt-4 mb-4 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                  <span className={`text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-[#111111]'}`}>{user.count}</span>
                  <span className="text-[10px] text-gray-400 font-mono ml-2">{user.countLabel}</span>
                </div>
              </div>
              <button
                onClick={() => setView(user.ctaView)}
                className="bg-[#3373AB] hover:bg-[#255C8E] text-white text-xs font-bold uppercase tracking-wider py-3 px-4 w-full flex items-center justify-center gap-2 transition-colors rounded-none"
              >
                <span>{user.cta}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
