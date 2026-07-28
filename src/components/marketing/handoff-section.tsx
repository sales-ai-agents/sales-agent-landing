import Image from "next/image";
import { Check, BarChart3 } from "lucide-react";

const checklist = [
  "Розпізнає нестандартні запити",
  "Реагує на прохання поговорити з людиною",
  "Передає менеджеру дзвінок і короткий підсумок",
] as const;

function ChecklistIcon() {
  return (
    <div className="from-primary flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br to-sky-200">
      <Check className="text-primary-foreground size-4" strokeWidth={3} />
    </div>
  );
}

interface HandoffCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function HandoffCard({ icon, title, description }: HandoffCardProps) {
  return (
    <div className="border-border bg-card-glass w-full max-w-sm rounded-2xl border p-5 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-full">
          {icon}
        </div>
        <div>
          <p className="text-foreground mb-1 text-lg font-semibold">{title}</p>
          <p className="text-foreground text-base">{description}</p>
        </div>
      </div>
    </div>
  );
}

function DashedConnector() {
  return (
    <div className="flex w-full max-w-sm justify-center" aria-hidden="true">
      <div className="border-primary/50 h-10 border-l-2 border-dashed" />
    </div>
  );
}

export function HandoffSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-foreground mb-4 text-base font-light tracking-wide uppercase lg:text-left">
          Передача людині
        </p>

        <h2 className="font-display mb-6 max-w-4xl text-3xl sm:text-4xl md:text-5xl lg:text-left">
          <span className="text-foreground">Складні питання </span>
          <span className="text-primary">переходять до менеджера</span>
        </h2>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div className="lg:text-left">
            <p className="text-foreground mb-10 max-w-2xl text-base md:text-lg">
              Якщо клієнт просить людину або питання виходить за сценарій, агент не імпровізує. Він
              передає дзвінок менеджеру разом із контекстом розмови.
            </p>

            <ul className="inline-flex flex-col space-y-5 text-left">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <ChecklistIcon />
                  <span className="text-foreground text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-0 lg:items-end">
            <HandoffCard
              icon={
                <Image
                  src="/image/handoff-headphone.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                  aria-hidden="true"
                />
              }
              title="ШI-агент"
              description={"\u201CЦе питання краще вирішить менеджер. Зараз зʼєднаю вас.\u201D"}
            />

            <DashedConnector />

            <HandoffCard
              icon={
                <Image
                  src="/image/handoff-union.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                  aria-hidden="true"
                />
              }
              title="Менеджер"
              description="Отримує дзвінок, підсумок і причину передачі."
            />

            <DashedConnector />

            <HandoffCard
              icon={<BarChart3 className="text-primary size-6" aria-hidden="true" />}
              title="CRM / Кабінет"
              description="Запис розмови та підсумок збережено в CRM"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
