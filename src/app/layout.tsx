import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/Context/AppContext";
import SmoothScroll from "@/Components/SmoothScroll";
import Client3DBackground from "@/Components/Background/Client3DBackground";
import LayoutWrapper from "@/Components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Furqan Khattak | Front-End Developer",
  description: "Portfolio of Furqan Khattak — Front-End Developer specialising in React, Next.js, and 3D web experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProvider>
          <SmoothScroll>
            {/* Global 3D Background (Client-side rendered) */}
            <Client3DBackground />

            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </SmoothScroll>
        </AppProvider>
      </body>
    </html>
  );
}
