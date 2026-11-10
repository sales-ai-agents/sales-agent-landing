"use client";

import { Label, RadioGroup, RadioGroupItem } from "@/components/ui";
import type { CrmPushMode } from "@dashboard/types";
import { CRM_PUSH_OPTIONS } from "../../_lib/crm-providers";

interface CrmPushOptionsProps {
  value: CrmPushMode;
  disabled: boolean;
  onChange: (value: CrmPushMode) => void;
}

export const CrmPushOptions = ({ value, disabled, onChange }: CrmPushOptionsProps) => (
  <fieldset className="space-y-2">
    <legend className="text-sm font-medium">Що надсилати в CRM</legend>
    <RadioGroup
      value={value}
      disabled={disabled}
      onValueChange={(next) => onChange(next as CrmPushMode)}
      className="gap-2"
    >
      {CRM_PUSH_OPTIONS.map((option) => (
        <Label
          key={option.value}
          htmlFor={`crm-push-${option.value}`}
          className="flex cursor-pointer items-start gap-2 text-sm font-normal"
        >
          <RadioGroupItem id={`crm-push-${option.value}`} value={option.value} className="mt-0.5" />
          <span>
            <span className="font-semibold">{option.title}</span> — {option.description}
          </span>
        </Label>
      ))}
    </RadioGroup>
  </fieldset>
);
