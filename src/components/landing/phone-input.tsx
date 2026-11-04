import type { ChangeEvent } from "react";

interface PhoneInputProps {
  value: string;
  invalid: boolean;
  describedBy: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function PhoneInput({ value, invalid, describedBy, onChange }: PhoneInputProps) {
  return (
    <input
      type="tel"
      inputMode="numeric"
      autoComplete="tel-national"
      placeholder="__ ___ __ __"
      aria-label="Номер телефону після +380"
      aria-invalid={invalid}
      aria-describedby={describedBy}
      data-phone=""
      value={value}
      onChange={onChange}
    />
  );
}
