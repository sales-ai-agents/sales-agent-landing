"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  Label,
} from "@/components/ui";
import { useUpdateProfile } from "@/lib/hooks";
import { AUTH_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { buildTimezoneOptions, canonicalizeTimezone, type TimezoneOption } from "@/lib/timezones";

const DEFAULT_TIMEZONE = "Europe/Kyiv";

interface TimezoneProps {
  initialTimezone: string | null;
}

export const Timezone = ({ initialTimezone }: TimezoneProps) => {
  const options = useMemo(() => buildTimezoneOptions(), []);
  const updateProfile = useUpdateProfile();

  const [selected, setSelected] = useState<TimezoneOption | null>(() => {
    const canonical = canonicalizeTimezone(initialTimezone ?? DEFAULT_TIMEZONE);
    return options.find((option) => option.value === canonical) ?? null;
  });

  const handleValueChange = (option: TimezoneOption | null) => {
    if (!option) return;
    setSelected(option);
    updateProfile.mutate(
      { timezone: option.value },
      {
        onSuccess: () => toast.success("Таймзону оновлено"),
        onError: (err) => handleMutationError(err, AUTH_ERROR_MESSAGES),
      }
    );
  };

  return (
    <section className="border-border bg-background rounded-2xl border p-5">
      <h2 className="text-base font-semibold">Таймзона</h2>
      <p className="text-muted-foreground mt-1 text-xs">
        Оберіть часовий пояс для коректного відображення часу в системі та звітах
      </p>
      <div className="mt-3 space-y-1">
        <Label htmlFor="timezone" className="text-xs">
          Часовий пояс
        </Label>
        <Combobox
          items={options}
          value={selected}
          onValueChange={handleValueChange}
          itemToStringLabel={(option) => option.label}
          itemToStringValue={(option) => option.value}
          disabled={updateProfile.isPending}
        >
          <ComboboxInput
            id="timezone"
            className="focus:border-border w-full"
            placeholder="Пошук часового поясу..."
          />
          <ComboboxContent>
            <ComboboxEmpty>Часовий пояс не знайдено</ComboboxEmpty>
            <ComboboxList>
              {(option: TimezoneOption) => (
                <ComboboxItem key={option.value} value={option}>
                  {option.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <p className="text-muted-foreground text-xs">
          Час у системі буде відображатися відповідно до обраного часового поясу
        </p>
      </div>
    </section>
  );
};
