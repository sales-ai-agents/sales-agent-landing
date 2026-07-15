import { Check, Headphones, User, ArrowDown } from "lucide-react";

const checklist = [
  "Розпізнає нестандартні запити",
  "Реагує на прохання поговорити з людиною",
  "Передає менеджеру дзвінок і короткий підсумок",
];

export function HandoffSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Eyebrow label */}
        <p className="mb-4 text-lg font-light uppercase leading-snug tracking-wide text-text-primary">
          Передача людині
        </p>

        {/* Heading */}
        <h2 className="mb-6 max-w-3xl text-4xl leading-tight tracking-tight text-text-primary md:text-5xl">
          <span className="font-light">Складні питання </span>
          <span className="font-semibold">переходять до менеджера</span>
        </h2>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Left column: subtitle + checklist */}
          <div>
            {/* Subtitle */}
            <p className="mb-10 max-w-3xl text-lg leading-snug tracking-wide text-text-primary">
              Якщо клієнт просить людину або питання виходить за сценарій, агент не імпровізує. Він
              передає дзвінок менеджеру разом із контекстом розмови.
            </p>

            {/* Checklist with filled blue circular markers */}
            <ul className="space-y-5">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Check className="size-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-lg tracking-wide text-text-primary">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column: message cards with connector */}
          <div className="flex flex-col items-center lg:items-end">
            {/* AI Agent message card */}
            <div className="flex w-full max-w-sm items-center gap-4 rounded-2xl border border-border bg-card-glass px-5 py-6 backdrop-blur-sm">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Headphones className="size-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="mb-1 text-lg font-semibold leading-snug tracking-wide text-text-primary">
                  ШI-агент
                </p>
                <p className="text-lg font-normal leading-snug tracking-wide text-text-primary">
                  &quot;Це питання краще вирішить менеджер. Зараз зʼєднаю вас.&quot;
                </p>
              </div>
            </div>

            {/* Connector arrow between cards */}
            <div className="flex h-12 items-center justify-center" aria-hidden="true">
              <ArrowDown className="size-8 text-text-secondary/60" strokeWidth={1.5} />
            </div>

            {/* Manager message card */}
            <div className="flex w-full max-w-sm items-center gap-4 rounded-2xl border border-border bg-card-glass px-5 py-6 backdrop-blur-sm">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="size-6 text-text-secondary" aria-hidden="true" />
              </div>
              <div>
                <p className="mb-1 text-lg font-semibold leading-snug tracking-wide text-text-primary">
                  Менеджер
                </p>
                <p className="text-lg font-normal leading-snug tracking-wide text-text-primary">
                  Отримує дзвінок, підсумок і причину передачі.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
