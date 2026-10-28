'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Mail, ChevronDown, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppContext } from '@/Context/AppContext';
import { API_BASE_URL as API_URL } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger);

/* ───────────── Edit your content here ───────────── */
interface TeamMember {
  name: string;
  position: string;
  image: string;
  expertise: string;
  skills: string[];
  status: 'Available' | 'Busy';
  projects: number;
  experience: string;
}

const CONTACT_EMAIL = 'furqanktk52@gmail.com';

const initialTeamMembers: TeamMember[] = [
  {
    name: 'M.Asim',
    position: 'Visual Designer',
    image: '/team/asim.jpg',
    expertise: 'Expert in Adobe Photoshop, Illustrator, and UI/UX design principles.',
    skills: ['Photoshop', 'Illustrator', 'UI/UX', 'Design Systems'],
    status: 'Available',
    projects: 12,
    experience: '3+ years',
  },
  {
    name: 'Hussain Khan',
    position: 'Software Engineer',
    image: '/team/hussain.enc',
    expertise: 'Proficient in JavaScript, React, Node.js, and cloud computing.',
    skills: ['JavaScript', 'React', 'Node.js', 'Cloud Computing'],
    status: 'Busy',
    projects: 18,
    experience: '5+ years',
  },
  {
    name: 'Nasir Khan',
    position: 'Project Manager',
    image: '/team/nasir.enc',
    expertise: 'Skilled in project management, Agile methodologies, and team leadership.',
    skills: ['Project Management', 'Agile', 'Leadership', 'Strategy'],
    status: 'Available',
    projects: 25,
    experience: '7+ years',
  },
  {
    name: 'Salman Khan',
    position: 'Database Administrator',
    image: '/team/salman.jpg',
    expertise: 'Experienced in SQL, NoSQL databases, and database performance optimization.',
    skills: ['SQL', 'NoSQL', 'Performance', 'Security'],
    status: 'Available',
    projects: 15,
    experience: '4+ years',
  },
  {
    name: 'Aftab Khan',
    position: 'UX Designer',
    image: '/team/aftab.jpg',
    expertise: 'Specialized in user research, wireframing, prototyping, and usability testing.',
    skills: ['User Research', 'Wireframing', 'Prototyping', 'Testing'],
    status: 'Busy',
    projects: 14,
    experience: '4+ years',
  },
];
/* ─────────────────────────────────────────────────── */

// Brand accent pairs, assigned to members in order
const ACCENTS: [string, string][] = [
  ['#a855f7', '#ec4899'],
  ['#8b5cf6', '#6366f1'],
  ['#d946ef', '#f43f5e'],
  ['#7c3aed', '#c026d3'],
  ['#ec4899', '#f97316'],
];
const grad = (i: number) => `linear-gradient(135deg, ${ACCENTS[i % ACCENTS.length][0]}, ${ACCENTS[i % ACCENTS.length][1]})`;

const ACTIVE_GROW = 3.4; // desktop: how much wider the open panel is
const OPEN_H = 520; // mobile: open panel height
const CLOSED_H = 92; // mobile: closed panel height

const initials = (name: string) =>
  name
    .replace(/\./g, ' ')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const availableCount = initialTeamMembers.filter((m) => m.status === 'Available').length;
const totalProjects = initialTeamMembers.reduce((acc, m) => acc + m.projects, 0);

const stats = [
  { value: initialTeamMembers.length, label: 'Team Members' },
  { value: totalProjects, label: 'Projects Completed' },
  { value: availableCount, label: 'Available Now' },
];

