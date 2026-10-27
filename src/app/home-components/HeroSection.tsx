'use client';
import { useState, useEffect, useRef } from 'react';
import { FaGithub, FaWhatsapp, FaLinkedin, FaDownload, FaX, FaEye, FaRocket, FaFacebook } from 'react-icons/fa6';
import Link from 'next/link';
import { useAppContext } from '@/Context/AppContext';
import TypingEffect from '@/Components/UI/TypingEffect';
import { Outfit } from 'next/font/google';
import Iconlist from '@/Components/UI/IconList';
import RollingText from '@/Components/UI/RollingText';
import HeroImage3D from './HeroImage3d';
import gsap from 'gsap';
import { motion } from 'framer-motion';
const outfit = Outfit({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '900'],
});

const socials = [
    { icon: <FaLinkedin />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/furqan-ktk-856552191', color: 'hover:text-blue-500' },
    { icon: <FaGithub />, label: 'GitHub', href: 'https://github.com/psycho-70', color: 'hover:text-gray-400' },
    // wa.me needs the international format with no leading 0 (92 = Pakistan)
    { icon: <FaWhatsapp />, label: 'WhatsApp', href: 'https://wa.me/923141868872', color: 'hover:text-green-500' },
    { icon: <FaFacebook />, label: 'Facebook', href: 'https://web.facebook.com/furqan.don.771/', color: 'hover:text-blue-600' },
];


const HeroSection = () => {
    const { darkMode } = useAppContext();
    const [isCVModalOpen, setIsCVModalOpen] = useState<boolean>(false);
    const [pdfError, setPdfError] = useState<boolean>(false);
    const [pdfLoading, setPdfLoading] = useState<boolean>(false);
    const sectionRef = useRef<HTMLElement>(null);

    const pdfUrl: string = '/Furqan_Ullah.pdf';
    const nameTexts: string[] = ['Furqan Khattak', 'Web Developer', 'UI/UX Visionary'];
    const skillTexts: string[] = ['Creative Coding', 'Next.js Mastery', 'Digital Design'];

    // One orchestrated entrance for the text column
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hero-content > *', {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out',
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const handleDownloadCV = (): void => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'Furqan_Ullah_CV.pdf';
        link.click();
    };

    const handleOpenCVModal = async (): Promise<void> => {
        setPdfLoading(true);
        setPdfError(false);
        try {
            const response = await fetch(pdfUrl);
            if (!response.ok) throw new Error('PDF not found');
            setIsCVModalOpen(true);
        } catch {
            setPdfError(true);
        } finally {
            setPdfLoading(false);
        }
    };

    const muted = darkMode ? 'text-gray-400' : 'text-gray-600';

    return (
        <section
            ref={sectionRef}
            className={`relative min-h-fit w-full flex flex-col justify-center items-center overflow-hidden py-28 px-6 ${outfit.className}`}
        >
            {/* Background: soft glow + faint grid */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                {/* <div className="absolute -top-40 right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-600/20 blur-[140px]" />
                <div className="absolute bottom-0 left-[-10%] h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[120px]" /> */}
                {/* <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage:
                            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
                        backgroundSize: '56px 56px',
                        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
                    }}
                /> */}
            </div>

            <div className="max-w-[1500px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left: content */}
                <div className="hero-content flex flex-col gap-6 text-left order-2 lg:order-1">
                    

                    <h1 className={`text-3xl md:text-4xl xl:text-5xl font-black leading-[1.05] tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <RollingText text="Empowering" />
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 min-h-[1.1em]">
                            <TypingEffect texts={nameTexts} typingSpeed={100} deletingSpeed={50} delayBetweenTexts={2000} />
                        </span>
                    </h1>

                    <h2 className={`text-xl md:text-2xl font-medium ${muted}`}>
                        Specializing in{' '}
                        <span className="text-purple-500 font-bold italic">
                            <TypingEffect texts={skillTexts} typingSpeed={80} deletingSpeed={40} delayBetweenTexts={1500} />
                        </span>
                    </h2>

                    <p className={`text-lg max-w-lg leading-relaxed ${muted}`}>
                        I breathe life into digital canvases. As a creative developer with over 2 years of experience,
                        I bridge the gap between design and technology to build immersive experiences.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-2">
                        <button
                            onClick={handleOpenCVModal}
                            disabled={pdfLoading}
                            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-70 text-white rounded-2xl font-semibold shadow-lg shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
                        >
                            <FaEye /> {pdfLoading ? 'Loading...' : 'View CV'}
                        </button>
                        <Link
                            href="#project"
                            className="px-8 py-4 bg-white/10 dark:bg-white/5 border border-white/20 hover:bg-white/20 backdrop-blur-md rounded-2xl font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
                        >
                            <FaRocket className="text-purple-500" /> Explore work
                        </Link>
                    </div>
                    {pdfError && (
                        <p role="alert" className="text-sm text-red-400">
                            The CV file could not be loaded. Check that {pdfUrl} exists in /public.
                        </p>
                    )}

                    <div className="flex gap-2 mt-2">
                        {socials.map((s) => (
                            <a
                                key={s.label}
                                aria-label={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-2xl ${darkMode ? 'text-gray-500' : 'text-gray-400'} ${s.color} transition-colors p-2 hover:bg-white/5 rounded-xl`}
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right: 3D image — the one bold element */}
                <div className="relative order-1 lg:order-2">
                    <HeroImage3D src="/furqan.png" className="w-full h-[420px] md:h-[560px] lg:h-[620px] cursor-crosshair" />
                </div>
            </div>

            

            {/* CV modal */}
            {isCVModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/40" role="dialog" aria-modal="true">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900 border border-white/10 w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl text-white"
                    >
                        <div className="p-6 flex justify-between items-center bg-white/5 border-b border-white/10">
                            <h3 className="text-xl font-bold">Curriculum Vitae</h3>
                            <div className="flex gap-4">
                                <button aria-label="Download CV" onClick={handleDownloadCV} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <FaDownload />
                                </button>
                                <button aria-label="Close" onClick={() => setIsCVModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <FaX />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-white">
                            <iframe src={pdfUrl} title="Curriculum Vitae" className="w-full h-full border-none" />
                        </div>
                    </motion.div>
                </div>
            )}
        </section>
    );
};

export default HeroSection;