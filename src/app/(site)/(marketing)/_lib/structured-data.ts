import type { FaqEntry, OnboardingStep } from "@marketing/types";

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
