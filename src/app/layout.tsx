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
  metadataBase: new URL("https://www.calls4u.ai"),
  title: {
    default: "calls4u — ШІ-агент для автоматизації дзвінків",
    template: "%s | calls4u",
  },
  description:
    "Голосовий ШІ-агент автоматизує рутинні дзвінки клієнтам: підтверджує записи, нагадує про візити, уточнює замовлення та передає результат у CRM, без програмістів.",
  alternates: {
    canonical: "/",
    languages: {
      uk: "https://www.calls4u.ai",
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
    siteName: "calls4u",
    url: "https://www.calls4u.ai",
  },
  twitter: {
    card: "summary_large_image",
  },
  keywords: [
    "ШІ-агент",
    "голосовий агент",
    "автоматизація дзвінків",
    "AI voice agent",
    "calls4u",
    "підтвердження запису",
    "CRM інтеграція",
    "автодзвінки",
    "голосовий бот",
    "штучний інтелект для бізнесу",
    "автоматизація бізнесу Україна",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
