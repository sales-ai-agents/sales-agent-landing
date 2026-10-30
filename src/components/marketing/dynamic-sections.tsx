"use client";

import dynamic from "next/dynamic";

export const DynamicDemoCallCard = dynamic(() => import("@/components/marketing/demo-call-card"), {
  ssr: false,
});

export const DynamicAudioDemoSection = dynamic(
  () =>
    import("@/components/marketing/audio-demo-section").then((m) => ({
      default: m.AudioDemoSection,
    })),
  { ssr: false }
);

export const DynamicVideoSection = dynamic(
  () =>
    import("@/components/marketing/video-section").then((m) => ({
      default: m.VideoSection,
    })),
  { ssr: false }
);

export const DynamicBuilderSection = dynamic(
  () =>
    import("@/components/marketing/builder-section").then((m) => ({
      default: m.BuilderSection,
    })),
  { ssr: false }
);
