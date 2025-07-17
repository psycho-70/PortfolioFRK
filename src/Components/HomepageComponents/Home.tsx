'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { MdOutlineFacebook } from "react-icons/md";
import { FaGithub, FaWhatsapp, FaLinkedin, FaYoutube, FaDownload, FaX, FaEye, FaRocket } from "react-icons/fa6";
import { Tooltip } from "@mui/material";
import Link from 'next/link';
import { useAppContext } from '@/Context/AppContext';
import TypingEffect from './TypingEffect';
import { Pacifico, Play } from 'next/font/google';
import Iconlist from './IconList';

// Font definitions
const pacifico = Pacifico({
    weight: '400',
    subsets: ['latin'],
});

const play = Play({
    weight: ['400', '700'],
    subsets: ['latin'],
});

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

const Home = () => {
    const { darkMode } = useAppContext();
    const [isCVModalOpen, setIsCVModalOpen] = useState<boolean>(false);
    const [pdfError, setPdfError] = useState<boolean>(false);
    const [pdfLoading, setPdfLoading] = useState<boolean>(false);

    const nameTexts: string[] = ["Furqan Khattak", "Web Developer", "Front End Developer"];
    const skillTexts: string[] = ["html", "css", "javascript", "node.js", "tailwindcss", "express.js", "next.js", "react"];

    // PDF path in public folder
    const pdfUrl: string = '/Furqan_Ullah.pdf';

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

    const handleDownloadCV = (): void => {
        try {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'Furqan_Ullah_CV.pdf';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
            window.open(pdfUrl, '_blank');
        }
    };

    const handleOpenCVModal = async (): Promise<void> => {
        setPdfLoading(true);
        setPdfError(false);

        try {
            const response = await fetch(pdfUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setIsCVModalOpen(true);
        } catch (error) {
            console.error('Error loading PDF:', error);
            setPdfError(true);
        } finally {
            setPdfLoading(false);
        }
    };

    const handleCloseCVModal = (): void => {
        setIsCVModalOpen(false);
        setPdfError(false);
    };

    return (
        <section className={`w-full z-20 relative overflow-hidden mx-auto ${darkMode
            ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900'
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} ${themeClasses.text} transition-all duration-500`}>
            <div className={`flex max-w-[1500px] mx-auto flex-wrap container ${themeClasses.text} justify-center items-start relative z-10`}>
                <motion.div
                    className={`text-center md:w-[50%] mt-16 md:mt-32 flex flex-col gap-8 px-6`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h1
                        className={`md:text-5xl text-3xl text-start font-bold leading-tight`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        I am{' '}
                        <span className={`${themeClasses.gradientText} bg-clip-text text-transparent font-extrabold`}>
                            <TypingEffect
                                texts={nameTexts}
                                typingSpeed={100}
                                deletingSpeed={50}
                                delayBetweenTexts={1000}
                            />
                        </span>
                    </motion.h1>

                    <motion.h2
                        className='text-start text-xl md:text-2xl font-semibold'
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Expertise{' '}
                        <span className={`${themeClasses.skillGradient} bg-clip-text text-transparent text-2xl md:text-3xl font-bold`}>
                            <TypingEffect
                                texts={skillTexts}
                                typingSpeed={150}
                                deletingSpeed={75}
                                delayBetweenTexts={800}
                            />
                        </span>
                    </motion.h2>

                    <motion.p
                        className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-start text-lg leading-relaxed w-full md:w-[520px] font-medium`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        I am a passionate Front-End Developer with over 2 years of hands-on experience in web
                        development using modern technologies like React.js, Next.js, Node.js, and Tailwind CSS. I am
                        currently working remotely with Precise Tech (Canada) as a Web Developer, contributing to
                        large-scale web applications, including ERP systems and e-commerce platforms.
                    </motion.p>

                    <motion.div
                        className="flex whitespace-nowrap gap-3 sm:gap-4 mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <button
                            type="button"
                            className={`flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-medium rounded-lg ${themeClasses.buttonPrimary} transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70`}
                            onClick={handleOpenCVModal}
                            disabled={pdfLoading}
                        >
                            <FaEye className="mr-2" />
                            {pdfLoading ? 'Loading...' : 'Preview CV'}
                        </button>

                        <Link href="#project" className="block">
                            <button className={`flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-medium rounded-lg ${themeClasses.buttonSecondary} transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
                                <FaRocket className="mr-2" />
                                Explore Projects
                            </button>
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div
                    className='mt-16 md:mt-24'
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div className="relative">
                        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl opacity-20' : 'bg-gradient-to-r from-blue-400 to-purple-400 blur-xl opacity-15'} rounded-full animate-pulse`}></div>
                        <Image
                            className={`profile-pic relative z-10 rounded-full ${darkMode ? 'shadow-2xl border-4 border-white/10' : 'shadow-xl border-4 border-white/30'} hover:scale-105 transition-transform duration-300`}
                            src="/fk.png"
                            width={400}
                            height={400}
                            alt="Profile"
                            priority
                        />
                    </div>
                </motion.div>

                <Iconlist />

                <motion.div
                    className="absolute top-[20%] md:block hidden right-[20px] z-20"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                >
                    <ul className="list-none space-y-6">
                        <li>
                            <Tooltip title="Facebook" arrow>
                                <a
                                    href="https://web.facebook.com/furqan.don.771/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`block p-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm`}
                                >
                                    <MdOutlineFacebook className="text-white text-2xl" />
                                </a>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip title="WhatsApp" arrow>
                                <a
                                    href="https://wa.me/03141868872"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`block p-3 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm`}
                                >
                                    <FaWhatsapp className="text-white text-2xl" />
                                </a>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip title="GitHub" arrow>
                                <a
                                    href="https://github.com/psycho-70"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`block p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm`}
                                >
                                    <FaGithub className="text-white text-2xl" />
                                </a>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip title="LinkedIn" arrow>
                                <a
                                    href="https://www.linkedin.com/in/furqan-ktk-856552191"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`block p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm`}
                                >
                                    <FaLinkedin className="text-white text-2xl" />
                                </a>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip title="YouTube" arrow>
                                <a
                                    href="https://www.youtube.com/@furqankhattak71"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`block p-3 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm`}
                                >
                                    <FaYoutube className="text-white text-2xl" />
                                </a>
                            </Tooltip>
                        </li>
                    </ul>
                </motion.div>
            </div>

            {/* Enhanced CV Preview Modal */}
            {isCVModalOpen && (
                <motion.div
                    className={`fixed inset-0 z-50 flex items-center justify-center ${themeClasses.modalBg} backdrop-blur-sm p-4`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={`relative ${themeClasses.cardBg} border ${themeClasses.cardBorder} backdrop-blur-sm rounded-3xl p-8 w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button
                            onClick={handleCloseCVModal}
                            className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 hover:scale-110 ${themeClasses.cardBg} border ${themeClasses.cardBorder} backdrop-blur-sm shadow-lg`}
                        >
                            <FaX className="text-xl" />
                        </button>

                        <h2 className={`text-3xl font-bold mb-6 ${themeClasses.gradientText} bg-clip-text text-transparent`}>
                            My CV Preview
                        </h2>

                        <div className="flex-1 mb-6 min-h-0">
                            {pdfError ? (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <p className="text-red-500 dark:text-red-400 mb-6 text-center text-lg">
                                        CV preview could not be loaded. Please try downloading instead.
                                    </p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleDownloadCV}
                                            className={`flex items-center gap-3 ${themeClasses.buttonSecondary} text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105`}
                                        >
                                            <FaDownload className="text-lg" /> Download CV
                                        </button>
                                        <button
                                            onClick={() => window.open(pdfUrl, '_blank')}
                                            className={`flex items-center gap-3 ${themeClasses.buttonPrimary} text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105`}
                                        >
                                            Open in New Tab
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className={`w-full h-full rounded-2xl overflow-hidden shadow-2xl`}>
                                    <iframe
                                        src={`${pdfUrl}#view=FitH`}
                                        className="w-full h-full border-0 rounded-2xl"
                                        title="CV Preview"
                                        onError={() => setPdfError(true)}
                                    >
                                        <p>Your browser does not support PDFs.
                                            <a href={pdfUrl} className="text-blue-500 underline">Download the PDF</a>.
                                        </p>
                                    </iframe>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center gap-6">
                            <button
                                onClick={handleDownloadCV}
                                className={`flex items-center gap-3 ${themeClasses.buttonSecondary} text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105 font-semibold`}
                            >
                                <FaDownload className="text-lg" /> Download CV
                            </button>
                            <button
                                onClick={() => window.open(pdfUrl, '_blank')}
                                className={`flex items-center gap-3 ${themeClasses.buttonPrimary} text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105 font-semibold`}
                            >
                                Open in New Tab
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
}

export default Home;