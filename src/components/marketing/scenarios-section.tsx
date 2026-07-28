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
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
          <span className="text-primary">Дзвінки,</span>{" "}
          <span className="text-foreground">які агент може забрати одразу</span>
        </h2>

        <p className="text-foreground mb-12 max-w-lg text-base tracking-wide md:text-lg">
          Не треба писати сценарій з нуля. Виберіть тип дзвінка, адаптуйте кілька фраз під бізнес і
          запускайте тест.
        </p>

        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario, index) => (
            <ScenarioCard key={scenario.title} scenario={scenario} alignRight={index % 2 !== 0} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <p className="text-muted-foreground max-w-sm text-center text-base">
            Почніть з готового сценарію, фрази можна{" "}
            <span className="font-medium">змінити під ваш бізнес.</span>
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-end">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 font-body h-12 w-full rounded-3xl px-8 text-lg font-normal text-white sm:w-auto"
            >
              <Link href="/sign-up">
                Вибрати сценарій і запустити тест
                <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="border-foreground text-foreground hover:bg-foreground/5 font-body h-12 w-full rounded-3xl border bg-transparent px-8 text-lg font-normal sm:w-auto"
            >
              <Link href="/sign-up">
                Створити власний сценарій
                <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ScenarioCardProps {
  readonly scenario: Scenario;
  readonly alignRight?: boolean;
}

function ScenarioCard({ scenario, alignRight }: ScenarioCardProps) {
  const Icon = scenario.icon;

  return (
    <div className={`relative pt-4 sm:pl-4 ${alignRight ? "pr-4 sm:pr-0" : "pl-4"}`}>
      <div
        className={`bg-primary shadow-primary/30 absolute top-0 z-10 flex size-14 items-center justify-center rounded-full shadow-lg sm:left-0 ${alignRight ? "right-0 sm:right-auto" : "left-0"}`}
        aria-hidden="true"
      >
        {Icon && <Icon className="size-6 text-white" />}
      </div>

      <div
        className={`border-border bg-card-glass rounded-2xl border py-5 backdrop-blur-sm sm:pr-6 sm:pl-14 ${alignRight ? "pr-14 pl-6 sm:pr-6 sm:pl-14" : "pr-6 pl-14"}`}
      >
        <h3 className="text-foreground mb-3 text-xl font-medium">{scenario.title}</h3>

        <div className="space-y-1">
          {scenario.details.map((detail: ScenarioDetail) => (
            <p key={detail.label} className="text-foreground text-sm">
              <span className="font-medium">{detail.label}</span>{" "}
              <span className="font-light">{detail.value}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
