'use client';

import React, { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import { Smile, Rocket, Trophy, Clock, Star, Code, ThumbsUp, Palette, type LucideIcon } from 'lucide-react';
import { useAppContext } from '@/Context/AppContext';

interface Metric {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
}

const metrics: Metric[] = [
  { icon: Clock, value: 2, suffix: '+', label: 'Years experience' },
  { icon: Rocket, value: 7, suffix: '+', label: 'Projects shipped' },
  { icon: Smile, value: 8, suffix: '+', label: 'Happy clients' },
  { icon: Trophy, value: 5, suffix: '+', label: 'Awards' },
  { icon: Code, value: 50, suffix: 'K+', label: 'Lines of code' },
  { icon: Star, value: 12, suffix: '+', label: 'Frameworks' },
  { icon: ThumbsUp, value: 98, suffix: '%', label: 'Satisfaction' },
  { icon: Palette, value: 15, suffix: '+', label: 'UI designs' },
];

/* Counts up once when `active` turns true */
const Counter = ({ to, suffix, active }: { to: number; suffix: string; active: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!active || !ref.current) return;
    if (reduce) {
      ref.current.textContent = String(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [active, to, reduce]);

  return (
    <>
      <span ref={ref}>0</span>
      <span className="text-purple-500">{suffix}</span>
    </>
  );
};

const Iconlist: React.FC = () => {
  const { darkMode } = useAppContext();
  const bandRef = useRef<HTMLDivElement>(null);
  const inView = useInView(bandRef, { once: true, margin: '-80px' });

  // two copies = seamless loop (track moves exactly -50%)
  const track = [...metrics, ...metrics];

  return (
    <div id="experience-metrics" className="mx-auto w-full max-w-7xl px-4 py-8">
      <style>{`
        @keyframes stats-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .stats-track { animation: stats-scroll 35s linear infinite; }
        .stats-band:hover .stats-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .stats-track { animation: none; } }
      `}</style>

      <div
        ref={bandRef}
        className={`stats-band relative overflow-hidden rounded-[2rem] border py-8 ${
          darkMode
            ? 'border-white/10 bg-gradient-to-br from-gray-900 via-purple-950/70 to-gray-900'
            : 'border-purple-200/60 bg-gradient-to-br from-purple-50 via-white to-pink-50'
        }`}
      >
        {/* background: glows + faint grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-purple-500/25 blur-[100px]" />
          <div className="absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-pink-500/20 blur-[100px]" />
          <div
            className={`absolute inset-0 ${darkMode ? 'text-white' : 'text-purple-900'} opacity-[0.06]`}
            style={{
              backgroundImage:
                'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <h2 className={`relative mb-6 px-6 text-center text-2xl font-bold md:text-3xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          My journey in numbers
        </h2>

        {/* horizontal marquee with faded edges */}
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          }}
        >
          <div className="stats-track flex w-max">
            {track.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={i}
                  aria-hidden={i >= metrics.length}
                  className={`mr-4 flex items-center gap-4 rounded-2xl border px-5 py-4 backdrop-blur-md ${
                    darkMode ? 'border-white/10 bg-white/[0.06]' : 'border-purple-200/70 bg-white/80'
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${darkMode ? 'bg-white/10 text-purple-300' : 'bg-purple-500/10 text-purple-600'}`}>
                    <Icon size={24} />
                  </div>
                  <div className="whitespace-nowrap">
                    <div className={`text-3xl font-black leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Counter to={m.value} suffix={m.suffix} active={inView} />
                    </div>
                    <div className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{m.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Iconlist;