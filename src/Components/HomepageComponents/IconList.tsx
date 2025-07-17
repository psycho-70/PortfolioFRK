'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { 
  Smile, 
  Rocket, 
  Trophy, 
  Clock, 
  Star, 
  Code, 
  ThumbsUp, 
  Palette,
  ChevronLeft,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { useAppContext } from '@/Context/AppContext';

// Type definitions
interface CounterValues {
  experience: number;
  projects: number;
  clients: number;
  awards: number;
  lines: number;
  frameworks: number;
  satisfaction: number;
  designs: number;
}

interface MetricItem {
  icon: React.ReactElement;
  value: number;
  label: string;
  description: string;
}

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren" as const,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0
  })
};

const Iconlist: React.FC = () => {
  const { darkMode } = useAppContext();
//   const controls: AnimationControls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [countersVisible, setCountersVisible] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [autoSlide, setAutoSlide] = useState<boolean>(true);
  const [counters, setCounters] = useState<CounterValues>({
    experience: 0,
    projects: 0,
    clients: 0,
    awards: 0,
    lines: 0,
    frameworks: 0,
    satisfaction: 0,
    designs: 0
  });

  const targetValues: CounterValues = {
    experience: 2,
    projects: 7,
    clients: 8,
    awards: 5,
    lines: 50,
    frameworks: 12,
    satisfaction: 98,
    designs: 15
  };

  // Auto slide effect for mobile
  useEffect(() => {
    if (!autoSlide) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 2) % metrics.length);
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [autoSlide]);

  const handleScroll = useCallback(() => {
    const element = document.getElementById('experience-metrics');
    if (element && !hasAnimated) {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight * 0.75 && elementBottom > 0) {
        triggerAnimations();
      }
    }
  }, [hasAnimated]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const triggerAnimations = (): void => {
    setHasAnimated(true);
    // controls.start("visible");
    startCounting();
  };

  const startCounting = (): void => {
    setCountersVisible(true);
    const duration = 2000;
    const interval = 50;
    
    Object.keys(targetValues).forEach((key) => {
      const typedKey = key as keyof CounterValues;
      const target = targetValues[typedKey];
      const step = target / (duration / interval);
      let current = 0;
      
      const counterInterval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(counterInterval);
        }
        
        setCounters(prev => ({
          ...prev,
          [typedKey]: Math.floor(current)
        }));
      }, interval);
    });
  };

  const metrics: MetricItem[] = [
    {
      icon: <Clock size={32} />,
      value: counters.experience,
      label: "Years Experience",
      description: "Professional Journey"
    },
    {
      icon: <Rocket size={32} />,
      value: counters.projects,
      label: "Projects",
      description: "Completed Successfully"
    },
    {
      icon: <Smile size={32} />,
      value: counters.clients,
      label: "Happy Clients",
      description: "Satisfied Customers"
    },
    {
      icon: <Trophy size={32} />,
      value: counters.awards,
      label: "Awards",
      description: "Recognition Earned"
    },
    {
      icon: <Code size={32} />,
      value: counters.lines,
      label: "K+ Lines of Code",
      description: "Clean & Efficient"
    },
    {
      icon: <Star size={32} />,
      value: counters.frameworks,
      label: "Frameworks",
      description: "Mastered Technologies"
    },
    {
      icon: <ThumbsUp size={32} />,
      value: counters.satisfaction,
      label: "% Satisfaction",
      description: "Client Feedback"
    },
    {
      icon: <Palette size={32} />,
      value: counters.designs,
      label: "UI Designs",
      description: "Creative Solutions"
    }
  ];

  const nextSlide = (): void => {
    setAutoSlide(false);
    setCurrentSlide((prev) => (prev + 2) % metrics.length);
    setTimeout(() => setAutoSlide(true), 5000);
  };

  const prevSlide = (): void => {
    setAutoSlide(false);
    setCurrentSlide((prev) => (prev - 2 + metrics.length) % metrics.length);
    setTimeout(() => setAutoSlide(true), 5000);
  };

  const goToSlide = (index: number): void => {
    setAutoSlide(false);
    setCurrentSlide(index * 2);
    setTimeout(() => setAutoSlide(true), 5000);
  };

  const getMetricSuffix = (label: string): string => {
    if (label.includes('Lines')) return 'K+';
    if (label.includes('Satisfaction')) return '%';
    return '+';
  };

  return (
    <div id="experience-metrics" className={`py-16 w-full mx-auto relative overflow-hidden`}>
      <motion.div
        // initial="hidden"
        // animate={controls}
        variants={containerVariants}
        className="px-4 max-w-6xl mx-auto relative z-10"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            My Journey
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Transforming ideas into digital experiences with passion and precision
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
            //   variants={itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="group cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative overflow-hidden rounded-2xl p-6 h-64 flex flex-col items-center justify-center
                  ${darkMode ? 'bg-gray-800' : 'bg-white'}
                  ${hoveredIndex === index ? 'shadow-xl' : 'shadow-md'}
                  border ${darkMode ? 'border-gray-700' : 'border-gray-200'}
                  transition-all duration-300 ease-out
                `}
              >
                {/* Icon */}
                <div className={`mb-4 p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${hoveredIndex === index ? (darkMode ? 'text-blue-400' : 'text-blue-600') : (darkMode ? 'text-gray-300' : 'text-gray-600')}`}>
                  {metric.icon}
                </div>

                {/* Counter */}
                <motion.div
                  className="text-center mb-3"
                  animate={countersVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className={`font-bold text-3xl mb-1 ${hoveredIndex === index ? (darkMode ? 'text-blue-400' : 'text-blue-600') : (darkMode ? 'text-white' : 'text-gray-800')}`}>
                    {metric.value}
                    {getMetricSuffix(metric.label)}
                  </div>
                </motion.div>

                {/* Label */}
                <div className="text-center">
                  <div className={`text-sm font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {metric.label}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {metric.description}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Mobile/Tablet Slider */}
        <div className="lg:hidden relative">
          <div className="overflow-hidden">
            <motion.div 
              className="flex"
              animate={{
                x: `-${currentSlide * 50}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  custom={index % 2 === 0 ? 1 : -1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="w-1/2 flex-shrink-0 px-2"
                >
                  <motion.div
                    // variants={itemVariants}
                    className={`
                      relative overflow-hidden rounded-2xl p-6 h-64 flex flex-col items-center justify-center
                      ${darkMode ? 'bg-gray-800' : 'bg-white'}
                      shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'}
                      transition-all duration-300 ease-out
                    `}
                  >
                    {/* Icon */}
                    <div className={`mb-4 p-3 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      {metric.icon}
                    </div>

                    {/* Counter */}
                    <motion.div
                      className="text-center mb-3"
                      animate={countersVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <div className={`font-bold text-3xl mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {metric.value}
                        {getMetricSuffix(metric.label)}
                      </div>
                    </motion.div>

                    {/* Label */}
                    <div className="text-center">
                      <div className={`text-sm font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {metric.label}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {metric.description}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 p-2 rounded-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 p-2 rounded-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.ceil(metrics.length / 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  Math.floor(currentSlide / 2) === index
                    ? (darkMode ? 'bg-blue-400' : 'bg-blue-600')
                    : (darkMode ? 'bg-gray-600' : 'bg-gray-300')
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Iconlist;