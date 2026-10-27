"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Code2, Gamepad2, Camera, Plane, BookOpen, Music, Download, MessageCircle, type LucideIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppContext } from "@/Context/AppContext";

gsap.registerPlugin(ScrollTrigger);

/* ───────────── Edit your content here ───────────── */
const profile = {
    image: "/furqan.png",
    name: "Furqan Khattak",
    intro:
        "I'm a creative web developer who loves turning ideas into fast, good-looking products. I work across the stack and add a little AI wherever it makes an app smarter.",
    cv: "/Furqan_Ullah.pdf",
    badge: { value: "2+", label: "years of experience" },
};

const story = [
    {
        title: "Where it started",
        text: "Curiosity about how websites work led me to open the browser's inspector and start breaking things on purpose. That turned into my first HTML page.",
    },
    {
        title: "Learning by building",
        text: "I picked up React, Next.js and Node by shipping small projects, then moved into Python, databases and machine learning.",
    },
    {
        title: "Today",
        text: "I design and build web apps, 3D interfaces and RAG chatbots, and I'm always looking for the next idea worth building.",
    },
];

const hobbies: { label: string; icon: LucideIcon }[] = [
    { label: "Side projects", icon: Code2 },
    { label: "Gaming", icon: Gamepad2 },
    { label: "Photography", icon: Camera },
    { label: "Travelling", icon: Plane },
    { label: "Reading", icon: BookOpen },
    { label: "Music", icon: Music },
];
/* ─────────────────────────────────────────────────── */

function TiltCard({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
    const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });

    const onMove = (e: React.PointerEvent) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
        rx.set((0.5 - (e.clientY - r.top) / r.height) * 12);
    };
    const onLeave = () => {
        rx.set(0);
        ry.set(0);
    };

    return (
        <div className="[perspective:1000px]">
            <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} style={{ rotateX: rx, rotateY: ry }}>
                {children}
            </motion.div>
        </div>
    );
}

