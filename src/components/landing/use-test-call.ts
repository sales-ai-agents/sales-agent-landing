"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useDemoCall } from "@/components/landing/api/use-demo-call";
import { trackEvent } from "@/lib/analytics";
import { formatPhoneInput, SUBSCRIBER_DIGITS } from "@/components/landing/phone";

const SUCCESS_MESSAGE = "✓ Готово! Агент зателефонує вам протягом 20 секунд.";
const INVALID_MESSAGE = "Введіть 9 цифр номера після +380.";

export type TestCallStatus = "idle" | "ok" | "error";

const resolveStatus = (invalid: boolean, failed: boolean, succeeded: boolean): TestCallStatus => {
  if (invalid || failed) return "error";
  return succeeded ? "ok" : "idle";
};

export function useTestCall(location: string) {
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const { requestCall, isLoading, isSuccess, errorMessage, reset } = useDemoCall();

  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(formatPhoneInput(event.target.value));
    setInvalid(false);
    if (errorMessage || isSuccess) reset();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const digits = value.replace(/\D/g, "");
    if (digits.length !== SUBSCRIBER_DIGITS) {
      setInvalid(true);
      return;
    }
    trackEvent("test_call_start", { location });
    requestCall(digits);
  };

  const status = resolveStatus(invalid, Boolean(errorMessage), isSuccess);
  const message = invalid
    ? INVALID_MESSAGE
    : (errorMessage ?? (isSuccess ? SUCCESS_MESSAGE : null));

  return { value, onChange, onSubmit, status, message, isLoading };
}
