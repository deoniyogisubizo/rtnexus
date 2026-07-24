import { useEffect, useState } from 'react';
import { Home, ShoppingCart, GraduationCap, Tv, User } from 'lucide-react';

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
    headline: 'SHOP EMMBEDED SYSTEM ON SHELF-BEATING PRICES ',
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

function TypewriterLine({ text, isActive, style }: { text: string; isActive: boolean; style?: React.CSSProperties }) {
  return (
    <span style={style}>
      {text.split('').map((char, i) => (
        <span
          key={`${text}-${i}`}
          className={`type-char ${isActive ? 'active' : ''}`}
          style={{ animationDelay: `${i * 0.03}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      {isActive && <span className="type-cursor" />}
    </span>
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
      id="hero-section"
      aria-label="Featured highlights"
      className="relative w-full -mt-[5px] border-b-0 overflow-hidden select-none"
      style={{ height: '90vh' }}
    >
      <style>{`
        @font-face {
          font-family: 'Jarvane';
          src: url('/jarvane-display-font/Jarvane-BF6814d55045491.woff') format('woff'),
               url('/jarvane-display-font/Jarvane-BF6814d5504a5e3.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @keyframes typeChar {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .type-char {
          opacity: 0;
          display: inline-block;
        }
        .type-char.active {
          animation: typeChar 0.02s forwards;
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .type-cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background: #E8C547;
          margin-left: 2px;
          vertical-align: text-bottom;
          animation: cursorBlink 0.7s step-end infinite;
        }

        @keyframes heroTextIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .hero-text-in { animation: heroTextIn 0.6s ease-out both; }

        @media (prefers-reduced-motion: reduce) {
          .type-char { opacity: 1 !important; animation: none !important; }
          .hero-text-in { animation: none; }
        }
      `}</style>

      {/* Full-width background crossfade */}
      <div className={`absolute inset-0 ${isDark ? 'bg-black' : 'bg-white'}`}>
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.image}
            className={`absolute inset-0 transition-opacity ${reducedMotion ? 'duration-150' : 'duration-700'
              } ${i === slide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
            <img
              src={window.innerWidth < 1024 && s.mobileImage ? s.mobileImage : s.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ filter: 'brightness(0.9)' }}
            />

            {/* Text positioned on the left, from left edge to near middle */}
            <div className="absolute inset-0 flex items-center">
              <div
                key={i === slide ? `active-${i}` : `inactive-${i}`}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                className={`w-full max-w-2xl px-6 md:px-10 lg:pl-24 lg:pr-14 ${i === slide && !reducedMotion ? 'hero-text-in' : ''
                  }`}
              >
                <p className="font-mono text-[11px] tracking-[0.2em] text-[#E8C547] mb-3 uppercase">
                  {s.eyebrow}
                </p>
                <h2
                  className="leading-[1.15] uppercase"
                  style={{
                    fontFamily: "'Jarvane', serif",
                    fontSize: 'clamp(1rem, 3vw, 2.25rem)',
                    letterSpacing: '0.08em',
                    color: isDark ? '#ffffff' : '#111111',
                    textShadow: '0 2px 16px rgba(0,0,0,0.4)',
                  }}
                >
                  <TypewriterLine text={s.headline} isActive={i === slide && !reducedMotion} />
                </h2>
                <p
                  className="mt-3 text-sm md:text-base max-w-md font-medium leading-relaxed"
                  style={{
                    color: isDark ? '#d1d5db' : '#374151',
                    textShadow: '0 1px 8px rgba(0,0,0,0.25)',
                  }}
                >
                  {s.subtext}
                </p>

                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => setView(s.primary.view)}
                    className="px-6 py-2.5 bg-[#3373AB] text-white text-sm font-semibold uppercase tracking-wide hover:bg-[#285a8a] transition-colors"
                  >
                    {s.primary.label}
                  </button>
                  <button
                    onClick={() => setView(s.secondary.view)}
                    className="px-6 py-2.5 border-2 border-[#3373AB] text-[#3373AB] text-sm font-semibold uppercase tracking-wide hover:bg-[#3373AB] hover:text-white transition-colors"
                  >
                    {s.secondary.label}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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

      {/* Left sidebar — icon strip */}
      <div className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 flex-col items-center justify-between py-6 px-2 bg-white/100 backdrop-blur-sm shadow-lg border border-white/20" style={{ borderRadius: '9999px', height: '420px' }}>
        <button
          onClick={() => setView('home')}
          className="w-9 h-9 flex items-center justify-center bg-[#222222] text-white transition-transform hover:scale-110"
          style={{ borderRadius: '50%' }}
          aria-label="Home"
        >
          <Home size={16} />
        </button>
        <button
          onClick={() => setView('shop')}
          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all hover:scale-110"
          style={{ borderRadius: '50%' }}
          aria-label="RT Shop"
        >
          <ShoppingCart size={16} />
        </button>
        <button
          onClick={() => setView('rtti')}
          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all hover:scale-110"
          style={{ borderRadius: '50%' }}
          aria-label="RTTI Learn"
        >
          <GraduationCap size={16} />
        </button>
        <button
          onClick={() => setView('mttv')}
          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all hover:scale-110"
          style={{ borderRadius: '50%' }}
          aria-label="MTTV"
        >
          <Tv size={16} />
        </button>
        <div className="w-5 h-px bg-gray-300" />
        <button
          onClick={() => setView('home')}
          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all hover:scale-110"
          style={{ borderRadius: '50%' }}
          aria-label="Account"
        >
          <User size={16} />
        </button>
      </div>
    </section>
  );
}
