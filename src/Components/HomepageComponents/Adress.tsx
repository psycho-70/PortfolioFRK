'use client';
import React, { useEffect } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { useAppContext } from '@/Context/AppContext';


const PageWithFixedBackground = () => {
  const controls = useAnimation();
  const { darkMode } = useAppContext();

  // Scroll animation handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > 100) {
        controls.start({
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, staggerChildren: 0.3 },
        });
      } else {
        controls.start({
          opacity: 0,
          y: 50,
          transition: { duration: 0.8, staggerChildren: 0.3 },
        });
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [controls]);

  const cardVariants:any = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={`relative w-full max-w-screen mx-auto transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`} style={{ minHeight: "508px" }}>
      {/* Background Layer with gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: darkMode 
            ? `
                linear-gradient(135deg, rgba(30, 30, 46, 0.8) 0%, rgba(45, 45, 80, 0.8) 100%),
                url('/Blue Modern.png'), 
                url('/Blue Modern.png')
              `
            : `
                linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.4) 100%),
                url('/Blue Modern.png'), 
                url('/Blue Modern.png')
              `,
          backgroundSize: "cover, cover, cover",
          backgroundPosition: "center, left, left",
          backgroundRepeat: "no-repeat, no-repeat, no-repeat",
          backgroundAttachment: "fixed, fixed, fixed",
          zIndex: 0,
        }}
      ></div>

      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-white'} opacity-20`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 min-h-full flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="relative flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 container w-full max-w-6xl">
          {/* University Education Section */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={cardVariants}
            whileHover="hover"
            className={`flex flex-col items-center backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl border transition-all duration-300 w-full sm:w-[280px] lg:w-[320px] ${
              darkMode 
                ? 'bg-gray-800/90 border-gray-700/30 hover:bg-gray-800/95' 
                : 'bg-white/90 border-white/20 hover:bg-white/95'
            }`}
          >
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3 text-center">
              Higher Education
            </h2>
            <p className={`text-sm sm:text-base lg:text-lg font-semibold mb-2 text-center ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              BS Software Engineering
            </p>
            <p className={`text-xs sm:text-sm lg:text-base text-center leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Kohat University of Science and Technology
            </p>
          </motion.div>

          {/* College Education Section */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={cardVariants}
            whileHover="hover"
            className={`flex flex-col items-center backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl border transition-all duration-300 w-full sm:w-[280px] lg:w-[320px] ${
              darkMode 
                ? 'bg-gray-800/90 border-gray-700/30 hover:bg-gray-800/95' 
                : 'bg-white/90 border-white/20 hover:bg-white/95'
            }`}
          >
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2 sm:mb-3 text-center">
              College Education
            </h2>
            <p className={`text-sm sm:text-base lg:text-lg font-semibold mb-2 text-center ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              FSc in ICS
            </p>
            <p className={`text-xs sm:text-sm lg:text-base text-center leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Wisdom College, Karak
            </p>
          </motion.div>

          {/* Address Section */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={cardVariants}
            whileHover="hover"
            className={`flex flex-col items-center backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl border transition-all duration-300 w-full sm:w-[280px] lg:w-[320px] ${
              darkMode 
                ? 'bg-gray-800/90 border-gray-700/30 hover:bg-gray-800/95' 
                : 'bg-white/90 border-white/20 hover:bg-white/95'
            }`}
          >
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 sm:mb-3 text-center">
              Address
            </h2>
            <p className={`text-xs sm:text-sm lg:text-base text-center leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              District Karak, Village Ambirikalla
            </p>
          </motion.div>
        </div>
      </div>

      {/* Dark Mode Toggle Button (Optional - for testing) */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => {}} // You can add toggleDarkMode here if needed
          className={`p-2 rounded-full transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          } shadow-lg`}
        >
          {darkMode ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default PageWithFixedBackground;