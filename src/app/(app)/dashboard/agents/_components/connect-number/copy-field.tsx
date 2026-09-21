"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button, Label } from "@/components/ui";
import { cn } from "@/lib/utils";

interface CopyFieldProps {
  label: string;
  value: string;
  mono?: boolean;
  warning?: string;
}

const COPY_RESET_MS = 2000;

export const CopyField = ({ label, value, mono = true, warning }: CopyFieldProps) => {
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
      <div className="border-input flex items-center gap-2 rounded-lg border px-3 py-2">
        <span className={cn("flex-1 truncate text-sm", mono && "font-mono")}>{value}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleCopy}
          aria-label={`Скопіювати: ${label}`}
        >
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      {warning && <p className="text-xs text-amber-600">{warning}</p>}
    </div>
  );
};
