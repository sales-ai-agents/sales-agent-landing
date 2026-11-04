"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button, Label } from "@/components/ui";
import { cn } from "@/lib/utils";

interface CopyFieldProps {
  label: string;
  value: string;
  masked?: boolean;
  placeholder?: string;
}

const COPY_RESET_MS = 2000;
const MASK = "••••••••••••";

export const CopyField = ({ label, value, masked = false, placeholder }: CopyFieldProps) => {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

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

  const isHidden = masked && !revealed;
  const displayValue = value ? (isHidden ? MASK : value) : placeholder;

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="border-input flex items-center gap-1 rounded-lg border px-3 py-0.5">
        <span
          className={cn(
            "flex-1 truncate text-sm",
            !value && "text-muted-foreground",
            isHidden && value && "tracking-widest"
          )}
        >
          {displayValue}
        </span>
        {masked && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={!value}
            onClick={() => setRevealed((current) => !current)}
            aria-label={revealed ? `Сховати: ${label}` : `Показати: ${label}`}
            aria-pressed={revealed}
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
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
