"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { Drawer, IconButton, Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAppContext } from "@/Context/AppContext";
// Type definitions
interface NavItem {
  name: string;
  color: string;
}

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Enhanced Material UI Switch for Dark Mode
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 70,
  height: 38,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(24px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    width: 34,
    height: 34,
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    background: 'linear-gradient(45deg, #ffeaa7 0%, #fab1a0 100%)',
    borderRadius: 20 / 2,
  },
}));

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [activeItem, setActiveItem] = useState<string>("Home");

  const { darkMode, toggleDarkMode }: AppContextType = useAppContext();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setIsMenuOpen(open);
  };

  const handleScroll = (): void => {
    if (typeof window !== "undefined") {
      const currentScrollY: number = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      setLastScrollY(currentScrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [lastScrollY]);

  const navItems: NavItem[] = [
    { name: "Home", color: "from-pink-500 to-rose-500" },
    { name: "Skill", color: "from-blue-500 to-cyan-500" },
    { name: "Project", color: "from-green-500 to-teal-500" },
    { name: "Services", color: "from-yellow-500 to-orange-500" },
    { name: "Team", color: "from-red-500 to-pink-500" },
    { name: "Experience", color: "from-purple-500 to-indigo-500" },
  ];

  const handleNavItemClick = (itemName: string): void => {
    setActiveItem(itemName);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isNavbarVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Main Navbar */}
        <div className={`relative ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-r from-white via-gray-50 to-white'
        } backdrop-blur-md shadow-2xl border-b ${
          darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute top-0 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              
              {/* Logo Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <Link href="#home" aria-label="Home">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <div className="relative p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
                      <Image
                        src={darkMode ? '/seclogo.png' : '/firstlogo.png'}
                        width={100}
                        height={50}
                        alt="Company Logo"
                        className="transition-transform duration-300 group-hover:scale-105"
                        priority
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item: NavItem, index: number) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group"
                  >
                    <Link 
                      href={`#${item.name.toLowerCase()}`}
                      onClick={() => handleNavItemClick(item.name)}
                      aria-label={`Navigate to ${item.name}`}
                    >
                      <div className="relative px-4 py-2 rounded-full transition-all duration-300 group-hover:scale-105">
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300`}></div>
                        
                        {/* Text */}
                        <span className={`relative text-lg font-medium transition-all duration-300 ${
                          activeItem === item.name 
                            ? `bg-gradient-to-r ${item.color} bg-clip-text text-transparent` 
                            : darkMode 
                              ? 'text-gray-300 group-hover:text-white' 
                              : 'text-gray-700 group-hover:text-gray-900'
                        }`}>
                          {item.name}
                        </span>

                        {/* Animated Underline */}
                        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r ${item.color} transition-all duration-300 ${
                          activeItem === item.name ? 'w-full' : 'w-0 group-hover:w-3/4'
                        } rounded-full`}></div>

                        {/* Hover Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 rounded-full blur-lg transition-opacity duration-300`}></div>
                      </div>
                    </Link>
                  </motion.div>
                ))}

                {/* Dark Mode Switch */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="ml-4"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-25"></div>
                    <div className="relative">
                      <MaterialUISwitch 
                        checked={darkMode} 
                        onChange={toggleDarkMode} 
                        inputProps={{ 'aria-label': 'Toggle dark mode' }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-25"></div>
                  <IconButton 
                    onClick={toggleDrawer(true)}
                    className={`relative ${
                      darkMode ? 'text-white' : 'text-gray-700'
                    } p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-full`}
                    aria-label="Open navigation menu"
                  >
                    <IoMdMenu size={28} />
                  </IconButton>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={isMenuOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            style: {
              width: "85%",
              maxWidth: "400px",
              background: darkMode 
                ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' 
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          <div className="relative h-full">
            {/* Decorative Background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-xl"></div>
            </div>

            <div className="relative z-10 p-6">
              {/* Close Button */}
              <div className="flex justify-end mb-8">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton 
                    onClick={toggleDrawer(false)}
                    className={`${
                      darkMode ? 'text-white' : 'text-gray-700'
                    } p-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-sm rounded-full`}
                    aria-label="Close navigation menu"
                  >
                    <IoMdClose size={28} />
                  </IconButton>
                </motion.div>
              </div>

              {/* Mobile Navigation Items */}
              <div className="space-y-4">
                {navItems.map((item: NavItem, index: number) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative group"
                  >
                    <Link 
                      href={`#${item.name.toLowerCase()}`}
                      onClick={() => handleNavItemClick(item.name)}
                      aria-label={`Navigate to ${item.name}`}
                    >
                      <div className={`relative p-4 rounded-2xl transition-all duration-300 group-hover:scale-105 ${
                        darkMode ? 'bg-gray-800/50' : 'bg-white/50'
                      } backdrop-blur-sm border ${
                        darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
                      }`}>
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                        
                        {/* Content */}
                        <div className="relative flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color} ${
                            activeItem === item.name ? 'opacity-100' : 'opacity-50'
                          }`}></div>
                          <span className={`text-xl font-medium transition-all duration-300 ${
                            activeItem === item.name 
                              ? `bg-gradient-to-r ${item.color} bg-clip-text text-transparent` 
                              : darkMode 
                                ? 'text-gray-300 group-hover:text-white' 
                                : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {item.name}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Dark Mode Switch for Mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8 flex items-center justify-center"
              >
                <div className={`p-4 rounded-2xl ${
                  darkMode ? 'bg-gray-800/50' : 'bg-white/50'
                } backdrop-blur-sm border ${
                  darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
                }`}>
                  <div className="flex items-center space-x-4">
                    <span className={`text-lg font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {darkMode ? 'Dark Mode' : 'Light Mode'}
                    </span>
                    <MaterialUISwitch 
                      checked={darkMode} 
                      onChange={toggleDarkMode} 
                      inputProps={{ 'aria-label': 'Toggle dark mode' }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Drawer>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;