import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geologica, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./calls4u.css";

const bodyFont = Inter_Tight({
  subsets: ["latin", "cyrillic"],
  variable: "--font-c4u-body",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: false,
});

const displayFont = Geologica({
  subsets: ["latin", "cyrillic"],
  axes: ["SHRP"],
  variable: "--font-c4u-display",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: false,
});

const monoFont = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-c4u-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
  adjustFontFallback: false,
});

const ANIMATION_BOOT_SCRIPT = `(function(){var r=document.currentScript&&document.currentScript.parentElement;if(!r||matchMedia('(prefers-reduced-motion: reduce)').matches)return;r.setAttribute('data-anim','');setTimeout(function(){if(!r.hasAttribute('data-anim-ready'))r.removeAttribute('data-anim')},4000)})();`;

export const metadata: Metadata = {
  title: "Calls4U — ШІ-агент дзвонить за вас",
  description:
    "Calls4U — голосовий ШІ-агент, який підтверджує записи, нагадує про візити, уточнює замовлення, кваліфікує ліди та фіксує результат у CRM. Економить до 70% часу менеджера. Запуск за 1 день.",
  alternates: { canonical: "/landing" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Calls4U — ШІ-агент дзвонить за вас",
    description:
      "Голосовий ШІ-агент підтверджує записи, нагадує про візити й передає результат у CRM. Запуск за 1 день, без програмістів.",
    type: "website",
    url: "https://www.calls4u.ai/landing",
    locale: "uk_UA",
    siteName: "Calls4U",
  },
};

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} c4u`}
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: ANIMATION_BOOT_SCRIPT }} />
      {children}
    </div>
  );
}
