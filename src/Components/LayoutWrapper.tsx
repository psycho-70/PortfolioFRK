"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/Components/Header&Footer/Navbar";
import Footer from "@/Components/Header&Footer/Footer";
import ChatbotToggle from "@/Components/ChatBot/ToggleButton";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith("/admin");

    return (
        <div className="relative z-10">
            {!isAdminPage && <Navbar />}
            <main>{children}</main>
            {!isAdminPage && <Footer />}
            {!isAdminPage && <ChatbotToggle />}
        </div>
    );
}
