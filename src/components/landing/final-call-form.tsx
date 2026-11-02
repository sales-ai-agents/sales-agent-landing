"use client";

import { cn } from "@/lib/utils";
import { Arrow } from "@/components/landing/typography";
import { useTestCall } from "@/components/landing/use-test-call";

const DEFAULT_NOTE = "Один тестовий дзвінок. Без спаму та передачі бази.";

export function FinalCallForm() {
  const { value, onChange, onSubmit, status, message, isLoading } = useTestCall("landing_final");

  return (
    <>
      <form className="final-form" data-r="" onSubmit={onSubmit} noValidate>
        <div className="row-in">
          <span className="cc">+380</span>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="__ ___ __ __"
            aria-label="Номер телефону"
            data-phone=""
            value={value}
            onChange={onChange}
          />
        </div>
        <button className="btn btn-blue" type="submit" disabled={isLoading}>
          Запустити дзвінок <Arrow />
        </button>
      </form>
      <p
        className={cn("final-note", status === "ok" && "ok", status === "error" && "err")}
        id="finalNote"
        role="status"
      >
        {message ?? DEFAULT_NOTE}
      </p>
    </>
  );
}