const TeamMemberCard: React.FC = () => {
  const { darkMode } = useAppContext();

  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/public/team`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((m: any) => ({
              ...m,
              image: m.image
                ? m.image.startsWith('http') || m.image.startsWith('/')
                  ? m.image
                  : `${API_URL}/uploads/${m.image}`
                : '',
            }));
            setTeamMembers(mapped);
          }
        }
      } catch (err) {
        console.warn('Could not fetch dynamic team, using fallback members:', err);
      }
    };
    fetchTeam();
  }, []);
  const [broken, setBroken] = useState<Record<number, boolean>>({});

  const prefersReduced = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;

  /* ---------------- Open one panel, close the others ---------------- */
  const layoutPanels = useCallback((index: number, animate: boolean) => {
    const list = listRef.current;
    if (!list) return;
    const wraps = Array.from(list.querySelectorAll<HTMLElement>('.tm-wrap'));
    const desktop = isDesktop();
    const go = animate && !prefersReduced();

    wraps.forEach((wrap, i) => {
      const on = i === index;
      const size = desktop ? { flexGrow: on ? ACTIVE_GROW : 1 } : { height: on ? OPEN_H : CLOSED_H };
      const collapsed = wrap.querySelector('.tm-collapsed');
      const expanded = wrap.querySelector('.tm-expanded');
      const items = wrap.querySelectorAll('.tm-x');

      if (go) {
        gsap.to(wrap, { ...size, duration: 0.75, ease: 'power3.inOut', overwrite: 'auto' });
      } else {
        gsap.set(wrap, size);
      }

      if (on) {
        if (go) {
          gsap.to(collapsed, { autoAlpha: 0, duration: 0.25, overwrite: 'auto' });
          gsap.set(expanded, { autoAlpha: 1 });
          gsap.fromTo(
            items,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.06, duration: 0.55, delay: 0.3, ease: 'power3.out', overwrite: true }
          );
        } else {
          gsap.set(collapsed, { autoAlpha: 0 });
          gsap.set(expanded, { autoAlpha: 1 });
          gsap.set(items, { y: 0, opacity: 1 });
        }
      } else if (go) {
        gsap.to(expanded, { autoAlpha: 0, duration: 0.2, overwrite: 'auto' });
        gsap.to(collapsed, { autoAlpha: 1, duration: 0.4, delay: 0.35, overwrite: 'auto' });
      } else {
        gsap.set(expanded, { autoAlpha: 0 });
        gsap.set(collapsed, { autoAlpha: 1 });
      }
    });
  }, []);

  const activate = useCallback(
    (index: number) => {
      const next = ((index % teamMembers.length) + teamMembers.length) % teamMembers.length;
      if (next === activeRef.current) return;
      activeRef.current = next;
      setActive(next);
      layoutPanels(next, true);
    },
    [layoutPanels]
  );

  // First layout (before paint) + re-layout when crossing the desktop/mobile breakpoint
  useIsoLayoutEffect(() => {
    layoutPanels(0, false);

    const mql = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      const list = listRef.current;
      if (list) gsap.set(list.querySelectorAll('.tm-wrap'), { clearProps: 'flexGrow,height' });
      layoutPanels(activeRef.current, false);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [layoutPanels, teamMembers]);

  /* ---------------- Scroll animations ---------------- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);

    mm.add(
      { isDesktop: '(min-width: 1024px)', reduce: '(prefers-reduced-motion: reduce)' },
      (ctx) => {
        const { isDesktop: desktop, reduce } = ctx.conditions as { isDesktop: boolean; reduce: boolean };
        if (reduce) return;
        const dist = desktop ? 220 : 60;

        // Heading: words fly in from both sides and zoom
        gsap
          .timeline({ scrollTrigger: { trigger: '.tm-head', start: 'top 92%', end: 'top 40%', scrub: true } })
          .from('.tm-title-a', { x: -dist * 1.4, opacity: 0, scale: 0.5, transformOrigin: '100% 50%', ease: 'power2.out' }, 0)
          .from('.tm-title-b', { x: dist * 1.4, opacity: 0, scale: 0.5, transformOrigin: '0% 50%', ease: 'power2.out' }, 0)
          .from('.tm-sub', { y: 30, opacity: 0, ease: 'power2.out' }, 0.4);

        // Stats: slide in from alternating sides, then count up once
        gsap.utils.toArray<HTMLElement>('.tm-stat', root).forEach((el, i) => {
          gsap.from(el, {
            x: i === 1 ? 0 : i === 0 ? -dist / 2 : dist / 2,
            y: i === 1 ? 50 : 0,
            opacity: 0,
            scale: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.tm-stats', start: 'top 94%', end: 'top 62%', scrub: true },
          });
          const num = el.querySelector<HTMLElement>('.tm-num');
          if (!num) return;
          const target = Number(num.dataset.target);
          const counter = { v: 0 };
          gsap.to(counter, {
            v: target,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.tm-stats', start: 'top 85%', once: true },
            onUpdate: () => {
              num.textContent = String(Math.round(counter.v));
            },
          });
        });

        // Panels: outer ones come from the sides, middle ones rise up (stacked on mobile: alternate sides)
        const total = teamMembers.length;
        gsap.utils.toArray<HTMLElement>('.tm-wrap', root).forEach((wrap, i) => {
          let x = 0;
          let y = 70;
          if (desktop) {
            const mid = (total - 1) / 2;
            x = i < mid ? -dist * 0.7 : i > mid ? dist * 0.7 : 0;
          } else {
            x = i % 2 === 0 ? -dist : dist;
            y = 30;
          }
          gsap.fromTo(
            wrap,
            { x, y, opacity: 0, scale: 0.85 },
            {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: desktop ? '.tm-list' : wrap, start: 'top 95%', end: desktop ? 'top 55%' : 'top 70%', scrub: true },
            }
          );
        });

        // Bottom call-to-action zooms in
        gsap.from('.tm-cta', {
          scale: 0.6,
          opacity: 0,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.tm-cta', start: 'top 98%', end: 'top 72%', scrub: true },
        });
      }
    );

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      window.clearTimeout(t);
      mm.revert();
    };
  }, []);

  /* ---------------- Keyboard + hover ---------------- */
  const focusPanel = (i: number) => {
    const el = listRef.current?.querySelectorAll<HTMLElement>('.tm-panel')[i];
    el?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate(i);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const n = (i + 1) % teamMembers.length;
      activate(n);
      focusPanel(n);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const n = (i - 1 + teamMembers.length) % teamMembers.length;
      activate(n);
      focusPanel(n);
    }
  };

  const onEnter = (i: number) => {
    if (window.matchMedia('(hover: hover)').matches && isDesktop()) activate(i);
  };

  /* ---------------- Theme helpers ---------------- */
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const soft = darkMode ? 'text-gray-300' : 'text-gray-600';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const statCls = darkMode ? 'border-white/10 bg-white/[0.06]' : 'border-purple-100 bg-white shadow-lg shadow-purple-900/5';

  return (
    <section id="team" ref={rootRef} className="relative w-full overflow-x-clip px-4 py-20 sm:px-6 md:py-28">
      {/* Cheap background glows (gradients, no blur filters) */}
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

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ---------- Header ---------- */}
        <div className="tm-head mb-14 text-center md:mb-16">
          <h1 className={`flex flex-wrap items-baseline justify-center gap-x-4 text-5xl font-black tracking-tight md:text-7xl ${text}`}>
            <span className="tm-title-a inline-block">Our</span>
            <span
              className="tm-title-b inline-block bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg,#a855f7,#ec4899)' }}
            >
              Team
            </span>
          </h1>
          <p className={`tm-sub mx-auto mt-5 max-w-2xl text-base md:text-lg ${soft}`}>
            Meet the innovative minds driving excellence in every project
          </p>
        </div>

        {/* ---------- Stats ---------- */}
        <div className="tm-stats mx-auto mb-14 grid max-w-3xl grid-cols-3 gap-3 md:mb-16 md:gap-6">
          {stats.map((s) => (
            <div key={s.label} className={`tm-stat rounded-2xl border p-4 text-center md:p-6 ${statCls}`}>
              <div
                className="bg-clip-text text-3xl font-black tabular-nums text-transparent md:text-5xl"
                style={{ backgroundImage: 'linear-gradient(135deg,#a855f7,#ec4899)' }}
              >
                <span className="tm-num" data-target={s.value}>
                  {s.value}
                </span>
              </div>
              <div className={`mt-1 text-xs md:text-sm ${muted}`}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ---------- Expanding panels ---------- */}
        <div ref={listRef} className="tm-list flex flex-col gap-3 lg:h-[580px] lg:flex-row lg:gap-4">
          {teamMembers.map((member, i) => {
            const isActive = i === active;
            const showImage = member.image && !broken[i];

            return (
              <div key={member.name} className="tm-wrap h-[92px] flex-none lg:h-full lg:min-w-0 lg:flex-[1_1_0%]">
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  aria-label={`${member.name}, ${member.position}`}
                  onClick={() => activate(i)}
                  onMouseEnter={() => onEnter(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className="tm-panel group relative h-full w-full cursor-pointer overflow-hidden rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  style={{ boxShadow: isActive ? `0 25px 60px -15px ${ACCENTS[i % ACCENTS.length][0]}66` : '0 10px 30px -15px rgba(0,0,0,0.4)' }}
                >
                  {/* Photo (or initials if the image is missing) */}
                  {showImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.image}
                      alt={member.name}
                      onError={() => setBroken((b) => ({ ...b, [i]: true }))}
                      className={`absolute inset-0 h-full w-full object-cover transition-[filter,scale] duration-700 ease-out ${
                        isActive ? '[scale:1.05] grayscale-0' : '[scale:1] grayscale'
                      }`}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: grad(i) }}>
                      <span className="select-none text-8xl font-black text-white/30 lg:text-9xl">{initials(member.name)}</span>
                    </div>
                  )}

                  {/* Readability overlay */}
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(9,6,26,0.92) 0%, rgba(9,6,26,0.45) 50%, rgba(9,6,26,0.25) 100%)' }}
                  />
                  {/* Accent line */}
                  <div className="absolute inset-x-0 top-0 h-1" style={{ background: grad(i) }} />

                  {/* ── Collapsed layer ── */}
                  <div className="tm-collapsed absolute inset-0 flex items-center justify-between px-5 lg:flex-col lg:items-center lg:justify-between lg:px-0 lg:py-6">
                    <span className="hidden text-sm font-black tracking-widest text-white/70 lg:block">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex flex-col lg:items-center">
                      <span className="text-lg font-extrabold text-white lg:rotate-180 lg:text-2xl lg:[writing-mode:vertical-rl]">
                        {member.name}
                      </span>
                      <span className="text-xs font-medium text-white/70 lg:hidden">{member.position}</span>
                    </div>
                    <span
                      className={`h-3 w-3 rounded-full lg:mb-1 ${member.status === 'Available' ? 'bg-emerald-400' : 'bg-orange-400'}`}
                      aria-label={member.status}
                    />
                    <ChevronDown className="h-5 w-5 text-white/70 lg:hidden" />
                  </div>

                  {/* ── Expanded layer ── */}
                  <div className="tm-expanded invisible absolute inset-0 flex flex-col justify-between p-5 opacity-0 lg:p-8">
                    <div className="tm-x flex items-center justify-between">
                      <span className="text-sm font-black tracking-widest text-white/70">{String(i + 1).padStart(2, '0')}</span>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                          member.status === 'Available'
                            ? 'border-emerald-400/40 bg-emerald-500/20 text-emerald-300'
                            : 'border-orange-400/40 bg-orange-500/20 text-orange-300'
                        }`}
                      >
                        <span className="relative mr-2 flex h-2 w-2">
                          {member.status === 'Available' && (
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          )}
                          <span className={`relative inline-flex h-2 w-2 rounded-full ${member.status === 'Available' ? 'bg-emerald-400' : 'bg-orange-400'}`} />
                        </span>
                        {member.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="tm-x text-3xl font-black leading-tight text-white lg:text-5xl">{member.name}</h3>
                      <p
                        className="tm-x mt-1 w-fit bg-clip-text text-base font-bold text-transparent lg:text-lg"
                        style={{ backgroundImage: 'linear-gradient(90deg,#f0abfc,#f9a8d4)' }}
                      >
                        {member.position}
                      </p>
                      <p className="tm-x mt-3 max-w-md text-sm leading-relaxed text-white/80 lg:text-base">{member.expertise}</p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {member.skills.map((s) => (
                          <span key={s} className="tm-x rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="tm-x mt-5 flex items-center gap-6">
                        <div>
                          <div className="text-xl font-black text-white">{member.projects}</div>
                          <div className="text-xs text-white/60">Projects</div>
                        </div>
                        <div>
                          <div className="text-xl font-black text-white">{member.experience}</div>
                          <div className="text-xs text-white/60">Experience</div>
                        </div>
                        <a
                          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Hello ${member.name}`)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="ml-auto inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                          style={{ background: grad(i) }}
                        >
                          <Mail className="h-4 w-4" /> Message
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ---------- Bottom call-to-action ---------- */}
        <div className="mt-20 text-center md:mt-28">
          <div className="tm-cta inline-block">
            <p className={`mb-5 text-2xl font-bold md:text-3xl ${text}`}>Want to work with us?</p>
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

export default TeamMemberCard;