import { useEffect, useState } from 'react';
import { Users, GraduationCap, Building2, BookOpen, Cpu, Calendar } from 'lucide-react';

export default function TrustSection() {
  // Let's create an elegant visual counter simulation
  const [usersCount, setUsersCount] = useState(248700);
  const [studentsCount, setStudentsCount] = useState(84800);
  const [vendorsCount, setVendorsCount] = useState(1210);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsersCount(prev => Math.min(250490, prev + Math.floor(Math.random() * 8) + 2));
      setStudentsCount(prev => Math.min(85200, prev + Math.floor(Math.random() * 4) + 1));
      setVendorsCount(prev => Math.min(1240, prev + (Math.random() > 0.8 ? 1 : 0)));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      id: 1,
      label: 'Registered Engineers',
      value: usersCount.toLocaleString(),
      icon: <Users size={18} className="text-[#3373AB]" />,
      desc: 'Active system designers, network architects & coders.'
    },
    {
      id: 2,
      label: 'Certified Students',
      value: studentsCount.toLocaleString(),
      icon: <GraduationCap size={18} className="text-[#3373AB]" />,
      desc: 'Enrolled in masterclasses & learning paths.'
    },
    {
      id: 3,
      label: 'Onboarded Vendors',
      value: vendorsCount.toLocaleString(),
      icon: <Building2 size={18} className="text-[#3373AB]" />,
      desc: 'Vetted original foundries and tech component distributors.'
    },
    {
      id: 4,
      label: 'Specialized Courses',
      value: '142',
      icon: <BookOpen size={18} className="text-[#3373AB]" />,
      desc: 'Covering embedded Linux, Edge AI, SCADA security & RF.'
    },
    {
      id: 5,
      label: 'Ecosystem Components',
      value: '3,400+',
      icon: <Cpu size={18} className="text-[#3373AB]" />,
      desc: 'Datasheets, microprocessors, IoT modules & robotics frames.'
    },
    {
      id: 6,
      label: 'Events & Keynotes',
      value: '890+',
      icon: <Calendar size={18} className="text-[#3373AB]" />,
      desc: 'Livestreams, interactive webinars & tutorials broadcasted.'
    }
  ];

  return (
    <section className="w-full bg-white text-gray-900 border-b border-gray-200 select-none font-sans">
      <div className="max-w-7xl mx-auto py-12 lg:py-16 px-6">
        <div className="border-l-4 border-[#3373AB] pl-5 mb-10">
          <p className="text-xs font-mono font-bold tracking-widest text-[#3373AB] uppercase">RT GLOBAL METRICS</p>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 uppercase tracking-tight mt-1">THE TRUSTED NETWORK OF ENTERPRISE ENGINEERING</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 border border-gray-200 divide-y md:divide-y-0 md:grid-cols-3 lg:divide-x divide-gray-200">
          {stats.map((stat) => (
            <div key={stat.id} className="p-6 bg-white flex flex-col justify-between min-h-[160px]">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-bold text-gray-400">0{stat.id}</span>
                {stat.icon}
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold font-mono tracking-tight text-[#111111]">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-gray-800 mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
                <p className="text-xs text-gray-500 mt-1 lines-clamp-2 leading-relaxed font-light">
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
