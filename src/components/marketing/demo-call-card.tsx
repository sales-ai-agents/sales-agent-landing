"use client";

import React, { useState } from "react";
import { Phone, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDemoCall } from "@/hooks/use-demo-call";
import { LeadFormModal } from "@/components/marketing/lead-form-card";
import { cn, formatUaPhoneDigits } from "@/lib/utils";

const UA_SUBSCRIBER_DIGITS = 9;

export default function DemoCallCard() {
  const [digits, setDigits] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
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
    <div className="border-border bg-card-glass relative overflow-hidden rounded-2xl border p-8 backdrop-blur-lg">
      <div className="mb-2 flex items-center gap-5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
          <Phone className="text-primary size-6" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-foreground max-w-xs text-lg leading-snug font-medium">
            Протестуйте ШI-агента в реальному часі
          </p>
          <p className="text-lg font-light text-neutral-600">
            Введіть свій номер — агент зателефонує вам за 20 секунд
          </p>
        </div>
      </div>

      {isSuccess ? (
        <DemoCallSuccess digits={digits} onShowForm={() => setShowLeadForm(true)} />
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

      <LeadFormModal
        open={isSuccess && showLeadForm}
        onClose={() => setShowLeadForm(false)}
        sourcePage="calls4u.ai/#hero-demo"
      />
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
      <div
        className={cn(
          "border-input-border mx-auto mb-4 flex h-12 w-full max-w-xs items-center rounded-2xl border px-4",
          errorMessage && "border-red-500"
        )}
      >
        <span className="text-foreground shrink-0 text-lg font-light">+380&nbsp;</span>
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
          className="text-foreground placeholder:text-foreground/40 h-full border-0 bg-transparent px-0 text-lg font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {errorMessage && (
        <p
          id="demo-call-error"
          role="alert"
          className="mx-auto mb-4 max-w-sm text-center text-sm text-red-600"
        >
          {errorMessage}
        </p>
      )}

      <Button
        type="button"
        onClick={onSubmit}
        disabled={!isComplete || isLoading}
        aria-label="Запустити тестовий дзвінок"
        className="bg-primary hover:bg-primary/90 mx-auto flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-full text-lg font-normal text-white shadow-md disabled:opacity-50"
      >
        {isLoading ? "Надсилаємо…" : "Запустити тестовий дзвінок"}
      </Button>

      <p className="mx-auto mt-5 max-w-sm text-center text-base text-neutral-500">
        Вже протестували <span className="font-semibold text-neutral-600">200+ компаній</span>
      </p>

      <p className="mx-auto mt-3 flex max-w-xs items-center gap-2 text-base font-light text-neutral-600">
        <Lock className="text-primary mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <span>
          <span className="text-primary font-semibold">Безпечно:</span> один тестовий дзвінок. Без
          спаму та передачі бази
        </span>
      </p>
    </>
  );
}

function DemoCallSuccess({
  digits,
  onShowForm,
}: {
  digits: string;
  onShowForm: () => void;
}): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3 py-4 text-center">
      <p className="text-foreground text-lg font-medium">Дзвінок на шляху!</p>
      <p className="text-base font-light text-neutral-600">
        Очікуйте дзвінок на номер +380&nbsp;{formatUaPhoneDigits(digits)} протягом 20 секунд.
      </p>
      <Button
        type="button"
        onClick={onShowForm}
        className="bg-primary hover:bg-primary/90 mt-3 h-11 rounded-full px-6 text-base font-normal text-white"
      >
        Отримати розрахунок
      </Button>
    </div>
  );
}