export default function AboutMe() {
    const { darkMode } = useAppContext();
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const mm = gsap.matchMedia();
        mm.add(
            "(prefers-reduced-motion: no-preference)",
            () => {
                // 1. Giant heading grows as you scroll
                gsap.fromTo(
                    ".about-big",
                    { scale: 0.45, opacity: 0.25 },
                    {
                        scale: 1.15,
                        opacity: 1,
                        ease: "none",
                        scrollTrigger: { trigger: ".about-big-wrap", start: "top 95%", end: "bottom 25%", scrub: 0.6 },
                    }
                );

                // 2. Image card wipes in, then drifts (parallax)
                gsap.fromTo(
                    ".about-card",
                    { clipPath: "inset(0 100% 0 0 round 2rem)" },
                    {
                        clipPath: "inset(0 0% 0 0 round 2rem)",
                        duration: 1.2,
                        ease: "power3.inOut",
                        scrollTrigger: { trigger: ".about-card", start: "top 85%", once: true },
                    }
                );
                gsap.fromTo(
                    ".about-img",
                    { yPercent: 7 },
                    {
                        yPercent: -7,
                        ease: "none",
                        scrollTrigger: { trigger: ".about-card", start: "top bottom", end: "bottom top", scrub: true },
                    }
                );

                // 3. Intro words light up as you read
                gsap.fromTo(
                    ".intro-word",
                    { opacity: 0.15 },
                    {
                        opacity: 1,
                        stagger: 0.1,
                        ease: "none",
                        scrollTrigger: { trigger: ".intro", start: "top 80%", end: "bottom 45%", scrub: true },
                    }
                );

                // 4. Timeline line draws, entries slide in
                gsap.fromTo(
                    ".story-line",
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        ease: "none",
                        transformOrigin: "top",
                        scrollTrigger: { trigger: ".story", start: "top 75%", end: "bottom 60%", scrub: true },
                    }
                );
                gsap.utils.toArray<HTMLElement>(".story-item").forEach((el) => {
                    gsap.from(el, {
                        x: 50,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: { trigger: el, start: "top 85%" },
                    });
                });

                // 5. Hobbies pop in, buttons rise
                gsap.from(".hobby", {
                    y: 20,
                    scale: 0.8,
                    opacity: 0,
                    stagger: 0.07,
                    duration: 0.5,
                    ease: "back.out(1.6)",
                    scrollTrigger: { trigger: ".hobbies", start: "top 88%" },
                });
                gsap.from(".about-cta", {
                    y: 24,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.6,
                    scrollTrigger: { trigger: ".about-cta", start: "top 92%" },
                });
            },
            sectionRef
        );
        return () => mm.revert();
    }, []);

    const heading = darkMode ? "text-white" : "text-gray-900";
    const body = darkMode ? "text-gray-300" : "text-gray-600";

    return (
        <section
            ref={sectionRef}
            id="about"
            className={`relative w-full overflow-hidden transition-colors duration-500 ${
                darkMode ? "bg-[#09061a]" : "bg-[#f5f0ff]"
            }`}
        >
            {/* full-width background colour: glows + dot grid */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className={`absolute -left-40 top-20 h-[620px] w-[620px] rounded-full blur-[150px] ${darkMode ? "bg-purple-600/30" : "bg-purple-400/30"}`} />
                <div className={`absolute -right-40 bottom-10 h-[520px] w-[520px] rounded-full blur-[150px] ${darkMode ? "bg-pink-600/20" : "bg-pink-300/40"}`} />
                <div
                    className={`absolute inset-0 opacity-[0.07] ${darkMode ? "text-white" : "text-purple-900"}`}
                    style={{
                        backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />
            </div>

            {/* Giant heading that scales up with scroll */}
            <div className="about-big-wrap relative flex h-[34vw] min-h-[180px] items-center justify-center overflow-hidden">
                <h2
                    className="about-big origin-center select-none whitespace-nowrap bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text text-[15vw] font-black uppercase leading-none tracking-tight text-transparent will-change-transform"
                    aria-label="About me"
                >
                    About Me
                </h2>
            </div>

            <div className="relative mx-auto grid max-w-[1300px] gap-12 px-6 pb-28 pt-6 lg:grid-cols-[5fr_7fr] lg:gap-20">
                {/* Left: image (stays in view while the text scrolls) */}
                <div className="lg:sticky lg:top-28 lg:self-start">
                    <TiltCard>
                        <div className="relative mx-auto w-[min(82vw,400px)]">
                            {/* offset colour block behind the photo */}
                            <div aria-hidden className="absolute -bottom-4 -right-4 h-full w-full rounded-[2rem] bg-gradient-to-br from-purple-600 to-pink-500 opacity-90" />
                            <div className="about-card relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl shadow-purple-900/30">
                                <div className="about-img absolute inset-[-8%]">
                                    <Image src={profile.image} alt={profile.name} fill priority sizes="(max-width: 1024px) 82vw, 400px" className="object-cover" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/50 via-transparent to-transparent" />
                            </div>
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className={`absolute -left-4 bottom-10 rounded-2xl border px-5 py-3 shadow-xl backdrop-blur-md md:-left-10 ${
                                    darkMode ? "border-white/20 bg-white/10 text-white" : "border-purple-200 bg-white/80 text-gray-900"
                                }`}
                            >
                                <div className="text-3xl font-black leading-none">{profile.badge.value}</div>
                                <div className={`mt-1 text-xs ${body}`}>{profile.badge.label}</div>
                            </motion.div>
                        </div>
                    </TiltCard>
                </div>

                {/* Right: text */}
                <div className="mx-auto w-full max-w-2xl">
                    <p className={`intro text-2xl font-semibold leading-snug md:text-3xl ${heading}`}>
                        {profile.intro.split(" ").map((w, i) => (
                            <span key={i} className="intro-word mr-[0.28em] inline-block">
                                {w}
                            </span>
                        ))}
                    </p>

                    {/* Life story */}
                    <div className="story relative mt-14">
                        <div aria-hidden className={`absolute bottom-0 left-0 top-0 w-px ${darkMode ? "bg-white/10" : "bg-purple-900/10"}`} />
                        <div aria-hidden className="story-line absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-purple-500 to-pink-500" />
                        <ol className="space-y-8 pl-8">
                            {story.map((s) => (
                                <li key={s.title} className="story-item relative">
                                    <span className="absolute -left-[2.45rem] top-1.5 h-3 w-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 ring-4 ring-purple-500/20" />
                                    <h3 className={`text-lg font-bold ${heading}`}>{s.title}</h3>
                                    <p className={`mt-1 ${body}`}>{s.text}</p>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Hobbies */}
                    <div className="hobbies mt-14">
                        <h3 className={`mb-4 text-sm font-semibold uppercase tracking-widest ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            When I'm not coding
                        </h3>
                        <ul className="flex flex-wrap gap-3">
                            {hobbies.map(({ label, icon: Icon }) => (
                                <li
                                    key={label}
                                    className={`hobby flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:border-purple-500/70 ${
                                        darkMode ? "border-white/10 bg-white/[0.05] text-gray-100" : "border-purple-200 bg-white/70 text-gray-800"
                                    }`}
                                >
                                    <Icon size={16} className="text-purple-500" />
                                    {label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="mt-12 flex flex-wrap gap-4">
                        <a
                            href={profile.cv}
                            download
                            className="about-cta flex items-center gap-2 rounded-2xl bg-purple-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-purple-500/25 transition-transform hover:scale-105 hover:bg-purple-700 active:scale-95"
                        >
                            <Download size={18} /> Download CV
                        </a>
                        <Link
                            href="/contact"
                            className={`about-cta flex items-center gap-2 rounded-2xl border px-7 py-3.5 font-semibold transition-transform hover:scale-105 active:scale-95 ${
                                darkMode ? "border-white/20 text-white" : "border-purple-300 text-gray-900"
                            }`}
                        >
                            <MessageCircle size={18} className="text-purple-500" /> Let's talk
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}