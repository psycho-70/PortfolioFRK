"use client";
import React, { useState, useEffect } from "react";
import {
    MessageSquare,
    Trash2,
    Mail,
    Heart,
    Calendar,
    Search,
    RefreshCw,
    ExternalLink,
    AlertCircle
} from "lucide-react";

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject?: string;
    message?: string;
    comment?: string;
    likes?: number;
    createdAt?: string;
}

export default function MessagePage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const fetchMessages = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_URL}/api/contacts`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                // sort most recent first
                const sorted = data.sort((a, b) => {
                    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return timeB - timeA;
                });
                setMessages(sorted);
            } else {
                setError(data?.error || "Could not fetch messages");
            }
        } catch (err: any) {
            console.error("Error fetching messages:", err);
            setError("Failed to reach server");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;

        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(`${API_URL}/api/contacts/${id}`, {
                method: "DELETE",
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (res.ok) {
                setMessages((prev) => prev.filter((m) => m.id !== id));
            } else {
                alert("Failed to delete message");
            }
        } catch (err) {
            console.error("Error deleting contact message:", err);
        }
    };

    const formatDate = (isoStr?: string) => {
        if (!isoStr) return "Recent";
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) return isoStr;
        return d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getInitials = (name: string) =>
        name
            .replace(/\./g, " ")
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "FK";

    const filtered = messages.filter((m) => {
        const text = `${m.name} ${m.email} ${m.subject || ""} ${m.message || m.comment || ""}`.toLowerCase();
        return text.includes(searchQuery.toLowerCase());
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <MessageSquare className="text-pink-400" size={28} />
                        Client Inquiries &amp; Messages
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                        Review submissions from your contact form and feedback comments
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={fetchMessages}
                        title="Refresh"
                        className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-gray-400 hover:text-white hover:border-purple-500/30 transition-all"
                    >
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <span className="rounded-full bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-400 border border-pink-500/20">
                        {messages.length} Total
                    </span>
                </div>
            </div>

            {/* Search filter */}
            <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by sender, email or message..."
                    className="w-full bg-[#111114] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                />
            </div>

            {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Messages list */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-[#111114] border border-white/5 p-6 rounded-2xl h-36" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-[#111114] border border-white/5 rounded-3xl p-16 text-center">
                    <MessageSquare className="mx-auto text-gray-600 mb-4" size={48} />
                    <h4 className="text-lg font-bold text-white">No inquiries found</h4>
                    <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
                        {searchQuery ? "No matches found for your query." : "Messages sent through your contact form will appear here."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((item, idx) => {
                        const content = item.message || item.comment || "";
                        return (
                            <div
                                key={item.id || idx}
                                className="group bg-[#111114] border border-white/5 hover:border-pink-500/30 p-6 rounded-2xl transition-all duration-300 flex flex-col md:flex-row items-start gap-5 justify-between"
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <div
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md ${
                                            idx % 3 === 0
                                                ? "bg-gradient-to-br from-pink-500 to-purple-600"
                                                : idx % 3 === 1
                                                ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                                                : "bg-gradient-to-br from-indigo-500 to-cyan-500"
                                        }`}
                                    >
                                        {getInitials(item.name)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-white font-bold text-base">{item.name}</h4>
                                                {item.subject && (
                                                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[11px] font-medium text-purple-300 border border-white/10">
                                                        {item.subject}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                                <Calendar size={13} />
                                                {formatDate(item.createdAt)}
                                            </span>
                                        </div>

                                        <a
                                            href={`mailto:${item.email}`}
                                            className="text-pink-400 hover:text-pink-300 text-xs font-semibold transition-colors block mb-3"
                                        >
                                            {item.email}
                                        </a>

                                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                            {content}
                                        </p>

                                        {typeof item.likes === "number" && item.likes > 0 && (
                                            <div className="mt-3 flex items-center gap-1 text-xs text-rose-400 font-semibold">
                                                <Heart size={14} className="fill-rose-500 text-rose-500" />
                                                <span>{item.likes} {item.likes === 1 ? "like" : "likes"}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 self-end md:self-start pt-2 md:pt-0">
                                    <a
                                        href={`mailto:${item.email}?subject=${encodeURIComponent(
                                            `Re: ${item.subject || "Your Portfolio Inquiry"}`
                                        )}`}
                                        className="px-3.5 py-1.5 rounded-xl bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
                                    >
                                        <Mail size={14} />
                                        Reply
                                    </a>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                                        title="Delete message"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
