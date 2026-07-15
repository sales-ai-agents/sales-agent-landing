import { FileText, Settings, Users, PhoneCall, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Оберіть сценарій",
    description:
      "Готовий шаблон для запису, нагадування, замовлення або заявки.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Налаштуйте агента",
    description:
      "Виберіть голос, додайте фрази і правила розмови для агента.",
    icon: Settings,
  },
  {
    number: "03",
    title: "Додайте контакти",
    description:
      "Завантажте номери через CSV, Google Sheets або підключену CRM.",
    icon: Users,
  },
  {
    number: "04",
    title: "Перевірте дзвінок",
    description:
      "Перевірте сценарій на собі, і тільки потім запускайте дзвінки клієнтам.",
    icon: PhoneCall,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Heading */}
        <div className="mb-16">
          <h2 className="mb-4 text-4xl leading-tight tracking-tight md:text-5xl">
            <span className="font-light">До першого тестового дзвінка –</span>{" "}
            <span className="font-semibold">4 кроки</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-tight tracking-wide text-text-primary">
            Оберіть сценарій, налаштуйте голос, додайте контакти і перевірте
            дзвінок на собі перед запуском.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex items-start gap-3">
                {/* Step card with watermark */}
                <div className="w-full">
                  {/* Title above card */}
                  <p className="mb-1 text-lg font-semibold leading-tight tracking-wide text-black">
                    {step.title}
                  </p>

                  {/* Card container */}
                  <div className="relative h-32 max-w-64 overflow-hidden rounded-2xl border border-border bg-card-glass backdrop-blur-sm">
                    {/* Step number watermark */}
                    <span
                      className="pointer-events-none absolute -top-2 left-0 select-none text-8xl font-semibold uppercase leading-tight tracking-wider text-primary/[0.17]"
                      aria-hidden="true"
                    >
                      {step.number}
                    </span>

                    {/* Description text */}
                    <p className="relative z-10 px-4 pt-5 text-lg font-normal leading-snug tracking-wide text-black">
                      {step.description}
                    </p>

                    {/* Decorative icon bottom-right */}
                    <Icon
                      className="absolute bottom-3 right-3 size-5 text-border"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Arrow between cards (hidden on last card and on mobile) */}
                {index < steps.length - 1 && (
                  <ArrowRight
                    className="mt-10 hidden size-4 shrink-0 text-text-secondary/60 lg:block"
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
