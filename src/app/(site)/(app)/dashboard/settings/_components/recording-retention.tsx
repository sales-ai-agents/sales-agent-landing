"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Input, Label } from "@/components/ui";
import { useUpdateProfile } from "@/lib/hooks";
import { AUTH_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";

const DEFAULT_RETENTION_DAYS = 90;
const MIN_DAYS = 0;
const MAX_DAYS = 365;

interface RecordingRetentionProps {
  initialDays: number;
}

export const RecordingRetention = ({ initialDays }: RecordingRetentionProps) => {
  const updateProfile = useUpdateProfile();
  const currentDays = updateProfile.data?.account?.recording_retention_days ?? initialDays;
  const [inputValue, setInputValue] = useState(String(currentDays));

  const handleBlur = (): void => {
    const parsed = parseInt(inputValue, 10);

    if (isNaN(parsed) || parsed < MIN_DAYS || parsed > MAX_DAYS) {
      setInputValue(String(currentDays));
      return;
    }

    if (parsed === currentDays) return;

    updateProfile.mutate(
      { recording_retention_days: parsed },
      {
        onSuccess: (data) => {
          const saved = data.account.recording_retention_days ?? DEFAULT_RETENTION_DAYS;
          setInputValue(String(saved));
          toast.success("Налаштування збережено");
        },
        onError: (err) => {
          setInputValue(String(currentDays));
          handleMutationError(err, AUTH_ERROR_MESSAGES);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="recording-retention">Зберігати записи розмов (днів)</Label>
      <Input
        id="recording-retention"
        type="number"
        min={MIN_DAYS}
        max={MAX_DAYS}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        disabled={updateProfile.isPending}
        className="w-32"
        aria-describedby="recording-retention-hint"
      />
      <p id="recording-retention-hint" className="text-muted-foreground text-xs">
        Старші записи видаляються автоматично. Розшифровки й звіти лишаються. 0 — не зберігати.
      </p>
    </div>
  );
};
