"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    LayoutDashboard,
    Briefcase,
    Code2,
    MessageSquare,
    Users,
    Building2,
    Settings,
    LogOut,
    Bell,
    Search,
    ShieldCheck,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/Context/AppContext";
import { clearAdminToken, getAdminToken } from "@/lib/adminAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { darkMode, toggleDarkMode } = useAppContext();

    useEffect(() => {
        const token = getAdminToken();
        if (!token) {
            router.push("/admin/login");
        }
    }, [router]);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        clearAdminToken();
        router.push("/admin/login");
    };

    const navItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/admin/dashboard" },
        { id: "projects", label: "Projects", icon: Briefcase, path: "/admin/dashboard/projects" },
        { id: "skills", label: "Skills", icon: Code2, path: "/admin/dashboard/skills" },
        { id: "messages", label: "Messages", icon: MessageSquare, path: "/admin/dashboard/messages" },
        { id: "team", label: "Team", icon: Users, path: "/admin/dashboard/team" },
        { id: "experience", label: "Experience", icon: Building2, path: "/admin/dashboard/experience" },
        { id: "settings", label: "Settings", icon: Settings, path: "/admin/dashboard/settings" },
    ];

    const activeItem = navItems.find((item) => item.path === pathname) || navItems[0];
    const showLabels = !collapsed || mobileOpen;

    return (
        <div className="admin-root flex h-[100dvh] w-full overflow-hidden bg-[var(--admin-bg)] text-[var(--admin-text)]">
            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.button
                        key="admin-overlay"
                        type="button"
                        aria-label="Close menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-[268px] shrink-0 flex-col border-r border-[var(--admin-border-soft)] bg-[var(--admin-panel)] transition-transform duration-300 md:static md:translate-x-0 ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                } ${collapsed ? "md:w-[80px]" : "md:w-[268px]"}`}
            >
                <div className={`flex h-16 shrink-0 items-center gap-3 border-b border-[var(--admin-border-soft)] px-5 md:h-20 ${collapsed ? "md:justify-center md:px-3" : ""}`}>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/20">
                        <ShieldCheck size={20} />
                    </div>
                    {showLabels && (
                        <div className="min-w-0">
                            <p className="truncate text-base font-bold tracking-tight text-[var(--admin-text)]">Dashboard</p>
                            <p className="text-[10px] font-medium uppercase tracking-widest text-[var(--admin-muted)]">Admin panel</p>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="ml-auto rounded-lg p-2 text-[var(--admin-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)] md:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="admin-scroll flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.id}
                                href={item.path}
                                title={item.label}
                                className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 transition-all duration-200 ${
                                    collapsed ? "md:justify-center md:px-0" : ""
                                } ${
                                    isActive
                                        ? "border border-purple-500/20 bg-purple-600/10 text-purple-500 dark:text-purple-400"
                                        : "border border-transparent text-[var(--admin-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]"
                                }`}
                            >
                                <Icon size={20} className="shrink-0" />
                                {showLabels && <span className="truncate font-medium">{item.label}</span>}
                                {isActive && showLabels && (
                                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500 dark:bg-purple-400" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto shrink-0 space-y-1 border-t border-[var(--admin-border-soft)] p-3">
                    <button
                        type="button"
                        onClick={toggleDarkMode}
                        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                        className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-[var(--admin-muted)] transition-colors hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)] ${
                            collapsed ? "md:justify-center md:px-0" : ""
                        }`}
                    >
                        {darkMode ? <Sun size={20} className="shrink-0" /> : <Moon size={20} className="shrink-0" />}
                        {showLabels && <span className="font-medium">{darkMode ? "Light mode" : "Dark mode"}</span>}
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        title="Logout"
                        className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-red-500 transition-colors hover:bg-red-500/10 ${
                            collapsed ? "md:justify-center md:px-0" : ""
                        }`}
                    >
                        <LogOut size={20} className="shrink-0" />
                        {showLabels && <span className="font-medium">Logout</span>}
                    </button>

                    <button
                        type="button"
                        onClick={() => setCollapsed((v) => !v)}
                        className="mt-1 hidden w-full items-center justify-center gap-2 rounded-xl border border-[var(--admin-border-soft)] px-3 py-2 text-xs font-medium text-[var(--admin-muted)] transition-colors hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)] md:flex"
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        {!collapsed && <span>Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* Main column */}
            <div className="flex min-w-0 flex-1 flex-col">
                <header className="z-30 flex h-16 shrink-0 items-center gap-3 border-b border-[var(--admin-border-soft)] bg-[var(--admin-bg)]/85 px-4 backdrop-blur-xl md:h-20 md:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className="rounded-xl border border-[var(--admin-border-soft)] p-2.5 text-[var(--admin-muted)] transition-colors hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)] md:hidden"
                        aria-label="Open sidebar"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="min-w-0">
                        <h1 className="truncate text-lg font-bold text-[var(--admin-text)] md:text-xl">{activeItem.label}</h1>
                        <p className="hidden text-xs text-[var(--admin-muted)] sm:block">Manage your portfolio content</p>
                    </div>

                    <div className="ml-auto flex items-center gap-2 sm:gap-4">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]" size={17} />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-56 rounded-full border border-[var(--admin-border)] bg-[var(--admin-soft)] py-2 pl-9 pr-4 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-faint)] focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/30 xl:w-64"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={toggleDarkMode}
                            className="rounded-xl border border-[var(--admin-border-soft)] p-2.5 text-[var(--admin-muted)] transition-colors hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]"
                            aria-label="Toggle theme"
                        >
                            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
                        </button>

                        <button
                            type="button"
                            className="relative rounded-xl border border-[var(--admin-border-soft)] p-2.5 text-[var(--admin-muted)] transition-colors hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]"
                            aria-label="Notifications"
                        >
                            <Bell size={19} />
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-purple-500" />
                        </button>

                        <div className="flex items-center gap-3 border-l border-[var(--admin-border-soft)] pl-2 sm:pl-4">
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-semibold leading-none text-[var(--admin-text)]">Furqan Khattak</p>
                                <p className="mt-1 text-xs text-[var(--admin-muted)]">Super Admin</p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-[2px] sm:h-10 sm:w-10">
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-[var(--admin-panel)] text-xs font-bold text-[var(--admin-text)] sm:text-sm">
                                    FK
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main id="admin-scroll" className="admin-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
                    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 pb-24 sm:px-6 lg:px-8">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}
