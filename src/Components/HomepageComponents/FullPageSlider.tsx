'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useAppContext } from '@/Context/AppContext';

// Section components
import Home from './Home';
import Skill from './Skill';
import Project from './Project';
import Services from './Services';
import TeamMemberCard from './TeamMember';
import WorkExperienceShowcase from './WorkExperience';
import Comments from './Comments';
import PageWithFixedBackground from './Adress';

// 3D background (lazy, no SSR)
const Hero3DScene = dynamic(() => import('./Hero3DScene'), { ssr: false });

// ─── Slide definitions ────────────────────────────────────────────────────────
const SLIDES = [
    { id: 'home', label: 'Home', Component: () => <><Home /><PageWithFixedBackground /></> },
    { id: 'skill', label: 'Skill', Component: Skill },
    { id: 'project', label: 'Project', Component: Project },
    { id: 'services', label: 'Services', Component: Services },
    { id: 'team', label: 'Team', Component: TeamMemberCard },
    { id: 'experience', label: 'Experience', Component: WorkExperienceShowcase },
    { id: 'comments', label: 'Contact', Component: Comments },
];

const TOTAL = SLIDES.length;
const AUTO_INTERVAL_MS = 8000; // 8 s per slide
const TRANSITION_DURATION = 0.65; // seconds
const WHEEL_DEBOUNCE_MS = 900;

// ─── Slide transition variants ────────────────────────────────────────────────
const makeVariants = (direction: number) => ({
    enter: { y: direction > 0 ? '100%' : '-100%', opacity: 0 },
    center: { y: '0%', opacity: 1 },
    exit: { y: direction > 0 ? '-100%' : '100%', opacity: 0 },
});

// ─── Dot indicator ────────────────────────────────────────────────────────────
const Dots = ({
    total, current, darkMode, onGoto,
}: { total: number; current: number; darkMode: boolean; onGoto: (i: number) => void }) => (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {Array.from({ length: total }).map((_, i) => (
            <button
                key={i}
                onClick={() => onGoto(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="group relative flex items-center justify-end gap-2"
            >
                {/* Label tooltip */}
                <span
                    className={`
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap
            ${darkMode ? 'bg-white/15 text-white' : 'bg-black/10 text-gray-800'}
          `}
                >
                    {SLIDES[i].label}
                </span>
                {/* Dot */}
                <motion.span
                    animate={{
                        width: i === current ? 28 : 10,
                        height: i === current ? 10 : 10,
                        opacity: i === current ? 1 : 0.45,
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`
            block rounded-full
            ${i === current
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/40'
                            : darkMode ? 'bg-white/50' : 'bg-gray-500/50'
                        }
          `}
                    style={{ minWidth: 10 }}
                />
            </button>
        ))}
    </div>
);

// ─── Progress bar ─────────────────────────────────────────────────────────────
const AutoProgress = ({ playing, duration }: { playing: boolean; duration: number }) => {
    const [width, setWidth] = useState(0);
    const rafRef = useRef<number | null>(null);
    const startRef = useRef<number | null>(null);

    useEffect(() => {
        setWidth(0);
        startRef.current = null;
        if (!playing) return;

        const step = (now: number) => {
            if (!startRef.current) startRef.current = now;
            const elapsed = now - startRef.current;
            setWidth(Math.min((elapsed / duration) * 100, 100));
            if (elapsed < duration) rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [playing, duration]);

    return (
        <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-transparent">
            <motion.div
                style={{ width: `${width}%` }}
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"
            />
        </div>
    );
};

// ─── Main FullPageSlider ──────────────────────────────────────────────────────
const FullPageSlider: React.FC = () => {
    const { darkMode } = useAppContext();
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);   // +1 down, -1 up
    const [autoPlay, setAutoPlay] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    const wheelLock = useRef(false);
    const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Navigate ──────────────────────────────────────────────────────────────
    const goTo = useCallback((next: number, dir?: number) => {
        if (isAnimating) return;
        const d = dir !== undefined ? dir : (next > current ? 1 : -1);
        setDirection(d);
        setCurrent(next);
        setIsAnimating(true);
        setAutoPlay(false);
    }, [isAnimating, current]);

    const goNext = useCallback(() => {
        const next = (current + 1) % TOTAL;
        goTo(next, 1);
    }, [current, goTo]);

    const goPrev = useCallback(() => {
        const next = (current - 1 + TOTAL) % TOTAL;
        goTo(next, -1);
    }, [current, goTo]);

    // ── Broadcast current slide to Navbar ─────────────────────────────────────
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('slide-change', { detail: current }));
    }, [current]);

    // ── Listen for Navbar navigation ──────────────────────────────────────────
    useEffect(() => {
        const handler = (e: Event) => {
            const idx = (e as CustomEvent<number>).detail;
            goTo(idx);
        };
        window.addEventListener('slide-goto', handler);
        return () => window.removeEventListener('slide-goto', handler);
    }, [goTo]);

    // ── Auto-advance ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!autoPlay) return;
        autoTimer.current = setTimeout(() => goNext(), AUTO_INTERVAL_MS);
        return () => { if (autoTimer.current) clearTimeout(autoTimer.current); };
    }, [autoPlay, current, goNext]);

    // Re-enable auto-play after manual nav
    useEffect(() => {
        if (autoPlay) return;
        const t = setTimeout(() => setAutoPlay(true), AUTO_INTERVAL_MS);
        return () => clearTimeout(t);
    }, [autoPlay, current]);

    // ── Mouse-wheel ───────────────────────────────────────────────────────────
    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (wheelLock.current) return;
            wheelLock.current = true;
            if (e.deltaY > 0) goNext(); else goPrev();
            setTimeout(() => { wheelLock.current = false; }, WHEEL_DEBOUNCE_MS);
        };
        window.addEventListener('wheel', onWheel, { passive: false });
        return () => window.removeEventListener('wheel', onWheel);
    }, [goNext, goPrev]);

    // ── Keyboard ──────────────────────────────────────────────────────────────
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goPrev();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [goNext, goPrev]);

    // ── Touch swipe ───────────────────────────────────────────────────────────
    const touchY = useRef(0);
    useEffect(() => {
        const onTouchStart = (e: TouchEvent) => { touchY.current = e.touches[0].clientY; };
        const onTouchEnd = (e: TouchEvent) => {
            const dy = touchY.current - e.changedTouches[0].clientY;
            if (Math.abs(dy) > 50) { if (dy > 0) goNext(); else goPrev(); }
        };
        window.addEventListener('touchstart', onTouchStart);
        window.addEventListener('touchend', onTouchEnd);
        return () => {
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [goNext, goPrev]);

    const { Component } = SLIDES[current];

    const variants = makeVariants(direction);

    return (
        <div
            className="fixed inset-0 overflow-hidden"
            style={{ zIndex: 10 }}
        >
            {/* ── 3D Scene Background (shared, always mounted) ── */}
            <div className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }}>
                <Hero3DScene />
                <div
                    className={`absolute inset-0 z-10 pointer-events-none ${darkMode
                        ? 'bg-gradient-to-br from-gray-900/70 via-purple-900/65 to-gray-900/75'
                        : 'bg-gradient-to-br from-blue-50/72 via-indigo-50/68 to-purple-50/78'
                        }`}
                />
            </div>

            {/* ── Slide content ── */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        y: { duration: TRANSITION_DURATION, ease: [0.76, 0, 0.24, 1] },
                        opacity: { duration: TRANSITION_DURATION * 0.6 },
                    }}
                    onAnimationComplete={() => {
                        setIsAnimating(false);
                        setAutoPlay(true);
                    }}
                    className={`absolute inset-0 z-20 overflow-y-auto ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                    style={{ scrollbarWidth: 'none' }}
                >
                    {/* Inner slide — min full-height so content can scroll inside if needed */}
                    <div className="min-h-full">
                        <Component />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* ── Auto-progress bar ── */}
            <AutoProgress playing={autoPlay && !isAnimating} duration={AUTO_INTERVAL_MS} />

            {/* ── Dot nav ── */}
            <Dots
                total={TOTAL}
                current={current}
                darkMode={darkMode}
                onGoto={(i) => goTo(i)}
            />

            {/* ── Slide label badge ── */}
            <motion.div
                key={`label-${current}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`
          fixed bottom-8 left-8 z-50 flex items-center gap-3
          px-4 py-2 rounded-full backdrop-blur-md text-sm font-semibold
          ${darkMode
                        ? 'bg-white/10 text-white border border-white/15'
                        : 'bg-black/8 text-gray-800 border border-black/10'
                    }
        `}
            >
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                {SLIDES[current].label}
                <span className={`ml-2 text-xs opacity-50`}>
                    {current + 1} / {TOTAL}
                </span>
            </motion.div>

            {/* ── Arrow buttons ── */}
            <div className="fixed bottom-8 right-16 z-50 flex gap-3">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={goPrev}
                    disabled={isAnimating}
                    className={`
            p-2.5 rounded-full backdrop-blur-md transition-all duration-200
            ${darkMode
                            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                            : 'bg-black/8 hover:bg-black/15 text-gray-800 border border-black/10'
                        }
          `}
                    aria-label="Previous slide"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={goNext}
                    disabled={isAnimating}
                    className={`
            p-2.5 rounded-full backdrop-blur-md transition-all duration-200
            ${darkMode
                            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                            : 'bg-black/8 hover:bg-black/15 text-gray-800 border border-black/10'
                        }
          `}
                    aria-label="Next slide"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </motion.button>
            </div>
        </div>
    );
};

export default FullPageSlider;
