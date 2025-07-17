'use client';

import { useState } from 'react';
import { useAppContext } from '@/Context/AppContext';

// Type definitions
interface TeamMember {
  name: string;
  position: string;
  image: string;
  expertise: string;
  skills: string[];
  status: 'Available' | 'Busy';
  projects: number;
  experience: string;
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

// Team members data
const teamMembers: TeamMember[] = [
  {
    name: 'M.Asim',
    position: 'Visual Designer',
    image: '/team/asim.jpg',
    expertise: 'Expert in Adobe Photoshop, Illustrator, and UI/UX design principles.',
    skills: ['Photoshop', 'Illustrator', 'UI/UX', 'Design Systems'],
    status: 'Available',
    projects: 12,
    experience: '3+ years'
  },
  {
    name: 'Hussain Khan',
    position: 'Software Engineer',
    image: '/team/hussain.enc',
    expertise: 'Proficient in JavaScript, React, Node.js, and cloud computing.',
    skills: ['JavaScript', 'React', 'Node.js', 'Cloud Computing'],
    status: 'Busy',
    projects: 18,
    experience: '5+ years'
  },
  {
    name: 'Nasir Khan',
    position: 'Project Manager',
    image: '/team/nasir.enc',
    expertise: 'Skilled in project management, Agile methodologies, and team leadership.',
    skills: ['Project Management', 'Agile', 'Leadership', 'Strategy'],
    status: 'Available',
    projects: 25,
    experience: '7+ years'
  },
  {
    name: 'Salman Khan',
    position: 'Database Administrator',
    image: '/team/salman.jpg',
    expertise: 'Experienced in SQL, NoSQL databases, and database performance optimization.',
    skills: ['SQL', 'NoSQL', 'Performance', 'Security'],
    status: 'Available',
    projects: 15,
    experience: '4+ years'
  },
  {
    name: 'Aftab Khan',
    position: 'UX Designer',
    image: '/team/aftab.jpg',
    expertise: 'Specialized in user research, wireframing, prototyping, and usability testing.',
    skills: ['User Research', 'Wireframing', 'Prototyping', 'Testing'],
    status: 'Busy',
    projects: 14,
    experience: '4+ years'
  },
];

const TeamMemberCard: React.FC = () => {
  const { darkMode } = useAppContext();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

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

  const handleEmailClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    window.open(`mailto:furqanktk52@gmail.com`, '_blank');
  };

  const handleViewClick = (e: React.MouseEvent<HTMLButtonElement>, member: TeamMember) => {
    e.stopPropagation();
    setSelectedMember(member);
  };

  const handleModalClose = () => {
    setSelectedMember(null);
  };

  return (
    <div className={`py-20 px-4 relative overflow-hidden`}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-10 w-72 h-72 ${darkMode ? 'bg-purple-500/10' : 'bg-blue-500/10'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 ${darkMode ? 'bg-pink-500/10' : 'bg-purple-500/10'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/2 w-80 h-80 ${darkMode ? 'bg-cyan-500/5' : 'bg-indigo-500/5'} rounded-full blur-3xl animate-pulse delay-2000`}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-block relative">
            <h1 className={`text-5xl font-bold mb-4 ${themeClasses.gradientText} bg-clip-text text-transparent`}>
              Our Team
            </h1>
          </div>
          <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Meet the innovative minds driving excellence in every project
          </p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} border backdrop-blur-lg rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300`}>
            <div className={`text-4xl font-bold ${themeClasses.gradientText} bg-clip-text text-transparent mb-2`}>
              {teamMembers.length}
            </div>
            <div className={`${themeClasses.text} opacity-80`}>Team Members</div>
          </div>
          <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} border backdrop-blur-lg rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300`}>
            <div className={`text-4xl font-bold ${themeClasses.gradientText} bg-clip-text text-transparent mb-2`}>
              {teamMembers.reduce((acc: number, member: TeamMember) => acc + member.projects, 0)}
            </div>
            <div className={`${themeClasses.text} opacity-80`}>Projects Completed</div>
          </div>
          <div className={`${themeClasses.cardBg} ${themeClasses.cardBorder} border backdrop-blur-lg rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300`}>
            <div className={`text-4xl font-bold ${themeClasses.gradientText} bg-clip-text text-transparent mb-2`}>
              {teamMembers.filter((member: TeamMember) => member.status === 'Available').length}
            </div>
            <div className={`${themeClasses.text} opacity-80`}>Available Now</div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member: TeamMember, index: number) => (
            <div
              key={index}
              className={`group relative ${themeClasses.cardBg} ${themeClasses.cardBorder} border backdrop-blur-lg rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedMember(member)}
            >
              {/* Card Glow Effect */}
              <div className={`absolute inset-0 ${themeClasses.buttonPrimary} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl`}></div>
              
