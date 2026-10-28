"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    Briefcase,
    Code2,
    MessageSquare,
    Activity,
    Plus,
    Users,
    Eye,
    ExternalLink,
    ChevronRight,
    RefreshCw,
    AlertTriangle,
    type LucideIcon,
} from "lucide-react";
import gsap from "gsap";

/* ───────────── Edit these to match your admin routes ───────────── */
const API_URL = process.env.NEXT_PUBLIC_DEPLOYMENT_URL

const QUICK_ACTIONS: { icon: LucideIcon; label: string; href: string; from: string; to: string; external?: boolean }[] = [
    { icon: Plus, label: "New Project", href: "/admin/dashboard/projects", from: "#a855f7", to: "#ec4899" },
    { icon: Users, label: "Manage Team", href: "/admin/dashboard/team", from: "#8b5cf6", to: "#6366f1" },
    { icon: MessageSquare, label: "Inquiries", href: "/admin/dashboard/messages", from: "#ec4899", to: "#f43f5e" },
    { icon: Eye, label: "Full Preview", href: "/", from: "#10b981", to: "#14b8a6" },
    { icon: ExternalLink, label: "Visit Website", href: "/", from: "#f59e0b", to: "#f97316", external: true },
];
/* ───────────────────────────────────────────────────────────────── */

interface Stats {
    projects: number;
    messages: number;
    skills: number;
    team: number;
}

const toNumber = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

