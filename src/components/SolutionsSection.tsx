import { TrendingUp, Building2, Radio, GraduationCap } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

interface SolutionsSectionProps {
  setView: (view: string) => void;
  theme?: 'light' | 'dark';
  standalone?: boolean;
}

export default function SolutionsSection({ setView, theme = 'light', standalone }: SolutionsSectionProps) {
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

  return (
    <section className={`w-full select-none py-10 px-4 sm:px-6 font-sans border-b ${bg}`}>
      <style>{`
        .sol-card {
          width: 100%;
          height: 148px;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.92);
          border-radius: 8px;
          backdrop-filter: blur(5px);
          border-bottom: 3px solid rgba(200, 200, 200, 0.5);
          border-left: 2px rgba(200, 200, 200, 0.6) outset;
          box-shadow: -40px 50px 30px rgba(0, 0, 0, 0.12);
          transform: skewX(10deg);
          transition: .4s;
          overflow: hidden;
          color: #111;
        }
        .sol-card:hover {
          height: 280px;
          transform: skew(0deg);
        }
          .sol-card-inner {
          transform: skewX(-10deg);
          transition: .4s;
        }
        .sol-card:hover .sol-card-inner {
          transform: skewX(0deg);
        }

        .sol-btn {
          background-color: transparent;
          border: 2px solid #111;
          border-radius: 0;
          box-sizing: border-box;
          color: #111;
          cursor: pointer;
          display: flex;
          width: 100%;
          font-weight: 700;
          letter-spacing: 0.05em;
          outline: none;
          overflow: visible;
          padding: 1.5em 2em;
          position: relative;
          text-align: center;
          text-transform: uppercase;
          transition: all 0.3s ease-in-out;
          user-select: none;
          font-size: 10px;
          align-items: center;
          justify-content: center;
        }
        .sol-btn::before {
          content: " ";
          width: 1.5625rem;
          height: 2px;
          background: #111;
          top: 50%;
          left: 1.5em;
          position: absolute;
          transform: translateY(-50%);
          transform-origin: center;
          transition: background 0.3s linear, width 0.3s linear;
        }
        .sol-btn .sol-btn-text {
          font-size: 1.125em;
          line-height: 1.33333em;
          padding-left: 2em;
          display: block;
          text-align: left;
          transition: all 0.3s ease-in-out;
          text-transform: uppercase;
          text-decoration: none;
          color: #111;
        }
        .sol-btn .top-key {
          height: 2px;
          width: 1.5625rem;
          top: -2px;
          left: 0.625rem;
          position: absolute;
          background: #e8e8e8;
          transition: width 0.5s ease-out, left 0.3s ease-out;
        }
        .sol-btn .bottom-key-1 {
          height: 2px;
          width: 1.5625rem;
          right: 1.875rem;
          bottom: -2px;
          position: absolute;
          background: #e8e8e8;
          transition: width 0.5s ease-out, right 0.3s ease-out;
        }
        .sol-btn .bottom-key-2 {
          height: 2px;
          width: 0.625rem;
          right: 0.625rem;
          bottom: -2px;
          position: absolute;
          background: #e8e8e8;
          transition: width 0.5s ease-out, right 0.3s ease-out;
        }
        .sol-btn:hover {
          color: white;
          background: #111;
        }
        .sol-btn:hover::before {
          width: 0.9375rem;
          background: white;
        }
        .sol-btn:hover .sol-btn-text {
          color: white;
          padding-left: 1.5em;
        }
        .sol-btn:hover .top-key {
          left: -2px;
          width: 0px;
        }
        .sol-btn:hover .bottom-key-1,
        .sol-btn:hover .bottom-key-2 {
          right: 0;
          width: 0;
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {standalone && (
          <Breadcrumb
            segments={[
              { label: 'Home', onClick: () => setView('home') },
              { label: 'Solutions' },
            ]}
            theme={theme}
          />
        )}
        <div className="text-center mb-8">
          <p className="text-xs font-mono tracking-[0.25em] text-[#3373AB] uppercase font-bold">WHO WE SERVE</p>
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight mt-1">FIND YOUR PATH</h2>
        </div>

        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <div key={user.id} className="sol-card">
              <div className="flex gap-1.5 px-3 pt-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff605c]" style={{boxShadow: '-5px 5px 5px rgba(0,0,0,0.15)'}} />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd44]" style={{boxShadow: '-5px 5px 5px rgba(0,0,0,0.15)'}} />
                <span className="w-2.5 h-2.5 rounded-full bg-[#00ca4e]" style={{boxShadow: '-5px 5px 5px rgba(0,0,0,0.15)'}} />
              </div>
              <div className="sol-card-inner p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-[#3373AB]/10 text-[#3373AB] rounded">{user.icon}</span>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-800">{user.label}</h3>
                </div>
                <p className="text-xs font-black leading-snug text-gray-900">{user.painPoint}</p>
                <p className="text-xs leading-relaxed text-gray-500">{user.story}</p>
                <div className="border-t border-gray-200 pt-2">
                  <span className="text-lg font-black font-mono text-gray-900">{user.count}</span>
                  <span className="text-xs text-gray-400 font-mono ml-1 uppercase">{user.countLabel}</span>
                </div>
                <button onClick={() => setView(user.ctaView)} className="sol-btn">
                  <span className="top-key" />
                  <span className="sol-btn-text">{user.cta}</span>
                  <span className="bottom-key-1" />
                  <span className="bottom-key-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
