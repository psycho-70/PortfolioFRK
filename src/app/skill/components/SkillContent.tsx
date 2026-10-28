'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppContext } from '@/Context/AppContext';
import TypingEffect from '@/Components/UI/TypingEffect';

gsap.registerPlugin(ScrollTrigger);

/* ───────────── Types ───────────── */
interface Skill { name: string; level: number; icon: string; }
interface SkillCategory {
  category: string;
  description: string;
  icon: string;
  from: string;
  to: string;
  skills: Skill[];
}

interface ApiSkill {
  id?: string;
  name: string;
  category: string;
  level: number | string;
  icon?: string;
  order?: number;
}

/* ───────────── Static content (edit here) ───────────── */
const nameTexts: string[] = [
  'Full Stack Developer',
  'Generative AI Engineer',
  'Python & Flask Developer',
  'AI Automation Builder',
  'React & Next.js Expert',
];

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const deploymentApiUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_URL?.trim();
const isLocalApiUrl = configuredApiUrl
  ? /^https?:\/\/(?:localhost|127(?:\.\d{1,3}){3}|\[::1\])(?::\d+)?(?:\/|$)/i.test(configuredApiUrl)
  : false;
const API_URL =
  configuredApiUrl && !(process.env.NODE_ENV === 'production' && isLocalApiUrl)
    ? configuredApiUrl
    : deploymentApiUrl ||
      (process.env.NODE_ENV === 'production'
        ? 'https://backendproject-01.vercel.app'
        : 'http://localhost:5000');

const CATEGORY_META: Record<string, { description: string; icon: string; from: string; to: string }> = {
  Frontend:               { description: 'Fast, responsive interfaces with clean, animated UIs.', icon: '🌐', from: '#3b82f6', to: '#06b6d4' },
  'Full Stack & Backend': { description: 'APIs, databases and authentication that hold up in production.', icon: '🧩', from: '#10b981', to: '#14b8a6' },
  'Python & Flask':       { description: 'Clean Python back ends and data tools built on Flask.', icon: '🐍', from: '#f59e0b', to: '#ef4444' },
  'Generative AI':        { description: 'LLM-powered apps, chatbots and retrieval systems that answer from your data.', icon: '✨', from: '#a855f7', to: '#ec4899' },
  'AI Automation':        { description: 'Workflows and agents that remove repetitive work.', icon: '🤖', from: '#6366f1', to: '#8b5cf6' },
  'Tools & Design':       { description: 'The workflow around the code: version control, planning and design.', icon: '🛠️', from: '#f43f5e', to: '#f97316' },
};

const ACCENT_COLORS: [string, string][] = [
  ['#3b82f6', '#06b6d4'],
  ['#10b981', '#14b8a6'],
  ['#f59e0b', '#ef4444'],
  ['#a855f7', '#ec4899'],
  ['#6366f1', '#8b5cf6'],
  ['#f43f5e', '#f97316'],
];

