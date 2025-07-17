"use client";

import React from 'react';
import { MdOutlineFacebook } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useAppContext } from '@/Context/AppContext';

// Type definitions
interface SocialLink {
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    color: string;
}

interface AppContextType {
    darkMode: boolean;
}

const Footer: React.FC = () => {
    const { darkMode }: AppContextType = useAppContext();

    const socialLinks: SocialLink[] = [
        { 
            icon: MdOutlineFacebook, 
            href: "https://web.facebook.com/furqan.don.771/", 
            color: "from-blue-500 to-blue-600" 
        },
        { 
            icon: FaXTwitter, 
            href: "https://twitter.com/?lang=en", 
            color: "from-gray-700 to-black" 
        },
        { 
            icon: FaInstagram, 
            href: "https://www.instagram.com/furqankhan070/", 
            color: "from-pink-500 to-purple-600" 
        }
    ];

    const generateFloatingShapes = (): React.ReactNode[] => {
        return Array.from({ length: 8 }, (_, i) => (
            <div
                key={i}
                className={`absolute opacity-30 animate-float ${
                    darkMode ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gradient-to-r from-blue-400 to-purple-400'
                }`}
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 20 + 10}px`,
                    height: `${Math.random() * 20 + 10}px`,
                    borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 10 + 15}s`
                }}
            />
        ));
    };

    return (
        <footer className={`relative w-full overflow-hidden transition-all duration-700 ${
            darkMode 
                ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-black' 
                : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
        }`}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute -top-32 -left-32 w-64 h-64 rounded-full opacity-20 blur-3xl animate-pulse ${
                    darkMode ? 'bg-purple-500' : 'bg-blue-400'
                }`}></div>
                <div className={`absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse delay-1000 ${
                    darkMode ? 'bg-pink-500' : 'bg-purple-400'
                }`}></div>
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse delay-2000 ${
                    darkMode ? 'bg-blue-500' : 'bg-pink-400'
                }`}></div>
            </div>

            {/* Floating Geometric Shapes */}
            <div className="absolute inset-0 pointer-events-none">
                {generateFloatingShapes()}
            </div>

            {/* Glassmorphism Top Border */}
            <div className={`h-[2px] w-full ${
                darkMode 
                    ? 'bg-gradient-to-r from-transparent via-purple-400 to-transparent' 
                    : 'bg-gradient-to-r from-transparent via-blue-400 to-transparent'
            }`}></div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-6 py-16">
                {/* Top Section with Typing Effect */}
                <div className="text-center mb-16">
                    <div className={`text-4xl md:text-5xl font-bold mb-6 ${
                        darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                        {/* <TypingEffect 
                            text="" 
                            speed={100}
                            className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                        /> */}
                        INFORMATION WORLD
                    </div>
                    <p className={`text-lg md:text-xl opacity-80 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Connecting worlds through information
                    </p>
                </div>

                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    {/* Social Media Section */}
                    <div className="text-center group">
                        <div className={`inline-block p-4 rounded-full mb-6 transition-all duration-500 group-hover:scale-110 ${
                            darkMode 
                                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30' 
                                : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30'
                        }`}>
                            <h3 className={`text-2xl font-bold ${
                                darkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                                Follow Us
                            </h3>
                        </div>
                        <div className="flex items-center justify-center gap-6">
                            {socialLinks.map((social: SocialLink, index: number) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-4 rounded-full transition-all duration-500 transform hover:scale-125 hover:rotate-12 ${
                                        darkMode 
                                            ? 'bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-sm border border-white/20 text-white hover:shadow-2xl hover:shadow-purple-500/50' 
                                            : 'bg-gradient-to-r from-white/70 to-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 hover:shadow-2xl hover:shadow-blue-500/30'
                                    }`}
                                    aria-label={`Follow us on ${social.icon.name}`}
                                >
                                    <social.icon className="text-2xl" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="text-center group">
                        <div className={`inline-block p-4 rounded-full mb-6 transition-all duration-500 group-hover:scale-110 ${
                            darkMode 
                                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30' 
                                : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30'
                        }`}>
                            <h3 className={`text-2xl font-bold ${
                                darkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                                Contact Us
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                                darkMode 
                                    ? 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20' 
                                    : 'bg-white/50 border-gray-200 text-gray-700 hover:bg-white/70'
                            }`}>
                                <p className="font-medium">📧 furqanktk52@gmail.com</p>
                            </div>
                            <div className={`p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                                darkMode 
                                    ? 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20' 
                                    : 'bg-white/50 border-gray-200 text-gray-700 hover:bg-white/70'
                            }`}>
                                <p className="font-medium">📱 +923141868872</p>
                            </div>
                        </div>
                    </div>

                    {/* Copyright Section */}
                    <div className="text-center group">
                        <div className={`inline-block p-4 rounded-full mb-6 transition-all duration-500 group-hover:scale-110 ${
                            darkMode 
                                ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm border border-pink-500/30' 
                                : 'bg-gradient-to-r from-blue-500/20 to-pink-500/20 backdrop-blur-sm border border-blue-500/30'
                        }`}>
                            <h3 className={`text-2xl font-bold ${
                                darkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                                Legacy
                            </h3>
                        </div>
                        <div className={`p-6 rounded-xl backdrop-blur-sm border transition-all duration-500 hover:scale-105 ${
                            darkMode 
                                ? 'bg-gradient-to-r from-white/10 to-white/20 border-white/20 text-gray-300' 
                                : 'bg-gradient-to-r from-white/50 to-white/70 border-gray-200 text-gray-700'
                        }`}>
                            <p className="text-lg font-medium">
                                &copy; 2024 INFORMATION WORLD
                            </p>
                            <p className="mt-2 opacity-80">
                                All rights reserved
                            </p>
                            <div className="mt-4 flex justify-center">
                                <div className={`w-16 h-1 rounded-full ${
                                    darkMode 
                                        ? 'bg-gradient-to-r from-purple-400 to-pink-400' 
                                        : 'bg-gradient-to-r from-blue-400 to-purple-400'
                                }`}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Wave Animation */}
                <div className="relative">
                    <div className={`h-32 w-full rounded-t-[100%] ${
                        darkMode 
                            ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20' 
                            : 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20'
                    }`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`text-sm opacity-70 ${
                                darkMode ? 'text-white' : 'text-gray-700'
                            }`}>
                                Made with ❤️ for the digital world
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-20px) rotate(90deg); }
                    50% { transform: translateY(-10px) rotate(180deg); }
                    75% { transform: translateY(-30px) rotate(270deg); }
                }
                
                .animate-float {
                    animation: float linear infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.4; }
                }
            `}</style>
        </footer>
    );
};

export default Footer;