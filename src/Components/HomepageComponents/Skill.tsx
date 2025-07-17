'use client';
import React, { useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useAppContext } from '@/Context/AppContext';

// Type definitions
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

interface Skill {
  name: string;
  level: number;
  icon: string;
}

interface SkillCategory {
  category: string;
  icon: string;
  skills: Skill[];
}

const SkillsShowcase = () => {
  const { darkMode } = useAppContext();
  const controls = useAnimation();
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true});

  // Theme classes object
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

  const nameTexts: string[] = [
    "Full Stack Developer",
    "Frontend Specialist",
    "React Expert", 
    "UI/UX Designer",
    "JavaScript Developer"
  ];

  const skills: SkillCategory[] = [
    {
      category: "Frontend Technologies",
      icon: "🌐",
      skills: [
        { name: "HTML5", level: 95, icon: "🌐" },
        { name: "CSS3", level: 90, icon: "🎨" },
        { name: "Tailwind CSS", level: 88, icon: "💨" },
        { name: "JavaScript", level: 85, icon: "⚡" },
        { name: "TypeScript", level: 80, icon: "📘" },
      ]
    },
    {
      category: "Frontend Frameworks",
      icon: "⚛️",
      skills: [
        { name: "React.js", level: 90, icon: "⚛️" },
        { name: "Next.js", level: 85, icon: "🔺" },
        { name: "Redux", level: 78, icon: "🔄" },
      ]
    },
    {
      category: "Development Tools",
      icon: "🛠️",
      skills: [
        { name: "Git", level: 85, icon: "🌿" },
        { name: "GitHub", level: 88, icon: "🐙" },
        { name: "Jira", level: 75, icon: "📋" },
        { name: "TFS", level: 70, icon: "🔧" },
      ]
    },
    {
      category: "Integration & Design",
      icon: "🎯",
      skills: [
        { name: "API Integration", level: 82, icon: "🔗" },
        { name: "UI Design", level: 85, icon: "🎯" },
        { name: "UX Design", level: 80, icon: "👥" },
      ]
    }
  ];

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [controls, isInView]);

  // Typing Effect Component with TypeScript
  const TypingEffect = ({ texts }: { texts: string[] }) => {
    const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
    const [currentText, setCurrentText] = useState<string>('');
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    useEffect(() => {
      const timeout = setTimeout(() => {
        const fullText = texts[currentTextIndex];
        
        if (isDeleting) {
          setCurrentText(fullText.substring(0, currentText.length - 1));
        } else {
          setCurrentText(fullText.substring(0, currentText.length + 1));
        }

        if (!isDeleting && currentText === fullText) {
          setTimeout(() => setIsDeleting(true), 1000);
        } else if (isDeleting && currentText === '') {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }, isDeleting ? 50 : 100);

      return () => clearTimeout(timeout);
    }, [currentText, isDeleting, texts, currentTextIndex]);

    return (
      <span className={`inline-block ${themeClasses.gradientText} bg-clip-text text-transparent`}>
        {currentText}
        <span className={`animate-pulse ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>|</span>
      </span>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.15 }
    }
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const skillVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className={`relative w-full transition-all duration-700`}>
      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 sm:py-16" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
          }}
          className="text-center mb-12 sm:mb-20"
        >
          <motion.h1 
            className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-6 ${themeClasses.text}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span>I AM{' '}</span>
            <TypingEffect texts={nameTexts} />
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className={`inline-block px-8 py-4 rounded-2xl ${themeClasses.cardBg} border ${themeClasses.cardBorder}`}>
              <p className={`text-sm sm:text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                🚀 Showcasing expertise in modern web development
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
        >
          {skills.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
            //   variants={categoryVariants}
              className={`${themeClasses.cardBg} border ${themeClasses.cardBorder} rounded-3xl p-6 sm:p-8 shadow-lg transition-all duration-500`}
            >
              {/* Category header */}
              <div className="flex items-center space-x-4 mb-8">
                <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <div>
                  <h2 className={`text-xl sm:text-2xl font-bold ${themeClasses.text}`}>
                    {category.category}
                  </h2>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {category.skills.length} technologies
                  </div>
                </div>
              </div>
              
              {/* Skills */}
              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    // variants={skillVariants}
                    className="group/skill relative"
                  >
                    {/* Skill header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
                          <span className="text-lg">{skill.icon}</span>
                        </div>
                        <div>
                          <span className={`font-semibold text-sm sm:text-base ${themeClasses.text}`}>
                            {skill.name}
                          </span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {skill.level}%
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className={`relative w-full h-4 rounded-full overflow-hidden ${
                      darkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'
                    }`}>
                      <motion.div
                        className={`absolute top-0 left-0 h-full ${themeClasses.skillGradient} rounded-full`}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{
                          duration: 2,
                          delay: categoryIndex * 0.3 + skillIndex * 0.15,
                          ease: "easeOut"
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8 } }
          }}
          className="mt-16 sm:mt-20 text-center"
        >
          <div className={`inline-flex items-center space-x-6 px-8 py-4 rounded-2xl ${themeClasses.cardBg} border ${themeClasses.cardBorder}`}>
            <div className="flex items-center space-x-2">
              <motion.div 
                className="w-3 h-3 bg-green-500 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(34, 197, 94, 0.7)",
                    "0 0 0 10px rgba(34, 197, 94, 0)",
                    "0 0 0 0 rgba(34, 197, 94, 0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Available for Projects
              </span>
            </div>
            <div className={`w-px h-6 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            <span className={`text-sm font-bold ${themeClasses.text}`}>
              {skills.reduce((total, cat) => total + cat.skills.length, 0)} Technologies Mastered
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SkillsShowcase;