'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppContext } from '@/Context/AppContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ---------------- Dummy data (replace with real reviews) ---------------- */
const testimonials = [
  {
    id: 0,
    name: 'Sarah Mitchell',
    role: 'Product Manager',
    company: 'Brightwave Labs',
    project: 'SaaS Dashboard',
    rating: 5,
    quote:
      'He turned a rough idea into a polished dashboard in half the time we expected. Every question got a clear answer, and the final product felt like it was built by an in-house team.',
    from: '#3b82f6',
    to: '#06b6d4',
  },
  {
    id: 1,
    name: 'Ahmed Raza',
    role: 'Founder',
    company: 'Karachi Cart',
    project: 'E-commerce Website',
    rating: 5,
    quote:
      'Our online store loads fast, looks great on every phone, and sales went up in the first month. Communication was honest and he delivered on the exact day he promised.',
    from: '#10b981',
    to: '#14b8a6',
  },
  {
    id: 2,
    name: 'Emily Carter',
    role: 'Marketing Director',
    company: 'Northfield Studio',
    project: 'Company Website',
    rating: 5,
    quote:
      'The animations are smooth without getting in the way, and our visitors keep mentioning how professional the new site feels. He understood our brand from the first call.',
    from: '#a855f7',
    to: '#ec4899',
  },
  {
    id: 3,
    name: 'Omar Farooq',
    role: 'CTO',
    company: 'Peshawar Tech Hub',
    project: 'Web Application',
    rating: 4,
    quote:
      'Clean code, sensible architecture, and helpful documentation. My team picked up the project without any hand-holding, and we have kept working together on new features since.',
    from: '#f59e0b',
    to: '#ef4444',
  },
  {
    id: 4,
    name: 'Lina Haddad',
    role: 'Operations Lead',
    company: 'Cedar Logistics',
    project: 'Internal Tool',
    rating: 5,
    quote:
      'The tool he built replaced three spreadsheets and saved our team hours every week. He listened carefully, suggested better ways to do things, and never missed a deadline.',
    from: '#6366f1',
    to: '#8b5cf6',
  },
];

const AUTOPLAY_SECONDS = 7;

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('');

const Stars = ({ rating, color }: { rating: number; color: string }) => (
  <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
    {[0, 1, 2, 3, 4].map((i) => (
      <svg
        key={i}
        className="tm-star h-5 w-5"
        viewBox="0 0 20 20"
        fill={i < rating ? color : 'none'}
        stroke={color}
        strokeWidth="1.5"
      >
        <path d="M10 1.8l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6L10 14.2 4.9 17l1.2-5.6L1.9 7.6l5.6-.6L10 1.8z" />
      </svg>
    ))}
  </div>
);

const TestimonialsSection = () => {
  const { darkMode } = useAppContext();
  const rootRef = useRef<HTMLElement>(null);

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const busy = useRef(false);
  const hovering = useRef(false);
  const reduceMotion = useRef(false);
  const progressTween = useRef<gsap.core.Tween | null>(null);
  const goToRef = useRef<(target: number, dir?: number) => void>(() => {});
  const dragStartX = useRef<number | null>(null);

  const total = testimonials.length;

  /* ---------- Autoplay progress bar (when it fills, go to next slide) ---------- */
  const restartProgress = () => {
    progressTween.current?.kill();
    const bar = rootRef.current?.querySelector('.tm-progress');
    if (!bar || reduceMotion.current) return;
    gsap.set(bar, { scaleX: 0 });
    progressTween.current = gsap.to(bar, {
      scaleX: 1,
      duration: AUTOPLAY_SECONDS,
      ease: 'none',
      onComplete: () => goToRef.current(activeRef.current + 1, 1),
    });
    if (hovering.current) progressTween.current.pause();
  };

  /* ---------- Slide change ---------- */
  const goTo = (target: number, dir?: number) => {
    const root = rootRef.current;
    if (!root || busy.current) return;

    const next = (target + total) % total;
    if (next === activeRef.current) return;

    const direction = dir ?? (target > activeRef.current ? 1 : -1);
    const slides = root.querySelectorAll<HTMLElement>('.tm-slide');
    const cur = slides[activeRef.current];
    const nxt = slides[next];

    activeRef.current = next;
    setActive(next);
    progressTween.current?.kill();

    if (reduceMotion.current) {
      gsap.set(cur, { autoAlpha: 0 });
      gsap.set(nxt, { autoAlpha: 1 });
      return;
    }

    busy.current = true;
    const dist = window.innerWidth >= 768 ? 180 : 60;

    const curQuote = cur.querySelector('.tm-quote');
    const curAuthor = cur.querySelector('.tm-author');
    const nxtQuote = nxt.querySelector('.tm-quote');
    const nxtAuthor = nxt.querySelector('.tm-author');
    const nxtWords = nxt.querySelectorAll('.tm-word');
    const nxtStars = nxt.querySelectorAll('.tm-star');
    const nxtAvatar = nxt.querySelector('.tm-avatar');
    const nxtMark = nxt.querySelector('.tm-mark');

    gsap
      .timeline({
        onComplete: () => {
          busy.current = false;
          restartProgress();
        },
      })
      // Old slide: quote leaves to one side, author to the other
      .to(curQuote, { x: -direction * dist, opacity: 0, scale: 0.85, duration: 0.45, ease: 'power2.in' }, 0)
      .to(curAuthor, { x: direction * dist, opacity: 0, duration: 0.45, ease: 'power2.in' }, 0)
      .set(cur, { autoAlpha: 0 })
      .set([curQuote, curAuthor], { clearProps: 'transform,opacity' })
      .set(nxt, { autoAlpha: 1 })
      // New slide: quote slides in, words zoom in one by one, author comes from the other side
      .fromTo(nxtQuote, { x: direction * dist, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
      .fromTo(
        nxtWords,
        { scale: 0.4, opacity: 0, y: 24 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.025, ease: 'back.out(1.6)' },
        '<0.1'
      )
      .fromTo(nxtMark, { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2)' }, '<')
      .fromTo(nxtAuthor, { x: -direction * dist, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '<')
      .fromTo(nxtAvatar, { scale: 0.4, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.6, ease: 'power2.out' }, '<')
      .fromTo(
        nxtStars,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, stagger: 0.08, ease: 'back.out(3)' },
        '<0.2'
      );
  };
  goToRef.current = goTo;

  /* ---------- Setup + scroll entrance ---------- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduce } = context.conditions as { isDesktop: boolean; reduce: boolean };
        reduceMotion.current = reduce;
        if (reduce) return;

        const dist = isDesktop ? 200 : 60;

        // Heading zooms in while scrolling
        gsap
          .timeline({
            scrollTrigger: { trigger: '.tm-head', start: 'top 90%', end: 'top 35%', scrub: 1 },
          })
          .from('.tm-title-left', { x: -dist * 1.5, opacity: 0, scale: 0.5, transformOrigin: '100% 50%', ease: 'power2.out' }, 0)
          .from('.tm-title-right', { x: dist * 1.5, opacity: 0, scale: 0.5, transformOrigin: '0% 50%', ease: 'power2.out' }, 0)
          .from('.tm-sub', { y: 30, opacity: 0, ease: 'power2.out' }, 0.4);

        // Slider stage zooms in while scrolling
        gsap.from('.tm-stage', {
          scale: 0.75,
          opacity: 0,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.tm-stage', start: 'top 95%', end: 'top 55%', scrub: 1 },
        });

        // First slide: words zoom in when the slider reaches the screen
        gsap.from('.tm-slide:first-child .tm-word', {
          scale: 0.4,
          opacity: 0,
          y: 24,
          duration: 0.6,
          stagger: 0.025,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: '.tm-stage', start: 'top 70%', once: true },
        });

        // Start autoplay only when the slider is on screen
        ScrollTrigger.create({
          trigger: '.tm-stage',
          start: 'top 80%',
          end: 'bottom 10%',
          onEnter: restartProgress,
          onEnterBack: restartProgress,
          onLeave: () => progressTween.current?.pause(),
          onLeaveBack: () => progressTween.current?.pause(),
        });
      }
    );

    return () => {
      progressTween.current?.kill();
      mm.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Swipe + keyboard ---------- */
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(dx) > 50) goTo(activeRef.current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goTo(activeRef.current + 1, 1);
    if (e.key === 'ArrowLeft') goTo(activeRef.current - 1, -1);
  };
  const onEnter = () => {
    hovering.current = true;
    progressTween.current?.pause();
  };
  const onLeave = () => {
    hovering.current = false;
    if (!busy.current) progressTween.current?.resume();
  };

  const muted = darkMode ? 'text-slate-400' : 'text-slate-500';
  const current = testimonials[active];
  const currentGradient = `linear-gradient(135deg, ${current.from}, ${current.to})`;

  const arrowBtn = `flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
    darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
  }`;

  return (
    <section ref={rootRef} className="relative w-full overflow-hidden py-20 md:py-32">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-40 top-1/4 h-96 w-96 rounded-full opacity-25 blur-3xl"
          style={{ background: `radial-gradient(circle, rgba(59,130,246,${darkMode ? 0.5 : 0.25}), transparent)` }}
        />
        <div
          className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full opacity-25 blur-3xl"
          style={{ background: `radial-gradient(circle, rgba(236,72,153,${darkMode ? 0.5 : 0.25}), transparent)` }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        {/* ---------- Header ---------- */}
        <div className="tm-head mb-14 text-center md:mb-20">
          <h2
            className={`flex flex-wrap items-baseline justify-center gap-x-4 text-5xl font-black tracking-tight md:text-7xl ${
              darkMode ? 'text-white' : 'text-slate-800'
            }`}
          >
            <span className="tm-title-left inline-block">What clients</span>
            <span
              className="tm-title-right inline-block bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg,#3b82f6,#a855f7,#ec4899)' }}
            >
              say
            </span>
          </h2>
          <p className={`tm-sub mx-auto mt-5 max-w-md text-base ${muted}`}>
            Honest feedback from people I have built products for
          </p>
        </div>

        {/* ---------- Slider ---------- */}
        <div className="tm-stage">
          <div
            className="overflow-hidden pt-14 outline-none"
            style={{ touchAction: 'pan-y' }}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Client testimonials"
            aria-live="polite"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerLeave={() => (dragStartX.current = null)}
            onKeyDown={onKeyDown}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            {/* All slides share one grid cell, so the height is the tallest slide */}
            <div className="grid">
              {testimonials.map((t, index) => {
                const gradient = `linear-gradient(135deg, ${t.from}, ${t.to})`;
                return (
                  <article
                    key={t.id}
                    className={`tm-slide col-start-1 row-start-1 grid items-center gap-8 md:grid-cols-12 md:gap-6 ${
                      index === 0 ? '' : 'invisible opacity-0'
                    }`}
                    aria-hidden={index !== active}
                  >
                    {/* Quote */}
                    <div className="relative md:col-span-8">
                      <span
                        className="tm-mark pointer-events-none absolute -top-12 -left-1 inline-block select-none font-serif text-8xl font-black leading-none md:-top-16 md:text-9xl"
                        style={{
                          backgroundImage: gradient,
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                        }}
                        aria-hidden="true"
                      >
                        “
                      </span>
                      <blockquote
                        className={`tm-quote relative pt-4 text-2xl font-semibold leading-snug md:text-4xl md:leading-snug ${
                          darkMode ? 'text-white' : 'text-slate-800'
                        }`}
                      >
                        {t.quote.split(' ').map((word, w) => (
                          <span key={w} className="tm-word inline-block">
                            {word}&nbsp;
                          </span>
                        ))}
                      </blockquote>
                    </div>

                    {/* Author */}
                    <div className="tm-author md:col-span-4 md:col-start-9">
                      <div className="border-t-2 pt-5" style={{ borderImage: `${gradient} 1` }}>
                        <div className="flex items-center gap-4">
                          <div
                            className="tm-avatar flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                            style={{ background: gradient }}
                            aria-hidden="true"
                          >
                            {getInitials(t.name)}
                          </div>
                          <div>
                            <p className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t.name}</p>
                            <p className={`text-sm ${muted}`}>
                              {t.role}, {t.company}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <Stars rating={t.rating} color={t.from} />
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
                            }`}
                            style={{ boxShadow: `inset 0 0 0 1px ${t.from}55` }}
                          >
                            {t.project}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* ---------- Controls ---------- */}
          <div className="mt-12 flex flex-col items-center gap-6 md:mt-16 md:flex-row md:justify-between">
            {/* Client avatars as navigation */}
            <div className="flex items-center gap-3" role="tablist" aria-label="Choose a testimonial">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Show review from ${t.name}`}
                  onClick={() => goTo(i)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    i === active ? 'scale-125 opacity-100' : 'scale-90 opacity-40 hover:opacity-80'
                  }`}
                  style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
                >
                  {getInitials(t.name)}
                </button>
              ))}
            </div>

            {/* Arrows + counter */}
            <div className="flex items-center gap-4">
              <button type="button" aria-label="Previous review" onClick={() => goTo(active - 1, -1)} className={arrowBtn}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className={`min-w-[4rem] text-center text-sm font-semibold tabular-nums ${muted}`}>
                {active + 1} / {total}
              </span>
              <button type="button" aria-label="Next review" onClick={() => goTo(active + 1, 1)} className={arrowBtn}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Autoplay progress */}
          <div className={`mt-8 h-[3px] w-full overflow-hidden rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div
              className="tm-progress h-full w-full origin-left rounded-full"
              style={{ background: currentGradient, transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;