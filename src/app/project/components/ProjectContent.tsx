'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ExternalLink,
  Github,
  Calendar,
  ArrowUpRight,
  Lock,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppContext } from '@/Context/AppContext';
import { stripHtml } from '@/lib/richText';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  date: string;
  technologies: string[];
  github: string;
  live: string;
  isConfidential: boolean;
  images: string[];
  from: string;
  to: string;
}

const API_URL = process.env.NEXT_PUBLIC_DEPLOYMENT_URL
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072';

// Brand accent pairs, assigned to projects in order
const ACCENTS: [string, string][] = [
  ['#a855f7', '#ec4899'],
  ['#8b5cf6', '#6366f1'],
  ['#d946ef', '#f43f5e'],
  ['#7c3aed', '#c026d3'],
];

const grad = (p: Pick<Project, 'from' | 'to'>) => `linear-gradient(135deg, ${p.from}, ${p.to})`;

const formatDate = (d: string) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
};

const ProjectShowcase = () => {
  const { darkMode } = useAppContext();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [filter, setFilter] = useState('All');

  const rootRef = useRef<HTMLElement>(null);
  const switching = useRef(false);
  const firstFilter = useRef(true);

  const prefersReduced = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Fetch projects ---------------- */
  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(false);

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/public/projects`, { signal: controller.signal });
        if (!res.ok) throw new Error('Request failed');
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Unexpected response');

        const mapped: Project[] = data.map((p: any, idx: number) => {
          const [from, to] = ACCENTS[idx % ACCENTS.length];
          return {
            id: p.id,
            title: p.title,
            description: p.description,
            longDescription: p.longDescription || p.description,
            category: p.category || 'Development',
            date: p.createdAt || new Date().toISOString(),
            technologies: Array.isArray(p.technologies) ? p.technologies : [],
            github: p.github || '#',
            live: p.link || '#',
            isConfidential: Boolean(p.isConfidential),
            images: Array.isArray(p.images) && p.images.length > 0
              ? p.images.map((img: string) => img.startsWith('http') || img.startsWith('/') ? img : `${API_URL}/uploads/${img}`)
              : p.image
              ? [p.image.startsWith('http') || p.image.startsWith('/') ? p.image : `${API_URL}/uploads/${p.image}`]
              : [FALLBACK_IMAGE],
            from,
            to,
          };
        });
        setProjects(mapped);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          console.error('Error fetching projects', e);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [reloadKey]);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);
  const filterKey = filtered.map((p) => p.id).join(',');
  const featuredFirst = filter === 'All' && filtered.length > 2;

  /* ---------------- Header + big sliding words ---------------- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);

    mm.add(
      { isDesktop: '(min-width: 768px)', reduce: '(prefers-reduced-motion: reduce)' },
      (ctx) => {
        const { isDesktop, reduce } = ctx.conditions as { isDesktop: boolean; reduce: boolean };
        if (reduce) return;
        const dist = isDesktop ? 220 : 60;

        // Giant words slide sideways in opposite directions as you scroll
        gsap.fromTo(
          '.pj-bigrow-a',
          { xPercent: 5 },
          { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.pj-big', start: 'top bottom', end: 'bottom top', scrub: true } }
        );
        gsap.fromTo(
          '.pj-bigrow-b',
          { xPercent: -30 },
          { xPercent: 5, ease: 'none', scrollTrigger: { trigger: '.pj-big', start: 'top bottom', end: 'bottom top', scrub: true } }
        );

        // Heading words fly in from both sides and zoom
        gsap
          .timeline({ scrollTrigger: { trigger: '.pj-head', start: 'top 92%', end: 'top 40%', scrub: true } })
          .from('.pj-title-a', { x: -dist * 1.4, opacity: 0, scale: 0.5, transformOrigin: '100% 50%', ease: 'power2.out' }, 0)
          .from('.pj-title-b', { x: dist * 1.4, opacity: 0, scale: 0.5, transformOrigin: '0% 50%', ease: 'power2.out' }, 0)
          .from('.pj-sub', { y: 30, opacity: 0, ease: 'power2.out' }, 0.4)
          .from('.pj-filters', { y: 20, opacity: 0, ease: 'power2.out' }, 0.5);
      }
    );

    return () => mm.revert();
  }, []);

  /* ---------------- Card scroll animation (re-runs when the list changes) ---------------- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || isLoading || filtered.length === 0) return;
    const mm = gsap.matchMedia(root);

    mm.add(
      {
        lg: '(min-width: 1024px)',
        md: '(min-width: 640px)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (ctx) => {
        const { lg, md, reduce } = ctx.conditions as { lg: boolean; md: boolean; reduce: boolean };
        if (reduce) return;

        const cols = lg ? 3 : md ? 2 : 1;
        const dist = lg ? 160 : md ? 100 : 50;
        let cursor = 0;

        gsap.utils.toArray<HTMLElement>('.pj-card', root).forEach((card, i) => {
          const span = lg && featuredFirst && i === 0 ? 2 : 1;
          const col = cursor % cols;
          cursor += span;

          // left column slides from the left, right column from the right, middle rises + zooms
          let side = 0;
          if (cols === 1) side = i % 2 === 0 ? -1 : 1;
          else if (col === 0) side = -1;
          else if (col === cols - 1) side = 1;

          gsap.fromTo(
            card,
            { x: side * dist, y: side === 0 ? 80 : 30, opacity: 0, scale: 0.8 },
            {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: card, start: 'top 96%', end: 'top 62%', scrub: true },
            }
          );

          // Image zooms out into place while scrolling
          const img = card.querySelector('.pj-img');
          if (img) {
            gsap.fromTo(
              img,
              { scale: 1.35 },
              { scale: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 40%', scrub: true } }
            );
          }

          // Title grows and slides in from the left
          const title = card.querySelector('.pj-ctitle');
          if (title) {
            gsap.fromTo(
              title,
              { x: -30, opacity: 0.15, scale: 0.8, transformOrigin: '0% 50%' },
              { x: 0, opacity: 1, scale: 1, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 50%', scrub: true } }
            );
          }
        });
      }
    );

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      window.clearTimeout(t);
      mm.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, isLoading, featuredFirst]);

  /* ---------------- Filter transition: cards leave to the sides, new ones fly in ---------------- */
  const changeFilter = (c: string) => {
    if (c === filter || switching.current) return;
    const cards = rootRef.current ? gsap.utils.toArray<HTMLElement>('.pj-inner', rootRef.current) : [];
    if (prefersReduced() || cards.length === 0) {
      setFilter(c);
      return;
    }
    switching.current = true;
    gsap.to(cards, {
      opacity: 0,
      scale: 0.8,
      y: 30,
      x: (i: number) => (i % 2 === 0 ? -60 : 60),
      stagger: 0.05,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => setFilter(c),
    });
  };

  useEffect(() => {
    if (firstFilter.current) {
      firstFilter.current = false;
      return;
    }
    switching.current = false;
    const root = rootRef.current;
    if (!root || prefersReduced()) return;
    const cards = gsap.utils.toArray<HTMLElement>('.pj-inner', root);
    gsap.fromTo(
      cards,
      { opacity: 0, scale: 0.85, y: 40, x: (i: number) => (i % 3 === 0 ? -80 : i % 3 === 2 ? 80 : 0) },
      { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.6, stagger: 0.07, ease: 'back.out(1.4)', clearProps: 'opacity,scale,x,y' }
    );
  }, [filter]);

  /* ---------------- Card hover tilt (mouse devices only) ---------------- */
  const canHover = () => window.matchMedia('(hover: hover)').matches && !prefersReduced();

  const onTiltMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!canHover()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 900, duration: 0.4, ease: 'power2.out' });
  };
  const onTiltLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (!canHover()) return;
    gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
  };

  /* ---------------- Open the dynamic project page ---------------- */
  const openProject = (p: Project) => router.push(`/project/${p.id}`);

  /* ---------------- Theme helpers ---------------- */
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const soft = darkMode ? 'text-gray-300' : 'text-gray-600';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardCls = darkMode
    ? 'bg-white/[0.06] border-white/10'
    : 'bg-white border-purple-100 shadow-lg shadow-purple-900/5';
  const chipCls = darkMode
    ? 'border-white/15 bg-white/[0.06] text-gray-200'
    : 'border-purple-200 bg-purple-50 text-gray-700';
  const strokeColor = darkMode ? 'rgba(192,132,252,0.45)' : 'rgba(124,58,237,0.35)';

  return (
    <section ref={rootRef} id="projects" className="relative w-full overflow-x-clip px-4 py-20 sm:px-6 md:py-28">
      {/* Cheap background glows (gradients, no blur filters) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-48 top-40 h-[600px] w-[600px] rounded-full"
          style={{ background: `radial-gradient(circle, ${darkMode ? 'rgba(147,51,234,0.22)' : 'rgba(192,132,252,0.28)'} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -right-48 bottom-40 h-[560px] w-[560px] rounded-full"
          style={{ background: `radial-gradient(circle, ${darkMode ? 'rgba(236,72,153,0.16)' : 'rgba(249,168,212,0.38)'} 0%, transparent 70%)` }}
        />
      </div>

      {/* ---------- Giant words that slide sideways while you scroll ---------- */}
      <div
        aria-hidden="true"
        className="pj-big pointer-events-none relative z-0 -mx-4 mb-10 select-none overflow-hidden sm:-mx-6 md:mb-14"
      >
        <div
          className="pj-bigrow-a flex w-max whitespace-nowrap text-[16vw] font-black uppercase leading-[0.95] md:text-[10vw]"
          style={{ WebkitTextStroke: `1.5px ${strokeColor}`, color: 'transparent' }}
        >
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="pr-[0.5em]">
              Projects • Work •
            </span>
          ))}
        </div>
        <div
          className="pj-bigrow-b flex w-max whitespace-nowrap text-[16vw] font-black uppercase leading-[0.95] md:text-[10vw]"
          style={{
            backgroundImage: 'linear-gradient(90deg,#a855f7,#ec4899)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            opacity: 0.9,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="pr-[0.5em]">
              Case Studies • Ideas •
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ---------- Header ---------- */}
        <div className="pj-head mb-12 text-center md:mb-16">
          <h1 className={`flex flex-wrap items-baseline justify-center gap-x-4 text-5xl font-black tracking-tight md:text-7xl ${text}`}>
            <span className="pj-title-a inline-block">My</span>
            <span
              className="pj-title-b inline-block bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg,#a855f7,#ec4899)' }}
            >
              Projects
            </span>
          </h1>
          <p className={`pj-sub mx-auto mt-5 max-w-xl text-base md:text-lg ${soft}`}>
            Discover my latest work and the technologies that bring it to life
          </p>

          {/* Filters */}
          {categories.length > 2 && (
            <div className="pj-filters mt-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter projects">
              {categories.map((c) => {
                const on = c === filter;
                return (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => changeFilter(c)}
                    className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
                      on ? 'border-transparent text-white shadow-lg shadow-purple-500/25' : chipCls
                    }`}
                    style={on ? { background: 'linear-gradient(135deg,#a855f7,#ec4899)' } : undefined}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ---------- States ---------- */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`animate-pulse overflow-hidden rounded-3xl border ${cardCls}`}>
                <div className={`aspect-[16/10] ${darkMode ? 'bg-white/10' : 'bg-purple-100'}`} />
                <div className="space-y-3 p-6">
                  <div className={`h-5 w-2/3 rounded ${darkMode ? 'bg-white/10' : 'bg-purple-100'}`} />
                  <div className={`h-4 w-full rounded ${darkMode ? 'bg-white/10' : 'bg-purple-100'}`} />
                  <div className={`h-4 w-4/5 rounded ${darkMode ? 'bg-white/10' : 'bg-purple-100'}`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="py-20 text-center">
            <p className={`mb-5 text-lg ${soft}`}>Could not load the projects right now.</p>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && projects.length === 0 && (
          <p className={`py-20 text-center text-lg ${soft}`}>No projects found yet. Check back soon.</p>
        )}

        {/* ---------- Project grid ---------- */}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="pj-grid grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {filtered.map((p, index) => {
              const featured = featuredFirst && index === 0;
              return (
                <article key={p.id} className={`pj-card ${featured ? 'lg:col-span-2' : ''}`}>
                  <div
                    role="link"
                    tabIndex={0}
                    aria-label={`Open details for ${p.title}`}
                    onClick={() => openProject(p)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openProject(p);
                      }
                    }}
                    onMouseMove={onTiltMove}
                    onMouseLeave={onTiltLeave}
                    className={`pj-inner group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border outline-none transition-shadow duration-300 hover:shadow-2xl hover:shadow-purple-500/20 focus-visible:ring-2 focus-visible:ring-purple-500 ${cardCls}`}
                  >
                    {/* accent line */}
                    <div className="absolute inset-x-0 top-0 z-10 h-[3px]" style={{ background: grad(p) }} />

                    {/* image */}
                    <div className={`pj-imgbox relative overflow-hidden ${featured ? 'aspect-[16/10] lg:aspect-[16/8]' : 'aspect-[16/10]'}`}>
                      <Image
                        unoptimized
                        src={p.images[0]}
                        alt={p.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        // hover zoom uses the CSS `scale` property, so it never clashes with GSAP's transform
                        className="pj-img object-cover transition-[scale] duration-700 ease-out [scale:1] group-hover:[scale:1.1]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                      <span
                        className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg"
                        style={{ background: grad(p) }}
                      >
                        {p.category}
                      </span>
                      <span className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-white text-gray-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                      {p.isConfidential && (
                        <span className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                          <Lock className="h-3 w-3" /> Confidential
                        </span>
                      )}
                    </div>

                    {/* body */}
                    <div className="flex flex-1 flex-col p-6">
                      <div className={`mb-2 flex items-center text-xs ${muted}`}>
                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                        {formatDate(p.date)}
                      </div>
                      <h3 className={`pj-ctitle font-extrabold leading-tight ${featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'} ${text}`}>
                        {p.title}
                      </h3>
                      <p
                        className={`mt-3 text-sm leading-relaxed ${soft}`}
                        style={{ display: '-webkit-box', WebkitLineClamp: featured ? 3 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      >
                        {stripHtml(p.description)}
                      </p>

                      {p.technologies.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {p.technologies.slice(0, 3).map((t) => (
                            <span key={t} className={`rounded-full border px-3 py-1 text-xs font-medium ${chipCls}`}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-6">
                        <span
                          className="bg-clip-text text-sm font-bold text-transparent"
                          style={{ backgroundImage: grad(p) }}
                        >
                          View details →
                        </span>
                        {!p.isConfidential && (
                          <div className="flex gap-2">
                            {p.live !== '#' && (
                              <a
                                href={p.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Live demo of ${p.title}`}
                                onClick={(e) => e.stopPropagation()}
                                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-transform hover:scale-110 ${chipCls}`}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                            {p.github !== '#' && (
                              <a
                                href={p.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Source code of ${p.title}`}
                                onClick={(e) => e.stopPropagation()}
                                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-transform hover:scale-110 ${chipCls}`}
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectShowcase;