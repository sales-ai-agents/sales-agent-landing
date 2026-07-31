import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const actayWideBold = localFont({
  src: "../fonts/ActayWide-Bold.woff2",
  variable: "--font-actay-wide",
  weight: "700",
  display: "swap",
  fallback: ["Inter", "sans-serif"],
});

const gilroy = localFont({
  src: "../fonts/Gilroy-SemiBold.woff",
  variable: "--font-gilroy-face",
  weight: "600",
  display: "swap",
  fallback: ["Inter", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "calls4u — AI Phone Call Automation",
    template: "%s | calls4u",
  },
  description: "Automate routine phone calls with AI voice agents. Built for small businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${inter.variable} ${actayWideBold.variable} ${gilroy.variable}`}>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
