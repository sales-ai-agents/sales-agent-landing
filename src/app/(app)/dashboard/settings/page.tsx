"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useMe, useUpdateProfile } from "@/lib/hooks";
import { PageError, PageLoading } from "@/components/dashboard";
import { handleMutationError } from "@/lib/mutation-error";
import { AUTH_ERROR_MESSAGES } from "@/lib/error-messages";
import { Business } from "./_components/business";
import { Profile } from "./_components/profile";
import { Password } from "./_components/password";
import { Notifications } from "./_components/notifications";
import { Team } from "./_components/team";

const TIMEZONE_OPTIONS = [
  { value: "Europe/Kyiv", label: "(UTC+02:00) Київ, Європа" },
  { value: "Europe/London", label: "(UTC+00:00) Лондон, Європа" },
  { value: "America/New_York", label: "(UTC-05:00) Нью-Йорк, США" },
  { value: "Europe/Berlin", label: "(UTC+01:00) Берлін, Європа" },
  { value: "Asia/Tokyo", label: "(UTC+09:00) Токіо, Японія" },
];

const DEFAULT_TZ = "Europe/Kyiv";

const SettingsPage = () => {
  const { data: account, isLoading, error, refetch } = useMe();
  const updateProfile = useUpdateProfile();

  const [timezone, setTimezone] = useState<string | null>(null);
  const effectiveTimezone = timezone ?? account?.timezone ?? DEFAULT_TZ;
  const selectedLabel = TIMEZONE_OPTIONS.find((opt) => opt.value === effectiveTimezone)?.label;

  const handleTimezoneChange = (val: string | null) => {
    if (!val) return;
    setTimezone(val);
    updateProfile.mutate(
      { timezone: val },
      {
        onSuccess: () => toast.success("Таймзону оновлено"),
        onError: (err) => handleMutationError(err, AUTH_ERROR_MESSAGES),
      }
    );
  };

  if (isLoading) return <PageLoading />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Профіль / Налаштування</h1>
        <p className="text-muted-foreground text-sm">Керування вашим акаунтом та налаштування</p>
      </div>

      <section className="border-border bg-background rounded-2xl border p-5">
        <h2 className="text-base font-semibold">Таймзона</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          Оберіть часовий пояс для коректного відображення часу в системі та звітах
        </p>
        <div className="mt-3">
          <Label htmlFor="timezone" className="text-xs">
            Часовий пояс
          </Label>
          <Select value={effectiveTimezone} onValueChange={handleTimezoneChange}>
            <SelectTrigger className="mt-1 w-full" id="timezone">
              <SelectValue>{selectedLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TIMEZONE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-muted-foreground mt-2 text-xs">
            Час у системі буде відображатися відповідно до обраного часового поясу
          </p>
        </div>
      </section>

      <Business
        initialCompany={account?.company ?? ""}
        initialShortName={account?.short_name ?? ""}
        initialWebsite={account?.website ?? ""}
        initialLanguage={account?.agent_language ?? "uk"}
      />

      <Profile initialName={account?.name ?? ""} initialEmail={account?.email ?? ""} />

      <Password />

      <Notifications />

      <Team />
    </div>
  );
};

export default SettingsPage;
