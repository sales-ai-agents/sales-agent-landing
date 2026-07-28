"use client";

import React, { useState } from "react";
import { Phone, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDemoCall } from "@/hooks/use-demo-call";
import { cn, formatUaPhoneDigits } from "@/lib/utils";

const UA_SUBSCRIBER_DIGITS = 9;

export default function DemoCallCard() {
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
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-white/40 to-gray-200/40 p-8 backdrop-blur-xl">
      {/* Header: Icon + Title */}
      <div className="mb-2 flex items-center gap-5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
          <Phone className="text-primary size-6" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="max-w-xs text-lg leading-snug font-medium text-black">
            Протестуйте ШI-агента в реальному часі
          </p>
          <p className="text-lg font-light text-neutral-600">
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
      {/* Phone input with +380 prefix */}
      <div
        className={cn(
          "mx-auto mb-4 flex h-12 w-full max-w-xs items-center rounded-2xl border border-gray-300 px-4",
          errorMessage && "border-red-500"
        )}
      >
        <span className="shrink-0 text-lg font-light text-black">+380&nbsp;</span>
        <Input
          type="tel"
          inputMode="numeric"
          value={displayValue}
          onChange={onChange}
          placeholder="___ ___ ___"
          aria-label="Номер телефону після +380"
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={errorMessage ? "demo-call-error" : undefined}
          disabled={isLoading}
          className="h-full border-0 bg-transparent px-0 text-lg font-light text-black shadow-none placeholder:text-black/40 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {/* Inline error */}
      {errorMessage && (
        <p
          id="demo-call-error"
          role="alert"
          className="mx-auto mb-4 max-w-sm text-center text-sm text-red-600"
        >
          {errorMessage}
        </p>
      )}

      {/* CTA button */}
      <Button
        type="button"
        onClick={onSubmit}
        disabled={!isComplete || isLoading}
        aria-label="Запустити тестовий дзвінок"
        className="bg-primary hover:bg-primary/90 disabled:bg-primary/70 mx-auto flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-full text-lg font-normal text-white shadow-md disabled:opacity-100"
      >
        {isLoading ? "Надсилаємо…" : "Запустити тестовий дзвінок"}
      </Button>

      {/* Social proof */}
      <p className="mx-auto mt-5 max-w-sm text-center text-base text-neutral-500">
        Вже протестували <span className="font-semibold text-neutral-600">200+ компаній</span>
      </p>

      {/* Disclaimer */}
      <p className="mx-auto mt-3 flex items-center max-w-xs gap-2 text-base font-light text-neutral-600">
        <Lock className="text-primary mt-0.5 size-5 shrink-0 " aria-hidden="true" />
        <span>
          <span className="text-primary font-semibold">Безпечно:</span> один тестовий дзвінок. Без
          спаму та передачі бази
        </span>
      </p>
    </>
  );
}

function DemoCallSuccess({ digits }: { digits: string }): React.JSX.Element {
  return (
    <div className="flex max-w-sm flex-col items-center gap-3 py-4 text-center">
      <p className="text-lg font-medium text-black">Дзвінок на шляху!</p>
      <p className="text-base font-light text-neutral-600">
        Очікуйте дзвінок на номер +380&nbsp;{formatUaPhoneDigits(digits)} протягом 20 секунд.
      </p>
    </div>
  );
}
