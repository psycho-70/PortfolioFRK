'use client';
import { motion, useScroll } from 'framer-motion';

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-50"
            style={{ scaleX: scrollYProgress }}
        />
    );
}
