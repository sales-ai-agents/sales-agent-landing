"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";

import { useDemoCall } from "@/hooks/use-demo-call";
import { cn, formatUaPhoneDigits } from "@/lib/utils";

const UA_SUBSCRIBER_DIGITS = 9;

function DemoCallCard() {
  const [digits, setDigits] = useState("");
  const { requestCall, isLoading, isSuccess, errorMessage, reset } = useDemoCall();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const raw = e.target.value.replace(/\D/g, "").slice(0, UA_SUBSCRIBER_DIGITS);
    setDigits(raw);
    if (errorMessage) reset();
  }

  function handleSubmit(): void {
    if (digits.length === UA_SUBSCRIBER_DIGITS) requestCall(digits);
  }

  const isComplete = digits.length === UA_SUBSCRIBER_DIGITS;
  const displayValue = digits.length > 0 ? formatUaPhoneDigits(digits) : "";

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

      {isSuccess ? (
        <DemoCallSuccess digits={digits} />
      ) : (
        <DemoCallForm
          displayValue={displayValue}
          isComplete={isComplete}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

interface DemoCallFormProps {
  displayValue: string;
  isComplete: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

function DemoCallForm({
  displayValue,
  isComplete,
  isLoading,
  errorMessage,
  onChange,
  onSubmit,
}: DemoCallFormProps): React.JSX.Element {
  return (
    <>
      {/* Phone input */}
      <div
        className={cn(
          "rounded-input border-input-border mx-auto mb-4 flex h-12 w-full max-w-xs items-center border px-5",
          errorMessage && "border-red-500"
        )}
      >
        <span className="shrink-0 text-lg font-light text-black">+380&nbsp;</span>
        <input
          type="tel"
          inputMode="numeric"
          value={displayValue}
          onChange={onChange}
          placeholder="___ ___ ___"
          aria-label="Номер телефону після +380"
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={errorMessage ? "demo-call-error" : undefined}
          disabled={isLoading}
          className="w-full bg-transparent text-lg font-light text-black placeholder:text-black/40 focus:outline-none disabled:opacity-50"
        />
      </div>

      {/* Inline error */}
      {errorMessage && (
        <p
          id="demo-call-error"
          role="alert"
          className="mx-auto mb-4 max-w-xs text-center text-sm text-red-600"
        >
          {errorMessage}
        </p>
      )}

      {/* CTA button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!isComplete || isLoading}
        aria-label="Запустити тестовий дзвінок"
        className={cn(
          "rounded-button-sm mx-auto flex h-12 w-full max-w-xs items-center justify-center gap-2 text-lg font-normal text-white transition-colors",
          isComplete && !isLoading
            ? "bg-primary hover:bg-primary-hover cursor-pointer"
            : "bg-primary/70 cursor-not-allowed"
        )}
      >
        {isLoading ? "Надсилаємо…" : "Запустити тестовий дзвінок"}
      </button>

      {/* Disclaimer */}
      <p className="text-text-secondary mx-auto mt-6 max-w-sm text-center text-base font-light">
        Один тестовий дзвінок. Ми не використовуємо номер для сторонніх задач
      </p>
    </>
  );
}

function DemoCallSuccess({ digits }: { digits: string }): React.JSX.Element {
  return (
    <div className="mx-auto flex max-w-xs flex-col items-center gap-3 py-4 text-center">
      <p className="text-lg font-medium text-black">Дзвінок на шляху!</p>
      <p className="text-text-secondary text-base font-light">
        Очікуйте дзвінок на номер +380&nbsp;{formatUaPhoneDigits(digits)} протягом 20 секунд.
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

      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div className="max-w-2xl text-center lg:text-left">
          <p className="mb-8 text-lg text-black">
            Голосовий <span className="font-semibold">ШІ-агент</span>
          </p>

          <h1 className="font-display mb-8 text-3xl font-black tracking-tight text-black uppercase lg:text-5xl">
            ШI-агент, який <span className="text-primary">телефонує клієнтам</span> і фіксує
            результат у CRM
          </h1>

          <p className="mb-10 text-sm text-black lg:max-w-lg lg:text-base">
            ШI-агент телефонує клієнтам, уточнює деталі та передає результат у CRM. Без програмістів
            і зайвих ручних дзвінків.
          </p>

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
              <Image
                src="/image/hero-play.svg"
                alt=""
                width={14}
                height={14}
                className="size-4"
                aria-hidden="true"
              />
              Прослухати демо
            </a>
          </div>
        </div>

        <DemoCallCard />
      </div>
    </section>
  );
}
