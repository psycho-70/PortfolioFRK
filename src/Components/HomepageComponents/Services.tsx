'use client';
import { useState } from "react";
import { useAppContext } from "@/Context/AppContext";

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

interface Service {
  title: string;
  icon: string;
  category: string;
  description: string;
  features: string[];
  projects: number;
  rating: number;
  deliveryTime: string;
}

const Services = () => {
  const { darkMode } = useAppContext();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  const services: Service[] = [
    {
      title: 'UI/UX Design',
      icon: '🎨',
      category: 'Design',
      description: 'Creating intuitive and visually stunning user interfaces that provide exceptional user experiences. From wireframes to final designs, we craft digital experiences that captivate and engage.',
      features: [
        'User Research & Analysis',
        'Wireframing & Prototyping',
        'Visual Design Systems',
        'Responsive Design',
        'Usability Testing',
        'Brand Integration'
      ],
      projects: 45,
      rating: 4.9,
      deliveryTime: '5-7 days'
    },
    {
      title: 'Frontend Development',
      icon: '💻',
      category: 'Development',
      description: 'Building responsive, interactive, and high-performance web applications using modern technologies. We transform designs into pixel-perfect, functional interfaces.',
      features: [
        'React & Next.js Development',
        'Responsive Web Design',
        'JavaScript & TypeScript',
        'State Management',
        'API Integration',
        'Performance Optimization'
      ],
      projects: 62,
      rating: 4.8,
      deliveryTime: '7-10 days'
    },
    {
      title: 'Backend Development',
      icon: '⚙️',
      category: 'Development',
      description: 'Developing robust server-side applications, APIs, and database systems that power your applications with security, scalability, and performance in mind.',
      features: [
        'RESTful API Development',
        'Database Design & Management',
        'Authentication & Security',
        'Cloud Integration',
        'Performance Optimization',
        'Microservices Architecture'
      ],
      projects: 38,
      rating: 4.9,
      deliveryTime: '10-14 days'
    },
    {
      title: 'SEO Optimization',
      icon: '🚀',
      category: 'Marketing',
      description: 'Boosting your online visibility and search rankings through comprehensive SEO strategies, technical optimizations, and content enhancement.',
      features: [
        'Technical SEO Audit',
        'Keyword Research & Strategy',
        'On-page Optimization',
        'Content Strategy',
        'Link Building',
        'Performance Tracking'
      ],
      projects: 29,
      rating: 4.7,
      deliveryTime: '14-21 days'
    },
    {
      title: 'Database Solutions',
      icon: '🗄️',
      category: 'Infrastructure',
      description: 'Designing and implementing efficient database systems that ensure data integrity, security, and optimal performance for your applications.',
      features: [
        'Database Architecture',
        'Data Modeling',
        'Query Optimization',
        'Security Implementation',
        'Backup & Recovery',
        'Migration Services'
      ],
      projects: 31,
      rating: 4.8,
      deliveryTime: '7-12 days'
    },
    {
      title: 'DevOps & Cloud',
      icon: '☁️',
      category: 'Infrastructure',
      description: 'Streamlining development workflows and deploying scalable applications with modern DevOps practices and cloud infrastructure.',
      features: [
        'CI/CD Pipeline Setup',
        'Cloud Platform Integration',
        'Container Orchestration',
        'Monitoring & Logging',
        'Security & Compliance',
        'Infrastructure as Code'
      ],
      projects: 22,
      rating: 4.9,
      deliveryTime: '10-15 days'
    }
  ];

  const categories = [...new Set(services.map(service => service.category))];

  return (
    <div className={`py-20 px-4 relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-10 w-96 h-96 ${darkMode ? 'bg-purple-500/10' : 'bg-blue-500/10'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-20 right-10 w-80 h-80 ${darkMode ? 'bg-pink-500/10' : 'bg-purple-500/10'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/3 w-64 h-64 ${darkMode ? 'bg-cyan-500/5' : 'bg-indigo-500/5'} rounded-full blur-3xl animate-pulse delay-2000`}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-block relative mb-8">
            <h1 className={`text-5xl font-bold mb-4 ${themeClasses.gradientText} bg-clip-text text-transparent`}>
              Services
            </h1>
          </div>
          <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Transforming ideas into digital excellence through innovative solutions
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} border backdrop-blur-lg rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300`}>
            <div className={`text-3xl font-bold ${themeClasses.gradientText} bg-clip-text text-transparent mb-2`}>
              {services.reduce((acc, service) => acc + service.projects, 0)}+
            </div>
            <div className={`${themeClasses.text} opacity-70 text-sm`}>Projects</div>
          </div>
          <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} border backdrop-blur-lg rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300`}>
            <div className={`text-3xl font-bold ${themeClasses.gradientText} bg-clip-text text-transparent mb-2`}>
              {categories.length}
            </div>
            <div className={`${themeClasses.text} opacity-70 text-sm`}>Categories</div>
          </div>
          <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} border backdrop-blur-lg rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300`}>
            <div className={`text-3xl font-bold ${themeClasses.gradientText} bg-clip-text text-transparent mb-2`}>
              4.8
            </div>
            <div className={`${themeClasses.text} opacity-70 text-sm`}>Avg Rating</div>
          </div>
          <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} border backdrop-blur-lg rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300`}>
            <div className={`text-3xl font-bold ${themeClasses.gradientText} bg-clip-text text-transparent mb-2`}>
              24/7
            </div>
            <div className={`${themeClasses.text} opacity-70 text-sm`}>Support</div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative ${themeClasses.cardBg} ${themeClasses.cardBorder} border backdrop-blur-lg rounded-3xl p-8 transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedService(service)}
            >
              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 ${themeClasses.buttonPrimary} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl`}></div>
              
              {/* Category Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${themeClasses.buttonSecondary} text-white`}>
                {service.category}
              </div>

              {/* Service Icon */}
              <div className="relative z-10 mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${themeClasses.buttonPrimary} shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <span className="text-2xl">{service.icon}</span>
                </div>
              </div>

              {/* Service Title */}
              <h3 className={`text-2xl font-bold ${themeClasses.text} mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300`}>
                {service.title}
              </h3>

              {/* Service Description */}
              <p className={`${themeClasses.text} opacity-80 text-sm leading-relaxed mb-6 line-clamp-3`}>
                {service.description}
              </p>

              {/* Service Stats */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${themeClasses.text}`}>{service.projects}</div>
                    <div className={`text-xs ${themeClasses.text} opacity-60`}>Projects</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${themeClasses.text} flex items-center`}>
                      {service.rating} <span className="text-yellow-400 ml-1">★</span>
                    </div>
                    <div className={`text-xs ${themeClasses.text} opacity-60`}>Rating</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${themeClasses.text}`}>{service.deliveryTime}</div>
                  <div className={`text-xs ${themeClasses.text} opacity-60`}>Delivery</div>
                </div>
              </div>

              {/* Preview Skills */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {service.features.slice(0, 3).map((feature, featureIndex) => (
                    <span
                      key={featureIndex}
                      className={`px-3 py-1 text-xs rounded-full ${
                        darkMode 
                          ? 'bg-white/10 text-white/80 border border-white/20' 
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-3 px-6 rounded-xl ${themeClasses.buttonPrimary} text-white font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedService(service);
                }}
              >
                Learn More →
              </button>

              {/* Decorative Elements */}
              <div className="absolute bottom-4 left-4 opacity-20">
                <div className={`w-2 h-2 rounded-full ${themeClasses.buttonPrimary}`}></div>
              </div>
              <div className="absolute top-1/2 right-4 opacity-10">
                <div className={`w-1 h-1 rounded-full ${themeClasses.buttonSecondary}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${themeClasses.modalBg} backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border ${themeClasses.cardBorder} relative`}>
              <button
                onClick={() => setSelectedService(null)}
                className={`absolute top-6 right-6 w-10 h-10 rounded-full ${themeClasses.cardBg} ${themeClasses.text} flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 z-10`}
              >
                ×
              </button>
              
              {/* Modal Header */}
              <div className="p-8 border-b border-gray-200/20">
                <div className="flex items-center space-x-6">
                  <div className={`w-20 h-20 rounded-2xl ${themeClasses.buttonPrimary} flex items-center justify-center shadow-lg`}>
                    <span className="text-3xl">{selectedService.icon}</span>
                  </div>
                  <div>
                    <h2 className={`text-4xl font-bold ${themeClasses.text} mb-2`}>
                      {selectedService.title}
                    </h2>
                    <p className={`${themeClasses.buttonSecondary} text-white px-4 py-1 rounded-full text-sm inline-block`}>
                      {selectedService.category}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className={`${themeClasses.cardBg} rounded-2xl p-6 text-center border ${themeClasses.cardBorder}`}>
                    <div className={`text-3xl font-bold ${themeClasses.gradientText} bg-clip-text text-transparent mb-2`}>
                      {selectedService.projects}
                    </div>
                    <div className={`${themeClasses.text} opacity-70`}>Completed Projects</div>
                  </div>
                  <div className={`${themeClasses.cardBg} rounded-2xl p-6 text-center border ${themeClasses.cardBorder}`}>
                    <div className={`text-3xl font-bold ${themeClasses.gradientText} bg-clip-text text-transparent mb-2 flex items-center justify-center`}>
                      {selectedService.rating} <span className="text-yellow-400 ml-1">★</span>
                    </div>
                    <div className={`${themeClasses.text} opacity-70`}>Average Rating</div>
                  </div>
                  <div className={`${themeClasses.cardBg} rounded-2xl p-6 text-center border ${themeClasses.cardBorder}`}>
                    <div className={`text-3xl font-bold ${themeClasses.gradientText} bg-clip-text text-transparent mb-2`}>
                      {selectedService.deliveryTime}
                    </div>
                    <div className={`${themeClasses.text} opacity-70`}>Delivery Time</div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>
                    About This Service
                  </h3>
                  <p className={`${themeClasses.text} opacity-80 text-lg leading-relaxed`}>
                    {selectedService.description}
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className={`text-2xl font-bold ${themeClasses.text} mb-6`}>
                    What You'll Get
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedService.features.map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-center p-4 rounded-xl ${themeClasses.cardBg} border ${themeClasses.cardBorder} transform hover:scale-105 transition-all duration-300`}
                      >
                        <div className={`w-2 h-2 rounded-full ${themeClasses.buttonPrimary} mr-4`}></div>
                        <span className={`${themeClasses.text} opacity-90`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setSelectedService(null)}
                    className={`px-8 py-4 rounded-xl ${themeClasses.cardBg} ${themeClasses.cardBorder} border ${themeClasses.text} font-semibold transition-all duration-300 hover:scale-105`}
                  >
                    Close
                  </button>
                  <button
                    className={`px-8 py-4 rounded-xl ${themeClasses.buttonPrimary} text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                  >
                    Get Started →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Services;