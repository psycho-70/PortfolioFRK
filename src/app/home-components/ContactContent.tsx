'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppContext } from '@/Context/AppContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const educationData = [
  {
    id: 0,
    year: '2020 - 2024',
    degree: 'BS Software Engineering',
    institution: 'Kohat University of Science and Technology',
    location: 'Khyber Pakhtunkhwa, Pakistan',
    description:
      'Specialized in modern web technologies, AI fundamentals, and software architecture. Graduated with distinction and led multiple collaborative projects.',
    achievements: ['CGPA: 3.8/4.0', "Dean's List", 'Best Final Year Project'],
    icon: '🎓',
    from: '#3b82f6',
    to: '#06b6d4',
  },
  {
    id: 1,
    year: '2018 - 2020',
    degree: 'FSc in ICS',
    institution: 'Wisdom College, Karak',
    location: 'Khyber Pakhtunkhwa, Pakistan',
    description:
      'Focused on computer science fundamentals, programming basics, and mathematics. Built strong foundation for advanced studies in software engineering.',
    achievements: ['Grade: A+', 'Computer Science Medalist', 'Scholarship Recipient'],
    icon: '📚',
    from: '#10b981',
    to: '#14b8a6',
  },
  {
    id: 2,
    year: 'Born & Raised',
    degree: 'District Karak',
    institution: 'Village Ambirikalla',
    location: 'Khyber Pakhtunkhwa, Pakistan',
    description:
      'Rooted in the beautiful landscapes of KP. The rich cultural heritage and supportive community shaped my values and work ethic.',
    achievements: ['Proud Pashtun', 'Community Volunteer', 'Nature Enthusiast'],
    icon: '🏔️',
    from: '#a855f7',
    to: '#ec4899',
  },
];

const EducationSection = () => {
  const { darkMode } = useAppContext();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions as {
          isDesktop: boolean;
          reduceMotion: boolean;
        };
        if (reduceMotion) return; // content stays visible, no motion

        const dist = isDesktop ? 200 : 70;

        /* ---------- Heading: words fly in from both sides and grow ---------- */
        const headTl = gsap.timeline({
          scrollTrigger: {
            trigger: root.querySelector('.edu-head'),
            start: 'top 90%',
            end: 'top 35%',
            scrub: 1,
          },
        });
        headTl
          .from('.edu-title-left', { x: -dist * 1.5, opacity: 0, scale: 0.5, transformOrigin: '100% 50%', ease: 'power2.out' }, 0)
          .from('.edu-title-right', { x: dist * 1.5, opacity: 0, scale: 0.5, transformOrigin: '0% 50%', ease: 'power2.out' }, 0)
          .from('.edu-sub', { y: 30, opacity: 0, ease: 'power2.out' }, 0.3);

        /* ---------- Timeline line draws as you scroll ---------- */
        gsap.fromTo(
          '.edu-line-fill',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: '.edu-timeline',
              start: 'top 60%',
              end: 'bottom 60%',
              scrub: true,
            },
          }
        );

        /* ---------- Each entry: alternate sides, text grows while scrolling ---------- */
        gsap.utils.toArray<HTMLElement>('.edu-item', root).forEach((item, i) => {
          const cardOnLeft = i % 2 === 0;
          const q = gsap.utils.selector(item);

          // On mobile everything is left-aligned, so grow from the left edge.
          const degreeOrigin = isDesktop ? (cardOnLeft ? '100% 50%' : '0% 50%') : '0% 50%';
          const yearOrigin = isDesktop ? (cardOnLeft ? '0% 50%' : '100% 50%') : '0% 50%';

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              end: 'top 38%',
              scrub: 1,
            },
          });

          tl.from(q('.edu-dot'), { scale: 0, ease: 'back.out(2)' }, 0)
            // text block comes from its own side
            .from(q('.edu-card'), { x: cardOnLeft ? -dist : dist, opacity: 0, ease: 'power2.out' }, 0)
            // big year comes from the opposite side and grows
            .from(
              q('.edu-year'),
              {
                x: cardOnLeft ? dist : -dist,
                opacity: 0,
                scale: 0.45,
                transformOrigin: yearOrigin,
                ease: 'power2.out',
              },
              0
            )
            // degree title increases in size
            .from(q('.edu-degree'), { scale: 0.65, transformOrigin: degreeOrigin, ease: 'none' }, 0)
            .from(q('.edu-meta'), { x: cardOnLeft ? -dist / 2 : dist / 2, opacity: 0, ease: 'power2.out' }, 0.15)
            .from(q('.edu-desc'), { y: 30, opacity: 0, ease: 'power2.out' }, 0.25)
            .from(q('.edu-chip'), { y: 20, opacity: 0, scale: 0.8, stagger: 0.12, ease: 'power2.out' }, 0.4);
        });
      }
    );

    return () => mm.revert();
  }, []);

  const muted = darkMode ? 'text-slate-400' : 'text-slate-500';
  const body = darkMode ? 'text-slate-300' : 'text-slate-600';

  return (
    <section ref={rootRef} className="relative w-full overflow-hidden py-20 md:py-32">
      {/* Soft background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full opacity-25 blur-3xl"
          style={{ background: `radial-gradient(circle, rgba(99,102,241,${darkMode ? 0.5 : 0.25}), transparent)` }}
        />
        <div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full opacity-25 blur-3xl"
          style={{ background: `radial-gradient(circle, rgba(168,85,247,${darkMode ? 0.5 : 0.25}), transparent)` }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        {/* ---------- Header ---------- */}
        <div className="edu-head mb-20 text-center md:mb-28">
          <h2
            className={`flex flex-wrap items-baseline justify-center gap-x-4 text-5xl font-black tracking-tight md:text-7xl ${
              darkMode ? 'text-white' : 'text-slate-800'
            }`}
          >
            <span className="edu-title-left inline-block">Education &amp;</span>
            <span
              className="edu-title-right inline-block bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg,#3b82f6,#a855f7,#ec4899)' }}
            >
              Background
            </span>
          </h2>
          <p className={`edu-sub mx-auto mt-5 max-w-md text-base ${muted}`}>
            The path that shaped who I am today
          </p>
        </div>

        {/* ---------- Timeline ---------- */}
        <div className="edu-timeline relative">
          {/* Track + animated fill */}
          <div
            className={`absolute bottom-0 left-5 top-0 w-px -translate-x-1/2 md:left-1/2 ${
              darkMode ? 'bg-slate-700/60' : 'bg-slate-300/70'
            }`}
          />
          <div
            className="edu-line-fill absolute bottom-0 left-5 top-0 w-[3px] -translate-x-1/2 rounded-full md:left-1/2"
            style={{ background: 'linear-gradient(to bottom,#3b82f6,#a855f7,#ec4899)' }}
          />

          {educationData.map((item, index) => {
            const cardOnLeft = index % 2 === 0;
            const gradient = `linear-gradient(135deg, ${item.from}, ${item.to})`;

            return (
              <article
                key={item.id}
                className="edu-item grid grid-cols-[2.5rem_1fr] items-start gap-x-4 py-12 md:grid-cols-[1fr_4rem_1fr] md:gap-x-10 md:py-20"
              >
                {/* Dot */}
                <div className="col-start-1 row-span-2 row-start-1 flex justify-center pt-3 md:col-start-2 md:row-span-1">
                  <span
                    className="edu-dot relative z-10 block h-4 w-4 rounded-full"
                    style={{
                      background: gradient,
                      boxShadow: `0 0 0 5px ${item.from}33`,
                    }}
                  />
                </div>

                {/* Big year: sits on the opposite side of the card on desktop */}
                <div
                  className={`col-start-2 row-start-1 mb-4 md:mb-0 ${
                    cardOnLeft ? 'md:col-start-3 md:text-left' : 'md:col-start-1 md:text-right'
                  }`}
                >
                  <span
                    className="edu-year inline-block text-4xl font-black leading-[1.05] tracking-tight md:text-6xl"
                    style={{
                      backgroundImage: gradient,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {item.year}
                  </span>
                </div>

                {/* Text block */}
                <div
                  className={`edu-card col-start-2 row-start-2 border-t-2 pt-5 md:row-start-1 ${
                    cardOnLeft ? 'md:col-start-1 md:text-right' : 'md:col-start-3 md:text-left'
                  }`}
                  style={{ borderImage: `${gradient} 1` }}
                >
                  <h3
                    className={`edu-degree mb-2 text-2xl font-extrabold leading-tight md:text-4xl ${
                      darkMode ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    {item.degree} <span aria-hidden="true">{item.icon}</span>
                  </h3>

                  <div className="edu-meta">
                    <p className={`text-sm font-semibold md:text-base ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                      {item.institution}
                    </p>
                    <p className={`mt-1 text-xs ${muted}`}>{item.location}</p>
                  </div>

                  <p className={`edu-desc mt-4 max-w-prose text-sm leading-relaxed md:text-base ${body} ${cardOnLeft ? 'md:ml-auto' : ''}`}>
                    {item.description}
                  </p>

                  <div className={`mt-5 flex flex-wrap gap-2 ${cardOnLeft ? 'md:justify-end' : ''}`}>
                    {item.achievements.map((a) => (
                      <span
                        key={a}
                        className={`edu-chip rounded-full px-3 py-1 text-xs font-medium ${
                          darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
                        }`}
                        style={{ boxShadow: `inset 0 0 0 1px ${item.from}55` }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;