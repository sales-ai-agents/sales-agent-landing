import { Check, BarChart3, Headset, User } from "lucide-react";
import Image from "next/image";
import { HANDOFF_CHECKLIST } from "@/lib/content";

interface HandoffCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function HandoffCard({ icon, title, description }: HandoffCardProps) {
  return (
    <div className="border-border bg-card-glass w-full max-w-sm rounded-2xl border p-5 shadow-md backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center p-3">
          <div
            className="bg-primary/80 pointer-events-none absolute top-0 left-0 -z-20 size-12 rounded-full blur-xs"
            aria-hidden="true"
          />
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

export function HandoffSection() {
  return (
    <section className="relative py-20">
      <Image
        src="/image/handoff-bg.svg"
        alt=""
        width={230}
        height={200}
        aria-hidden="true"
        className="absolute bottom-0 left-0 -z-10 hidden lg:block"
        style={{ width: "auto", height: "auto" }}
      />
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-foreground mb-4 text-center text-base font-light tracking-wide uppercase lg:text-left">
          Передача людині
        </p>

        <h2 className="font-display mb-6 max-w-4xl text-center text-3xl sm:text-4xl md:text-5xl lg:text-left">
          <span className="text-foreground">Складні питання</span> <br />
          <span className="text-primary">переходять до менеджера</span>
        </h2>

        <div className="grid grid-cols-1 items-start lg:grid-cols-2">
          <div className="pb-6">
            <p className="text-foreground mb-10 max-w-2xl text-center text-base md:text-lg lg:text-left">
              Якщо клієнт просить людину або питання виходить за сценарій, агент не імпровізує. Він
              передає дзвінок менеджеру разом із контекстом розмови.
            </p>

            <ul className="space-y-5">
              {HANDOFF_CHECKLIST.map((item) => (
                <li key={item} className="relative flex gap-4">
                  <div
                    className="bg-primary/80 pointer-events-none absolute top-1 left-4 -z-20 size-6 rounded-full blur-xs"
                    aria-hidden="true"
                  />
                  <div className="bg-card-glass flex size-8 shrink-0 items-center justify-center rounded-full border border-white">
                    <Check className="size-4" strokeWidth={3} />
                  </div>
                  <span className="text-foreground text-left text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-0">
            <div className="relative flex flex-col items-center lg:items-end">
              <HandoffCard
                icon={<Headset className="size-6 text-white" aria-hidden="true" />}
                title="ШI-агент"
                description={"\u201CЦе питання краще вирішить менеджер. Зараз зʼєднаю вас.\u201D"}
              />
              <Image
                src="/image/handoff-ai-arrow.svg"
                alt=""
                width={125}
                height={60}
                aria-hidden="true"
                className="absolute top-14 -right-14 hidden lg:block"
                style={{ width: "auto", height: "auto" }}
              />
              <Image
                src="/image/handoff-crm-mobile-arrow.svg"
                alt=""
                width={130}
                height={60}
                aria-hidden="true"
                className="block lg:hidden"
                style={{ width: "auto", height: "auto" }}
              />
            </div>

            <div className="relative flex flex-col items-center pt-0 lg:pt-14 lg:pl-20">
              <HandoffCard
                icon={<User className="size-6 text-white" aria-hidden="true" />}
                title="Менеджер"
                description="Отримує дзвінок, підсумок і причину передачі."
              />
              <Image
                src="/image/handoff-crm-arrow.svg"
                alt=""
                width={140}
                height={60}
                aria-hidden="true"
                className="absolute top-30 left-4 hidden lg:block"
                style={{ width: "auto", height: "auto" }}
              />
              <Image
                src="/image/handoff-mobile-ai-arrow.svg"
                alt=""
                width={125}
                height={60}
                aria-hidden="true"
                className="block lg:hidden"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <HandoffCard
              icon={<BarChart3 className="size-6 text-white" aria-hidden="true" />}
              title="CRM / Кабінет"
              description="Запис розмови та підсумок збережено в CRM"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
