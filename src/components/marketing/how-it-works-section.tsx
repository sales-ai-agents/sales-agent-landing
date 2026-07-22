import Image from "next/image";
import { cn } from "@/lib/utils";

const steps = [
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
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Heading */}
        <div className="mb-16 max-w-2xl text-center lg:text-left">
          <h2 className="font-display mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            До першого тестового дзвінка – <span className="text-primary">4 кроки</span>
          </h2>
          <p className="text-text-secondary mx-auto max-w-lg text-lg lg:mx-0">
            Оберіть сценарій, налаштуйте голос, додайте контакти і перевірте дзвінок на собі перед
            запуском.
          </p>
        </div>

        {/* Steps grid — horizontal on desktop, vertical stack on mobile with zigzag */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={cn("flex flex-col", index % 2 !== 0 && "ml-8 md:ml-0")}
            >
              {/* Title above card */}
              <p className="font-heading text-text-primary mb-8 text-lg font-semibold">
                {step.title}
              </p>

              {/* Card container */}
              <div
                className={cn(
                  "relative flex h-36 flex-col",
                  "rounded-card border-border bg-card-glass backdrop-blur-card border"
                )}
              >
                {/* Step number watermark */}
                <span
                  className="text-primary/15 pointer-events-none absolute -top-10 left-2 text-8xl font-bold select-none"
                  aria-hidden="true"
                >
                  {step.number}
                </span>

                {/* Description text */}
                <p className="text-text-primary relative z-10 flex-1 px-4 pt-6 text-base font-normal">
                  {step.description}
                </p>

                {/* Arrow at bottom-right */}
                <div className="flex justify-end px-4 pb-3">
                  <Image
                    src="/image/how-arrow.svg"
                    alt=""
                    width={28}
                    height={12}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
