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
import { SettingsSection } from "./settings-section";
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
    <SettingsSection
      title="Таймзона"
      description="Оберіть часовий пояс для коректного відображення часу в системі та звітах"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="timezone">Часовий пояс</Label>
        <Combobox
          items={options}
          value={selected}
          onValueChange={handleValueChange}
          itemToStringLabel={(option) => option.label}
          itemToStringValue={(option) => option.value}
          disabled={updateProfile.isPending}
        >
          <ComboboxInput id="timezone" placeholder="Пошук часового поясу..." />
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
    </SettingsSection>
  );
};
