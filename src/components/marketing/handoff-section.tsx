import Image from "next/image";
import { Check, BarChart3 } from "lucide-react";

const checklist = [
  "Розпізнає нестандартні запити",
  "Реагує на прохання поговорити з людиною",
  "Передає менеджеру дзвінок і короткий підсумок",
] as const;

function ChecklistIcon() {
  return (
    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-200">
      <Check className="size-3.5 text-black/70" strokeWidth={3} />
    </div>
  );
}

export function HandoffSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Eyebrow label */}
        <p className="mb-4 text-center text-base font-light uppercase tracking-wide text-black lg:text-left">
          Передача людині
        </p>

        {/* Heading */}
        <h2 className="mb-6 max-w-3xl text-center font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl lg:text-left">
          <span className="text-black">Складні питання </span>
          <span className="text-primary">переходять до менеджера</span>
        </h2>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Left column: subtitle + checklist */}
          <div className="text-center lg:text-left">
            <p className="mb-10 max-w-2xl text-base text-black md:text-lg">
              Якщо клієнт просить людину або питання виходить за сценарій,
              агент не імпровізує. Він передає дзвінок менеджеру разом із
              контекстом розмови.
            </p>

            {/* Checklist */}
            <ul className="inline-flex flex-col space-y-5 text-left">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <ChecklistIcon />
                  <span className="text-lg text-black">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column: message cards with connector */}
          <div className="flex flex-col items-center gap-6 lg:items-end">
            {/* AI Agent message card */}
            <div className="w-full max-w-sm rounded-2xl border border-border bg-card-glass p-5 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Image
                    src="/image/handoff-headphone.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="size-6"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="mb-1 text-lg font-semibold text-black">
                    ШI-агент
                  </p>
                  <p className="text-base text-black">
                    &ldquo;Це питання краще вирішить менеджер. Зараз зʼєднаю
                    вас.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Dashed connector */}
            <div className="flex w-full max-w-sm justify-center" aria-hidden="true">
              <div className="h-10 border-l-2 border-dashed border-primary/50" />
            </div>

            {/* Manager message card */}
            <div className="w-full max-w-sm rounded-2xl border border-border bg-card-glass p-5 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Image
                    src="/image/handoff-union.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="size-6"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="mb-1 text-lg font-semibold text-black">
                    Менеджер
                  </p>
                  <p className="text-base text-black">
                    Отримує дзвінок, підсумок і причину передачі.
                  </p>
                </div>
              </div>
            </div>

            {/* Dashed connector */}
            <div className="flex w-full max-w-sm justify-center" aria-hidden="true">
              <div className="h-10 border-l-2 border-dashed border-primary/50" />
            </div>

            {/* CRM / Кабінет card */}
            <div className="w-full max-w-sm rounded-2xl border border-border bg-card-glass p-5 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <BarChart3 className="size-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="mb-1 text-lg font-semibold text-black">
                    CRM / Кабінет
                  </p>
                  <p className="text-base text-black">
                    Запис розмови та підсумок збережено в CRM
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
