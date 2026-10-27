'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppContext } from '@/Context/AppContext';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  title: string;
  icon: string;
  category: string;
  description: string;
  features: string[];
  projects: number;
  rating: number;
  deliveryTime: string;
  from: string;
  to: string;
}

/* ───────────── Edit your content here ───────────── */
const services: Service[] = [
  {
    title: 'UI/UX Design',
    icon: '🎨',
    category: 'Design',
    description:
      'Creating intuitive and visually stunning user interfaces that provide exceptional user experiences. From wireframes to final designs, I craft digital experiences that captivate and engage.',
    features: [
      'User Research & Analysis',
      'Wireframing & Prototyping',
      'Visual Design Systems',
      'Responsive Design',
      'Usability Testing',
      'Brand Integration',
    ],
    projects: 45,
    rating: 4.9,
    deliveryTime: '5-7 days',
    from: '#ec4899',
    to: '#f43f5e',
  },
  {
    title: 'Frontend Development',
    icon: '💻',
    category: 'Development',
    description:
      'Building responsive, interactive, and high-performance web applications using modern technologies. I turn designs into pixel-perfect, functional interfaces.',
    features: [
      'React & Next.js Development',
      'Responsive Web Design',
      'JavaScript & TypeScript',
      'State Management',
      'API Integration',
      'Performance Optimization',
    ],
    projects: 62,
    rating: 4.8,
    deliveryTime: '7-10 days',
    from: '#3b82f6',
    to: '#06b6d4',
  },
  {
    title: 'Backend Development',
    icon: '⚙️',
    category: 'Development',
    description:
      'Developing robust server-side applications, APIs, and database systems with Node.js and Python Flask, built with security, scalability, and performance in mind.',
    features: [
      'RESTful API Development',
      'Node.js & Flask Back Ends',
      'Authentication & Security',
      'Cloud Integration',
      'Performance Optimization',
      'Microservices Architecture',
    ],
    projects: 38,
    rating: 4.9,
    deliveryTime: '10-14 days',
    from: '#10b981',
    to: '#14b8a6',
  },
  {
    title: 'Generative AI & Chatbots',
    icon: '✨',
    category: 'AI',
    description:
      'Adding real intelligence to your product: LLM-powered chatbots, RAG systems that answer from your own documents, and smart features that make apps feel effortless.',
    features: [
      'RAG Chatbots on Your Data',
      'LLM API Integration',
      'Prompt Engineering',
      'Vector Database Setup',
      'AI Feature Prototyping',
      'Evaluation & Tuning',
    ],
    projects: 18,
    rating: 4.9,
    deliveryTime: '10-14 days',
    from: '#a855f7',
    to: '#ec4899',
  },
  {
    title: 'AI Automation',
    icon: '🤖',
    category: 'AI',
    description:
      'Removing repetitive work with automated workflows and AI agents that connect your tools, process data, and run in the background so your team can focus on what matters.',
    features: [
      'Workflow Automation',
      'AI Agents & Assistants',
      'Webhook & API Pipelines',
      'Document Processing',
      'Email & CRM Automation',
      'Monitoring & Alerts',
    ],
    projects: 15,
    rating: 4.8,
    deliveryTime: '7-12 days',
    from: '#6366f1',
    to: '#8b5cf6',
  },
  {
    title: 'SEO Optimization',
    icon: '🚀',
    category: 'Marketing',
    description:
      'Boosting your online visibility and search rankings through comprehensive SEO strategies, technical optimizations, and content enhancement.',
    features: [
      'Technical SEO Audit',
      'Keyword Research & Strategy',
      'On-page Optimization',
      'Content Strategy',
      'Link Building',
      'Performance Tracking',
    ],
    projects: 29,
    rating: 4.7,
    deliveryTime: '14-21 days',
    from: '#f59e0b',
    to: '#f97316',
  },
  {
    title: 'Database Solutions',
    icon: '🗄️',
    category: 'Infrastructure',
    description:
      'Designing and implementing efficient database systems that ensure data integrity, security, and optimal performance for your applications.',
    features: [
      'Database Architecture',
      'Data Modeling',
      'Query Optimization',
      'Security Implementation',
      'Backup & Recovery',
      'Migration Services',
    ],
    projects: 31,
    rating: 4.8,
    deliveryTime: '7-12 days',
    from: '#0ea5e9',
    to: '#6366f1',
  },
  {
    title: 'DevOps & Cloud',
    icon: '☁️',
    category: 'Infrastructure',
    description:
      'Streamlining development workflows and deploying scalable applications with modern DevOps practices and cloud infrastructure.',
    features: [
      'CI/CD Pipeline Setup',
      'Cloud Platform Integration',
      'Container Orchestration',
      'Monitoring & Logging',
      'Security & Compliance',
      'Infrastructure as Code',
    ],
    projects: 22,
    rating: 4.9,
    deliveryTime: '10-15 days',
    from: '#64748b',
    to: '#38bdf8',
  },
];
/* ─────────────────────────────────────────────────── */

const totalProjects = services.reduce((acc, s) => acc + s.projects, 0);
const categoryCount = Array.from(new Set(services.map((s) => s.category))).length;
const avgRating = services.reduce((acc, s) => acc + s.rating, 0) / services.length;

const stats = [
  { value: totalProjects, suffix: '+', decimals: 0, label: 'Projects' },
  { value: categoryCount, suffix: '', decimals: 0, label: 'Categories' },
  { value: avgRating, suffix: '', decimals: 1, label: 'Avg Rating' },
  { value: null, suffix: '24/7', decimals: 0, label: 'Support' },
];

const grad = (s: Service) => `linear-gradient(135deg, ${s.from}, ${s.to})`;

const Services = () => {
  const { darkMode } = useAppContext();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const rootRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  const prefersReduced = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Scroll animations ---------------- */
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
        if (reduce) return;

        const dist = isDesktop ? 220 : 60;

        // Header: words fly in from both sides and zoom
        gsap
          .timeline({
            scrollTrigger: { trigger: '.sv-head', start: 'top 92%', end: 'top 40%', scrub: true },
          })
          .from('.sv-title-a', { x: -dist * 1.4, opacity: 0, scale: 0.5, transformOrigin: '100% 50%', ease: 'power2.out' }, 0)
          .from('.sv-title-b', { x: dist * 1.4, opacity: 0, scale: 0.5, transformOrigin: '0% 50%', ease: 'power2.out' }, 0)
          .from('.sv-sub', { y: 30, opacity: 0, ease: 'power2.out' }, 0.4);

        // Stats: slide from alternating sides, count up once
        gsap.utils.toArray<HTMLElement>('.sv-stat', root).forEach((el, i) => {
          gsap.from(el, {
            x: i % 2 === 0 ? -dist / 2 : dist / 2,
            opacity: 0,
            scale: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.sv-stats', start: 'top 94%', end: 'top 62%', scrub: true },
          });

          const num = el.querySelector<HTMLElement>('.sv-num');
          if (!num || num.dataset.target === undefined) return;
          const target = Number(num.dataset.target);
          const decimals = Number(num.dataset.decimals);
          const counter = { v: 0 };
          gsap.to(counter, {
            v: target,
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.sv-stats', start: 'top 85%', once: true },
            onUpdate: () => {
              num.textContent = counter.v.toFixed(decimals);
            },
          });
        });

        // Service rows
        gsap.utils.toArray<HTMLElement>('.sv-row', root).forEach((row, i) => {
          const side = i % 2 === 0 ? -1 : 1;
          const q = gsap.utils.selector(row);

          // Top line draws across
          gsap.fromTo(
            q('.sv-line'),
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: { trigger: row, start: 'top 95%', end: 'top 70%', scrub: true },
            }
          );

          // Main text comes from one side and grows
          gsap.fromTo(
            q('.sv-inner'),
            { x: side * dist, opacity: 0, scale: 0.8, transformOrigin: side < 0 ? '0% 50%' : '100% 50%' },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: row, start: 'top 92%', end: 'top 55%', scrub: true },
            }
          );

          // Metrics come from the opposite side
          gsap.fromTo(
            q('.sv-meta'),
            { x: -side * dist * 0.6, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: row, start: 'top 90%', end: 'top 50%', scrub: true },
            }
          );

          // Icon spins in, chips pop
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: 'top 80%', once: true } })
            .from(q('.sv-icon'), { rotate: -180, scale: 0, duration: 0.7, ease: 'back.out(1.8)' }, 0)
            .from(q('.sv-chip'), { y: 14, opacity: 0, scale: 0.8, stagger: 0.08, duration: 0.45, ease: 'back.out(1.8)' }, 0.2);
        });

        // Bottom call-to-action zooms in
        gsap.from('.sv-cta', {
          scale: 0.6,
          opacity: 0,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.sv-cta', start: 'top 98%', end: 'top 70%', scrub: true },
        });
      }
    );

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      mm.revert();
    };
  }, []);

  /* ---------------- Hover effects (mouse devices only) ---------------- */
  const canHover = () => window.matchMedia('(hover: hover)').matches && !prefersReduced();

  const onRowEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!canHover()) return;
    const q = gsap.utils.selector(e.currentTarget);
    gsap.set(q('.sv-fill'), { transformOrigin: '0% 50%' });
    gsap.to(q('.sv-fill'), { scaleX: 1, duration: 0.55, ease: 'power3.out', overwrite: true });
    gsap.to(q('.sv-title'), { x: 18, duration: 0.45, ease: 'power3.out' });
    gsap.to(q('.sv-arrow'), { rotate: -45, x: 6, duration: 0.45, ease: 'power3.out' });
    gsap.to(q('.sv-icon'), { scale: 1.15, rotate: 8, duration: 0.45, ease: 'back.out(2)' });
  };

  const onRowLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (!canHover()) return;
    const q = gsap.utils.selector(e.currentTarget);
    gsap.set(q('.sv-fill'), { transformOrigin: '100% 50%' });
    gsap.to(q('.sv-fill'), { scaleX: 0, duration: 0.45, ease: 'power3.inOut', overwrite: true });
    gsap.to(q('.sv-title'), { x: 0, duration: 0.4, ease: 'power3.out' });
    gsap.to(q('.sv-arrow'), { rotate: 0, x: 0, duration: 0.4, ease: 'power3.out' });
    gsap.to(q('.sv-icon'), { scale: 1, rotate: 0, duration: 0.4, ease: 'power3.out' });
  };

  /* ---------------- Modal open animation ---------------- */
  useEffect(() => {
    if (!selectedService) return;
    const overlay = modalRef.current;
    if (!overlay) return;

    document.body.style.overflow = 'hidden';
    overlay.querySelector<HTMLElement>('.md-close')?.focus();

    const ctx = gsap.context(() => {
      if (prefersReduced()) return;
      gsap
        .timeline()
        .from(overlay, { opacity: 0, duration: 0.3 }, 0)
        .from('.md-panel', { scale: 0.85, y: 50, opacity: 0, duration: 0.55, ease: 'power3.out' }, 0.05)
        .from('.md-icon', { rotate: -180, scale: 0, duration: 0.7, ease: 'back.out(1.8)' }, 0.2)
        .from('.md-title', { x: -70, opacity: 0, duration: 0.55, ease: 'power3.out' }, 0.25)
        .from('.md-badge', { x: 70, opacity: 0, duration: 0.55, ease: 'power3.out' }, 0.25)
        .from(
          '.md-stat',
          { y: 40, scale: 0.7, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'back.out(1.6)', clearProps: 'all' },
          0.35
        )
        .from('.md-about', { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' }, 0.5)
        .from(
          '.md-feature',
          {
            x: (i: number) => (i % 2 === 0 ? -60 : 60),
            opacity: 0,
            stagger: 0.07,
            duration: 0.5,
            ease: 'power3.out',
            clearProps: 'all',
          },
          0.55
        )
        .from('.md-actions', { y: 24, opacity: 0, duration: 0.45, ease: 'power3.out' }, 0.8);
    }, overlay);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [selectedService]);

  const closeModal = () => {
    const overlay = modalRef.current;
    if (!overlay || closing.current) return;
    if (prefersReduced()) {
      setSelectedService(null);
      return;
    }
    closing.current = true;
    gsap
      .timeline({
        onComplete: () => {
          closing.current = false;
          setSelectedService(null);
        },
      })
      .to(overlay.querySelector('.md-panel'), { scale: 0.9, y: 30, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)
      .to(overlay, { opacity: 0, duration: 0.3 }, 0.05);
  };

  // Close with the Escape key
  useEffect(() => {
    if (!selectedService) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedService]);

  const text = darkMode ? 'text-white' : 'text-gray-900';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const soft = darkMode ? 'text-gray-300' : 'text-gray-600';
  const line = darkMode ? 'bg-white/10' : 'bg-purple-900/10';
  const chip = darkMode
    ? 'border-white/15 bg-white/[0.05] text-gray-200'
    : 'border-purple-200 bg-white/70 text-gray-700';
  const panelBg = darkMode ? 'bg-[#120d28] border-white/15' : 'bg-white border-gray-200';
  const tile = darkMode ? 'bg-white/[0.06] border-white/10' : 'bg-gray-50 border-gray-200';

  return (
    <section ref={rootRef} id="services" className="relative w-full overflow-x-clip px-4 py-20 sm:px-6 md:py-28">
      {/* Cheap background glows (gradients, no blur filters) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-48 top-32 h-[600px] w-[600px] rounded-full"
          style={{ background: `radial-gradient(circle, ${darkMode ? 'rgba(147,51,234,0.22)' : 'rgba(192,132,252,0.28)'} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -right-48 bottom-32 h-[560px] w-[560px] rounded-full"
          style={{ background: `radial-gradient(circle, ${darkMode ? 'rgba(236,72,153,0.16)' : 'rgba(249,168,212,0.38)'} 0%, transparent 70%)` }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* ---------- Header ---------- */}
        <div className="sv-head mb-14 text-center md:mb-20">
          <h1 className={`flex flex-wrap items-baseline justify-center gap-x-4 text-5xl font-black tracking-tight md:text-7xl ${text}`}>
            <span className="sv-title-a inline-block">What I</span>
            <span
              className="sv-title-b inline-block bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg,#a855f7,#ec4899)' }}
            >
              Offer
            </span>
          </h1>
          <p className={`sv-sub mx-auto mt-5 max-w-xl text-base md:text-lg ${soft}`}>
            Transforming ideas into digital excellence through design, code and AI
          </p>
        </div>

        {/* ---------- Stats ---------- */}
        <div className="sv-stats mx-auto mb-20 grid max-w-4xl grid-cols-2 gap-6 md:mb-28 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="sv-stat text-center">
              <div
                className="bg-clip-text text-4xl font-black text-transparent md:text-5xl"
                style={{ backgroundImage: 'linear-gradient(135deg,#a855f7,#ec4899)' }}
              >
                {s.value === null ? (
                  s.suffix
                ) : (
                  <>
                    <span className="sv-num tabular-nums" data-target={s.value} data-decimals={s.decimals}>
                      {s.value.toFixed(s.decimals)}
                    </span>
                    {s.suffix}
                  </>
                )}
              </div>
              <p className={`mt-1 text-sm ${muted}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ---------- Service rows ---------- */}
        <div>
          {services.map((service, index) => (
            <article
              key={service.title}
              role="button"
              tabIndex={0}
              aria-label={`Open details for ${service.title}`}
              className="sv-row group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              onMouseEnter={onRowEnter}
              onMouseLeave={onRowLeave}
              onClick={() => setSelectedService(service)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedService(service);
                }
              }}
            >
              {/* Divider that draws itself */}
              <div className={`absolute left-0 right-0 top-0 h-px ${line}`} />
              <div
                className="sv-line absolute left-0 right-0 top-0 h-px origin-left"
                style={{ background: grad(service) }}
              />

              {/* Hover fill sweep */}
              <div
                className="sv-fill absolute inset-0"
                style={{ background: grad(service), opacity: darkMode ? 0.14 : 0.1, transform: 'scaleX(0)', transformOrigin: '0% 50%' }}
              />

              <div className="relative grid items-center gap-x-6 gap-y-5 px-2 py-8 md:grid-cols-[4.5rem_1fr_auto] md:px-6 md:py-12">
                {/* Number */}
                <span
                  className="hidden text-4xl font-black leading-none md:block"
                  style={{
                    backgroundImage: grad(service),
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Main */}
                <div className="sv-inner">
                  <div className="flex items-center gap-4">
                    <span
                      className="sv-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-lg"
                      style={{ background: grad(service) }}
                      aria-hidden="true"
                    >
                      {service.icon}
                    </span>
                    <div>
                      <h3 className={`sv-title text-2xl font-extrabold leading-tight md:text-4xl ${text}`}>{service.title}</h3>
                      <span className="mt-1 inline-block text-xs font-semibold uppercase tracking-widest" style={{ color: service.from }}>
                        {service.category}
                      </span>
                    </div>
                  </div>

                  <p
                    className={`mt-4 max-w-2xl text-sm leading-relaxed md:text-base ${soft}`}
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {service.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.features.slice(0, 3).map((f) => (
                      <span key={f} className={`sv-chip rounded-full border px-3 py-1 text-xs font-medium ${chip}`}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics + arrow */}
                <div className="sv-meta flex items-center justify-between gap-6 md:flex-col md:items-end md:gap-4">
                  <div className="flex items-center gap-6 md:gap-5">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${text}`}>{service.projects}</div>
                      <div className={`text-xs ${muted}`}>Projects</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${text}`}>
                        {service.rating} <span className="text-yellow-400">★</span>
                      </div>
                      <div className={`text-xs ${muted}`}>Rating</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-bold ${text}`}>{service.deliveryTime}</div>
                      <div className={`text-xs ${muted}`}>Delivery</div>
                    </div>
                  </div>
                  <span
                    className="sv-arrow flex h-11 w-11 items-center justify-center rounded-full text-lg text-white"
                    style={{ background: grad(service) }}
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </div>
            </article>
          ))}
          <div className={`h-px ${line}`} />
        </div>

        {/* ---------- Bottom call-to-action ---------- */}
        <div className="mt-20 text-center md:mt-28">
          <div className="sv-cta inline-block">
            <p className={`mb-5 text-2xl font-bold md:text-3xl ${text}`}>Have a project in mind?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-500/25 transition-transform hover:scale-105 active:scale-95"
            >
              Let&apos;s work together →
            </Link>
          </div>
        </div>
      </div>

      {/* ---------- Modal ---------- */}
      {selectedService && (
        <div
          ref={modalRef}
          // data-lenis-prevent lets the modal scroll natively while smooth scroll is active
          data-lenis-prevent
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={selectedService.title}
        >
          <div
            className={`md-panel relative max-h-[90vh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-3xl border ${panelBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className={`md-close absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full text-xl transition-colors hover:bg-red-500 hover:text-white ${
                darkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              ×
            </button>

            {/* Header */}
            <div className="border-b border-gray-200/20 p-6 md:p-8">
              <div className="flex items-center gap-5 pr-10 md:gap-6">
                <div
                  className="md-icon flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-lg md:h-20 md:w-20"
                  style={{ background: grad(selectedService) }}
                >
                  {selectedService.icon}
                </div>
                <div>
                  <h2 className={`md-title text-3xl font-black md:text-4xl ${text}`}>{selectedService.title}</h2>
                  <span
                    className="md-badge mt-2 inline-block rounded-full px-4 py-1 text-sm font-semibold text-white"
                    style={{ background: grad(selectedService) }}
                  >
                    {selectedService.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Stats */}
              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                {[
                  { v: String(selectedService.projects), l: 'Completed Projects' },
                  { v: `${selectedService.rating} ★`, l: 'Average Rating' },
                  { v: selectedService.deliveryTime, l: 'Delivery Time' },
                ].map((s) => (
                  <div key={s.l} className={`md-stat rounded-2xl border p-5 text-center ${tile}`}>
                    <div
                      className="bg-clip-text text-3xl font-black text-transparent"
                      style={{ backgroundImage: grad(selectedService) }}
                    >
                      {s.v}
                    </div>
                    <div className={`mt-1 text-sm ${muted}`}>{s.l}</div>
                  </div>
                ))}
              </div>

              <div className="md-about mb-8">
                <h3 className={`mb-3 text-2xl font-bold ${text}`}>About this service</h3>
                <p className={`text-base leading-relaxed md:text-lg ${soft}`}>{selectedService.description}</p>
              </div>

              <div className="mb-8">
                <h3 className={`mb-5 text-2xl font-bold ${text}`}>What you get</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  {selectedService.features.map((feature) => (
                    <div
                      key={feature}
                      className={`md-feature flex items-center rounded-xl border p-4 transition-transform duration-300 hover:scale-[1.03] ${tile}`}
                    >
                      <span
                        className="mr-4 h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: grad(selectedService) }}
                      />
                      <span className={text}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md-actions flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`rounded-xl border px-8 py-4 font-semibold transition-transform hover:scale-105 ${tile} ${text}`}
                >
                  Close
                </button>
                <Link
                  href="/contact"
                  className="rounded-xl px-8 py-4 font-semibold text-white transition-transform hover:scale-105 hover:shadow-lg"
                  style={{ background: grad(selectedService) }}
                >
                  Get Started →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;