const FALLBACK_CATEGORIES: SkillCategory[] = [
  {
    category: 'Frontend',
    description: CATEGORY_META.Frontend.description,
    icon: CATEGORY_META.Frontend.icon,
    from: CATEGORY_META.Frontend.from,
    to: CATEGORY_META.Frontend.to,
    skills: [
      { name: 'HTML5', level: 95, icon: '🌐' },
      { name: 'CSS3', level: 90, icon: '🎨' },
      { name: 'Tailwind', level: 88, icon: '💨' },
      { name: 'JavaScript', level: 87, icon: '⚡' },
      { name: 'TypeScript', level: 80, icon: '📘' },
      { name: 'React.js', level: 90, icon: '⚛️' },
      { name: 'Next.js', level: 85, icon: '🔺' },
      { name: 'Redux', level: 78, icon: '🔄' },
    ],
  },
  {
    category: 'Full Stack & Backend',
    description: CATEGORY_META['Full Stack & Backend'].description,
    icon: CATEGORY_META['Full Stack & Backend'].icon,
    from: CATEGORY_META['Full Stack & Backend'].from,
    to: CATEGORY_META['Full Stack & Backend'].to,
    skills: [
      { name: 'Node.js', level: 82, icon: '🟢' },
      { name: 'Express.js', level: 80, icon: '🚂' },
      { name: 'REST APIs', level: 85, icon: '🔗' },
      { name: 'MongoDB', level: 78, icon: '🍃' },
      { name: 'PostgreSQL', level: 72, icon: '🐘' },
      { name: 'JWT Auth', level: 78, icon: '🔐' },
    ],
  },
  {
    category: 'Python & Flask',
    description: CATEGORY_META['Python & Flask'].description,
    icon: CATEGORY_META['Python & Flask'].icon,
    from: CATEGORY_META['Python & Flask'].from,
    to: CATEGORY_META['Python & Flask'].to,
    skills: [
      { name: 'Python', level: 85, icon: '🐍' },
      { name: 'Flask', level: 82, icon: '🧪' },
      { name: 'Flask REST', level: 80, icon: '🔌' },
      { name: 'SQLAlchemy', level: 72, icon: '🗄️' },
      { name: 'Pandas', level: 70, icon: '🐼' },
      { name: 'Web Scraping', level: 75, icon: '🕷️' },
    ],
  },
  {
    category: 'Generative AI',
    description: CATEGORY_META['Generative AI'].description,
    icon: CATEGORY_META['Generative AI'].icon,
    from: CATEGORY_META['Generative AI'].from,
    to: CATEGORY_META['Generative AI'].to,
    skills: [
      { name: 'LLM APIs', level: 85, icon: '🧠' },
      { name: 'Prompt Eng.', level: 85, icon: '💬' },
      { name: 'RAG', level: 82, icon: '📚' },
      { name: 'LangChain', level: 78, icon: '⛓️' },
      { name: 'Vector DBs', level: 75, icon: '🧭' },
      { name: 'AI Chatbots', level: 85, icon: '🤖' },
    ],
  },
  {
    category: 'AI Automation',
    description: CATEGORY_META['AI Automation'].description,
    icon: CATEGORY_META['AI Automation'].icon,
    from: CATEGORY_META['AI Automation'].from,
    to: CATEGORY_META['AI Automation'].to,
    skills: [
      { name: 'AI Agents', level: 75, icon: '🕹️' },
      { name: 'Workflows', level: 80, icon: '🔁' },
      { name: 'n8n / Zapier', level: 75, icon: '⚙️' },
      { name: 'Webhooks', level: 82, icon: '🪝' },
      { name: 'Pipelines', level: 72, icon: '🚰' },
    ],
  },
  {
    category: 'Tools & Design',
    description: CATEGORY_META['Tools & Design'].description,
    icon: CATEGORY_META['Tools & Design'].icon,
    from: CATEGORY_META['Tools & Design'].from,
    to: CATEGORY_META['Tools & Design'].to,
    skills: [
      { name: 'Git', level: 85, icon: '🌿' },
      { name: 'GitHub', level: 88, icon: '🐙' },
      { name: 'Jira', level: 75, icon: '📋' },
      { name: 'API Integration', level: 82, icon: '🔗' },
      { name: 'UI Design', level: 85, icon: '🎯' },
      { name: 'UX Design', level: 80, icon: '👥' },
    ],
  },
];

const RADIUS = 28;
const CIRC = 2 * Math.PI * RADIUS;

/* ───────────── Group flat API skills into ordered categories ───────────── */
function groupSkills(raw: ApiSkill[]): SkillCategory[] {
  const buckets = new Map<string, Skill[]>();

  const sorted = [...raw].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  for (const s of sorted) {
    if (!s?.name || !s?.category) continue;
    const cat = s.category.trim();
    const lvl = Math.max(0, Math.min(100, Number(s.level) || 0));
    if (!buckets.has(cat)) buckets.set(cat, []);
    buckets.get(cat)!.push({ name: s.name, level: lvl, icon: s.icon || '⚡' });
  }

  const knownOrder = Object.keys(CATEGORY_META);
  const result: SkillCategory[] = [];

  for (const cat of knownOrder) {
    const items = buckets.get(cat);
    if (!items || items.length === 0) continue;
    const meta = CATEGORY_META[cat];
    result.push({
      category: cat,
      description: meta.description,
      icon: meta.icon,
      from: meta.from,
      to: meta.to,
      skills: items,
    });
    buckets.delete(cat);
  }

  let extraIdx = 0;
  for (const [cat, items] of buckets) {
    const [from, to] = ACCENT_COLORS[extraIdx % ACCENT_COLORS.length];
    result.push({
      category: cat,
      description: 'Additional skills and tools.',
      icon: '⭐',
      from,
      to,
      skills: items,
    });
    extraIdx++;
  }

  return result;
}

