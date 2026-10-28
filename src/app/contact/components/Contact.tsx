'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Clock, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppContext } from '@/Context/AppContext';
import { API_BASE_URL as API_URL, isLocalApiUrl } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger);

/* ───────────── Edit your details here ───────────── */
// Where the form is sent (POST, JSON: { name, email, subject, message }).
// Point this to your own backend route, or a service such as Formspree.
const configuredContactEndpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT?.trim();
const CONTACT_ENDPOINT =
  configuredContactEndpoint &&
  !(process.env.NODE_ENV === 'production' && isLocalApiUrl(configuredContactEndpoint))
    ? configuredContactEndpoint
    : `${API_URL}/api/contacts`;

const contact = {
  email: 'furqankhan.webdev@gmail.com',
  phone: '+92 314 1868872',
  location: 'Khyber Pakhtunkhwa, Pakistan',
  hours: 'Mon – Sat, 9:00 AM – 8:00 PM (PKT)',
  github: 'https://github.com/psycho-70',
  linkedin: 'https://www.linkedin.com/in/furqan-ktk-856552191',
};

const topics = ['Web Development', 'AI & Chatbots', 'Automation', 'UI/UX Design', 'Other'];
const MAX_MESSAGE = 1000;
/* ─────────────────────────────────────────────────── */

type Status = 'idle' | 'sending' | 'success' | 'error';
type FormState = { name: string; email: string; subject: string; message: string; website: string };
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const infoItems = [
  { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}`, from: '#a855f7', to: '#ec4899' },
  { icon: Phone, label: 'Phone', value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}`, from: '#8b5cf6', to: '#6366f1' },
  { icon: MapPin, label: 'Location', value: contact.location, href: undefined, from: '#d946ef', to: '#f43f5e' },
];

const ContactSection = () => {
  const { darkMode } = useAppContext();

  const rootRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: topics[0], message: '', website: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  const prefersReduced = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Scroll animations ---------------- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);

    mm.add(
      { isDesktop: '(min-width: 1024px)', reduce: '(prefers-reduced-motion: reduce)' },
      (ctx) => {
        const { isDesktop, reduce } = ctx.conditions as { isDesktop: boolean; reduce: boolean };
        if (reduce) return;
        const dist = isDesktop ? 220 : 60;

        // Giant words slide sideways in opposite directions while scrolling
        gsap.fromTo(
          '.ct-bigrow-a',
          { xPercent: 5 },
          { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.ct-big', start: 'top bottom', end: 'bottom top', scrub: true } }
        );
        gsap.fromTo(
          '.ct-bigrow-b',
          { xPercent: -30 },
          { xPercent: 5, ease: 'none', scrollTrigger: { trigger: '.ct-big', start: 'top bottom', end: 'bottom top', scrub: true } }
        );

        // Heading: words fly in from both sides and zoom
        gsap
          .timeline({ scrollTrigger: { trigger: '.ct-head', start: 'top 92%', end: 'top 40%', scrub: true } })
          .from('.ct-title-a', { x: -dist * 1.4, opacity: 0, scale: 0.5, transformOrigin: '100% 50%', ease: 'power2.out' }, 0)
          .from('.ct-title-b', { x: dist * 1.4, opacity: 0, scale: 0.5, transformOrigin: '0% 50%', ease: 'power2.out' }, 0)
          .from('.ct-sub', { y: 30, opacity: 0, ease: 'power2.out' }, 0.4);

        // Contact details slide in from the left, one after another
        gsap.utils.toArray<HTMLElement>('.ct-item', root).forEach((el) => {
          gsap.fromTo(
            el,
            { x: -dist * 0.8, opacity: 0, scale: 0.9 },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 65%', scrub: true },
            }
          );
        });

        // Form card comes from the right and zooms in
        gsap.fromTo(
          '.ct-form-card',
          { x: dist * 0.8, opacity: 0, scale: 0.85 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.ct-form-card', start: 'top 95%', end: 'top 55%', scrub: true },
          }
        );

        // Socials pop in once
        gsap.from('.ct-social', {
          scale: 0,
          rotate: -90,
          opacity: 0,
          stagger: 0.12,
          duration: 0.6,
          ease: 'back.out(2)',
          clearProps: 'all',
          scrollTrigger: { trigger: '.ct-socials', start: 'top 92%' },
        });
      }
    );

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      window.clearTimeout(t);
      mm.revert();
    };
  }, []);

  /* ---------------- Input focus line ---------------- */
  const onFieldFocus = (e: React.FocusEvent<HTMLElement>) => {
    const line = e.currentTarget.querySelector('.ct-line');
    if (!line || prefersReduced()) return;
    gsap.set(line, { transformOrigin: '0% 50%' });
    gsap.to(line, { scaleX: 1, duration: 0.45, ease: 'power3.out' });
  };
  const onFieldBlur = (e: React.FocusEvent<HTMLElement>) => {
    const line = e.currentTarget.querySelector('.ct-line');
    if (!line || prefersReduced()) return;
    gsap.set(line, { transformOrigin: '100% 50%' });
    gsap.to(line, { scaleX: 0, duration: 0.35, ease: 'power3.inOut' });
  };

  /* ---------------- Form logic ---------------- */
  const update = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your name.';
    if (!EMAIL_RE.test(form.email.trim())) e.email = 'Please enter a valid email address.';
    if (form.message.trim().length < 10) e.message = 'Please write at least 10 characters.';
    return e;
  };

  const showSuccess = () => {
    const body = formRef.current?.querySelector('.ct-form-body');
    if (!body || prefersReduced()) {
      setStatus('success');
      return;
    }
    gsap.to(body, {
      opacity: 0,
      y: -24,
      scale: 0.95,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => setStatus('success'),
    });
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status === 'sending') return;

    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // shake the invalid fields
      if (!prefersReduced()) {
        (Object.keys(found) as string[]).forEach((k) => {
          gsap.fromTo(
            `#ct-field-${k}`,
            { x: -10 },
            { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)', clearProps: 'x' }
          );
        });
      }
      return;
    }

    // Honeypot: bots fill this hidden field. Pretend it worked.
    if (form.website) {
      showSuccess();
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject,
          message: form.message.trim(),
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      showSuccess();
    } catch (err) {
      console.error('Contact form error', err);
      setStatus('error');
      if (!prefersReduced()) {
        gsap.fromTo('.ct-error-box', { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
      }
    }
  };

  const resetForm = () => {
    const panel = rootRef.current?.querySelector('.ct-success');
    const finish = () => {
      setForm({ name: '', email: '', subject: topics[0], message: '', website: '' });
      setErrors({});
      setStatus('idle');
    };
    if (!panel || prefersReduced()) {
      finish();
      return;
    }
    gsap.to(panel, { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in', onComplete: finish });
  };

  // Form comes back after "Send another"
  useEffect(() => {
    if (status !== 'idle' || prefersReduced()) return;
    const body = formRef.current?.querySelector('.ct-form-body');
    if (body && (body as HTMLElement).style.opacity === '0') {
      gsap.fromTo(body, { opacity: 0, y: 24, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', clearProps: 'all' });
    }
  }, [status]);

  // Success animation: circle pops, check draws itself, text zooms in
  useEffect(() => {
    if (status !== 'success' || prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .from('.ct-success', { opacity: 0, scale: 0.9, duration: 0.4, ease: 'power3.out' }, 0)
        .from('.ct-check-circle', { scale: 0, rotate: -120, duration: 0.7, ease: 'back.out(2)' }, 0.1)
        .fromTo('.ct-check-path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }, 0.45)
        .from('.ct-success-title', { y: 30, opacity: 0, scale: 0.8, duration: 0.55, ease: 'back.out(1.6)' }, 0.6)
        .from('.ct-success-text', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, 0.75)
        .from('.ct-success-btn', { y: 20, opacity: 0, duration: 0.45, ease: 'power3.out' }, 0.9);
    }, rootRef);
    return () => ctx.revert();
  }, [status]);

  /* ---------------- Small UI helpers ---------------- */
  const onSendHover = (e: React.MouseEvent<HTMLElement>, enter: boolean) => {
    if (!window.matchMedia('(hover: hover)').matches || prefersReduced()) return;
    const icon = e.currentTarget.querySelector('.ct-send-icon');
    if (!icon) return;
    gsap.to(icon, enter ? { x: 6, y: -6, rotate: 12, duration: 0.35, ease: 'power3.out' } : { x: 0, y: 0, rotate: 0, duration: 0.35, ease: 'power3.out' });
  };

  const pickTopic = (e: React.MouseEvent<HTMLElement>, t: string) => {
    update('subject', t);
    if (!prefersReduced()) {
      gsap.fromTo(e.currentTarget, { scale: 0.88 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
    }
  };

  /* ---------------- Theme helpers ---------------- */
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const soft = darkMode ? 'text-gray-300' : 'text-gray-600';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardCls = darkMode ? 'bg-white/[0.06] border-white/10' : 'bg-white border-purple-100 shadow-xl shadow-purple-900/5';
  const inputCls = darkMode
    ? 'bg-white/[0.07] text-white placeholder:text-gray-500'
    : 'bg-purple-50/70 text-gray-900 placeholder:text-gray-400';
  const chipCls = darkMode
    ? 'border-white/15 bg-white/[0.06] text-gray-200'
    : 'border-purple-200 bg-purple-50 text-gray-700';
  const strokeColor = darkMode ? 'rgba(192,132,252,0.45)' : 'rgba(124,58,237,0.35)';

  const Field = ({
    id,
    label,
    error,
    children,
  }: {
    id: keyof Errors;
    label: string;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div id={`ct-field-${id}`}>
      <label htmlFor={`ct-${id}`} className={`mb-2 block text-sm font-semibold ${text}`}>
        {label}
      </label>
      <div
        className="relative overflow-hidden rounded-xl"
        onFocusCapture={onFieldFocus}
        onBlurCapture={onFieldBlur}
      >
        {children}
        <span
          aria-hidden="true"
          className="ct-line absolute inset-x-0 bottom-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg,#a855f7,#ec4899)', transform: 'scaleX(0)', transformOrigin: '0% 50%' }}
        />
      </div>
      {error && (
        <p id={`ct-${id}-error`} role="alert" className="mt-2 text-sm text-rose-500">
          {error}
        </p>
      )}
    </div>
  );

  return (
    <section ref={rootRef} id="contact" className="relative w-full overflow-x-clip px-4 py-24 sm:px-6 md:py-32">
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

      {/* ---------- Giant words that slide sideways while you scroll ---------- */}
      <div
        aria-hidden="true"
        className="ct-big pointer-events-none relative z-0 -mx-4 mb-10 select-none overflow-hidden sm:-mx-6 md:mb-14"
      >
        <div
          className="ct-bigrow-a flex w-max whitespace-nowrap text-[16vw] font-black uppercase leading-[0.95] md:text-[10vw]"
          style={{ WebkitTextStroke: `1.5px ${strokeColor}`, color: 'transparent' }}
        >
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="pr-[0.5em]">
              Say Hello • Get In Touch •
            </span>
          ))}
        </div>
        <div
          className="ct-bigrow-b flex w-max whitespace-nowrap text-[16vw] font-black uppercase leading-[0.95] md:text-[10vw]"
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
              Let&apos;s Talk • Start A Project •
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* ---------- Header ---------- */}
        <div className="ct-head mb-14 text-center md:mb-20">
          <h1 className={`flex flex-wrap items-baseline justify-center gap-x-4 text-5xl font-black tracking-tight md:text-7xl ${text}`}>
            <span className="ct-title-a inline-block">Let&apos;s</span>
            <span
              className="ct-title-b inline-block bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg,#a855f7,#ec4899)' }}
            >
              Talk
            </span>
          </h1>
          <p className={`ct-sub mx-auto mt-5 max-w-xl text-base md:text-lg ${soft}`}>
            Have a project, an idea or just a question? Send a message and I will get back to you as soon as I can.
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14">
          {/* ---------- Left: details ---------- */}
          <div className="space-y-5">
            {infoItems.map(({ icon: Icon, label, value, href, from, to }) => {
              const inner = (
                <>
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-xs font-semibold uppercase tracking-widest ${muted}`}>{label}</span>
                    <span className={`block break-words text-base font-bold md:text-lg ${text}`}>{value}</span>
                  </span>
                </>
              );
              const cls = `ct-item flex items-center gap-4 rounded-3xl border p-5 transition-transform duration-300 hover:scale-[1.02] ${cardCls}`;
              return href ? (
                <a key={label} href={href} className={cls}>
                  {inner}
                </a>
              ) : (
                <div key={label} className={cls}>
                  {inner}
                </div>
              );
            })}

            {/* Availability */}
            <div className={`ct-item flex items-center gap-4 rounded-3xl border p-5 ${cardCls}`}>
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
                <Clock className="h-6 w-6" />
                <span className="absolute right-2 top-2 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>
              </span>
              <span>
                <span className={`block text-xs font-semibold uppercase tracking-widest ${muted}`}>Available for projects</span>
                <span className={`block text-sm font-semibold md:text-base ${text}`}>{contact.hours}</span>
                <span className={`block text-xs ${muted}`}>Usually replies within 24 hours</span>
              </span>
            </div>

            {/* Socials */}
            <div className="ct-socials flex items-center gap-3 pt-2">
              <span className={`mr-2 text-sm font-semibold ${muted}`}>Find me on</span>
              {[
                { icon: Github, label: 'GitHub', href: contact.github },
                { icon: Linkedin, label: 'LinkedIn', href: contact.linkedin },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`ct-social flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-purple-500 hover:text-purple-500 ${chipCls}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* ---------- Right: form ---------- */}
          <div className={`ct-form-card relative overflow-hidden rounded-3xl border p-6 md:p-10 ${cardCls}`}>
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: 'linear-gradient(90deg,#a855f7,#ec4899)' }} />

            {status === 'success' ? (
              <div className="ct-success flex min-h-[420px] flex-col items-center justify-center text-center">
                <div
                  className="ct-check-circle mb-6 flex h-24 w-24 items-center justify-center rounded-full"
                  style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}
                >
                  <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path className="ct-check-path" d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} strokeDasharray={1} strokeDashoffset={0} />
                  </svg>
                </div>
                <h2 className={`ct-success-title text-3xl font-black md:text-4xl ${text}`}>Message sent!</h2>
                <p className={`ct-success-text mt-3 max-w-sm ${soft}`}>
                  Thank you for reaching out. I will read your message and reply to you soon.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className={`ct-success-btn mt-8 rounded-full border px-7 py-3 font-semibold transition-transform hover:scale-105 ${chipCls}`}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate>
                <div className="ct-form-body space-y-6">
                  <div>
                    <h2 className={`text-2xl font-black md:text-3xl ${text}`}>Send me a message</h2>
                    <p className={`mt-1 text-sm ${muted}`}>All fields marked * are required.</p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field id="name" label="Your name *" error={errors.name}>
                      <input
                        id="ct-name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'ct-name-error' : undefined}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3.5 outline-none ${inputCls}`}
                      />
                    </Field>
                    <Field id="email" label="Your email *" error={errors.email}>
                      <input
                        id="ct-email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'ct-email-error' : undefined}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-3.5 outline-none ${inputCls}`}
                      />
                    </Field>
                  </div>

                  {/* Topic chips */}
                  <div>
                    <span className={`mb-2 block text-sm font-semibold ${text}`}>What is it about?</span>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Topic">
                      {topics.map((t) => {
                        const on = form.subject === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={(e) => pickTopic(e, t)}
                            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                              on ? 'border-transparent text-white shadow-lg shadow-purple-500/25' : chipCls
                            }`}
                            style={on ? { background: 'linear-gradient(135deg,#a855f7,#ec4899)' } : undefined}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Field id="message" label="Your message *" error={errors.message}>
                    <textarea
                      id="ct-message"
                      rows={6}
                      maxLength={MAX_MESSAGE}
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'ct-message-error' : undefined}
                      placeholder="Tell me a little about your project..."
                      className={`w-full resize-none px-4 py-3.5 outline-none ${inputCls}`}
                    />
                  </Field>
                  <p className={`-mt-4 text-right text-xs tabular-nums ${muted}`}>
                    {form.message.length} / {MAX_MESSAGE}
                  </p>

                  {/* Honeypot: hidden from people, visible to bots */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label htmlFor="ct-website">Website</label>
                    <input
                      id="ct-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) => update('website', e.target.value)}
                    />
                  </div>

                  {status === 'error' && (
                    <div className="ct-error-box rounded-2xl border border-rose-500/40 bg-rose-500/10 px-5 py-4 text-sm text-rose-500" role="alert">
                      Something went wrong and your message was not sent. Please try again, or email me directly at{' '}
                      <a href={`mailto:${contact.email}`} className="font-semibold underline">
                        {contact.email}
                      </a>
                      .
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    onMouseEnter={(e) => onSendHover(e, true)}
                    onMouseLeave={(e) => onSendHover(e, false)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-white shadow-lg shadow-purple-500/25 transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                    style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        Send message <Send className="ct-send-icon h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;