import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Geist_Mono } from "next/font/google";
import { ExperienceProvider } from "@/context/ExperienceContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A Cinematic Experience",
  description:
    "An ultra-premium cinematic interactive experience crafted with love.",
  robots: "noindex, nofollow",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-black font-sans antialiased">
        <ExperienceProvider>{children}</ExperienceProvider>
      </body>
    </html>
  );
}
