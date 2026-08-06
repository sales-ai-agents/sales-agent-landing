import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CalculatorInputs, FaqEntry, OnboardingStep } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formats up to 9 raw UA subscriber digits into the display pattern: __ ___ __ __
export function formatUaPhoneDigits(digits: string): string {
  const cleaned = digits.replace(/\D/g, "").slice(0, 9);

  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 5) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
  if (cleaned.length <= 7)
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;

  return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
}

// ROI Calculator Helpers
export function calcHoursPerDay(inputs: CalculatorInputs): number {
  return Number(((inputs.callsPerDay * inputs.avgDuration) / 60).toFixed(1));
}

// FAQ Schema Builder
export function buildFaqPageSchema(faqs: readonly FaqEntry[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: typeof faq.answer === "string" ? faq.answer : (faq.textAnswer ?? ""),
      },
    })),
  };
}

// Organization Schema Builder (GEO + SEO)
export function buildOrganizationSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Calls4U",
    url: "https://www.calls4u.ai",
    logo: "https://www.calls4u.ai/image/Logo.svg",
    description:
      "Calls4U — платформа голосових ШІ-агентів для автоматизації рутинних дзвінків малого та середнього бізнесу в Україні.",
    email: "salesagentswork@gmail.com",
    telephone: "+380914810542",
    areaServed: {
      "@type": "Country",
      name: "Ukraine",
    },
    serviceType: "AI Voice Agent Platform",
    knowsLanguage: ["uk", "ru"],
    sameAs: [],
  };
}

// HowTo Schema Builder (GEO — step-by-step for AI extraction)
export function buildHowToSchema(steps: readonly OnboardingStep[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Як запустити ШІ-агента для дзвінків за 4 кроки",
    description:
      "Покрокова інструкція створення голосового AI-агента для автоматизації дзвінків клієнтам на платформі calls4u.",
    totalTime: "PT15M",
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };
}
