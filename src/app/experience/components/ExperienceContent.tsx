'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Code,
  Building2,
  GraduationCap,
  Briefcase,
  ChevronDown,
  ArrowRight,
  Loader2,
  AlertCircle,
  Rocket,
  type LucideIcon,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppContext } from '@/Context/AppContext';

gsap.registerPlugin(ScrollTrigger);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/* ───────────── Types ───────────── */
interface ApiExperience {
  id: string;
  company: string;
  location?: string;
  position: string;
  type?: string;
  duration?: string;
  status?: 'current' | 'completed';
  companyType?: string;
  from?: string;
  to?: string;
  icon?: string;
  technologies?: string[];
  achievements?: string[];
  projects?: string[];
  skills?: string[];
  order?: number;
}

interface Experience extends ApiExperience {
  icon: string;
}

/* ───────────── Icon map (string → Lucide component) ───────────── */
const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  GraduationCap,
  Briefcase,
  Building2,
  Rocket,
};

const getIcon = (name?: string): LucideIcon => ICON_MAP[name || ''] || Code;

/* ───────────── Helpers ───────────── */
const ACCENT_PAIRS: [string, string][] = [
  ['#a855f7', '#ec4899'],
  ['#8b5cf6', '#6366f1'],
  ['#d946ef', '#f43f5e'],
  ['#3b82f6', '#06b6d4'],
  ['#10b981', '#14b8a6'],
];

const grad = (e: Pick<Experience, 'from' | 'to'>) =>
  `linear-gradient(135deg, ${e.from || '#a855f7'}, ${e.to || '#ec4899'})`;

const pad = (n: number) => String(n).padStart(2, '0');

/* ───────────── Component ───────────── */
const WorkExperienceShowcase: React.FC = () => {
  const { darkMode } = useAppContext();

  const rootRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLOListElement>(null);

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState(0);

  const prefersReduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───────────── Fetch ───────────── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/public/experience`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ApiExperience[] = await res.json();
        if (cancelled) return;

        const mapped: Experience[] = data
          .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
          .map((e, idx) => {
            const [from, to] = ACCENT_PAIRS[idx % ACCENT_PAIRS.length];
            return {
              ...e,
              from: e.from || from,
              to: e.to || to,
              icon: e.icon || ['Code', 'GraduationCap', 'Briefcase'][idx % 3],
            };
          });

        setExperiences(mapped);

        // Auto-open the current job
        const initial: Record<string, boolean> = {};
        mapped.forEach((e) => {
          if (e.status === 'current') initial[e.id] = true;
        });
        setOpen(initial);
        setError(null);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to load experience');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ───────────── Derived stats ───────────── */
  const { stats, uniqueTechCount, totalProjects } = useMemo(() => {
    const tech = new Set<string>();
    let proj = 0;
    experiences.forEach((e) => {
      (e.technologies || []).forEach((t) => tech.add(t));
      proj += (e.projects || []).length;
    });
    return {
      stats: [
        { value: experiences.length, label: 'Positions' },
        { value: tech.size, label: 'Technologies' },
        { value: proj, label: 'Projects' },
      ],
      uniqueTechCount: tech.size,
      totalProjects: proj,
    };
  }, [experiences]);

  /* ───────────── Scroll animations ───────────── */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || loading || experiences.length === 0) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia(root);

      mm.add(
        { isDesktop: '(min-width: 1024px)', reduce: '(prefers-reduced-motion: reduce)' },
        (c) => {
          const { isDesktop, reduce } = c.conditions as { isDesktop: boolean; reduce: boolean };
          if (reduce) return;
          const dist = isDesktop ? 220 : 60;

          gsap
            .timeline({
              scrollTrigger: {
                trigger: '.ex-head',
                start: 'top 92%',
                end: 'top 40%',
                scrub: true,
              },
            })
            .from('.ex-badge', { scale: 0, rotate: -120, opacity: 0, ease: 'back.out(2)' }, 0)
            .from(
              '.ex-title-a',
              { x: -dist * 1.4, opacity: 0, scale: 0.5, transformOrigin: '100% 50%', ease: 'power2.out' },
              0
            )
            .from(
              '.ex-title-b',
              { x: dist * 1.4, opacity: 0, scale: 0.5, transformOrigin: '0% 50%', ease: 'power2.out' },
              0
            )
            .from('.ex-sub', { y: 30, opacity: 0, ease: 'power2.out' }, 0.4);

          gsap.from('.ex-side', {
            x: -dist * 0.8,
            opacity: 0,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.ex-layout', start: 'top 92%', end: 'top 55%', scrub: true },
          });

          gsap.fromTo(
            '.ex-fill',
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: { trigger: '.ex-cards', start: 'top 60%', end: 'bottom 60%', scrub: true },
            }
          );

          gsap.utils.toArray<HTMLElement>('.ex-num', root).forEach((num) => {
            const target = Number(num.dataset.target);
            const counter = { v: 0 };
            gsap.to(counter, {
              v: target,
              duration: 1.6,
              ease: 'power2.out',
              scrollTrigger: { trigger: '.ex-stats', start: 'top 90%', once: true },
              onUpdate: () => {
                num.textContent = String(Math.round(counter.v));
              },
            });
          });

          gsap.utils.toArray<HTMLElement>('.ex-card', root).forEach((card) => {
            const q = gsap.utils.selector(card);

            gsap.fromTo(
              card,
              { x: dist, opacity: 0, scale: 0.85 },
              {
                x: 0,
                opacity: 1,
                scale: 1,
                ease: 'power2.out',
                scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 55%', scrub: true },
              }
            );

            gsap.fromTo(
              q('.ex-bar'),
              { scaleY: 0 },
              { scaleY: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 90%', end: 'top 40%', scrub: true } }
            );

            gsap.fromTo(
              q('.ex-ptitle'),
              { x: 40, opacity: 0.15, scale: 0.85, transformOrigin: '0% 50%' },
              { x: 0, opacity: 1, scale: 1, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 50%', scrub: true } }
            );

            gsap.fromTo(
              q('.ex-index'),
              { scale: 0.4, opacity: 0, transformOrigin: '0% 50%' },
              { scale: 1, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 92%', end: 'top 55%', scrub: true } }
            );

            gsap
              .timeline({ scrollTrigger: { trigger: card, start: 'top 75%', once: true } })
              .from(q('.ex-icon'), { rotate: -180, scale: 0, duration: 0.7, ease: 'back.out(1.8)' }, 0)
              .from(q('.ex-meta'), { y: 14, opacity: 0, stagger: 0.08, duration: 0.45, ease: 'power3.out', clearProps: 'all' }, 0.15)
              .from(q('.ex-tchip-preview'), { y: 14, opacity: 0, scale: 0.8, stagger: 0.07, duration: 0.45, ease: 'back.out(1.8)', clearProps: 'all' }, 0.3);
          });

          gsap.from('.ex-cta', {
            scale: 0.6,
            opacity: 0,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.ex-cta', start: 'top 98%', end: 'top 72%', scrub: true },
          });
        }
      );
    }, root);

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, [experiences, loading]);

  /* ───────────── Active card tracker ───────────── */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || experiences.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.ex-card', root).forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [experiences]);

  useEffect(() => {
    const items = navRef.current?.querySelectorAll('.ex-nav-item');
    if (!items || prefersReduced()) return;
    gsap.to(items, {
      x: (i: number) => (i === active ? 10 : 0),
      opacity: (i: number) => (i === active ? 1 : 0.45),
      duration: 0.4,
      ease: 'power3.out',
    });
    gsap.to('.ex-nav-dot', {
      scale: (i: number) => (i === active ? 1.5 : 1),
      duration: 0.4,
      ease: 'back.out(2)',
    });
  }, [active]);

  /* ───────────── Expand / collapse ───────────── */
  const toggle = (id: string) => {
    const root = rootRef.current;
    if (!root) return;
    const card = root.querySelector<HTMLElement>(`[data-exp="${id}"]`);
    const more = card?.querySelector<HTMLElement>('.ex-more');
    const arrow = card?.querySelector<HTMLElement>('.ex-arrow');
    if (!card || !more) return;

    const willOpen = !open[id];
    setOpen((o) => ({ ...o, [id]: willOpen }));

    if (prefersReduced()) {
      gsap.set(more, { height: willOpen ? 'auto' : 0, opacity: willOpen ? 1 : 0 });
      if (arrow) gsap.set(arrow, { rotate: willOpen ? 180 : 0 });
      ScrollTrigger.refresh();
      return;
    }

    if (arrow) gsap.to(arrow, { rotate: willOpen ? 180 : 0, duration: 0.4, ease: 'power3.out' });

    if (willOpen) {
      gsap.set(more, { height: 'auto' });
      const h = more.offsetHeight;
      gsap.set(more, { height: 0 });
      gsap.to(more, {
        height: h,
        opacity: 1,
        duration: 0.55,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(more, { height: 'auto' });
          ScrollTrigger.refresh();
        },
      });
      gsap.fromTo(
        card.querySelectorAll('.ex-li, .ex-pchip, .ex-tchip'),
        { x: -24, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.04, duration: 0.45, delay: 0.15, ease: 'power3.out', clearProps: 'all' }
      );
    } else {
      gsap.to(more, {
        height: 0,
        opacity: 0,
        duration: 0.45,
        ease: 'power3.inOut',
        onComplete: () => ScrollTrigger.refresh(),
      });
    }
  };

  const bounceIcon = (e: React.MouseEvent<HTMLElement>, enter: boolean) => {
    if (!window.matchMedia('(hover: hover)').matches || prefersReduced()) return;
    const icon = e.currentTarget.querySelector('.ex-icon');
    if (!icon) return;
    gsap.to(
      icon,
      enter
        ? { scale: 1.15, rotate: 8, duration: 0.4, ease: 'back.out(2)' }
        : { scale: 1, rotate: 0, duration: 0.4, ease: 'power3.out' }
    );
  };

  /* ───────────── Theme ───────────── */
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const soft = darkMode ? 'text-gray-300' : 'text-gray-600';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardCls = darkMode
    ? 'bg-white/[0.06] border-white/10 hover:border-white/20'
    : 'bg-white border-purple-100 shadow-xl shadow-purple-900/5 hover:border-purple-200';
  const chipCls = darkMode
    ? 'border-white/15 bg-white/[0.06] text-gray-200'
    : 'border-purple-200 bg-purple-50 text-gray-700';
  const track = darkMode ? 'bg-white/10' : 'bg-purple-900/10';

  /* ───────────── Loading / error ───────────── */
  if (loading) {
    return (
      <section id="Experience" className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className={`h-10 w-10 animate-spin ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
      </section>
    );
  }

  if (error) {
    return (
      <section id="Experience" className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className={soft}>Couldn’t load experience ({error}).</p>
      </section>
    );
  }

  return (
    <section id="Experience" ref={rootRef} className="relative w-full overflow-x-clip px-4 py-20 sm:px-6 md:py-28">
      {/* Background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-48 top-40 h-[600px] w-[600px] rounded-full"
          style={{ background: `radial-gradient(circle, ${darkMode ? 'rgba(147,51,234,0.22)' : 'rgba(192,132,252,0.28)'} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -right-48 bottom-20 h-[560px] w-[560px] rounded-full"
          style={{ background: `radial-gradient(circle, ${darkMode ? 'rgba(236,72,153,0.16)' : 'rgba(249,168,212,0.38)'} 0%, transparent 70%)` }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="ex-head mb-14 text-center md:mb-20">
          <div
            className="ex-badge mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg shadow-purple-500/30"
            style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}
          >
            <Briefcase className="h-8 w-8" />
          </div>
          <h1 className={`flex flex-wrap items-baseline justify-center gap-x-4 text-5xl font-black tracking-tight md:text-7xl ${text}`}>
            <span className="ex-title-a inline-block">Work</span>
            <span
              className="ex-title-b inline-block bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg,#a855f7,#ec4899)' }}
            >
              Experience
            </span>
          </h1>
          <p className={`ex-sub mx-auto mt-5 max-w-2xl text-base md:text-lg ${soft}`}>
            A journey through my professional development and achievements
          </p>
        </div>

        <div className="ex-layout grid items-start gap-10 lg:grid-cols-[4fr_8fr] lg:gap-14">
          {/* Left panel */}
          <aside className="ex-side lg:sticky lg:top-28">
            <div className="ex-stats grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className={`rounded-2xl border p-4 text-center ${
                    darkMode ? 'border-white/10 bg-white/[0.06]' : 'border-purple-100 bg-white shadow-lg shadow-purple-900/5'
                  }`}
                >
                  <div
                    className="bg-clip-text text-3xl font-black tabular-nums text-transparent md:text-4xl"
                    style={{ backgroundImage: 'linear-gradient(135deg,#a855f7,#ec4899)' }}
                  >
                    <span className="ex-num" data-target={s.value}>
                      {s.value}
                    </span>
                  </div>
                  <div className={`mt-1 text-xs ${muted}`}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="relative mt-10 hidden lg:block">
              <div className={`absolute bottom-0 left-[7px] top-0 w-[2px] rounded-full ${track}`} />
              <div
                className="ex-fill absolute bottom-0 left-[7px] top-0 w-[2px] origin-top rounded-full"
                style={{ background: 'linear-gradient(to bottom,#a855f7,#ec4899)' }}
              />
              <ol ref={navRef} className="space-y-7 pl-8">
                {experiences.map((e, i) => (
                  <li key={e.id} className="ex-nav-item relative" style={{ opacity: i === 0 ? 1 : 0.45 }}>
                    <span
                      className="ex-nav-dot absolute -left-[2.15rem] top-1.5 h-3 w-3 rounded-full"
                      style={{ background: grad(e), boxShadow: `0 0 0 4px ${(e.from || '#a855f7') + '33'}` }}
                    />
                    <span className={`block text-xs font-semibold uppercase tracking-widest ${muted}`}>
                      {pad(i + 1)}
                    </span>
                    <span className={`block text-lg font-bold leading-tight ${text}`}>{e.company}</span>
                    <span className={`block text-sm ${muted}`}>{e.duration}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          {/* Cards */}
          <div className="ex-cards space-y-8 md:space-y-10">
            {experiences.map((exp, index) => {
              const Icon = getIcon(exp.icon);
              const initiallyOpen = exp.status === 'current';
              const isOpen = Boolean(open[exp.id]);

              return (
                <article key={exp.id} data-exp={exp.id} className="ex-card">
                  <div
                    className={`relative overflow-hidden rounded-3xl border transition-colors duration-300 ${cardCls}`}
                    onMouseEnter={(e) => bounceIcon(e, true)}
                    onMouseLeave={(e) => bounceIcon(e, false)}
                  >
                    <div className="ex-bar absolute bottom-0 left-0 top-0 w-1.5 origin-top" style={{ background: grad(exp) }} />

                    <div className="p-6 pl-8 md:p-8 md:pl-10">
                      <div className="flex items-start justify-between gap-4">
                        <span
                          className="ex-index text-6xl font-black leading-none md:text-7xl"
                          style={{
                            backgroundImage: grad(exp),
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                          }}
                        >
                          {pad(index + 1)}
                        </span>

                        <span
                          className="ex-meta inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
                          style={{
                            background:
                              exp.status === 'current'
                                ? 'linear-gradient(135deg,#10b981,#14b8a6)'
                                : 'linear-gradient(135deg,#6b7280,#9ca3af)',
                          }}
                        >
                          {exp.status === 'current' ? (
                            <span className="relative mr-2 flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                            </span>
                          ) : (
                            <span className="mr-2 h-2 w-2 rounded-full bg-white/80" />
                          )}
                          {exp.status === 'current' ? 'Currently working' : 'Completed'}
                        </span>
                      </div>

                      <div className="mt-5 flex items-center gap-4">
                        <span
                          className="ex-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
                          style={{ background: grad(exp) }}
                        >
                          <Icon className="h-6 w-6" />
                        </span>
                        <div className="min-w-0">
                          <h3 className={`ex-ptitle text-xl font-extrabold leading-tight md:text-3xl ${text}`}>
                            {exp.position}
                          </h3>
                          <p className={`mt-1 text-sm font-semibold md:text-base ${soft}`}>
                            {exp.company} <span className={muted}>· {exp.companyType}</span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                        <span className={`ex-meta flex items-center text-sm ${soft}`}>
                          <Calendar className="mr-2 h-4 w-4" style={{ color: exp.from }} />
                          {exp.duration}
                        </span>
                        <span className={`ex-meta flex items-center text-sm ${soft}`}>
                          <MapPin className="mr-2 h-4 w-4" style={{ color: exp.from }} />
                          {exp.location}
                        </span>
                        <span className={`ex-meta flex items-center text-sm ${soft}`}>
                          <Building2 className="mr-2 h-4 w-4" style={{ color: exp.from }} />
                          {exp.type}
                        </span>
                      </div>

                      {exp.achievements?.[0] && (
                        <p className={`mt-5 text-sm leading-relaxed md:text-base ${soft}`}>
                          {exp.achievements[0]}
                        </p>
                      )}

                      {(exp.technologies?.length ?? 0) > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {exp.technologies!.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className={`ex-tchip-preview rounded-full border px-3 py-1 text-xs font-medium ${chipCls}`}
                            >
                              {t}
                            </span>
                          ))}
                          {exp.technologies!.length > 3 && (
                            <span className={`ex-tchip-preview rounded-full border px-3 py-1 text-xs font-medium ${chipCls}`}>
                              +{exp.technologies!.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => toggle(exp.id)}
                        aria-expanded={isOpen}
                        aria-controls={`ex-more-${exp.id}`}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-bold"
                        style={{ color: exp.from }}
                      >
                        {isOpen ? 'Hide details' : 'Show details'}
                        <ChevronDown
                          className="ex-arrow h-4 w-4"
                          style={{ transform: initiallyOpen ? 'rotate(180deg)' : undefined }}
                        />
                      </button>
                    </div>

                    <div
                      id={`ex-more-${exp.id}`}
                      className="ex-more overflow-hidden"
                      style={{ height: initiallyOpen ? 'auto' : 0, opacity: initiallyOpen ? 1 : 0 }}
                    >
                      <div
                        className={`mx-6 mb-6 rounded-2xl border p-6 md:mx-8 md:mb-8 md:ml-10 ${
                          darkMode ? 'border-white/10 bg-black/20' : 'border-purple-100 bg-purple-50/60'
                        }`}
                      >
                        {(exp.achievements?.length ?? 0) > 0 && (
                          <>
                            <h4 className={`mb-3 text-lg font-bold ${text}`}>Key achievements</h4>
                            <ul className="space-y-3">
                              {exp.achievements!.map((a) => (
                                <li key={a} className="ex-li flex items-start gap-3">
                                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: grad(exp) }} />
                                  <span className={`text-sm md:text-base ${soft}`}>{a}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}

                        {(exp.projects?.length ?? 0) > 0 && (
                          <>
                            <h4 className={`mb-3 mt-7 text-lg font-bold ${text}`}>Notable projects</h4>
                            <div className="flex flex-wrap gap-2">
                              {exp.projects!.map((p) => (
                                <span
                                  key={p}
                                  className={`ex-pchip rounded-lg border px-3 py-2 text-sm font-medium ${chipCls}`}
                                  style={{ borderColor: `${exp.from}66` }}
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          </>
                        )}

                        {(exp.technologies?.length ?? 0) > 0 && (
                          <>
                            <h4 className={`mb-3 mt-7 text-lg font-bold ${text}`}>Technologies used</h4>
                            <div className="flex flex-wrap gap-2">
                              {exp.technologies!.map((t) => (
                                <span key={t} className={`ex-tchip rounded-full border px-3 py-1 text-xs font-medium ${chipCls}`}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </>
                        )}

                        {(exp.skills?.length ?? 0) > 0 && (
                          <>
                            <h4 className={`mb-3 mt-7 text-lg font-bold ${text}`}>Skills gained</h4>
                            <div className="flex flex-wrap gap-2">
                              {exp.skills!.map((s) => (
                                <span
                                  key={s}
                                  className="ex-tchip rounded-full px-3 py-1 text-xs font-semibold text-white"
                                  style={{ background: grad(exp) }}
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center md:mt-28">
          <div className="ex-cta inline-block">
            <p className={`mb-5 text-2xl font-bold md:text-3xl ${text}`}>Want to work together?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-500/25 transition-transform hover:scale-105 active:scale-95"
            >
              Get in touch <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkExperienceShowcase;