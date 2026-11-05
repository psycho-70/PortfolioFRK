'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Admin dashboard uses its own scroll container; Lenis would swallow the wheel events.
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  useEffect(() => {
    if (isAdmin) return;
    // Respect users who ask for less motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      lerp: 0.1,            // same smoothing every time (duration-based easing felt fast then slow)
      smoothWheel: true,
      wheelMultiplier: 1,   // raise to 1.2 if scrolling feels too slow
      orientation: 'vertical',
      gestureOrientation: 'vertical',
    });

    // 1) Tell ScrollTrigger every time Lenis moves
    lenis.on('scroll', ScrollTrigger.update);

    // 2) Drive Lenis from the GSAP ticker so both use the same clock
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);

    // 3) Stop GSAP from "catching up" after lag, which causes sudden jumps
    gsap.ticker.lagSmoothing(0);

    // Recalculate trigger positions once the page has laid out
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(refresh);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [isAdmin]);

  return <>{children}</>;
}