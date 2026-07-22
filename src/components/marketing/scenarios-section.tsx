import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
    <section id="features" className="bg-section-tinted px-10 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <h2 className="font-display text-text-primary mb-8 max-w-2xl text-4xl md:text-5xl">
          <span className="text-primary font-bold">Дзвінки,</span>{" "}
          <span className="font-bold">які агент може забрати одразу</span>
        </h2>

        {/* Subtitle */}
        <p className="text-text-primary mb-20 max-w-lg text-lg font-normal">
          Не треба писати сценарій з нуля. Виберіть тип дзвінка, адаптуйте кілька фраз під бізнес і
          запускайте тест.
        </p>

        {/* 3×2 Grid */}
        <div className="mb-18 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario, index) => (
            <ScenarioCard key={scenario.title} scenario={scenario} index={index} />
          ))}
        </div>

        {/* Bottom row: text + button (right-aligned) */}
        <div className="flex flex-col items-end gap-4">
          <p className="text-text-secondary max-w-xs text-base">
            Почніть з готового сценарію, фрази можна{" "}
            <span className="font-medium">змінити під ваш бізнес.</span>
          </p>
          <Link
            href="/sign-up"
            aria-label="Вибрати сценарій і запустити тест"
            className="rounded-badge bg-primary text-primary-foreground hover:bg-primary-hover inline-flex h-12 items-center gap-3.5 px-6 text-lg font-normal transition-colors"
          >
            Вибрати сценарій і запустити тест
            <ArrowUpRight className="size-6" aria-hidden="true" />
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
  index: number;
}

function ScenarioCard({ scenario, index }: ScenarioCardProps) {
  const isEven = index % 2 === 0;

  return (
    <div className="relative">
      <div
        className={cn(
          "bg-primary absolute -top-5 size-14 rounded-full md:-top-5 md:-left-5",
          isEven ? "-left-5" : "-right-5"
        )}
        aria-hidden="true"
      />

      {/* Card body — relative for stacking context */}
      <div className="rounded-card border-border bg-card-glass backdrop-blur-card relative h-full border py-5 pr-5 pl-15">
        {/* Title */}
        <h3 className="text-text-primary mb-3 text-base font-semibold">{scenario.title}</h3>

        {/* Details */}
        <div>
          {scenario.details.map((detail) => (
            <p key={detail.label} className="text-text-primary text-sm">
              <span className="font-bold">{detail.label}</span>{" "}
              <span className="font-normal">{detail.value}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
