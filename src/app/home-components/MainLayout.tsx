'use client';
import React, { useState } from 'react';
import HeroSection from "./HeroSection";
import { useAppContext } from "@/Context/AppContext";
import ContactContent from "./ContactContent";
import Chatbot from "@/Components/ChatBot/ChatBot";
import { motion } from 'framer-motion';
import { SmartToy, Close } from '@mui/icons-material';
import MetricsStrip from "./MetricsStrip";
import TechStack from "./TechStack";
import Iconlist from './IconList';
import TestimonialsSection from './Testimonal';

const MainLayout: React.FC = () => {
    const [showChatbot, setShowChatbot] = useState<boolean>(false);
    const { darkMode } = useAppContext();

    return (
        <div className="relative  mx-auto overflow-x-hidden">

            <HeroSection />

            <div className="w-full mt-20 z-10">
                <Iconlist />
            </div>
            <div className="w-full px-4 py-12 flex flex-col items-center gap-16">
                <MetricsStrip />
            </div>

            <TechStack />

            <div id="contact_preview">
                <ContactContent />
                <TestimonialsSection />
            </div>

            {/* Chatbot Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowChatbot(!showChatbot)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-40 ${darkMode ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                    }`}
                aria-label="Toggle chatbot"
            >
                {showChatbot ? <Close /> : <SmartToy />}
            </motion.button>

            {/* Chatbot Component */}
            {showChatbot && (
                <Chatbot
                    onClose={() => setShowChatbot(false)}
                    darkMode={darkMode}
                />
            )}
        </div>
    );
};

export default MainLayout;
