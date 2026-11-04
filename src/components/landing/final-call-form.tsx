"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { useLandingCopy } from "@/components/landing/copy/provider";
import { PhoneInput } from "@/components/landing/phone-input";
import { Arrow } from "@/components/landing/typography";
import { useTestCall } from "@/components/landing/use-test-call";

export function FinalCallForm() {
  const { copy } = useLandingCopy();
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
          {copy.finalForm.submit} <Arrow />
        </button>
      </form>
      <p
        className={cn("final-note", status === "ok" && "ok", status === "error" && "err")}
        id={noteId}
        role="status"
      >
        {message ?? copy.finalForm.note}
      </p>
    </>
  );
}
