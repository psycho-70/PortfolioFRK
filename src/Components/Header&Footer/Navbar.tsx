"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAppContext } from "@/Context/AppContext";
// import NavScene from "./NavScene";
import gsap from "gsap";

const NAV_ITEMS = [
  { id: "home", label: "Home", num: "01", path: "/" },
  { id: "skill", label: "Skill", num: "02", path: "/skill" },
  { id: "project", label: "Project", num: "03", path: "/project" },
  { id: "services", label: "Services", num: "04", path: "/services" },
  { id: "team", label: "Team", num: "05", path: "/team" },
  { id: "experience", label: "Experience", num: "06", path: "/experience" },
  { id: "contact", label: "Contact", num: "07", path: "/contact" },
];

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/psycho-70" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/furqan-ktk-856552191" },
  { label: "Facebook", href: "https://web.facebook.com/furqan.don.771/" },
];

const MaterialUISwitch = styled(Switch)(() => ({
  width: 56,
  height: 30,
  padding: 6,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(4px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(20px)",
      "& + .MuiSwitch-track": { opacity: 1, background: "linear-gradient(45deg,#667eea,#764ba2)" },
    },
  },
  "& .MuiSwitch-thumb": {
    background: "linear-gradient(45deg,#667eea,#764ba2)",
    width: 26,
    height: 26,
    boxShadow: "0 2px 8px rgba(102,126,234,0.4)",
  },
  "& .MuiSwitch-track": { opacity: 1, background: "linear-gradient(45deg,#ffeaa7,#fab1a0)", borderRadius: 20 },
}));

const Navbar: React.FC = () => {
  const { darkMode, toggleDarkMode } = useAppContext();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);       // burger state
  const [mounted, setMounted] = useState(false); // overlay is in the DOM
  const [hovered, setHovered] = useState(-1);
  const [visible, setVisible] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    try {
      setIsLogged(!!localStorage.getItem("adminToken"));
    } catch {
      /* storage unavailable */
    }
  }, []);

  // hide on scroll down, show on scroll up
  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y <= lastY || y < 60);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GSAP: circular reveal from the burger, then masked line reveals
  useEffect(() => {
    if (!mounted || !overlayRef.current) return;
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline()
        .fromTo(
          overlayRef.current,
          { clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" },
          { clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)", duration: 0.9, ease: "power3.inOut" }
        )
        .fromTo(".nav-line", { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.06, ease: "power4.out" }, "-=0.4")
        .fromTo(".nav-fade", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }, "-=0.5");
    }, overlayRef);
    return () => ctx.revert();
  }, [mounted]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setHovered(-1);
    if (tl.current) {
      tl.current.eventCallback("onReverseComplete", () => setMounted(false));
      tl.current.timeScale(1.8).reverse();
    } else {
      setMounted(false);
    }
  }, []);

  const toggleMenu = () => {
    if (!mounted) {
      setMounted(true);
      setOpen(true);
    } else if (open) {
      closeMenu();
    }
  };

  // lock page scroll + Escape to close while the overlay is up
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, closeMenu]);

  const isActive = (p: string) => (p === "/" ? pathname === "/" : pathname.startsWith(p));
  const bar = darkMode ? "bg-white" : "bg-gray-900";

  return (
    <>
      {/* ───────── Floating pill header ───────── */}
      <motion.header
        animate={{ y: visible || mounted ? 0 : -110, opacity: visible || mounted ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className="fixed left-0 right-0 top-4 z-[110] px-4"
      >
        <div
          className={`mx-auto flex h-16 max-w-[1500px] items-center justify-between rounded-full border px-4 pl-5 shadow-lg backdrop-blur-xl transition-colors duration-300
            ${darkMode ? "border-white/10 bg-black/40 text-white shadow-black/30" : "border-black/10 bg-white/60 text-gray-900 shadow-purple-500/10"}`}
        >
          <Link href="/" aria-label="Home" className="relative shrink-0">
            <Image
              src={darkMode ? "/seclogo.png" : "/firstlogo.png"}
              width={84}
              height={40}
              alt="FK Logo"
              priority
              className="transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* inline links (wide screens) with a sliding active pill */}
          {/* <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path) ? "text-white" : darkMode ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {isActive(item.path) && (
                  <motion.span
                    layoutId="navPill"
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            ))}
          </nav> */}

          <div className="flex items-center gap-3">
            <Link
              href={isLogged ? "/admin/dashboard" : "/admin/login"}
              className={`hidden rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors sm:block ${
                darkMode ? "border-white/10 bg-white/5 text-white/80 hover:bg-white/10" : "border-black/10 bg-black/5 text-gray-700 hover:bg-black/10"
              }`}
            >
              {isLogged ? "Dashboard" : "Sign In"}
            </Link>

            <MaterialUISwitch checked={darkMode} onChange={toggleDarkMode} inputProps={{ "aria-label": "Toggle dark mode" }} />

            <button
              onClick={toggleMenu}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-transform hover:scale-105 active:scale-95 ${
                darkMode ? "border-white/20 bg-white/10" : "border-black/10 bg-black/5"
              }`}
            >
              <span className="flex w-5 flex-col gap-1.5">
                <motion.span animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className={`h-0.5 rounded-full ${bar}`} />
                <motion.span animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} className={`h-0.5 rounded-full ${bar}`} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ───────── Full-screen overlay ───────── */}
      {mounted && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={`fixed inset-0 z-[105] overflow-hidden ${darkMode ? "bg-[#07060d] text-white" : "bg-[#f6f3ff] text-gray-900"}`}
        >
          {/* <NavScene hovered={hovered} className="absolute inset-0" /> */}

          <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-between px-6 pb-8 pt-28 md:px-10">
            <nav className="flex flex-1 flex-col justify-center" aria-label="Overlay">
              {NAV_ITEMS.map((item, i) => (
                <div key={item.id} className="overflow-hidden">
                  <Link
                    href={item.path}
                    onClick={closeMenu}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(-1)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(-1)}
                    className={`nav-line group flex items-baseline gap-5 py-1 transition-opacity duration-300 md:py-1.5 ${
                      hovered !== -1 && hovered !== i ? "opacity-30" : "opacity-100"
                    }`}
                  >
                    <span className="w-8 font-mono text-xs tracking-widest text-purple-500">{item.num}</span>
                    <span
                      className={`text-4xl font-black tracking-tight transition-transform duration-300 group-hover:translate-x-3 sm:text-5xl md:text-6xl lg:text-7xl ${
                        isActive(item.path) ? "bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </div>
              ))}
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-current/10 pt-6">
              <div className="nav-fade flex flex-wrap gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      darkMode ? "border-white/15 text-white/70 hover:bg-white/10" : "border-black/10 text-gray-600 hover:bg-black/5"
                    }`}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
              <Link
                href={isLogged ? "/admin/dashboard" : "/admin/login"}
                onClick={closeMenu}
                className="nav-fade rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-sm font-semibold text-white"
              >
                {isLogged ? "Dashboard" : "Admin login"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;