export default function DashboardOverview() {
    const rootRef = useRef<HTMLDivElement>(null);
    const animatedIn = useRef(false);

    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [online, setOnline] = useState<boolean | null>(null);
    const [latency, setLatency] = useState<number | null>(null);
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

    const prefersReduced = () =>
        typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------------- Load stats ---------------- */
    const load = useCallback(async (signal?: AbortSignal) => {
        setRefreshing(true);
        setError(null);
        const started = performance.now();

        try {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                setError("You are not signed in. Please log in again.");
                setOnline(null);
                return;
            }

            const res = await fetch(`${API_URL}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` },
                signal,
            });
            setOnline(true);
            setLatency(Math.round(performance.now() - started));

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                setError(
                    res.status === 401 || res.status === 403
                        ? "Your session has expired. Please log in again."
                        : data?.message || "Could not load the statistics."
                );
                return;
            }

            setStats({
                projects: toNumber(data?.projects),
                messages: toNumber(data?.messages),
                skills: toNumber(data?.skills),
                team: toNumber(data?.team),
            });
            setUpdatedAt(new Date());
        } catch (e) {
            if ((e as Error).name === "AbortError") return;
            console.error("Error fetching stats", e);
            setOnline(false);
            setLatency(null);
            setError("Could not reach the server. Check that your backend is running.");
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        load(controller.signal);
        return () => controller.abort();
    }, [load]);

    /* ---------------- Entrance animation (once, when the first data arrives) ---------------- */
    useEffect(() => {
        if (loading || animatedIn.current || !rootRef.current) return;
        animatedIn.current = true;
        if (prefersReduced()) return;

        const ctx = gsap.context(() => {
            gsap
                .timeline({ defaults: { ease: "power3.out" } })
                .from(".db-head", { y: -20, opacity: 0, duration: 0.5 })
                .from(
                    ".db-card",
                    {
                        x: (i: number) => (i % 2 === 0 ? -60 : 60),
                        y: 30,
                        opacity: 0,
                        scale: 0.9,
                        stagger: 0.1,
                        duration: 0.7,
                        clearProps: "transform,opacity",
                    },
                    0.1
                )
                .from(".db-chart", { x: -80, opacity: 0, duration: 0.7, clearProps: "transform,opacity" }, 0.4)
                .from(".db-actions", { x: 80, opacity: 0, duration: 0.7, clearProps: "transform,opacity" }, 0.4)
                .from(
                    ".db-action",
                    { x: 40, opacity: 0, stagger: 0.08, duration: 0.5, clearProps: "transform,opacity" },
                    0.65
                );
        }, rootRef);
        return () => ctx.revert();
    }, [loading]);

    /* ---------------- Count-up numbers + bar growth (re-runs on every refresh) ---------------- */
    useEffect(() => {
        const root = rootRef.current;
        if (!root || !stats) return;
        const reduce = prefersReduced();

        root.querySelectorAll<HTMLElement>(".db-num").forEach((el) => {
            const target = Number(el.dataset.target);
            const from = Number(el.dataset.shown || 0);
            if (reduce || from === target) {
                el.textContent = String(target);
                el.dataset.shown = String(target);
                return;
            }
            const counter = { v: from };
            gsap.to(counter, {
                v: target,
                duration: 1.4,
                ease: "power2.out",
                onUpdate: () => {
                    el.textContent = String(Math.round(counter.v));
                },
                onComplete: () => {
                    el.dataset.shown = String(target);
                },
            });
        });

        const max = Math.max(stats.projects, stats.messages, stats.skills, 1);
        root.querySelectorAll<HTMLElement>(".db-bar").forEach((bar) => {
            const value = Number(bar.dataset.value);
            const pct = `${(value / max) * 100}%`;
            if (reduce) gsap.set(bar, { width: pct });
            else gsap.to(bar, { width: pct, duration: 1.2, ease: "elastic.out(1, 0.7)", delay: 0.3 });
        });
    }, [stats]);

    /* ---------------- Hover effects (mouse devices only) ---------------- */
    const canHover = () => window.matchMedia("(hover: hover)").matches && !prefersReduced();

    const cardEnter = (e: React.MouseEvent<HTMLElement>) => {
        if (!canHover()) return;
        gsap.to(e.currentTarget, { y: -6, duration: 0.35, ease: "power3.out" });
        gsap.to(e.currentTarget.querySelector(".db-icon"), { rotate: -8, scale: 1.12, duration: 0.4, ease: "back.out(2)" });
    };
    const cardLeave = (e: React.MouseEvent<HTMLElement>) => {
        if (!canHover()) return;
        gsap.to(e.currentTarget, { y: 0, duration: 0.45, ease: "power3.out" });
        gsap.to(e.currentTarget.querySelector(".db-icon"), { rotate: 0, scale: 1, duration: 0.4, ease: "power3.out" });
    };

    const actionEnter = (e: React.MouseEvent<HTMLElement>) => {
        if (!canHover()) return;
        gsap.to(e.currentTarget, { x: 6, duration: 0.3, ease: "power3.out" });
        gsap.to(e.currentTarget.querySelector(".db-action-icon"), { rotate: -10, scale: 1.1, duration: 0.35, ease: "back.out(2)" });
        gsap.to(e.currentTarget.querySelector(".db-chevron"), { x: 5, duration: 0.3, ease: "power3.out" });
    };
    const actionLeave = (e: React.MouseEvent<HTMLElement>) => {
        if (!canHover()) return;
        gsap.to(e.currentTarget, { x: 0, duration: 0.4, ease: "power3.out" });
        gsap.to(e.currentTarget.querySelector(".db-action-icon"), { rotate: 0, scale: 1, duration: 0.35, ease: "power3.out" });
        gsap.to(e.currentTarget.querySelector(".db-chevron"), { x: 0, duration: 0.3, ease: "power3.out" });
    };

    /* ---------------- Data for the cards / bars ---------------- */
    const cards: {
        label: string;
        icon: LucideIcon;
        from: string;
        to: string;
        badge: string;
        value?: number;
        text?: string;
        textColor?: string;
    }[] = [
        { label: "Total Projects", icon: Briefcase, from: "#a855f7", to: "#8b5cf6", badge: "Live", value: stats?.projects ?? 0 },
        { label: "Form Inquiries", icon: MessageSquare, from: "#ec4899", to: "#f43f5e", badge: "Inbox", value: stats?.messages ?? 0 },
        { label: "Active Skills", icon: Code2, from: "#10b981", to: "#14b8a6", badge: "Synced", value: stats?.skills ?? 0 },
        { label: "Team Members", icon: Users, from: "#6366f1", to: "#4f46e5", badge: "Active", value: stats?.team ?? 0 },
        {
            label: "API Status",
            icon: Activity,
            from: online === false ? "#f43f5e" : "#f59e0b",
            to: online === false ? "#fb7185" : "#f97316",
            badge: latency !== null ? `${latency} ms` : "—",
            text: online === null ? "—" : online ? "Online" : "Offline",
            textColor: online === false ? "text-rose-400" : "text-white",
        },
    ];

    const bars = [
        { label: "Projects", value: stats?.projects ?? 0, from: "#a855f7", to: "#8b5cf6" },
        { label: "Messages", value: stats?.messages ?? 0, from: "#ec4899", to: "#f43f5e" },
        { label: "Skills", value: stats?.skills ?? 0, from: "#10b981", to: "#14b8a6" },
        { label: "Team Members", value: stats?.team ?? 0, from: "#6366f1", to: "#4f46e5" },
    ];
    const hasData = bars.some((b) => b.value > 0);

    return (
        <div ref={rootRef} className="space-y-8">
            {/* ---------- Header row ---------- */}
            <div className="db-head flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                    {updatedAt ? `Last updated ${updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Loading your data..."}
                </p>
                <button
                    type="button"
                    onClick={() => load()}
                    disabled={refreshing}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-purple-500/40 hover:text-white disabled:opacity-60"
                >
                    <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* ---------- Error banner ---------- */}
            {error && (
                <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* ---------- Stat cards ---------- */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {loading
                    ? [0, 1, 2, 3, 4].map((i) => (
                          <div key={i} className="animate-pulse rounded-2xl border border-white/5 bg-[#111114] p-6">
                              <div className="mb-4 flex items-center justify-between">
                                  <div className="h-12 w-12 rounded-xl bg-white/5" />
                                  <div className="h-5 w-14 rounded-full bg-white/5" />
                              </div>
                              <div className="h-4 w-24 rounded bg-white/5" />
                              <div className="mt-3 h-7 w-16 rounded bg-white/5" />
                          </div>
                      ))
                    : cards.map((c) => (
                          <div
                              key={c.label}
                              onMouseEnter={cardEnter}
                              onMouseLeave={cardLeave}
                              className="db-card group relative overflow-hidden rounded-2xl border border-white/5 bg-[#111114] p-6 transition-colors duration-300 hover:border-purple-500/30"
                          >
                              {/* soft tint in the corner */}
                              <div
                                  aria-hidden
                                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 transition-opacity duration-500 group-hover:opacity-40"
                                  style={{ background: `radial-gradient(circle, ${c.from}, transparent 70%)` }}
                              />
                              <div className="relative mb-4 flex items-center justify-between">
                                  <div
                                      className="db-icon flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg"
                                      style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
                                  >
                                      <c.icon size={24} />
                                  </div>
                                  <span className="rounded-full bg-purple-500/10 px-2 py-1 text-xs font-medium text-purple-400">{c.badge}</span>
                              </div>
                              <p className="relative text-sm text-gray-500">{c.label}</p>
                              <h3 className={`relative mt-1 text-3xl font-bold tabular-nums ${c.textColor ?? "text-white"}`}>
                                  {c.value !== undefined ? (
                                      <span className="db-num" data-target={c.value} data-shown="0">
                                          0
                                      </span>
                                  ) : (
                                      c.text
                                  )}
                              </h3>
                          </div>
                      ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* ---------- Content overview (real numbers from the API) ---------- */}
                <div className="db-chart rounded-3xl border border-white/5 bg-[#111114] p-8 lg:col-span-2">
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-xl font-bold text-white">Content Overview</h3>
                        <p className="text-xs text-gray-500">Live data from your database</p>
                    </div>

                    {loading ? (
                        <div className="space-y-6">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="animate-pulse space-y-2">
                                    <div className="h-4 w-24 rounded bg-white/5" />
                                    <div className="h-4 w-full rounded-full bg-white/5" />
                                </div>
                            ))}
                        </div>
                    ) : !hasData ? (
                        <p className="py-16 text-center text-sm text-gray-500">No content yet. Add your first project to see it here.</p>
                    ) : (
                        <div className="space-y-7">
                            {bars.map((b) => (
                                <div key={b.label}>
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-300">{b.label}</span>
                                        <span className="font-bold tabular-nums text-white">{b.value}</span>
                                    </div>
                                    <div className="h-4 w-full overflow-hidden rounded-full bg-white/5">
                                        <div
                                            className="db-bar h-full w-0 rounded-full"
                                            data-value={b.value}
                                            style={{ background: `linear-gradient(90deg, ${b.from}, ${b.to})` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ---------- Quick actions ---------- */}
                <div className="db-actions rounded-3xl border border-white/5 bg-[#111114] p-8">
                    <h3 className="mb-8 text-xl font-bold text-white">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {QUICK_ACTIONS.map(({ icon: Icon, label, href, from, to, external }) => (
                            <Link
                                key={label}
                                href={href}
                                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                onMouseEnter={actionEnter}
                                onMouseLeave={actionLeave}
                                className="db-action group flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-left transition-colors hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                            >
                                <div
                                    className="db-action-icon flex h-10 w-10 items-center justify-center rounded-xl text-white"
                                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                                >
                                    <Icon size={20} />
                                </div>
                                <span className="font-medium text-gray-300 transition-colors group-hover:text-white">{label}</span>
                                <ChevronRight size={16} className="db-chevron ml-auto text-gray-600 transition-colors group-hover:text-gray-300" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}