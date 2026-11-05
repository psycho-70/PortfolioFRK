'use client';
import HeroSection from "./HeroSection";
import ContactContent from "./ContactContent";
import MetricsStrip from "./MetricsStrip";
import TechStack from "./TechStack";
import Iconlist from './IconList';
import TestimonialsSection from './Testimonal';

const MainLayout: React.FC = () => {
    return (
        <div className="relative  mx-auto overflow-x-hidden">

            <HeroSection />

            <div className="w-full mt-20 z-10">
                <Iconlist />
            </div>
            <div className="w-full px-4 py-12 flex flex-col items-center gap-16">
                <MetricsStrip />
            </div>

            <TechStack />

            <div id="contact_preview">
                <ContactContent />
                <TestimonialsSection />
            </div>
        </div>
    );
};

export default MainLayout;
