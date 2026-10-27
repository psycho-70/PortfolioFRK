'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
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
  Sparkles
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

const Iconlist: React.FC = () => {
  const { darkMode } = useAppContext();
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [countersVisible, setCountersVisible] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [autoSlide, setAutoSlide] = useState<boolean>(true);
  const marqueeRef = useRef<HTMLDivElement>(null);

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

  const metrics: MetricItem[] = [
    { icon: <Clock size={32} />, value: counters.experience, label: "Years Experience", description: "Professional Journey" },
    { icon: <Rocket size={32} />, value: counters.projects, label: "Projects", description: "Completed Successfully" },
    { icon: <Smile size={32} />, value: counters.clients, label: "Happy Clients", description: "Satisfied Customers" },
    { icon: <Trophy size={32} />, value: counters.awards, label: "Awards", description: "Recognition Earned" },
    { icon: <Code size={32} />, value: counters.lines, label: "K+ Lines of Code", description: "Clean & Efficient" },
    { icon: <Star size={32} />, value: counters.frameworks, label: "Frameworks", description: "Mastered Technologies" },
    { icon: <ThumbsUp size={32} />, value: counters.satisfaction, label: "% Satisfaction", description: "Client Feedback" },
    { icon: <Palette size={32} />, value: counters.designs, label: "UI Designs", description: "Creative Solutions" }
  ];

  // Auto slide effect for mobile
  useEffect(() => {
    if (!autoSlide) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 2) % metrics.length);
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [autoSlide, metrics.length]);

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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const triggerAnimations = (): void => {
    setHasAnimated(true);
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

  // Duplicate metrics for infinite marquee
  const marqueeMetrics = [...metrics, ...metrics];

  return (
    <div id="experience-metrics" className={`py-16 w-full mx-auto relative overflow-hidden transition-colors duration-500`}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="px-4 max-w-7xl mx-auto relative z-10"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
          {/* Left Side: Text and Decorative Image */}
          <motion.div
            className="lg:w-1/3 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-semibold mb-4 border border-blue-500/20">
              <Sparkles size={16} />
              <span>Statistics</span>
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              My <span className="text-blue-600">Journey</span> in Numbers
            </h2>
            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Continuously evolving and pushing boundaries in the digital landscape.
            </p>

            {/* Added Image */}
            <motion.div
              className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/code1.gif"
                alt="Development Progress"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-bottom p-6 flex-col justify-end">
                <p className="text-white font-medium">Fueled by Code & Creativity</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Continuous Slider (Marquee) */}
          <div className="lg:w-2/3 w-full relative">
            <div className={`absolute left-0 top-0 bottom-0 w-20 z-20 bg-gradient-to-r ${darkMode ? 'from-gray-900' : 'from-blue-50/50'} to-transparent hidden lg:block`}></div>
            <div className={`absolute right-0 top-0 bottom-0 w-20 z-20 bg-gradient-to-l ${darkMode ? 'from-gray-900' : 'from-blue-50/50'} to-transparent hidden lg:block`}></div>

            <div className="overflow-hidden py-10">
              <motion.div
                className="flex gap-6 w-max"
                animate={{
                  x: [0, -2000], // Approximate distance for all items
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 40,
                    ease: "linear",
                  },
                }}
                onMouseEnter={(e) => {
                  // Optional: pause on hover
                }}
              >
                {marqueeMetrics.map((metric, index) => (
                  <div
                    key={`${metric.label}-${index}`}
                    className="w-[280px] group cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <motion.div
                      whileHover={{ y: -10 }}
                      className={`
                        relative overflow-hidden rounded-3xl p-8 h-72 flex flex-col items-center justify-center
                        ${darkMode ? 'bg-gray-800/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'}
                        ${hoveredIndex === index ? 'shadow-2xl ring-2 ring-blue-500/50' : 'shadow-lg'}
                        border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}
                        transition-all duration-300
                      `}
                    >
                      {/* Decorative Background Element */}
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>

                      {/* Icon */}
                      <div className={`mb-6 p-4 rounded-2xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} ${hoveredIndex === index ? 'text-blue-500 scale-110' : (darkMode ? 'text-gray-300' : 'text-gray-600')} transition-all duration-300`}>
                        {metric.icon}
                      </div>

                      {/* Counter */}
                      <div className="text-center mb-4">
                        <div className={`font-bold text-4xl mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {metric.value}
                          <span className="text-blue-500">{getMetricSuffix(metric.label)}</span>
                        </div>
                      </div>

                      {/* Label */}
                      <div className="text-center">
                        <div className={`text-base font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {metric.label}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {metric.description}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Slider Remains for better UX on small screens or we can use marquee there too */}
        <div className="lg:hidden relative pb-10">
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
                <div key={index} className="w-1/2 flex-shrink-0 px-2">
                  <div className={`
                    relative overflow-hidden rounded-2xl p-6 h-64 flex flex-col items-center justify-center
                    ${darkMode ? 'bg-gray-800' : 'bg-white'}
                    shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'}
                  `}>
                    <div className={`mb-4 p-3 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      {metric.icon}
                    </div>
                    <div className="text-center mb-3">
                      <div className={`font-bold text-3xl mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {metric.value}{getMetricSuffix(metric.label)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{metric.label}</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{metric.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation for Mobile */}
          <div className="flex justify-between items-center mt-6 px-4">
            <button onClick={prevSlide} className={`p-3 rounded-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}><ChevronLeft size={20} /></button>
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(metrics.length / 2) }).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${Math.floor(currentSlide / 2) === i ? 'bg-blue-500' : 'bg-gray-400'}`} />
              ))}
            </div>
            <button onClick={nextSlide} className={`p-3 rounded-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}><ChevronRight size={20} /></button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Iconlist;
