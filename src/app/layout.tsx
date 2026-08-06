import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import { GoogleAnalytics } from "@/lib/google-analytics";
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
  metadataBase: new URL("https://www.calls4u.ai"),
  title: {
    default: "Calls4U | ШІ-агент для бізнесу",
    template: "%s | Calls4U",
  },
  description:
    "Calls4U — голосовий ШІ-агент, який телефонує клієнтам за вас: підтверджує записи, нагадує про візити, уточнює замовлення та передає результат у CRM. Запуск за 1 день, без програмістів.",
  alternates: {
    canonical: "/",
    languages: {
      uk: "https://www.calls4u.ai",
      ru: "https://www.calls4u.ai",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: "Calls4U",
    url: "https://www.calls4u.ai",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/twitter-image.jpg"],
  },
  keywords: [
    "Calls4U",
    "ШІ-агент",
    "голосовий агент",
    "автоматизація дзвінків",
    "AI voice agent",
    "підтвердження запису",
    "CRM інтеграція",
    "автодзвінки",
    "голосовий бот",
    "штучний інтелект для бізнесу",
    "автоматизація бізнесу Україна",
    "ШІ-агент для бізнесу",
    "ИИ-агент для бизнеса",
    "голосовой бот",
    "автоматизация звонков",
    "ИИ-агент для звонков",
    "голосовой агент",
    "автоматизация бизнеса",
    "подтверждение записи",
    "CRM интеграция",
  ],
  other: {
    "geo.region": "UA",
    "geo.placename": "Україна",
    "content-language": "uk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${inter.variable} ${actayWideBold.variable} ${gilroy.variable}`}>
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
