"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button, Label } from "@/components/ui";

interface CopyFieldProps {
  label: string;
  value: string;
}

const COPY_RESET_MS = 2000;

export const CopyField = ({ label, value }: CopyFieldProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} скопійовано`);
      setTimeout(() => setCopied(false), COPY_RESET_MS);
    } catch {
      toast.error("Не вдалося скопіювати");
    }
  };

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="border-input flex items-center gap-2 rounded-lg border px-3 py-0.5">
        <span className="flex-1 truncate text-sm">{value}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={!value}
          onClick={handleCopy}
          aria-label={`Скопіювати: ${label}`}
        >
          {copied ? <Check className="text-success h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
