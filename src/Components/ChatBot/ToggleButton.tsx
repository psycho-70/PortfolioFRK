"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";
import Chatbot from "./ChatBot";

const ChatbotToggle: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        key="chat-launcher"
                        type="button"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => setIsOpen(true)}
                        aria-label="Open portfolio assistant"
                        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-900/30 ring-1 ring-white/20 sm:bottom-6 sm:right-6"
                    >
                        <Bot size={24} />
                        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && <Chatbot onClose={() => setIsOpen(false)} />}
            </AnimatePresence>
        </>
    );
};

export default ChatbotToggle;
