"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { MdOutlineFacebook } from "react-icons/md";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { ArrowUpRight, ArrowUp, Mail, Phone } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useAppContext } from "@/Context/AppContext";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ───────────── Edit your content here ───────────── */
const brand = {
    name: "Furqan Khattak",
    tagline: "Creative web developer building fast, beautiful and intelligent web experiences.",
    email: "furqanktk52@gmail.com",
    phone: "+923141868872",
};

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Skill", href: "/skill" },
    { label: "Project", href: "/project" },
    { label: "Services", href: "/services" },
    { label: "Team", href: "/team" },
    { label: "Experience", href: "/experience" },
    { label: "Contact", href: "/contact" },
];

const socials = [
    { label: "GitHub", href: "https://github.com/psycho-70", icon: FaGithub },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/furqan-ktk-856552191", icon: FaLinkedin },
    { label: "Facebook", href: "https://web.facebook.com/furqan.don.771/", icon: MdOutlineFacebook },
    { label: "Instagram", href: "https://www.instagram.com/furqankhan070/", icon: FaInstagram },
    { label: "X", href: "https://twitter.com/?lang=en", icon: FaXTwitter },
];
/* ─────────────────────────────────────────────────── */

const Footer: React.FC = () => {
    const { darkMode } = useAppContext();
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = footerRef.current;
        if (!el) return;
        const mm = gsap.matchMedia();

        mm.add(
            "(prefers-reduced-motion: no-preference)",
            () => {
                const trigger = { trigger: el, start: "top 75%" };

                // top line draws across
                gsap.fromTo(".f-line", { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power3.out", scrollTrigger: trigger });

                // headline lines slide up from behind a mask
                gsap.from(".cta-line", {
                    yPercent: 115,
                    duration: 1,
                    stagger: 0.14,
                    ease: "power4.out",
                    scrollTrigger: trigger,
                });

                // email button + columns
                gsap.from(".cta-mail", { opacity: 0, y: 30, duration: 0.8, delay: 0.35, ease: "power3.out", scrollTrigger: trigger });
                gsap.from(".f-col", {
                    opacity: 0,
                    y: 40,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out",
                    scrollTrigger: { trigger: ".f-grid", start: "top 90%" },
                });

                // giant name rises into view as you reach the bottom
                gsap.fromTo(
                    ".f-giant",
                    { yPercent: 70 },
                    {
                        yPercent: 0,
                        ease: "none",
                        scrollTrigger: { trigger: ".f-giant-wrap", start: "top bottom", end: "bottom bottom", scrub: true },
                    }
                );
            },
            el
        );

        // magnetic effect on the email button (pointer devices only)
        const cleanups: Array<() => void> = [];
        if (window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) {
            el.querySelectorAll<HTMLElement>(".magnet").forEach((m) => {
                const xTo = gsap.quickTo(m, "x", { duration: 0.4, ease: "power3" });
                const yTo = gsap.quickTo(m, "y", { duration: 0.4, ease: "power3" });
                const move = (e: MouseEvent) => {
                    const r = m.getBoundingClientRect();
                    xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
                    yTo((e.clientY - (r.top + r.height / 2)) * 0.25);
                };
                const leave = () => {
                    xTo(0);
                    yTo(0);
                };
                m.addEventListener("mousemove", move);
                m.addEventListener("mouseleave", leave);
                cleanups.push(() => {
                    m.removeEventListener("mousemove", move);
                    m.removeEventListener("mouseleave", leave);
                });
            });
        }

        return () => {
            mm.revert();
            cleanups.forEach((fn) => fn());
        };
    }, []);

    const backToTop = () => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        gsap.to(window, { scrollTo: 0, duration: reduce ? 0 : 1.2, ease: "power3.inOut" });
    };

    const heading = darkMode ? "text-white" : "text-gray-900";
    const muted = darkMode ? "text-gray-400" : "text-gray-600";
    const linkHover = darkMode ? "hover:text-white" : "hover:text-purple-700";
    const label = `mb-5 text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-purple-300" : "text-purple-600"}`;

    return (
        <footer
            ref={footerRef}
            className={`relative w-full overflow-hidden transition-colors duration-500 ${
                darkMode ? "bg-[#07050f] text-white" : "bg-[#f5f0ff] text-gray-900"
            }`}
        >
            {/* background glows */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className={`absolute -left-32 top-0 h-[480px] w-[480px] rounded-full blur-[140px] ${darkMode ? "bg-purple-600/25" : "bg-purple-400/30"}`} />
                <div className={`absolute -right-32 bottom-20 h-[420px] w-[420px] rounded-full blur-[140px] ${darkMode ? "bg-pink-600/20" : "bg-pink-300/40"}`} />
            </div>

            <div className="f-line h-px w-full origin-left bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

            <div className="relative mx-auto max-w-[1300px] px-6 pt-24">
                {/* CTA */}
                <div className="mb-24">
                    <p className={`mb-6 text-sm font-semibold uppercase tracking-widest ${darkMode ? "text-purple-300" : "text-purple-600"}`}>
                        Have a project in mind?
                    </p>
                    <h2 className={`text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-8xl ${heading}`}>
                        <span className="block overflow-hidden pb-2">
                            <span className="cta-line block">Let&apos;s build</span>
                        </span>
                        <span className="block overflow-hidden pb-2">
                            <span className="cta-line block bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                                something great.
                            </span>
                        </span>
                    </h2>

                    <div className="cta-mail mt-10">
                        <a
                            href={`mailto:${brand.email}`}
                            className="magnet group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/30 md:text-lg"
                        >
                            {brand.email}
                            <ArrowUpRight size={20} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                    </div>
                </div>

                {/* Link grid */}
                <div className={`f-grid grid gap-12 border-t pt-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] ${darkMode ? "border-white/10" : "border-purple-900/10"}`}>
                    <div className="f-col max-w-sm">
                        <div className={`text-2xl font-black ${heading}`}>{brand.name}</div>
                        <p className={`mt-3 leading-relaxed ${muted}`}>{brand.tagline}</p>
                    </div>

                    <div className="f-col">
                        <h3 className={label}>Navigate</h3>
                        <ul className="space-y-3">
                            {navLinks.map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className={`inline-block transition-transform duration-300 hover:translate-x-1 ${muted} ${linkHover}`}>
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="f-col">
                        <h3 className={label}>Social</h3>
                        <ul className="space-y-3">
                            {socials.map(({ label: name, href, icon: Icon }) => (
                                <li key={name}>
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-3 transition-transform duration-300 hover:translate-x-1 ${muted} ${linkHover}`}
                                    >
                                        <Icon size={18} className="text-purple-500" />
                                        {name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="f-col">
                        <h3 className={label}>Contact</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href={`mailto:${brand.email}`} className={`inline-flex items-center gap-3 break-all transition-colors ${muted} ${linkHover}`}>
                                    <Mail size={18} className="shrink-0 text-purple-500" />
                                    {brand.email}
                                </a>
                            </li>
                            <li>
                                <a href={`tel:${brand.phone}`} className={`inline-flex items-center gap-3 transition-colors ${muted} ${linkHover}`}>
                                    <Phone size={18} className="shrink-0 text-purple-500" />
                                    {brand.phone}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className={`mt-14 flex flex-wrap items-center justify-between gap-4 border-t py-6 text-sm ${muted} ${darkMode ? "border-white/10" : "border-purple-900/10"}`}>
                    <p>
                        &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
                    </p>
                    <button
                        onClick={backToTop}
                        aria-label="Back to top"
                        className={`group flex items-center gap-2 rounded-full border px-4 py-2 transition-colors ${
                            darkMode ? "border-white/15 hover:bg-white/10" : "border-purple-900/15 hover:bg-purple-900/5"
                        }`}
                    >
                        Back to top
                        <ArrowUp size={16} className="transition-transform duration-300 group-hover:-translate-y-1" />
                    </button>
                </div>
            </div>

            {/* Giant name that rises as you reach the bottom */}
            {/* <div aria-hidden className="f-giant-wrap relative overflow-hidden">
                <div className="f-giant select-none whitespace-nowrap bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text pb-[0.08em] text-center text-[11vw] font-black uppercase leading-[0.9] tracking-tight text-transparent opacity-80">
                    {brand.name}
                </div>
            </div> */}
        </footer>
    );
};

export default Footer;