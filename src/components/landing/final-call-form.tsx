"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/landing/phone-input";
import { Arrow } from "@/components/landing/typography";
import { useTestCall } from "@/components/landing/use-test-call";

const DEFAULT_NOTE = "Один тестовий дзвінок. Без спаму та передачі бази.";

export function FinalCallForm() {
  const { value, onChange, onSubmit, status, message, isLoading } = useTestCall("landing_final");
  const noteId = useId();

  return (
    <>
      <form className="final-form" data-r="" onSubmit={onSubmit} noValidate>
        <div className="row-in">
          <span className="cc">+380</span>
          <PhoneInput
            value={value}
            onChange={onChange}
            invalid={status === "error"}
            describedBy={noteId}
          />
        </div>
        <button className="btn btn-blue" type="submit" disabled={isLoading}>
          Запустити дзвінок <Arrow />
        </button>
      </form>
      <p
        className={cn("final-note", status === "ok" && "ok", status === "error" && "err")}
        id={noteId}
        role="status"
      >
        {message ?? DEFAULT_NOTE}
      </p>
    </>
  );
}
