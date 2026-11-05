"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { useAppContext } from "@/Context/AppContext";

interface Message {
    text: string;
    sender: "user" | "ai";
    id: string;
    sources?: string[];
}

interface ChatbotProps {
    onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_DEPLOYMENT_URL

const SUGGESTIONS = [
    "What projects has Furqan built?",
    "What are his top skills?",
    "Tell me about his experience",
    "How can I hire him?",
];

const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

function renderRich(text: string) {
    const clean = text.replace(/<br\s*\/?>/gi, "\n").replace(/<\/?[a-z][^>]*>/gi, "");
    const parts = clean.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+)/g);
    return parts.map((part, index) => {
        if (!part) return null;
        const bold = part.match(/^\*\*(.+)\*\*$/);
        if (bold) return <strong key={index} className="font-semibold">{bold[1]}</strong>;
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
            return (
                <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                    {link[1]}
                </a>
            );
        }
        if (/^https?:\/\//.test(part)) {
            return (
                <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="break-all underline underline-offset-2">
                    {part}
                </a>
            );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
    });
}

export default function Chatbot({ onClose }: ChatbotProps) {
    const { darkMode } = useAppContext();
    const [messages, setMessages] = useState<Message[]>([
        {
            text: "Hi! I'm Furqan's AI assistant. Ask me about his projects, skills, experience, or services.",
            sender: "ai",
            id: "welcome",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll only the message list. scrollIntoView() also moves the page
    // (and fights Lenis), which made the panel look frozen.
    useEffect(() => {
        const panel = scrollRef.current;
        if (!panel) return;
        panel.scrollTo({ top: panel.scrollHeight, behavior: "smooth" });
    }, [messages, isLoading]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const send = async (raw: string) => {
        const text = raw.trim();
        if (!text || isLoading) return;

        const history = messages.map((m) => ({
            role: m.sender === "ai" ? "assistant" : "user",
            content: m.text,
        }));

        setMessages((prev) => [...prev, { text, sender: "user", id: uid() }]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/chatbot`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: history, currentInput: text }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok || !data?.success) {
                throw new Error(data?.error || `Request failed (${res.status})`);
            }

            setMessages((prev) => [
                ...prev,
                {
                    text: data.response,
                    sender: "ai",
                    id: uid(),
                    sources: Array.isArray(data.toolsUsed) ? data.toolsUsed : [],
                },
            ]);
        } catch (error) {
            const message =
                error instanceof Error && error.message
                    ? error.message
                    : "I couldn't reach the server. Please try again in a moment.";
            setMessages((prev) => [
                ...prev,
                { text: `Sorry — ${message}`, sender: "ai", id: uid() },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send(input);
        }
    };

    const showSuggestions = messages.length === 1 && !isLoading;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            role="dialog"
            aria-label="Portfolio assistant"
            className={`fixed inset-x-0 bottom-0 z-[60] flex h-[75dvh] w-full flex-col overflow-hidden rounded-t-3xl border shadow-2xl sm:inset-x-auto sm:bottom-0 sm:right-6 sm:h-[600px] sm:max-h-[calc(100dvh-7rem)] sm:w-[420px] sm:rounded-3xl ${
                darkMode
                    ? "border-white/10 bg-[#0d0e12] text-slate-100 shadow-black/50"
                    : "border-slate-200 bg-white text-slate-800 shadow-slate-300/40"
            }`}
        >
            {/* Header */}
            <div className="flex shrink-0 items-center gap-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 py-3.5 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                    <Bot size={21} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold leading-tight">Portfolio Assistant</p>
                    <p className="flex items-center gap-1.5 text-[11px] text-white/80">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />
                        AI agent · live portfolio data
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close chatbot"
                    className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                data-lenis-prevent
                data-lenis-prevent-wheel
                aria-live="polite"
                className={`custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-3.5 py-4 ${darkMode ? "bg-[#0a0b0e]" : "bg-slate-50"}`}
            >
                <AnimatePresence initial={false}>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {message.sender === "ai" && (
                                <div className={`mr-2 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${darkMode ? "bg-purple-500/15 text-purple-300" : "bg-purple-100 text-purple-600"}`}>
                                    <Sparkles size={14} />
                                </div>
                            )}
                            <div
                                className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                                    message.sender === "user"
                                        ? "rounded-br-md bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                                        : darkMode
                                        ? "rounded-bl-md border border-white/5 bg-[#181a20] text-slate-200"
                                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                                }`}
                            >
                                {renderRich(message.text)}
                                {message.sender === "ai" && (message.sources?.length ?? 0) > 0 && (
                                    <div
                                        className={`mt-2 flex flex-wrap gap-1 border-t pt-1.5 text-[10px] ${
                                            darkMode
                                                ? "border-white/5 text-slate-500"
                                                : "border-slate-200 text-slate-400"
                                        }`}
                                    >
                                        {message.sources!.map((source) => (
                                            <span
                                                key={source}
                                                className={`rounded-full px-1.5 py-0.5 ${
                                                    darkMode ? "bg-white/5" : "bg-slate-100"
                                                }`}
                                            >
                                                {source.replace(/_/g, " ")}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {showSuggestions && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {SUGGESTIONS.map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => send(suggestion)}
                                className={`rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors ${
                                    darkMode
                                        ? "border-purple-500/25 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20"
                                        : "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
                                }`}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className={`ml-9 flex items-center gap-1 rounded-2xl rounded-bl-md px-3.5 py-3 ${darkMode ? "bg-[#181a20]" : "border border-slate-200 bg-white"} `}>
                            {[0, 1, 2].map((dot) => (
                                <span
                                    key={dot}
                                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400"
                                    style={{ animationDelay: `${dot * 120}ms` }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div
                className={`shrink-0 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] ${
                    darkMode ? "border-white/5 bg-[#0d0e12]" : "border-slate-200 bg-white"
                }`}
            >
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        maxLength={2000}
                        placeholder="Ask about projects, skills, experience…"
                        aria-label="Message"
                        className={`min-w-0 flex-1 rounded-xl border px-3.5 py-2.5 text-base outline-none transition-colors disabled:opacity-60 sm:text-sm ${
                            darkMode
                                ? "border-white/10 bg-[#14161b] text-slate-100 placeholder:text-slate-500 focus:border-purple-500/60"
                                : "border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-purple-400"
                        }`}
                    />
                    <button
                        type="button"
                        onClick={() => send(input)}
                        disabled={isLoading || !input.trim()}
                        aria-label="Send message"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Send size={17} />
                    </button>
                </div>
                <p className={`mt-2 text-center text-[10px] ${darkMode ? "text-slate-600" : "text-slate-400"}`}>
                    Answers use live data from Furqan's portfolio database
                </p>
            </div>
        </motion.div>
    );
}
