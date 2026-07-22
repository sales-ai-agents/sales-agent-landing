import Image from "next/image";
import { ArrowDown } from "lucide-react";

const checklist = [
  "Розпізнає нестандартні запити",
  "Реагує на прохання поговорити з людиною",
  "Передає менеджеру дзвінок і короткий підсумок",
];

export function HandoffSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Eyebrow label */}
        <p className="text-text-secondary mb-4 text-center text-base font-light uppercase lg:text-left">
          Передача людині
        </p>

        {/* Heading */}
        <h2 className="font-display mb-6 text-center text-4xl font-bold md:text-5xl lg:text-left">
          Складні питання <span className="text-primary">переходять до менеджера</span>
        </h2>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Left column: subtitle + checklist */}
          <div className="text-center lg:text-left">
            {/* Subtitle */}
            <p className="text-text-primary mb-10 text-lg">
              Якщо клієнт просить людину або питання виходить за сценарій, агент не імпровізує. Він
              передає дзвінок менеджеру разом із контекстом розмови.
            </p>

            {/* Checklist */}
            <ul className="inline-flex flex-col space-y-5 text-left">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <Image
                    src="/image/builder-checklist.svg"
                    alt=""
                    width={28}
                    height={28}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-text-primary text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column: message cards with connector */}
          <div className="flex flex-col items-center lg:items-end">
            {/* AI Agent message card */}
            <div className="rounded-card border-border bg-card-glass backdrop-blur-card relative w-full max-w-sm overflow-hidden border">
              <div className="rounded-card border-border/20 pointer-events-none absolute inset-0 border-4 blur-sm" />
              <div className="relative flex items-center gap-4 px-5 py-5">
                <div className="bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-full">
                  <Image
                    src="/image/handoff-headphone.svg"
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-text-primary mb-1 text-lg font-semibold">ШI-агент</p>
                  <p className="text-text-primary text-base">
                    &ldquo;Це питання краще вирішить менеджер. Зараз зʼєднаю вас.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Connector arrow — centered between cards */}
            <div
              className="flex w-full max-w-sm items-center justify-center py-3"
              aria-hidden="true"
            >
              <ArrowDown className="text-text-secondary/60 size-6" strokeWidth={1.5} />
            </div>

            {/* Manager message card */}
            <div className="rounded-card border-border bg-card-glass backdrop-blur-card relative w-full max-w-sm overflow-hidden border">
              <div className="rounded-card border-border/20 pointer-events-none absolute inset-0 border-4 blur-sm" />
              <div className="relative flex items-center gap-4 px-5 py-5">
                <div className="bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-full">
                  <Image
                    src="/image/handoff-union.svg"
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-text-primary mb-1 text-lg font-semibold">Менеджер</p>
                  <p className="text-text-primary text-base">
                    Отримує дзвінок, підсумок і причину передачі.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
