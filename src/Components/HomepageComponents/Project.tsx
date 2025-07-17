'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Github, Calendar, Tag, X, ZoomIn, Moon, Sun, Lock } from 'lucide-react';
import { useAppContext } from '@/Context/AppContext';
import Image from 'next/image';

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  date: string;
  technologies: string[];
  github: string;
  live: string;
  isConfidential: boolean;
  images: string[];
  color: string;
}

interface ThemeClasses {
  background: string;
  text: string;
  cardBg: string;
  cardBorder: string;
  headerOverlay: string;
  modalBg: string;
  buttonPrimary: string;
  buttonSecondary: string;
  gradientText: string;
}

const ProjectShowcase = () => {
 const { darkMode } = useAppContext();
  const [selectedProject, setSelectedProject] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isConfidentialModalOpen, setIsConfidentialModalOpen] = useState<boolean>(false);


  // Projects data with TypeScript typing
  const projects: Project[] = [
    {
      id: 1,
      title: "Sowatolling E-commerce Platform",
      description: "A comprehensive e-commerce platform with modern design, user-friendly interface, and complete shopping functionality including cart, checkout, and user management.",
      longDescription: "Sowatolling is a full-featured e-commerce platform built with modern web technologies. It includes a responsive design, product catalog, shopping cart functionality, secure checkout process, user authentication, and admin dashboard. The platform also features a WordPress-like editor for content management and dynamic footer links creation.",
      category: "E-commerce",
      date: "2024-01-15",
      technologies: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
      github: "https://github.com/yourusername/sowatolling",
      live: "https://sowatolling.com",
      isConfidential: true,
      images: [
        "/project/Sowa/1 (1).png",
        "/project/Sowa/1 (2).png",
        "/project/Sowa/1 (3).png",
        "/project/Sowa/1 (4).png"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      title: "Natural Clam E-commerce",
      description: "A specialized e-commerce website for natural clam products with elegant design, product showcasing, and seamless shopping experience.",
      longDescription: "Natural Clam is an e-commerce platform dedicated to natural clam products. It features a clean, elegant design that highlights product quality, detailed product information, customer reviews, and a smooth checkout process. The website emphasizes natural and organic qualities with earth-tone aesthetics.",
      category: "E-commerce",
      date: "2024-02-20",
      technologies: ["React", "Next.js", "Tailwind CSS", "Stripe", "MongoDB"],
      github: "https://github.com/yourusername/natural-clam",
      live: "https://naturalclam.com",
      isConfidential: true,
      images: [
        "/project/NC/1 (1).png",
        "/project/NC/1 (2).png",
        "/project/NC/1 (3).png",
        "/project/NC/1 (4).png"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 3,
      title: "Spotify Clone, Netflix Clone, Twitter Clone, Password Generator, OP Ultra Edit Website, Yellow Zip Archive",
      description: "A feature-rich Spotify clone with music streaming capabilities, playlist management, and modern UI/UX design.",
      longDescription: "This Spotify clone replicates the core functionality of the popular music streaming platform. It includes features like music playback, playlist creation and management, search functionality, user profiles, and a responsive design that works across all devices. The app provides an immersive music experience with smooth transitions and modern design elements.",
      category: "Music App",
      date: "2024-03-10",
      technologies: ["HTML", "CSS", "JS", "React", "Web Audio API"],
      github: "https://github.com/psycho-70/spotify-clone",
      live: "https://github.com/psycho-70/spotify-clone",
      isConfidential: false,
      images: [
        "/project/clone/1 (1).png",
        "/project/clone/1 (2).png",
        "/project/clone/1 (3).png",
        "/project/clone/1 (4).png"
      ],
      color: "from-green-400 to-green-600"
    },
    {
      id: 4,
      title: "Weather App",
      description: "A comprehensive weather application with real-time forecasts, air quality index, OAuth authentication, and dark mode support.",
      longDescription: "This advanced weather dashboard provides detailed weather analytics including current conditions, hourly/daily forecasts, and air quality index reports. Key features include:\n\n- Secure OAuth authentication with Google Sign-In\n- Dark/Light mode toggle for optimal viewing\n- Interactive weather maps and data visualizations\n- Air quality monitoring with health recommendations\n- Personalized weather blogs and articles\n- Multi-location support with favorites system\n- Weather alerts and severe condition warnings\n\nBuilt with modern technologies for optimal performance and user experience.",
      category: "Utility App",
      date: "2024-04-05",
      technologies: [
        "Next.js",
        "OpenWeather API",
        "AirVisual API",
        "Tailwind CSS",
        "Node.js",
        "Firebase",
        "OAuth",
        "Next-Auth"
      ],
      github: "https://github.com/psycho-70/weatherapp",
      live: "https://weatherapp-lilac-xi.vercel.app/",
      isConfidential: false,
      images: [
        "/project/weather/1 (1).png",
        "/project/weather/1 (2).png",
        "/project/weather/1 (3).png",
        "/project/weather/1 (4).png"
      ],
      color: "from-blue-400 to-cyan-500"
    },
    {
      id: 5,
      title: "Todo List Application",
      description: "A productive todo list app with task management, categories, and progress tracking features.",
      longDescription: "This todo list application helps users organize their tasks efficiently. It includes features like task categorization, priority levels, due dates, progress tracking, and task filtering. The app has a clean, minimalist design that focuses on productivity and ease of use, with drag-and-drop functionality for task organization.",
      category: "Productivity",
      date: "2024-04-20",
      technologies: ["React", "Local Storage", "Tailwind CSS", "Drag & Drop API"],
      github: "https://github.com/psycho-70/TODO-list",
      live: "https://github.com/psycho-70/TODO-list",
      isConfidential: false,
      images: [
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=entropy&cs=tinysrgb&q=80",
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop&crop=entropy&cs=tinysrgb&q=80",
        "/project/todo/todo.png",
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop&crop=entropy&cs=tinysrgb&q=80"
      ],
      color: "from-orange-400 to-red-500"
    },
    {
      id: 6,
      title: "Portfolio Website",
      description: "A professional portfolio website showcasing projects, skills, and experience with modern design and smooth animations.",
      longDescription: "This portfolio website serves as a comprehensive showcase of professional work and skills. It features project galleries, skill demonstrations, contact forms, and smooth animations throughout. The design is modern and professional, with responsive layouts that work perfectly on all devices. It includes sections for about, projects, skills, experience, and contact information.",
      category: "Portfolio",
      date: "2024-05-10",
      technologies: ["React", "Tailwind CSS", "Framer Motion","Material UI"],
      github: "https://github.com/psycho-70/portfolio",
      live: "https://informativeworld-furqan-khans-projects.vercel.app/",
      isConfidential: false,
      images: [
        "/project/protfiolo/1 (1).png",
        "/project/protfiolo/1 (2).png",
        "/project/protfiolo/1 (3).png",
        "/project/protfiolo/1 (4).png"
      ],
      color: "from-indigo-500 to-purple-600"
    }
  ];

  // Auto image slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % projects[selectedProject].images.length);
    }, 3000); // 5 seconds

    return () => clearInterval(interval);
  }, [selectedProject, projects]);

  // Enhanced project navigation with animation
  const nextProject = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedProject((prev) => (prev + 1) % projects.length);
    setSelectedImage(0);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevProject = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedProject((prev) => (prev - 1 + projects.length) % projects.length);
    setSelectedImage(0);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Enhanced modal functions
  const openModal = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Confidential modal functions
  const openConfidentialModal = () => {
    setIsConfidentialModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeConfidentialModal = () => {
    setIsConfidentialModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Handle link clicks for confidential projects
  const handleLinkClick = (e: React.MouseEvent, isConfidential: boolean) => {
    if (isConfidential) {
      e.preventDefault();
      openConfidentialModal();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) {
        switch (e.key) {
          case 'Escape':
            closeModal();
            break;
          case 'ArrowLeft':
            prevImage();
            break;
          case 'ArrowRight':
            nextImage();
            break;
        }
      }
      if (isConfidentialModalOpen && e.key === 'Escape') {
        closeConfidentialModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isConfidentialModalOpen]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projects[selectedProject].images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projects[selectedProject].images.length) % projects[selectedProject].images.length);
  };

  // Dynamic theme classes
  const themeClasses: ThemeClasses = {
    background: darkMode 
      ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
      : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
    text: darkMode ? 'text-white' : 'text-gray-900',
    cardBg: darkMode ? 'bg-white/10' : 'bg-white/80',
    cardBorder: darkMode ? 'border-white/20' : 'border-gray-200',
    headerOverlay: darkMode 
      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20' 
      : 'bg-gradient-to-r from-blue-600/10 to-purple-600/10',
    modalBg: darkMode ? 'bg-black/90' : 'bg-white/95',
    buttonPrimary: darkMode 
      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
    buttonSecondary: darkMode 
      ? 'bg-white/10 hover:bg-white/20 border-white/20' 
      : 'bg-gray-100 hover:bg-gray-200 border-gray-300',
    gradientText: darkMode 
      ? 'bg-gradient-to-r from-purple-400 to-pink-400' 
      : 'bg-gradient-to-r from-blue-600 to-purple-600',
  };

  const currentProject = projects[selectedProject];

  return (
    <div className={`transition-all duration-500`}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 backdrop-blur-sm`}></div>
        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className={`text-5xl font-bold mb-4 ${themeClasses.gradientText} bg-clip-text text-transparent`}>
              Project Showcase
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Discover my latest projects and the technologies that bring them to life
            </p>
          </div>
        </div>
      </div>

      {/* Project Navigation */}
      <div className="container mx-auto px-6 py-8">
        {/* Project Details */}
        <div className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-500 ${isAnimating ? 'opacity-50 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
          {/* Project Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${currentProject.color} text-white shadow-lg`}>
                  {currentProject.category}
                </span>
                <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(currentProject.date).toLocaleDateString()}
                </div>
              </div>
              
              <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'bg-gradient-to-r from-white to-gray-300' : 'bg-gradient-to-r from-gray-800 to-gray-600'} bg-clip-text text-transparent`}>
                {currentProject.title}
              </h2>
              
              <p className={`text-lg leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {currentProject.longDescription}
              </p>
            </div>

            {/* Technologies */}
            <div>
              <h3 className={`text-xl font-semibold mb-4 flex items-center ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                <Tag className="w-5 h-5 mr-2" />
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentProject.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${themeClasses.cardBg} border ${themeClasses.cardBorder} backdrop-blur-sm transition-all duration-300 hover:scale-105`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <a
                href={currentProject.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleLinkClick(e, currentProject.isConfidential)}
                className={`flex items-center px-6 py-3 ${themeClasses.buttonPrimary} rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-white cursor-pointer`}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Live Demo
              </a>
              <a
                href={currentProject.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleLinkClick(e, currentProject.isConfidential)}
                className={`flex items-center px-6 py-3 ${themeClasses.buttonSecondary} rounded-full font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border shadow-lg cursor-pointer`}
              >
                <Github className="w-5 h-5 mr-2" />
                View Code
              </a>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative group">
              <div className={`aspect-video rounded-2xl overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-100 to-gray-200'} shadow-2xl`}>
                <Image
                  src={currentProject.images[selectedImage]}
                  alt={`${currentProject.title} - Image ${selectedImage + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  width={800}
                  height={600}
                />
                <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-t from-black/50 via-transparent to-transparent' : 'bg-gradient-to-t from-white/50 via-transparent to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <button
                  onClick={() => openModal(selectedImage)}
                  className={`absolute top-4 right-4 p-2 rounded-full ${darkMode ? 'bg-black/50 hover:bg-black/70' : 'bg-white/50 hover:bg-white/70'} transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110`}
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {currentProject.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                    index === selectedImage 
                      ? `ring-2 ring-offset-2 ${darkMode ? 'ring-purple-400 ring-offset-gray-900' : 'ring-blue-400 ring-offset-white'} scale-105` 
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${currentProject.title} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    width={200}
                    height={200}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center space-x-4 py-12">
          <button
            onClick={prevProject}
            disabled={isAnimating}
            className={`p-3 rounded-full ${themeClasses.cardBg} border ${themeClasses.cardBorder} backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex space-x-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setSelectedProject(index);
                    setSelectedImage(0);
                  }
                }}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === selectedProject 
                    ? `bg-gradient-to-r ${currentProject.color} w-8` 
                    : `w-3 ${darkMode ? 'bg-white/30 hover:bg-white/50' : 'bg-gray-400 hover:bg-gray-600'}`
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextProject}
            disabled={isAnimating}
            className={`p-3 rounded-full ${themeClasses.cardBg} border ${themeClasses.cardBorder} backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Modal for Full Screen Image */}
      {isModalOpen && (
        <div className={`fixed inset-0 ${themeClasses.modalBg} z-50 flex items-center justify-center backdrop-blur-sm`}>
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={closeModal}
              className={`absolute top-4 right-4 p-2 rounded-full ${themeClasses.cardBg} border ${themeClasses.cardBorder} backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10`}
            >
              <X className="w-6 h-6" />
            </button>
            
            <button
              onClick={prevImage}
              className={`absolute left-4 p-2 rounded-full ${themeClasses.cardBg} border ${themeClasses.cardBorder} backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextImage}
              className={`absolute right-4 p-2 rounded-full ${themeClasses.cardBg} border ${themeClasses.cardBorder} backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            <Image
              src={currentProject.images[currentImageIndex]}
              alt={`${currentProject.title} - Full size`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              width={1200}
              height={800}
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {currentProject.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? `bg-gradient-to-r ${currentProject.color} w-6` 
                      : `w-2 ${darkMode ? 'bg-white/50' : 'bg-gray-400'}`
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confidential Modal */}
      {isConfidentialModalOpen && (
        <div className={`fixed inset-0 ${themeClasses.modalBg} z-50 flex items-center justify-center backdrop-blur-sm`}>
          <div className={`relative max-w-md w-full mx-4 ${themeClasses.cardBg} border ${themeClasses.cardBorder} backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden`}>
            <div className={`bg-gradient-to-r ${currentProject.color} p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Confidential Project</h3>
                </div>
                <button
                  onClick={closeConfidentialModal}
                  className="p-1 hover:bg-white/20 rounded-full transition-all duration-300"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center space-y-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} rounded-full`}>
                  <Lock className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                
                <div>
                  <h4 className={`text-lg font-semibold mb-2 ${themeClasses.text}`}>
                    Access Restricted
                  </h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    This project contains confidential information and is not available for public viewing. 
                    Please contact me directly for more information about this project.
                  </p>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={closeConfidentialModal}
                    className={`w-full px-6 py-3 ${themeClasses.buttonPrimary} rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg`}
                  >
                    Understood
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectShowcase;