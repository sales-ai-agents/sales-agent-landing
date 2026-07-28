import Link from "next/link";
import {
  ArrowUpRight,
  ClipboardCheck,
  Bell,
  ShoppingCart,
  Trophy,
  PhoneCall,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Scenario, ScenarioDetail } from "@/types";

const scenarios = [
  {
    title: "Підтвердження запису",
    icon: ClipboardCheck,
    details: [
      { label: "Для кого:", value: "салони, клініки, СТО" },
      { label: "Питає:", value: "чи клієнт прийде у вибраний час" },
      { label: "Результат:", value: "підтверджено / перенос" },
    ],
  },
  {
    title: "Нагадування про візит",
    icon: Bell,
    details: [
      { label: "Для кого:", value: "послуги за записом" },
      { label: "Робить:", value: "нагадує дату, час і деталі" },
      { label: "Результат:", value: "менше ручних дзвінків" },
    ],
  },
  {
    title: "Уточнення замовлення",
    icon: ShoppingCart,
    details: [
      { label: "Для кого:", value: "інтернет-магазини" },
      { label: "Питає:", value: "товар, адресу, доставку" },
      { label: "Результат:", value: "замовлення готове до обробки" },
    ],
  },
  {
    title: "Кваліфікація ліда",
    icon: Trophy,
    details: [
      { label: "Для кого:", value: "заявки з реклами" },
      { label: "Питає:", value: "потребу, бюджет, термін" },
      { label: "Результат:", value: "тепла заявка для менеджера" },
    ],
  },
  {
    title: "Повторний дзвінок",
    icon: PhoneCall,
    details: [
      { label: "Для кого:", value: "клієнти з бази" },
      { label: "Робить:", value: "пропонує запис або послугу" },
      { label: "Результат:", value: "статус і наступна дія" },
    ],
  },
  {
    title: "Власний сценарій",
    icon: Settings,
    details: [
      { label: "Для кого:", value: "нестандартні процеси" },
      { label: "Робить:", value: "говорить вашими фразами" },
      { label: "Результат:", value: "сценарій під конкретний бізнес" },
    ],
  },
] as const satisfies readonly Scenario[];

export function ScenariosSection() {
  return (
    <section id="features" className="bg-slate-50 px-6 py-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <h2 className="font-display mb-6 max-w-2xl text-center text-3xl sm:text-4xl md:text-left md:text-5xl">
          <span className="text-primary">Дзвінки,</span>{" "}
          <span className="text-black">які агент може забрати одразу</span>
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mb-12 max-w-md text-center text-base text-black md:mx-0 md:max-w-lg md:text-left md:text-lg">
          Не треба писати сценарій з нуля. Виберіть тип дзвінка, адаптуйте кілька фраз під бізнес і
          запускайте тест.
        </p>

        {/* Grid: 3 columns on lg, 2 on md, 1 on mobile */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario) => (
            <ScenarioCard key={scenario.title} scenario={scenario} />
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-end gap-4 sm:flex-row sm:justify-center md:justify-end">
          <div>
            {/* Bottom helper text */}
            <p className="mx-auto mb-4 max-w-sm text-center text-base text-neutral-600 md:mx-0 md:text-left">
              Почніть з готового сценарію, фрази можна{" "}
              <span className="font-medium">змінити під ваш бізнес.</span>
            </p>

            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 h-12 rounded-full px-6 text-base text-white"
            >
              <Link href="/sign-up">
                Вибрати сценарій і запустити тест
                <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <Button
            asChild
            variant="ghost"
            size="lg"
            className="hidden h-12 rounded-full border border-black bg-transparent px-6 text-base text-black hover:bg-black/5 sm:inline-flex"
          >
            <Link href="/sign-up">
              Створити власний сценарій
              <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

interface ScenarioCardProps {
  readonly scenario: Scenario;
}

function ScenarioCard({ scenario }: ScenarioCardProps) {
  const Icon = scenario.icon;

  return (
    <div className="relative pt-4 pl-4">
      {/* Decorative blue circle with icon */}
      <div
        className="absolute z-50 left-0 top-0 flex size-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40 md:size-14"
        aria-hidden="true"
      >
        {Icon && <Icon className="size-5 text-white md:size-6" />}
      </div>

      {/* Card body */}
      <div className="relative rounded-2xl border border-border bg-card-glass pl-15 pr-8 py-5 backdrop-blur-sm">
        <h3 className="mb-3 text-base font-medium text-black">
          {scenario.title}
        </h3>

        <div className="space-y-1">
          {scenario.details.map((detail: ScenarioDetail) => (
            <p key={detail.label} className="text-sm text-black">
              <span className="font-medium">{detail.label}</span>{" "}
              <span className="font-light">{detail.value}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
