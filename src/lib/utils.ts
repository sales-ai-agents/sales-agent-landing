import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CalculatorInputs, FaqEntry } from "@/types";

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
