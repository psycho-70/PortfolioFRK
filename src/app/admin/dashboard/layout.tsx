"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Briefcase,
    Code2,
    MessageSquare,
    Users,
    Settings,
    LogOut,
    Bell,
    Search,
    ShieldCheck as ShieldCheckIcon
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
    };

    const navItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/admin/dashboard" },
        { id: "projects", label: "Projects", icon: Briefcase, path: "/admin/dashboard/projects" },
        { id: "skills", label: "Skills", icon: Code2, path: "/admin/dashboard/skills" },
        { id: "messages", label: "Messages", icon: MessageSquare, path: "/admin/dashboard/messages" },
        { id: "team", label: "Team", icon: Users, path: "/admin/dashboard/team" },
        { id: "experience", label: "Experience", icon: Users, path: "/admin/dashboard/experience" },
        { id: "settings", label: "Settings", icon: Settings, path: "/admin/dashboard/settings" },
    ];

    const activeItem = navItems.find(item => item.path === pathname) || navItems[0];

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-gray-300 font-sans flex overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="h-screen bg-[#111114] border-r border-white/5 flex flex-col relative z-50"
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                        <ShieldCheckIcon size={20} />
                    </div>
                    {isSidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-bold text-white text-lg tracking-tight"
                        >
                            ANTIGRAVITY
                        </motion.span>
                    )}
                </div>

                <nav className="flex-1 mt-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.id}
                                href={item.path}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? "bg-purple-600/10 text-purple-400 border border-purple-500/20"
                                    : "hover:bg-white/5 text-gray-500 hover:text-gray-300"
                                    }`}
                            >
                                <Icon size={20} className={isActive ? "text-purple-400" : ""} />
                                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                                {isActive && isSidebarOpen && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-purple-600 rounded-full items-center justify-center text-white border-4 border-[#0a0a0c]"
                    >
                        <motion.span animate={{ rotate: isSidebarOpen ? 0 : 180 }}>
                            <ChevronRight size={12} />
                        </motion.span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative h-screen bg-[#0a0a0c]">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#0a0a0c]/80 backdrop-blur-xl z-40">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-white">
                            {activeItem.label}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-64"
                            />
                        </div>
                        <button className="relative text-gray-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#0a0a0c]" />
                        </button>
                        <div className="h-8 w-[1px] bg-white/10" />
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-white leading-none">Furqan Khattak</p>
                                <p className="text-xs text-gray-500 mt-1">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-[2px]">
                                <div className="w-full h-full rounded-full bg-[#111114] flex items-center justify-center text-white font-bold">
                                    FK
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content Area */}
                <div className="p-8 pb-20">
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
    );
}

// Helper components missing from layout scope
function ChevronRight({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}
