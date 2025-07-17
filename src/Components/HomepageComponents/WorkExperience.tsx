'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Code, 
  Award, 
  ArrowRight, 
  ExternalLink, 
  Clock, 
  Building2, 
  GraduationCap, 
  Briefcase 
} from 'lucide-react';
import { useAppContext } from '@/Context/AppContext';
// Types
interface Experience {
  id: number;
  company: string;
  location: string;
  position: string;
  type: string;
  duration: string;
  status: 'current' | 'completed';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  technologies: string[];
  achievements: string[];
  projects: string[];
  skills: string[];
  companyType: string;
}

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

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Custom hook for app context (replace with your actual context)

const WorkExperienceShowcase: React.FC = () => {
  const [hoveredExperience, setHoveredExperience] = useState<number | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<number | null>(null);
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, });
  const { darkMode } = useAppContext();

  // Theme classes
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

  const experiences: Experience[] = [
    {
      id: 1,
      company: "Precise Tech",
      location: "Canada",
      position: "Web Developer",
      type: "Remote",
      duration: "08/2024 - Present",
      status: "current",
      icon: <Code className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      technologies: ["JavaScript", "TypeScript", "Jira", "TFS", "ERP Solutions"],
      achievements: [
        "Work remotely as a web developer, focusing on enterprise resource planning (ERP) solutions",
        "Contributed to specialized websites like Nature Clam and Sowa Tooling",
        "Collaborate with cross-functional teams to design and implement features",
        "Participate in code reviews and agile development processes"
      ],
      projects: ["Nature Clam", "Sowa Tooling"],
      skills: ["Enterprise Solutions", "Remote Collaboration", "Agile Development"],
      companyType: "Tech Company"
    },
    {
      id: 2,
      company: "Khushal Institute",
      location: "Karak",
      position: "Web Development Instructor & Computer Education Teacher",
      type: "On-site",
      duration: "01/2024 - 06/2024",
      status: "completed",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
      technologies: ["HTML", "CSS", "JavaScript", "Web Frameworks", "Office Automation"],
      achievements: [
        "Instructed and mentored students in web development fundamentals",
        "Taught courses on office automation, networking, and basic computer skills",
        "Developed and updated educational materials including course outlines and textbooks",
        "Created dynamic and effective learning experiences for students"
      ],
      projects: ["Course Development", "Educational Materials", "Student Mentoring"],
      skills: ["Teaching", "Curriculum Development", "Student Mentoring"],
      companyType: "Educational Institute"
    },
    {
      id: 3,
      company: "Uzair Technology",
      location: "Kohat",
      position: "Intern (React.js and Web Development)",
      type: "Internship",
      duration: "06/2023 - 12/2023",
      status: "completed",
      icon: <Briefcase className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
      technologies: ["React.js", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
      achievements: [
        "Completed comprehensive internship focused on React.js and modern web development",
        "Built several web applications including Weather App, Profile App, and To-Do List App",
        "Gained hands-on experience in responsive and interactive UI development",
        "Worked extensively with React and Tailwind CSS for modern web solutions"
      ],
      projects: ["Weather App", "Profile App", "To-Do List App", "FCP App"],
      skills: ["React Development", "Responsive Design", "Interactive UIs"],
      companyType: "Technology Company"
    }
  ];

  const getStatusColor = (status: Experience['status']): string => {
    switch (status) {
      case 'current':
        return darkMode ? 'from-green-500 to-emerald-500' : 'from-green-400 to-emerald-400';
      case 'completed':
        return darkMode ? 'from-gray-500 to-gray-600' : 'from-gray-400 to-gray-500';
      default:
        return darkMode ? 'from-blue-500 to-cyan-500' : 'from-blue-400 to-cyan-400';
    }
  };

  const getStatusText = (status: Experience['status']): string => {
    switch (status) {
      case 'current':
        return 'Currently Working';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const handleExperienceClick = (expId: number): void => {
    setSelectedExperience(expId === selectedExperience ? null : expId);
  };

  return (
    <div id="Experience" className={`relative transition-all duration-700 `}>
      
     

      <div className="relative z-10 px-4 py-8 sm:py-16" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-2"
          >
            <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-lg`}>
              <Briefcase className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </motion.div>
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${themeClasses.text}`}>
            Work <span className={`bg-gradient-to-r ${themeClasses.gradientText} bg-clip-text text-transparent`}>Experience</span>
          </h1>
          
          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            A journey through my professional development and achievements
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <div className="relative">
            {/* Timeline Line */}
            <div className={`absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-300'
            }`}></div>

            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                // variants={itemVariants}
                className={`relative mb-12 md:mb-16 ${
                  index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:text-right'
                }`}
                onMouseEnter={() => setHoveredExperience(exp.id)}
                onMouseLeave={() => setHoveredExperience(null)}
              >
                {/* Timeline Node */}
                <motion.div
                  className={`absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full border-4 ${
                    darkMode ? 'border-gray-900 bg-gray-800' : 'border-gray-50 bg-white'
                  } flex items-center justify-center z-10`}
                  whileHover={{ scale: 1.2 }}
                >
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${exp.color}`}></div>
                </motion.div>

                {/* Experience Card */}
                <motion.div
                  className={`ml-12 md:ml-0 ${
                    index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`backdrop-blur-xl rounded-2xl p-6 shadow-2xl border transition-all duration-300 cursor-pointer ${
                      darkMode 
                        ? 'bg-gray-800/40 border-gray-700/30 hover:bg-gray-800/60' 
                        : 'bg-white/60 border-white/40 hover:bg-white/80'
                    } ${hoveredExperience === exp.id ? 'transform scale-105' : ''}`}
                    onClick={() => handleExperienceClick(exp.id)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${exp.bgColor}`}>
                          {exp.icon}
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${themeClasses.text}`}>
                            {exp.position}
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {exp.company}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(exp.status)} text-white`}>
                          <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                          {getStatusText(exp.status)}
                        </div>
                      </div>
                    </div>

                    {/* Info Row */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {exp.duration}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {exp.location}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building2 className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {exp.type}
                        </span>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {exp.technologies.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            darkMode 
                              ? 'bg-gray-700/50 text-gray-300' 
                              : 'bg-gray-100/50 text-gray-700'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                      {exp.technologies.length > 3 && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100/50 text-gray-700'
                        }`}>
                          +{exp.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Achievements Preview */}
                    <div className="mb-4">
                      <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {exp.achievements[0]}
                      </p>
                    </div>

                    {/* Expand Button */}
                    <button
                      className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                        darkMode 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : 'text-blue-600 hover:text-blue-500'
                      }`}
                      type="button"
                      aria-label={selectedExperience === exp.id ? 'Show less details' : 'Show more details'}
                    >
                      <span>{selectedExperience === exp.id ? 'Show Less' : 'Show More'}</span>
                      <ArrowRight className={`w-4 h-4 transition-transform ${
                        selectedExperience === exp.id ? 'rotate-90' : ''
                      }`} />
                    </button>
                  </div>

                  {/* Expanded Content */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: selectedExperience === exp.id ? 1 : 0,
                      height: selectedExperience === exp.id ? 'auto' : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className={`mt-4 backdrop-blur-xl rounded-2xl p-6 border ${
                      darkMode 
                        ? 'bg-gray-800/20 border-gray-700/20' 
                        : 'bg-white/40 border-white/30'
                    }`}>
                      {/* All Achievements */}
                      <div className="mb-6">
                        <h4 className={`text-lg font-semibold mb-3 ${themeClasses.text}`}>
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="flex items-start space-x-2">
                              <div className={`w-2 h-2 rounded-full mt-2 bg-gradient-to-r ${exp.color}`}></div>
                              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {achievement}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Projects */}
                      <div className="mb-6">
                        <h4 className={`text-lg font-semibold mb-3 ${themeClasses.text}`}>
                          Notable Projects
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.projects.map((project, projIndex) => (
                            <span
                              key={projIndex}
                              className={`px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r ${exp.bgColor} ${
                                darkMode ? 'text-gray-200' : 'text-gray-700'
                              }`}
                            >
                              {project}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* All Technologies */}
                      <div>
                        <h4 className={`text-lg font-semibold mb-3 ${themeClasses.text}`}>
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                darkMode 
                                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700' 
                                  : 'bg-gray-100/50 text-gray-700 hover:bg-gray-100'
                              } transition-colors cursor-pointer`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5 } }
          }}
          className="mt-16 text-center"
        >
          <div className={`inline-flex items-center justify-center space-x-8 px-8 py-6 rounded-2xl backdrop-blur-lg border ${
            darkMode 
              ? 'bg-gray-800/40 border-gray-700/30' 
              : 'bg-white/60 border-white/40'
          }`}>
            <div className="text-center">
              <div className={`text-2xl font-bold ${themeClasses.text}`}>
                {experiences.length}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Positions
              </div>
            </div>
            <div className={`w-px h-8 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${themeClasses.text}`}>
                {experiences.reduce((total, exp) => total + exp.technologies.length, 0)}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Technologies
              </div>
            </div>
            <div className={`w-px h-8 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${themeClasses.text}`}>
                {experiences.reduce((total, exp) => total + exp.projects.length, 0)}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Projects
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkExperienceShowcase;