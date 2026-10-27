'use client';
import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '@/Context/AppContext';

interface Metric {
  label: string;
  target: number;
  suffix?: string;
}

const METRICS: Metric[] = [
  { label: 'Years', target: 2 },
  { label: 'Projects', target: 7 },
  { label: 'Clients', target: 8 },
  { label: '% Happy', target: 98 },
];

const MetricsStrip = () => {
  const { darkMode } = useAppContext();
  const [values, setValues] = useState(METRICS.map(() => 0));
  const animated = useRef(false);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated.current) {
          animated.current = true;
          METRICS.forEach((m, i) => {
            const duration = 1600;
            const stepMs = 16;
            let elapsed = 0;
            const iv = setInterval(() => {
              elapsed += stepMs;
              const progress = Math.min(elapsed / duration, 1);
              // ease-out quad
              const eased = 1 - (1 - progress) ** 2;
              setValues(prev => {
                const next = [...prev];
                next[i] = Math.round(m.target * eased);
                return next;
              });
              if (progress >= 1) clearInterval(iv);
            }, stepMs);
          });
        }
      },
      { threshold: 0.4 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const border = darkMode ? 'rgba(168,85,247,0.2)' : 'rgba(100,80,200,0.15)';
  const cardBg = darkMode ? 'rgba(20,20,42,0.6)' : 'rgba(255,255,255,0.55)';
  const valClr = darkMode ? '#f0eeff' : '#1a1030';
  const lblClr = darkMode ? '#9990cc' : '#6050a0';

  return (
    <div
      ref={stripRef}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1,
        background: border,
        border: `1px solid ${border}`,
        borderRadius: 16,
        overflow: 'hidden',
        width: '100%',
        maxWidth: 340,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {METRICS.map((m, i) => (
        <div key={m.label} style={{ background: cardBg, padding: '16px 10px', textAlign: 'center', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.45rem', lineHeight: 1, color: valClr }}>
            {values[i]}
          </div>
          <div style={{ fontSize: '0.68rem', color: lblClr, marginTop: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsStrip;