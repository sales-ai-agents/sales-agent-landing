"use client";

import dynamic from "next/dynamic";

// DemoCallCard — uses useState, fetch, phone formatting (Client Island inside HeroSection)
export const DynamicDemoCallCard = dynamic(
  () => import("@/components/marketing/demo-call-card"),
  { ssr: false }
);

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

// BuilderSection — uses livekit-client which reads browser APIs at module init
export const DynamicBuilderSection = dynamic(
  () =>
    import("@/components/marketing/builder-section").then((m) => ({
      default: m.BuilderSection,
    })),
  { ssr: false }
);
