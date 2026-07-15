"use client";

import dynamic from "next/dynamic";

// AudioDemoSection — uses Howler.js which requires browser APIs
export const DynamicAudioDemoSection = dynamic(
  () =>
    import("@/components/marketing/audio-demo-section").then((m) => ({
      default: m.AudioDemoSection,
    })),
  { ssr: false }
);

// CalculatorSection — heavy interactive sliders, client-only for performance
export const DynamicCalculatorSection = dynamic(
  () =>
    import("@/components/marketing/calculator-section").then((m) => ({
      default: m.CalculatorSection,
    })),
  { ssr: false }
);
