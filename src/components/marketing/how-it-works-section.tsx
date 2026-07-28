import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingStep } from "@/types";

const steps: readonly OnboardingStep[] = [
  {
    number: "01",
    title: "Оберіть сценарій",
    description:
      "Готовий шаблон для запису, нагадування, замовлення або заявки.",
  },
  {
    number: "02",
    title: "Налаштуйте агента",
    description:
      "Виберіть голос, додайте фрази і правила розмови для агента.",
  },
  {
    number: "03",
    title: "Додайте контакти",
    description:
      "Завантажте номери через CSV, Google Sheets або підключену CRM.",
  },
  {
    number: "04",
    title: "Перевірте дзвінок",
    description:
      "Перевірте сценарій на собі, і тільки потім запускайте дзвінки клієнтам.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-12 max-w-2xl text-center lg:text-left">
          <h2 className="font-display mb-4 text-3xl sm:text-4xl md:text-5xl">
            <span className="text-black">До першого тестового дзвінка - </span>
            <span className="text-primary">4 кроки</span>
          </h2>
          <p className="mx-auto max-w-md text-base text-black lg:mx-0 lg:max-w-lg lg:text-lg">
            Оберіть сценарій, налаштуйте голос, додайте контакти і перевірте дзвінок на собі перед
            запуском.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={cn("flex items-center gap-3", index % 2 !== 0 && "ml-8 md:ml-0")}
            >
              {/* Step card */}
              <div className="flex w-full flex-col">
                {/* Title above card */}
                <h3 className="mb-8 text-lg font-semibold text-black">{step.title}</h3>

                {/* Card with watermark behind */}
                <div className="relative">
                  {/* Watermark number behind */}
                  <span
                    className="pointer-events-none absolute -top-8 left-0 text-8xl font-semibold tracking-wide text-gray-200"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>

                  {/* Glass card */}
                  <div className="border-border bg-card-glass relative flex h-32 flex-col justify-between rounded-2xl border p-4 opacity-80 backdrop-blur-sm">
                    <p className="text-base text-black">{step.description}</p>
                    <span className="text-primary self-end text-2xl font-semibold">
                      {step.number}
                    </span>
                  </div>
                </div>
              </div>

              {/* Arrow separator */}
              {index < steps.length - 1 && (
                <div className="hidden shrink-0 self-end pb-2 lg:block">
                  <ArrowRight className="text-primary size-6" aria-hidden="true" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
