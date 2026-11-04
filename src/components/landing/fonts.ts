import { Geologica, Inter_Tight, JetBrains_Mono } from "next/font/google";

const bodyFont = Inter_Tight({
  subsets: ["latin", "cyrillic"],
  variable: "--font-c4u-body",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const displayFont = Geologica({
  subsets: ["latin", "cyrillic"],
  axes: ["SHRP"],
  variable: "--font-c4u-display",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const monoFont = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  preload: false,
  variable: "--font-c4u-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const LANDING_FONT_CLASSES = `${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`;
