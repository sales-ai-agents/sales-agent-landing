"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Formats raw digits (max 9) into the display pattern: XX XXX XX XX
 */
function formatPhoneDigits(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 9);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
  if (d.length <= 7) return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
  return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}`;
}

export function DemoCallSection() {
  const [digits, setDigits] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
    setDigits(raw);
  }

  const isComplete = digits.length === 9;
  const displayValue = digits.length > 0 ? formatPhoneDigits(digits) : "";

  return (
    <section className="py-10">
      <div className="mx-auto max-w-5xl px-4">
        {/* Section label */}
        <p className="mb-4 text-center text-lg font-normal uppercase tracking-wide text-black">
          Демо дзвінок
        </p>

        {/* Glass card */}
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card-glass px-8 pb-8 pt-6 backdrop-blur-sm md:px-14">
          {/* Top row: icon + text */}
          <div className="mb-6 flex items-center gap-4">
            {/* Phone icon with circle background */}
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Phone className="size-7 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-medium tracking-wide text-black">
                Протестуйте ШI-агента в реальному часі
              </p>
              <p className="text-lg font-light tracking-wide text-black">
                Введіть свій номер — агент зателефонує вам за 20 секунд
              </p>
            </div>
          </div>

          {/* Input + Button row */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Phone input with hardcoded +380 prefix */}
            <div className="flex h-12 w-full items-center rounded-xl border border-border bg-white px-6 sm:w-72">
              <span className="shrink-0 text-lg font-light text-black">
                +380&nbsp;
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={displayValue}
                onChange={handleChange}
                placeholder="___ ___ __ __"
                aria-label="Номер телефону після +380"
                className="w-full bg-transparent text-lg font-light text-black placeholder:text-black/40 focus:outline-none"
              />
            </div>

            {/* Primary CTA button — disabled when < 9 digits */}
            <button
              type="button"
              disabled={!isComplete}
              aria-label="Запустити тестовий дзвінок"
              className={cn(
                "h-12 rounded-full px-8 text-lg font-normal text-white transition-colors sm:flex-1",
                isComplete
                  ? "cursor-pointer bg-primary hover:bg-primary-hover"
                  : "cursor-not-allowed bg-primary/50"
              )}
            >
              Запустити тестовий дзвінок
            </button>
          </div>

          {/* Disclaimer */}
          <p className="mt-5 text-center text-base font-light text-black">
            Один тестовий дзвінок. Ми не використовуємо номер для сторонніх
            задач
          </p>
        </div>
      </div>
    </section>
  );
}
