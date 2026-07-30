import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const actayWideBold = localFont({
  src: "../fonts/ActayWide-Bold.woff2",
  variable: "--font-display",
  weight: "700",
  fallback: ["Inter", "sans-serif"],
});

const gilroy = localFont({
  src: "../fonts/Gilroy-SemiBold.woff",
  variable: "--font-gilroy",
  weight: "600",
  fallback: ["Inter", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "VoiceAgent — AI Phone Call Automation",
    template: "%s | VoiceAgent",
  },
  description: "Automate routine phone calls with AI voice agents. Built for small businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${actayWideBold.variable} ${gilroy.variable}`}
    >
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
