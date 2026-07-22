"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Formats raw digits (max 9) into the display pattern: ___ ___ ___
 */
function formatPhoneDigits(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 9);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

function DemoCallCard() {
  const [digits, setDigits] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
    setDigits(raw);
  }

  const isComplete = digits.length === 9;
  const displayValue = digits.length > 0 ? formatPhoneDigits(digits) : "";

  return (
    <div className="rounded-card border-border bg-card-glass backdrop-blur-card border p-8 lg:max-w-lg">
      {/* Top row: Icon left + Title/Subtitle right */}
      <div className="mb-6 flex items-center gap-8">
        <div className="bg-muted flex size-14 shrink-0 items-center justify-center rounded-full border border-black">
          <Phone className="text-text-secondary size-7" aria-hidden="true" />
        </div>
        <div>
          <p className="max-w-xs text-lg font-medium text-black">
            Протестуйте ШI-агента в реальному часі
          </p>
          <p className="text-text-secondary mt-2 text-lg font-light">
            Введіть свій номер — агент зателефонує вам за 20 секунд
          </p>
        </div>
      </div>

      {/* Phone input — centered */}
      <div className="rounded-input border-input-border mx-auto mb-4 flex h-12 w-full max-w-xs items-center border px-5">
        <span className="shrink-0 text-lg font-light text-black">+380&nbsp;</span>
        <input
          type="tel"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder="___ ___ ___"
          aria-label="Номер телефону після +380"
          className="w-full bg-transparent text-lg font-light text-black placeholder:text-black/40 focus:outline-none"
        />
      </div>

      {/* CTA button — centered */}
      <button
        type="button"
        disabled={!isComplete}
        aria-label="Запустити тестовий дзвінок"
        className={cn(
          "rounded-button-sm mx-auto flex h-12 w-full max-w-xs items-center justify-center gap-2 text-lg font-normal text-white transition-colors",
          isComplete
            ? "bg-primary hover:bg-primary-hover cursor-pointer"
            : "bg-primary/70 cursor-not-allowed"
        )}
      >
        Запустити тестовий дзвінок
      </button>

      {/* Disclaimer — centered */}
      <p className="text-text-secondary mx-auto mt-6 max-w-sm text-center text-base font-light">
        Один тестовий дзвінок. Ми не використовуємо номер для сторонніх задач
      </p>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen px-12 pt-22 lg:pt-42">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/image/hero-bg.jpg"
          alt=""
          fill
          className="object-cover object-top"
          priority
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div className="max-w-2xl text-center lg:text-left">
          <p className="mb-8 text-lg text-black">
            Голосовий <span className="font-semibold">ШІ-агент</span>
          </p>

          {/* Heading */}
          <h1 className="font-display mb-8 text-3xl font-black tracking-tight text-black uppercase lg:text-5xl">
            ШI-агент, який <span className="text-primary">телефонує клієнтам</span> і фіксує
            результат у CRM
          </h1>

          {/* Subtitle */}
          <p className="mb-10 text-sm text-black lg:max-w-lg lg:text-base">
            ШI-агент телефонує клієнтам, уточнює деталі та передає результат у CRM. Без програмістів
            і зайвих ручних дзвінків.
          </p>

          {/* Buttons */}
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-start">
            <Link
              href="/sign-up"
              className="rounded-button bg-primary hover:bg-primary-hover inline-flex h-12 w-48 items-center justify-center text-lg whitespace-nowrap text-white transition-colors"
            >
              Створити агента
            </Link>

            <a
              href="#audio-demo"
              aria-label="Прослухати демо дзвінок"
              className="rounded-button-sm border-border bg-card-glass backdrop-blur-card hover:bg-card-glass-hover inline-flex h-12 w-48 items-center justify-center gap-2 border text-lg whitespace-nowrap text-black transition-colors"
            >
              <Image src="/image/hero-play.svg" alt="" width={14} height={14} aria-hidden="true" />
              Прослухати демо
            </a>
          </div>
        </div>

        {/* Right side — Demo call card */}
        <DemoCallCard />
      </div>
    </section>
  );
}