              {/* Status Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                member.status === 'Available' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              }`}>
                {member.status}
              </div>

              {/* Profile Section */}
              <div className="relative z-10">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <div className={`w-24 h-24 rounded-2xl ${themeClasses.buttonPrimary} p-1 mb-4 group-hover:rotate-6 transition-transform duration-300`}>
                      <img
                        src={member.image || '/api/placeholder/96/96'}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 ${member.status === 'Available' ? 'bg-green-500' : 'bg-orange-500'} rounded-full border-2 ${darkMode ? 'border-gray-900' : 'border-white'}`}></div>
                  </div>
                  
                  <h3 className={`text-xl font-bold ${themeClasses.text} mb-1`}>
                    {member.name}
                  </h3>
                  <p className={`text-sm ${themeClasses.gradientText} bg-clip-text text-transparent font-medium`}>
                    {member.position}
                  </p>
                </div>

                {/* Experience & Projects */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${themeClasses.text}`}>{member.projects}</div>
                    <div className={`text-xs ${themeClasses.text} opacity-60`}>Projects</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${themeClasses.text}`}>{member.experience}</div>
                    <div className={`text-xs ${themeClasses.text} opacity-60`}>Experience</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {member.skills.slice(0, 3).map((skill: string, skillIndex: number) => (
                      <span
                        key={skillIndex}
                        className={`px-3 py-1 text-xs rounded-full ${
                          darkMode 
                            ? 'bg-white/10 text-white/80 border border-white/20' 
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 3 && (
                      <span className={`px-3 py-1 text-xs rounded-full ${darkMode ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-500'}`}>
                        +{member.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    className={`flex-1 py-3 px-4 rounded-xl ${themeClasses.buttonPrimary} text-white font-medium text-sm transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5`}
                    onClick={handleEmailClick}
                  >
                    Message
                  </button>
                  <button
                    className={`px-4 py-3 rounded-xl ${themeClasses.cardBg} ${themeClasses.cardBorder} border ${themeClasses.text} font-medium text-sm transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5`}
                    onClick={(e) => handleViewClick(e, member)}
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className={`absolute inset-0 ${themeClasses.buttonPrimary} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl pointer-events-none`}></div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${themeClasses.modalBg} backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border ${themeClasses.cardBorder} relative`}>
              <button
                onClick={handleModalClose}
                className={`absolute top-4 right-4 w-8 h-8 rounded-full ${themeClasses.cardBg} ${themeClasses.text} flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300`}
              >
                ×
              </button>
              
              <div className="text-center mb-6">
                <div className={`w-20 h-20 rounded-2xl ${themeClasses.buttonPrimary} p-1 mx-auto mb-4`}>
                  <img
                    src={selectedMember.image || '/api/placeholder/80/80'}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
                  {selectedMember.name}
                </h3>
                <p className={`${themeClasses.gradientText} bg-clip-text text-transparent font-medium`}>
                  {selectedMember.position}
                </p>
              </div>

              <div className={`${themeClasses.cardBg} rounded-2xl p-6 mb-6 border ${themeClasses.cardBorder}`}>
                <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>Expertise</h4>
                <p className={`${themeClasses.text} opacity-80 text-sm leading-relaxed`}>
                  {selectedMember.expertise}
                </p>
              </div>

              <div className="mb-6">
                <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm rounded-full ${themeClasses.buttonSecondary} text-white`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleModalClose}
                className={`w-full py-3 rounded-xl ${themeClasses.buttonPrimary} text-white font-medium transition-all duration-300 hover:shadow-lg`}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;