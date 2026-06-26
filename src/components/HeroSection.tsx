import { useEffect, useState } from 'react';
import {
  Workflow,
  GraduationCap,
  Radio,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';

interface HeroSectionProps {
  setView: (view: string) => void;
  theme: 'light' | 'dark';
}

interface HeroSlide {
  image: string;
  mobileImage?: string;
  eyebrow: string;
  headline: string;
  subtext: string;
  primary: { label: string; view: string };
  secondary: { label: string; view: string };
}

const HERO_SLIDES: HeroSlide[] = [
  {
    image: '/animation/rtshop.png',
    mobileImage: '/animation/rtshopmobile.png',
    eyebrow: 'RT SHOP — COMPONENTS & IOT HARDWARE',
    headline: 'Premium Components. Shelf-Beating Prices.',
    subtext:
      'Microcontrollers, IoT shields, sensors and biometrics — sourced and stocked for makers and businesses across Rwanda.',
    primary: { label: 'Shop IoT Devices', view: 'shop' },
    secondary: { label: 'Browse Categories', view: 'shop' },
  },
  {
    image: '/animation/rtlearn.png',
    mobileImage: '/animation/rtlearnmobile.png',
    eyebrow: 'RTTI LEARN — CERTIFIED TRAINING TRACKS',
    headline: 'Train On Real Hardware. Get RTB Certified.',
    subtext:
      'Structured tracks, hands-on labs, and an RTB-recognized certification path for the next generation of embedded engineers.',
    primary: { label: 'View Certification Track', view: 'rtti' },
    secondary: { label: 'Start Learning', view: 'rtti' },
  },
];

interface SystemModule {
  tag: string;
  tagClass: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  view: string;
  dashed?: boolean;
  mono?: boolean;
}

const SHOP_MODULE: SystemModule = {
  tag: 'COMMERCE GRID',
  tagClass: 'bg-[#3373AB]',
  title: 'RT Shop',
  desc: 'Microcontrollers, IoT shields, biometrics',
  icon: Workflow,
  view: 'shop',
};

const SECONDARY_MODULES: SystemModule[] = [
  {
    tag: 'EDUCATION SYSTEM',
    tagClass: 'bg-gray-500',
    title: 'RTTI Learn',
    desc: 'Certifications & labs',
    icon: GraduationCap,
    view: 'rtti',
  },
  {
    tag: 'BROADCASTING NODE',
    tagClass: 'bg-gray-500',
    title: 'MTTV Media',
    desc: 'Webinars & podcasts',
    icon: Radio,
    view: 'mttv',
  },
];

const PORTAL_MODULE: SystemModule = {
  tag: 'ROLE WORKSPACES',
  tagClass: 'bg-[#3373AB]',
  title: 'RT-Portal Core',
  desc: 'Dashboards for every role',
  icon: LayoutDashboard,
  view: 'portals',
  dashed: true,
  mono: true,
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function FancyButton({
  label,
  solid,
  onClick,
}: {
  label: string;
  solid?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`fancy-btn shadow-lg ${solid ? 'fancy-btn-solid' : ''}`}
    >
      <span className="f-top-key" />
      <span className="f-text">{label}</span>
      <span className="f-bot-key-1" />
      <span className="f-bot-key-2" />
    </button>
  );
}

function ModuleTile({
  mod,
  busDot,
  onClick,
}: {
  mod: SystemModule;
  busDot?: boolean;
  onClick: () => void;
}) {
  const Icon = mod.icon;
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      className={`relative w-full p-3 text-left cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8C547] focus-visible:outline-offset-2 ${mod.dashed
          ? 'border border-dashed border-[#3373AB]/30 bg-white/60 hover:bg-white/90'
          : 'border border-gray-200 bg-white/60 hover:border-[#3373AB]/50'
        }`}
    >
      {busDot && (
        <span
          aria-hidden
          className="hidden md:block absolute -left-[19px] top-1/2 -translate-y-1/2 w-[7px] h-[7px] rotate-45 bg-[#3373AB]"
        />
      )}
      <div
        className={`absolute -top-[9px] left-3 ${mod.tagClass} text-white px-1.5 py-0.5 text-xs font-mono uppercase font-bold`}
      >
        {mod.tag}
      </div>
      <div className="flex justify-between items-center">
        <div>
          <h4
            className={`font-extrabold uppercase tracking-wide ${mod.mono
                ? 'font-mono text-xs text-[#3373AB]'
                : 'font-sans text-sm text-gray-900'
              }`}
          >
            {mod.title}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5 font-medium leading-snug">
            {mod.desc}
          </p>
        </div>
        {mod.dashed ? (
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        ) : (
          <Icon className="text-[#3373AB]" size={16} />
        )}
      </div>
    </div>
  );
}

export default function HeroSection({ setView, theme }: HeroSectionProps) {
  const isDark = theme === 'dark';
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (paused) return;
    const t = setInterval(
      () => setSlide((p) => (p + 1) % HERO_SLIDES.length),
      5000
    );
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section
      aria-label="Featured highlights"
      className="relative w-full h-[75vh] lg:h-screen border-b-4 border-[#3373AB] overflow-hidden select-none pt-[var(--rtn-header-height,0px)]"
    >
      <style>{`
        @font-face {
          font-family: 'Jarvane';
          src: url('/jarvane-display-font/Jarvane-BF6814d55045491.woff') format('woff'),
               url('/jarvane-display-font/Jarvane-BF6814d5504a5e3.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @keyframes heroOverlayIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-overlay-in { animation: heroOverlayIn 0.5s ease-out both; }

        @keyframes busPulse {
          0% { top: 4%; opacity: 0; }
          12% { opacity: 1; }
          50% { top: 92%; opacity: 1; }
          62% { opacity: 0; }
          100% { top: 92%; opacity: 0; }
        }
        .bus-pulse { animation: busPulse 4.5s ease-in-out infinite; }

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
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
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
          box-shadow: 0 0 16px rgba(232,197,71,0.12), 0 6px 18px rgba(0,0,0,0.35);
          transform: translateY(-2px);
        }
        .fancy-btn:hover::before { width: 0.75rem; background: #E8C547; }
        .fancy-btn:hover .f-text { color: #E8C547; padding-left: 1.5em; }
        .fancy-btn:hover .f-top-key { left: -2px; width: 0px; }
        .fancy-btn:hover .f-bot-key-1, .fancy-btn:hover .f-bot-key-2 { right: 0; width: 0; }
        .fancy-btn:focus-visible {
          outline: 2px solid #E8C547;
          outline-offset: 3px;
        }
        .fancy-btn-solid {
          background-color: #3373AB;
          border-color: #3373AB;
          box-shadow: 0 4px 16px rgba(51,115,171,0.3), 0 6px 18px rgba(0,0,0,0.25);
        }
        .fancy-btn-solid:hover {
          background: rgba(255,255,255,0.1);
          border-color: #E8C547;
          box-shadow: 0 0 24px rgba(232,197,71,0.25), 0 8px 22px rgba(0,0,0,0.4);
          transform: translateY(-3px);
        }
        .fancy-btn-solid:hover::before { background: #E8C547; }
        .fancy-btn-solid:hover .f-text { color: #E8C547; }

        @media (prefers-reduced-motion: reduce) {
          .hero-overlay-in { animation: none; }
          .bus-pulse { animation: none; opacity: 0; }
        }
      `}</style>

      {/* Full‑width background crossfade */}
      <div className={`absolute inset-0 ${isDark ? 'bg-black' : 'bg-white'}`}>
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.image}
            className={`absolute inset-0 transition-opacity ${reducedMotion ? 'duration-150' : 'duration-700'
              } ${i === slide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
            <picture className="absolute inset-0">
              {s.mobileImage && (
                <source media="(max-width: 1023px)" srcSet={s.mobileImage} />
              )}
              <img
                src={s.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </picture>
            {/* Brand-tinted overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1727]/75 via-[#0B1727]/15 to-transparent" />
            {/* Left-to-right dimming overlay for desktop */}
            <div className="absolute inset-0 hidden md:block bg-[linear-gradient(to_right,black_0%,rgba(0,0,0,0.90)_25%,rgba(0,0,0,0.45)_50%,rgba(0,0,0,0.18)_75%,rgba(0,0,0,0.08)_100%)] pointer-events-none" />

            <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-full px-4 md:px-0 z-20">
              <div
                key={i === slide ? `active-${i}` : `inactive-${i}`}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                className={`relative w-full max-w-3xl mx-auto md:mx-0 bg-[#0B1727]/90 border-l-4 border-[#E8C547] px-6 py-7 md:px-9 md:py-8 text-center ${i === slide && !reducedMotion ? 'hero-overlay-in' : ''
                  }`}
              >
                <span
                  aria-hidden
                  className="hidden md:block absolute -top-px -right-px w-3 h-3 border-t border-r border-white/25"
                />
                <span
                  aria-hidden
                  className="hidden md:block absolute -bottom-px -right-px w-3 h-3 border-b border-r border-white/25"
                />

                <p className="font-mono text-[11px] tracking-[0.2em] text-[#E8C547] mb-3 uppercase">
                  {s.eyebrow}
                </p>
                <h2
                  className="[font-family:'Jarvane',serif] text-2xl sm:text-3xl md:text-4xl text-white leading-[1.15] tracking-wide"
                  style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
                >
                  {s.headline}
                </h2>
                <p className="mt-3 text-sm text-slate-300/90 max-w-md mx-auto font-medium leading-relaxed">
                  {s.subtext}
                </p>

                <div className="flex flex-wrap gap-3 mt-6 justify-center">
                  <FancyButton
                    label={s.primary.label}
                    solid
                    onClick={() => setView(s.primary.view)}
                  />
                  <FancyButton
                    label={s.secondary.label}
                    onClick={() => setView(s.secondary.view)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div
          className={`absolute inset-0 ${isDark ? 'bg-black/40' : 'bg-black/10'} pointer-events-none`}
        />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #3373AB 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Slide progress ticks */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === slide ? 'true' : undefined}
            className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8C547] focus-visible:outline-offset-2 ${i === slide
                ? 'w-8 bg-[#E8C547]'
                : isDark
                  ? 'w-4 bg-white/30 hover:bg-white/60'
                  : 'w-4 bg-gray-400/60 hover:bg-gray-500'
              }`}
          />
        ))}
      </div>

      {/* System status panel — removed */}
    </section>
  );
}