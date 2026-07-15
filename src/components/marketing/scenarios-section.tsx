import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const scenarios = [
  {
    title: "Підтвердження запису",
    details: [
      { label: "Для кого:", value: "салони, клініки, СТО" },
      { label: "Питає:", value: "чи клієнт прийде у вибраний час" },
      { label: "Результат:", value: "підтверджено / перенос" },
    ],
  },
  {
    title: "Нагадування про візит",
    details: [
      { label: "Для кого:", value: "послуги за записом" },
      { label: "Робить:", value: "нагадує дату, час і деталі" },
      { label: "Результат:", value: "менше ручних дзвінків" },
    ],
  },
  {
    title: "Уточнення замовлення",
    details: [
      { label: "Для кого:", value: "інтернет-магазини" },
      { label: "Питає:", value: "товар, адресу, доставку" },
      { label: "Результат:", value: "замовлення готове до обробки" },
    ],
  },
  {
    title: "Кваліфікація ліда",
    details: [
      { label: "Для кого:", value: "заявки з реклами" },
      { label: "Питає:", value: "потребу, бюджет, термін" },
      { label: "Результат:", value: "тепла заявка для менеджера" },
    ],
  },
  {
    title: "Повторний дзвінок",
    details: [
      { label: "Для кого:", value: "клієнти з бази" },
      { label: "Робить:", value: "пропонує запис або послугу" },
      { label: "Результат:", value: "статус і наступна дія" },
    ],
  },
  {
    title: "Власний сценарій",
    details: [
      { label: "Для кого:", value: "нестандартні процеси" },
      { label: "Робить:", value: "говорить вашими фразами" },
      { label: "Результат:", value: "сценарій під конкретний бізнес" },
    ],
  },
];

export function ScenariosSection() {
  return (
    <section id="features" className="bg-section-tinted py-20">
      <div className="mx-auto max-w-5xl px-5">
        {/* Heading */}
        <h2 className="mb-5 text-4xl leading-tight text-text-primary md:text-5xl">
          <span className="font-semibold">Дзвінки,</span>{" "}
          <span className="font-light">які агент може забрати одразу</span>
        </h2>

        {/* Subtitle */}
        <p className="mb-14 max-w-lg text-lg font-normal tracking-wide text-text-primary">
          Не треба писати сценарій з нуля. Виберіть тип дзвінка, адаптуйте
          кілька фраз під бізнес і запускайте тест.
        </p>

        {/* 3×2 Grid */}
        <div className="mb-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario) => (
            <ScenarioCard key={scenario.title} scenario={scenario} />
          ))}
        </div>

        {/* Bottom row: text + button (right-aligned) */}
        <div className="flex flex-col items-end gap-4">
          <p className="max-w-xs text-right text-base tracking-wide text-text-secondary">
            Почніть з готового сценарію, фрази можна{" "}
            <span className="font-medium">змінити під ваш бізнес.</span>
          </p>
          <Link
            href="/sign-up"
            aria-label="Вибрати сценарій і запустити тест"
            className="inline-flex h-12 items-center gap-3.5 rounded-full bg-primary px-6 text-lg font-normal text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Вибрати сценарій і запустити тест
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

interface ScenarioCardProps {
  scenario: {
    title: string;
    details: { label: string; value: string }[];
  };
}

function ScenarioCard({ scenario }: ScenarioCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 rounded-2xl border border-border/50 bg-card-glass backdrop-blur-sm" />

      {/* Blue circle — positioned at left edge, partially clipped */}
      <div
        className="absolute -left-4 top-4 size-16 rounded-full bg-primary"
        aria-hidden="true"
      />

      {/* Content — left padding clears the circle */}
      <div className="relative pb-6 pl-16 pr-6 pt-10">
        {/* Title */}
        <h3 className="mb-3 text-base font-medium text-text-primary">
          {scenario.title}
        </h3>

        {/* Details */}
        <div className="space-y-0.5">
          {scenario.details.map((detail) => (
            <p
              key={detail.label}
              className="text-sm leading-relaxed tracking-wide text-text-primary"
            >
              <span className="font-medium">{detail.label}</span>{" "}
              <span className="font-light">{detail.value}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