const SkillsShowcase = () => {
  const { darkMode } = useAppContext();
  const rootRef = useRef<HTMLElement>(null);
  const [categories, setCategories] = useState<SkillCategory[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── Fetch dynamic skills ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/public/skills`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ApiSkill[] = await res.json();
        if (cancelled) return;
        const grouped = groupSkills(data);
        if (grouped.length > 0) setCategories(grouped);
        setError(null);
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load skills');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const allSkillNames = useMemo(
    () => categories.flatMap((c) => c.skills.map((s) => s.name)),
    [categories]
  );
  const totalSkills = allSkillNames.length;

  /* ── GSAP animations (re-run when categories change) ── */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia(root);

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, reduce } = context.conditions as { isDesktop: boolean; reduce: boolean };
          if (reduce) return;

          const dist = isDesktop ? 200 : 60;

          gsap.timeline({
            scrollTrigger: { trigger: '.sk-head', start: 'top 92%', end: 'top 40%', scrub: true },
          })
            .from('.sk-iam', { x: -dist, opacity: 0, scale: 0.5, transformOrigin: '100% 50%', ease: 'power2.out' }, 0)
            .from('.sk-typed', { x: dist, opacity: 0, scale: 0.5, transformOrigin: '0% 50%', ease: 'power2.out' }, 0)
            .from('.sk-sub', { y: 30, opacity: 0, ease: 'power2.out' }, 0.4);

          const rows = gsap.utils.toArray<HTMLElement>('.sk-marquee-row', root);
          const marqueeTweens = rows.map((row, i) =>
            gsap.fromTo(
              row,
              { xPercent: i % 2 === 0 ? 0 : -50 },
              { xPercent: i % 2 === 0 ? -50 : 0, duration: 45, ease: 'none', repeat: -1 }
            )
          );
          ScrollTrigger.create({
            trigger: '.sk-marquee',
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => marqueeTweens.forEach((t) => (self.isActive ? t.play() : t.pause())),
          });

          gsap.utils.toArray<HTMLElement>('.sk-row', root).forEach((row, i) => {
            const titleOnLeft = i % 2 === 0;
            const side = titleOnLeft ? -1 : 1;
            const q = gsap.utils.selector(row);

            gsap.fromTo(
              q('.sk-info'),
              {
                x: side * dist,
                opacity: 0,
                scale: 0.6,
                transformOrigin: isDesktop ? (titleOnLeft ? '0% 50%' : '100% 50%') : '0% 50%',
              },
              {
                x: 0, opacity: 1, scale: 1, ease: 'power2.out',
                scrollTrigger: { trigger: row, start: 'top 92%', end: 'top 45%', scrub: true },
              }
            );

            gsap.fromTo(
              q('.sk-grid'),
              { x: -side * dist, opacity: 0 },
              {
                x: 0, opacity: 1, ease: 'power2.out',
                scrollTrigger: { trigger: row, start: 'top 90%', end: 'top 40%', scrub: true },
              }
            );

            const tl = gsap.timeline({
              scrollTrigger: { trigger: row, start: 'top 70%', once: true },
            });
            q('.sk-skill').forEach((el, s) => {
              const ring = el.querySelector<SVGCircleElement>('.sk-ring');
              const pct = el.querySelector<HTMLElement>('.sk-pct');
              if (!ring || !pct) return;
              const level = Number(pct.dataset.target);
              const final = CIRC * (1 - level / 100);
              const counter = { v: 0 };
              const at = s * 0.08;

              tl.from(el, { y: 30, opacity: 0, scale: 0.8, duration: 0.6, ease: 'back.out(1.6)', clearProps: 'all' }, at)
                .fromTo(ring, { strokeDashoffset: CIRC }, { strokeDashoffset: final, duration: 1.4, ease: 'power3.out' }, at)
                .to(counter, {
                  v: level, duration: 1.4, ease: 'power3.out',
                  onUpdate: () => { pct.textContent = `${Math.round(counter.v)}%`; },
                }, at);
            });
          });

          gsap.from('.sk-foot', {
            scale: 0.6, opacity: 0, ease: 'power2.out',
            scrollTrigger: { trigger: '.sk-foot', start: 'top 98%', end: 'top 75%', scrub: true },
          });
        }
      );
    }, root);

    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => {
      window.clearTimeout(id);
      ctx.revert();
    };
  }, [categories]);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  const text = darkMode ? 'text-white' : 'text-gray-900';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const track = darkMode ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.10)';
  const chip = darkMode
    ? 'border-white/10 bg-white/[0.05] text-gray-200'
    : 'border-purple-200 bg-white/70 text-gray-700';

  const marqueeA = useMemo(() => [...allSkillNames, ...allSkillNames], [allSkillNames]);
  const marqueeB = useMemo(
    () => [...allSkillNames].reverse().concat([...allSkillNames].reverse()),
    [allSkillNames]
  );

  const renderMarqueeRow = (items: string[], keyPrefix: string) => (
    <div className="sk-marquee-row flex w-max gap-3">
      {items.map((name, i) => (
        <span
          key={`${keyPrefix}-${name}-${i}`}
          className={`whitespace-nowrap rounded-full border px-5 py-2 text-sm font-semibold ${chip}`}
        >
          {name}
        </span>
      ))}
    </div>
  );

  return (
    <section ref={rootRef} id="skills" className="relative w-full overflow-x-clip py-16 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-48 top-40 h-[600px] w-[600px] rounded-full"
          style={{ background: `radial-gradient(circle, ${darkMode ? 'rgba(147,51,234,0.22)' : 'rgba(192,132,252,0.28)'} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -right-48 bottom-40 h-[560px] w-[560px] rounded-full"
          style={{ background: `radial-gradient(circle, ${darkMode ? 'rgba(14,165,233,0.18)' : 'rgba(125,211,252,0.35)'} 0%, transparent 70%)` }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="sk-head mb-12 text-center sm:mb-16">
          <h1 className={`flex flex-wrap items-baseline justify-center gap-x-3 text-3xl font-black md:text-5xl lg:text-6xl ${text}`}>
            <span className="sk-iam inline-block">I AM</span>
            <span
              className="sk-typed inline-block bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg,#a855f7,#ec4899)' }}
            >
              <TypingEffect texts={nameTexts} />
            </span>
          </h1>
          <p className={`sk-sub mx-auto mt-5 max-w-xl text-base ${muted}`}>
            From pixel-perfect interfaces to Python back ends and AI that does real work.
          </p>
        </div>
      </div>

      <div
        className="sk-marquee relative z-10 mb-20 space-y-3 overflow-hidden sm:mb-28"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
        aria-hidden="true"
      >
        {renderMarqueeRow(marqueeA, 'a')}
        {renderMarqueeRow(marqueeB, 'b')}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {loading && (
          <p className={`mb-8 text-center text-sm ${muted}`}>Loading skills…</p>
        )}
        {error && (
          <p className="mb-8 text-center text-sm text-red-500">
            Couldn’t load live skills ({error}). Showing the default set.
          </p>
        )}

        <div className="space-y-20 md:space-y-32">
          {categories.map((cat, ci) => {
            const titleOnLeft = ci % 2 === 0;
            const gradient = `linear-gradient(135deg, ${cat.from}, ${cat.to})`;

            return (
              <div key={cat.category} className="sk-row grid items-center gap-8 md:grid-cols-12 md:gap-10">
                <div
                  className={`sk-info md:col-span-4 ${
                    titleOnLeft ? 'md:col-start-1 md:text-left' : 'md:col-start-9 md:row-start-1 md:text-right'
                  }`}
                >
                  <span
                    className="block text-7xl font-black leading-none md:text-8xl"
                    style={{
                      backgroundImage: gradient,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                      opacity: 0.9,
                    }}
                  >
                    {String(ci + 1).padStart(2, '0')}
                  </span>
                  <h2 className={`mt-3 text-2xl font-extrabold leading-tight md:text-3xl ${text}`}>
                    {cat.category} <span aria-hidden="true">{cat.icon}</span>
                  </h2>
                  <p className={`mt-2 text-sm md:text-base ${muted}`}>{cat.description}</p>
                  <p
                    className="mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ color: cat.from, boxShadow: `inset 0 0 0 1px ${cat.from}66` }}
                  >
                    {cat.skills.length} technologies
                  </p>
                </div>

                <div
                  className={`sk-grid grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:col-span-8 ${
                    titleOnLeft ? 'md:col-start-5' : 'md:col-start-1 md:row-start-1'
                  }`}
                >
                  {cat.skills.map((skill, si) => {
                    const gid = `sk-grad-${ci}-${si}`;
                    const safeLevel = Math.max(0, Math.min(100, skill.level));
                    return (
                      <div key={`${cat.category}-${skill.name}`} className="sk-skill flex flex-col items-center text-center">
                        <div className="relative h-20 w-20 sm:h-24 sm:w-24">
                          <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90" aria-hidden="true">
                            <defs>
                              <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stopColor={cat.from} />
                                <stop offset="1" stopColor={cat.to} />
                              </linearGradient>
                            </defs>
                            <circle cx="32" cy="32" r={RADIUS} fill="none" stroke={track} strokeWidth="5" />
                            <circle
                              className="sk-ring"
                              cx="32" cy="32" r={RADIUS}
                              fill="none"
                              stroke={`url(#${gid})`}
                              strokeWidth="5"
                              strokeLinecap="round"
                              strokeDasharray={CIRC}
                              strokeDashoffset={CIRC * (1 - safeLevel / 100)}
                            />
                          </svg>
                          <span
                            className={`sk-pct absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums sm:text-base ${text}`}
                            data-target={safeLevel}
                          >
                            {safeLevel}%
                          </span>
                        </div>
                        <p className={`mt-2 text-xs font-semibold sm:text-sm ${text}`}>
                          <span aria-hidden="true" className="mr-1">{skill.icon}</span>
                          {skill.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center sm:mt-28">
          <div
            className={`sk-foot inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-2xl border px-8 py-4 ${
              darkMode ? 'border-white/20 bg-white/10' : 'border-gray-200 bg-white/80'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-70" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
              </span>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Available for Projects
              </span>
            </div>
            <span className={`hidden h-6 w-px sm:block ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
            <span className={`text-sm font-bold ${text}`}>{totalSkills} Technologies Mastered</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsShowcase;