"use client";

import Image from "next/image";

import { InputGroup, InputGroupAddon, InputGroupInput, Label } from "@/components/ui";
import { cn, formatUaPhoneDigits } from "@/lib/utils";

interface PhoneFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  classname?: string;
}

export const PhoneField = ({ id, label, value, onChange, hint, classname }: PhoneFieldProps) => {
  return (
    <div className={cn("space-y-2", classname)}>
      <Label htmlFor={id}>{label}</Label>
      <InputGroup>
        <InputGroupAddon>
          <Image src="/image/ua-flag.svg" alt="" width={24} height={16} aria-hidden="true" />
          <span className="text-sm">+380</span>
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          inputMode="tel"
          autoComplete="tel"
          value={value}
          onChange={(event) => onChange(formatUaPhoneDigits(event.target.value))}
          placeholder="32 245 11 90"
        />
      </InputGroup>
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
    </div>
  );
};
