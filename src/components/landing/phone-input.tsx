"use client";

import type { ChangeEvent } from "react";
import { useLandingCopy } from "@/components/landing/copy/provider";

interface PhoneInputProps {
  value: string;
  invalid: boolean;
  describedBy: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function PhoneInput({ value, invalid, describedBy, onChange }: PhoneInputProps) {
  const { copy } = useLandingCopy();

  return (
    <input
      type="tel"
      inputMode="numeric"
      autoComplete="tel-national"
      placeholder="__ ___ __ __"
      aria-label={copy.phoneAriaLabel}
      aria-invalid={invalid}
      aria-describedby={describedBy}
      data-phone=""
      value={value}
      onChange={onChange}
    />
  );
}
