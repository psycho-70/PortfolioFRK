'use client';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Calendar,
  Tag,
  X,
  ArrowUpRight,
  Lock,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppContext } from '@/Context/AppContext';
import { API_BASE_URL as API_URL } from '@/lib/api';

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

// Layout effect in the browser (no flash), plain effect on the server
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// A temporary copy of the card image that flies between the card and the modal
const makeGhost = (src: string, r: DOMRect) => {
  const g = document.createElement('div');
  Object.assign(g.style, {
    position: 'fixed',
    left: `${r.left}px`,
    top: `${r.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    backgroundImage: `url("${src}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '16px',
    zIndex: '60',
    pointerEvents: 'none',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0,0,0,0.45)',
  } as Partial<CSSStyleDeclaration>);
  document.body.appendChild(g);
  return g;
};

const ProjectShowcase = () => {
  const { darkMode } = useAppContext();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState<Project | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  const rootRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const switching = useRef(false);
  const firstFilter = useRef(true);
  const originRef = useRef<DOMRect | null>(null);

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

  /* ---------------- Detail modal ---------------- */
  const openProject = (p: Project, card?: HTMLElement | null) => {
    // Remember where the card image is, so the modal image can fly out of it
    const box = card?.querySelector('.pj-imgbox');
    originRef.current = box ? box.getBoundingClientRect() : null;
    setImgIdx(0);
    setActive(p);
  };

  // Open: the card image flies into the modal, the rest fades / slides in
  useIsoLayoutEffect(() => {
    if (!active) return;
    const overlay = modalRef.current;
    if (!overlay) return;

    document.body.style.overflow = 'hidden';
    overlay.querySelector<HTMLElement>('.pm-close')?.focus();

    const main = overlay.querySelector<HTMLElement>('.pm-main');
    let ghost: HTMLDivElement | null = null;

    const ctx = gsap.context(() => {
      if (prefersReduced()) return;

      const tl = gsap.timeline();
      tl.from(overlay, { opacity: 0, duration: 0.3 }, 0)
        .from('.pm-panel', { opacity: 0, duration: 0.35 }, 0.05)
        .from('.pm-info', { x: 90, opacity: 0, duration: 0.65, ease: 'power3.out' }, 0.3)
        .from('.pm-badge', { x: 40, opacity: 0, scale: 0.8, duration: 0.45, ease: 'back.out(1.6)' }, 0.4)
        .from('.pm-heading', { y: 40, opacity: 0, scale: 0.85, transformOrigin: '0% 50%', duration: 0.6, ease: 'power3.out' }, 0.45)
        .from('.pm-thumb', { y: 20, opacity: 0, scale: 0.8, stagger: 0.06, duration: 0.4, ease: 'back.out(1.6)', clearProps: 'all' }, 0.7)
        .from('.pm-chip', { y: 14, opacity: 0, scale: 0.8, stagger: 0.05, duration: 0.4, ease: 'back.out(1.6)', clearProps: 'all' }, 0.7)
        .from('.pm-actions', { y: 20, opacity: 0, duration: 0.4, ease: 'power3.out' }, 0.85);

      const origin = originRef.current;
      if (origin && main) {
        const target = main.getBoundingClientRect();
        gsap.set(main, { opacity: 0 });
        ghost = makeGhost(active.images[0], origin);
        tl.to(
          ghost,
          {
            left: target.left,
            top: target.top,
            width: target.width,
            height: target.height,
            duration: 0.75,
            ease: 'power3.inOut',
            onComplete: () => {
              ghost?.remove();
              ghost = null;
              gsap.set(main, { opacity: 1 });
            },
          },
          0.05
        );
      } else if (main) {
        tl.from(main, { scale: 0.9, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.2);
      }
    }, overlay);

    return () => {
      ctx.revert();
      ghost?.remove();
      document.body.style.overflow = '';
    };
  }, [active]);

  // Close: the image flies back into its card
  const closeModal = useCallback(() => {
    const overlay = modalRef.current;
    if (!overlay || closing.current) return;
    if (prefersReduced() || !active) {
      setActive(null);
      return;
    }

    closing.current = true;
    const main = overlay.querySelector<HTMLElement>('.pm-main');
    const origin = originRef.current;
    let ghost: HTMLDivElement | null = null;

    const tl = gsap.timeline({
      onComplete: () => {
        ghost?.remove();
        closing.current = false;
        setActive(null);
      },
    });

    if (origin && main) {
      ghost = makeGhost(active.images[imgIdx] ?? active.images[0], main.getBoundingClientRect());
      gsap.set(main, { opacity: 0 });
      tl.to(
        ghost,
        { left: origin.left, top: origin.top, width: origin.width, height: origin.height, duration: 0.6, ease: 'power3.inOut' },
        0
      );
      tl.to(overlay.querySelector('.pm-panel'), { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)
        .to(overlay, { opacity: 0, duration: 0.4 }, 0.2);
    } else {
      tl.to(overlay.querySelector('.pm-panel'), { scale: 0.9, y: 30, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)
        .to(overlay, { opacity: 0, duration: 0.3 }, 0.05);
    }
  }, [active, imgIdx]);

  const changeImage = useCallback(
    (next: number, dir: number) => {
      if (!active) return;
      const total = active.images.length;
      setImgIdx(((next % total) + total) % total);
      if (!prefersReduced()) {
        gsap.fromTo('.pm-main', { opacity: 0, x: dir * 50, scale: 0.97 }, { opacity: 1, x: 0, scale: 1, duration: 0.45, ease: 'power3.out' });
      }
    },
    [active]
  );

  // Keyboard: Esc closes, arrows change image
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') changeImage(imgIdx + 1, 1);
      if (e.key === 'ArrowLeft') changeImage(imgIdx - 1, -1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, imgIdx, closeModal, changeImage]);

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
  const panelBg = darkMode ? 'bg-[#120d28] border-white/15' : 'bg-white border-gray-200';
  const tile = darkMode ? 'bg-white/[0.06] border-white/10' : 'bg-gray-50 border-gray-200';
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
                    role="button"
                    tabIndex={0}
                    aria-label={`Open details for ${p.title}`}
                    onClick={(e) => openProject(p, e.currentTarget)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openProject(p, e.currentTarget);
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
                        {p.description}
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

      {/* ---------- Detail modal ---------- */}
      {active && (
        <div
          ref={modalRef}
          // data-lenis-prevent lets the modal scroll natively while smooth scroll is active
          data-lenis-prevent
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div
            className={`pm-panel relative max-h-[92vh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-3xl border ${panelBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className={`pm-close absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-red-500 hover:text-white ${
                darkMode ? 'bg-black/50 text-white' : 'bg-white/90 text-gray-800 shadow'
              }`}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
              {/* Media */}
              <div className="pm-media p-4 md:p-6">
                <div className="pm-main relative aspect-video overflow-hidden rounded-2xl">
                  <Image
                    src={active.images[imgIdx]}
                    alt={`${active.title} - image ${imgIdx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover"
                    priority
                  />
                  {active.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous image"
                        onClick={() => changeImage(imgIdx - 1, -1)}
                        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-transform hover:scale-110"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next image"
                        onClick={() => changeImage(imgIdx + 1, 1)}
                        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-transform hover:scale-110"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>

                {active.images.length > 1 && (
                  <div className="mt-3 grid grid-cols-4 gap-3">
                    {active.images.map((img, i) => (
                      <button
                        key={img + i}
                        type="button"
                        aria-label={`Show image ${i + 1}`}
                        onClick={() => changeImage(i, i > imgIdx ? 1 : -1)}
                        className={`pm-thumb relative aspect-video overflow-hidden rounded-lg transition-all duration-300 ${
                          i === imgIdx
                            ? 'scale-105 ring-2 ring-purple-500 ring-offset-2 ' + (darkMode ? 'ring-offset-[#120d28]' : 'ring-offset-white')
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image
                        unoptimized src={img} alt="" fill sizes="150px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="pm-info flex flex-col p-6 pt-2 md:p-8 lg:pt-8">
                <div className="mb-4 flex flex-wrap items-center gap-3 pr-10">
                  <span className="pm-badge rounded-full px-4 py-1 text-sm font-semibold text-white" style={{ background: grad(active) }}>
                    {active.category}
                  </span>
                  <span className={`flex items-center text-sm ${muted}`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDate(active.date)}
                  </span>
                </div>

                <h2 className={`pm-heading text-3xl font-black leading-tight md:text-4xl ${text}`}>{active.title}</h2>
                <p className={`mt-4 text-base leading-relaxed md:text-lg ${soft}`}>{active.longDescription}</p>

                {active.technologies.length > 0 && (
                  <div className="mt-6">
                    <h3 className={`mb-3 flex items-center text-sm font-semibold uppercase tracking-widest ${muted}`}>
                      <Tag className="mr-2 h-4 w-4" /> Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {active.technologies.map((t) => (
                        <span key={t} className={`pm-chip rounded-full border px-3 py-1 text-sm font-medium ${chipCls}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pm-actions mt-auto flex flex-wrap gap-3 pt-8">
                  {active.isConfidential ? (
                    <div className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-sm ${tile} ${soft}`}>
                      <Lock className="h-5 w-5 shrink-0 text-purple-500" />
                      This is a confidential project, so the demo and code are private. Contact me to learn more.
                    </div>
                  ) : (
                    <>
                      <a
                        href={active.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center rounded-full px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105"
                        style={{ background: grad(active) }}
                      >
                        <ExternalLink className="mr-2 h-5 w-5" /> Live Demo
                      </a>
                      <a
                        href={active.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center rounded-full border px-6 py-3 font-semibold transition-transform hover:scale-105 ${tile} ${text}`}
                      >
                        <Github className="mr-2 h-5 w-5" /> View Code
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectShowcase;