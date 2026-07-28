import Image from "next/image";
import type { OnboardingStep } from "@/types";

const steps: readonly OnboardingStep[] = [
  {
    number: "01",
    title: "Оберіть сценарій",
    description: "Готовий шаблон для запису, нагадування, замовлення або заявки.",
  },
  {
    number: "02",
    title: "Налаштуйте агента",
    description: "Виберіть голос, додайте фрази і правила розмови для агента.",
  },
  {
    number: "03",
    title: "Додайте контакти",
    description: "Завантажте номери через CSV, Google Sheets або підключену CRM.",
  },
  {
    number: "04",
    title: "Перевірте дзвінок",
    description: "Перевірте сценарій на собі, і тільки потім запускайте дзвінки клієнтам.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center md:text-left">
          <h2 className="font-display mb-4 text-3xl sm:text-4xl md:text-5xl">
            <span className="text-foreground">До першого тестового дзвінка - </span>
            <span className="text-primary">4 кроки</span>
          </h2>
          <p className="text-foreground mx-auto max-w-lg text-lg md:mx-0">
            Оберіть сценарій, налаштуйте голос, додайте контакти і перевірте дзвінок на собі перед
            запуском.
          </p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center gap-3">
              <div className="flex w-full flex-col md:w-64">
                <h3 className="text-foreground mb-6 text-xl font-semibold">{step.title}</h3>

                <div className="relative">
                  <span
                    className="font-display text-foreground/10 pointer-events-none absolute -top-6 left-0 text-8xl font-semibold tracking-wide uppercase"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>

                  <div className="border-border bg-card-glass relative flex h-32 flex-col justify-between rounded-2xl border p-4 backdrop-blur-sm">
                    <p className="text-foreground text-base">{step.description}</p>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-primary text-xl font-semibold">{step.number}</span>
                      {index < steps.length - 1 && (
                        <span className="text-primary md:hidden" aria-hidden="true">
                          →
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden shrink-0 self-end pb-4 md:block" aria-hidden="true">
                  <Image
                    src="/image/how-arrow.svg"
                    alt=""
                    width={31}
                    height={37}
                    className="pointer-events-none"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
