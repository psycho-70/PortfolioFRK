'use client';
import React, { useState, useEffect, useRef } from "react";
import Services from "./Services";
// import About from "@/components/About";
import Home from "./Home";
import Skill from "./Skill";
import Project from "./Project";
import Comments from "./Comments";
import TeamMemberCard from "./TeamMember";
import { useAppContext } from "@/Context/AppContext";
import PageWithFixedBackground from "./Adress";
import WorkExperienceShowcase from "./WorkExperience";
import Chatbot from "../ChatBot/ChatBot";
import { motion } from 'framer-motion';
import { SmartToy, Close } from '@mui/icons-material';

interface ThemeClasses {
  background: string;
  text: string;
  cardBg: string;
  cardBorder: string;
  modalBg: string;
  buttonPrimary: string;
  buttonSecondary: string;
  gradientText: string;
  skillGradient: string;
}

const Page: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [terminalText, setTerminalText] = useState<string>("");
  const [showModeQuestion, setShowModeQuestion] = useState<boolean>(false);
  const [waitingForUser, setWaitingForUser] = useState<boolean>(false);
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { darkMode, toggleDarkMode } = useAppContext();

  const themeClasses: ThemeClasses = {
    background: darkMode
      ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900'
      : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
    text: darkMode ? 'text-white' : 'text-gray-900',
    cardBg: darkMode ? 'bg-white/10' : 'bg-white/80',
    cardBorder: darkMode ? 'border-white/20' : 'border-gray-200',
    modalBg: darkMode ? 'bg-black/90' : 'bg-white/95',
    buttonPrimary: darkMode
      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
    buttonSecondary: darkMode
      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
      : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600',
    gradientText: darkMode
      ? 'bg-gradient-to-r from-purple-400 to-pink-400'
      : 'bg-gradient-to-r from-blue-600 to-purple-600',
    skillGradient: darkMode
      ? 'bg-gradient-to-r from-green-400 to-blue-400'
      : 'bg-gradient-to-r from-blue-600 to-purple-600',
  };

  useEffect(() => {
    const fullText: string[] = [
      "> Initializing system...",
      "> Welcome to my World...",
      "> Checking display preferences..."
    ];

    let currentText: string = "";
    let lineIndex: number = 0;
    let charIndex: number = 0;

    const type = () => {
      if (lineIndex >= fullText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setShowModeQuestion(true);
        setWaitingForUser(true);
        return;
      }

      const line: string = fullText[lineIndex];

      if (charIndex < line.length) {
        currentText += line[charIndex];
        setTerminalText(currentText);
        charIndex++;
      } else {
        currentText += "\n";
        setTerminalText(currentText);
        lineIndex++;
        charIndex = 0;
      }
    };

    intervalRef.current = setInterval(type, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleModeSelection = (selectedDarkMode: boolean): void => {
    if (selectedDarkMode !== darkMode) {
      toggleDarkMode();
    }
    setShowModeQuestion(false);
    setTerminalText(prev => prev + "\n> Preference saved. Loading interface...");
    setWaitingForUser(false);
    timeoutRef.current = setTimeout(() => setLoading(false), 2000);
  };

  if (loading) {
    return (
      <div className={`fixed inset-0 text-2xl ${darkMode ? 'bg-black text-green-400' : 'bg-white text-gray-800'} font-mono flex flex-col items-center justify-center p-8 z-50`}>
        <div className="terminal-text whitespace-pre mb-4">
          {terminalText}
          {!waitingForUser && <span className="animate-pulse">_</span>}
        </div>

        {showModeQuestion && (
          <div className="mt-6 text-center animate-fade-in">
            <p className="mb-4">Select your preferred interface mode:</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleModeSelection(true)}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                🌙 Dark Mode
              </button>
              <button
                onClick={() => handleModeSelection(false)}
                className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ☀️ Light Mode
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen overflow-x-hidden dark:bg-gray-900 dark:text-white">
        <div id="home">
          <Home />
          <PageWithFixedBackground />
        </div>
        <div id="about">
          {/* <About /> */}
        </div>
        <div className={`bg-gradient-to-br ${themeClasses.background} ${themeClasses.text}`}>
          <div id="skill">
            <Skill />
          </div>
          <div id="Experince">
            <WorkExperienceShowcase />
          </div>
          <div id="project">
            <Project />
          </div>
          <div id="services">
            <Services />
          </div>
          <div id="team">
            <TeamMemberCard />
          </div>
          <div id="comments">
            <Comments />
          </div>
        </div>

        {/* Chatbot Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowChatbot(!showChatbot)}
          className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-40 ${
            darkMode ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
          }`}
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
    </div>
  );
};

export default Page;