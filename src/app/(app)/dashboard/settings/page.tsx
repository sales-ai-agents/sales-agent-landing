"use client";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useMe } from "@/lib/hooks";
import { PageError, PageLoading } from "@/components/dashboard";
import { BusinessSection } from "./_sections/business-section";
import { ProfileSection } from "./_sections/profile-section";
import { PasswordSection } from "./_sections/password-section";

export default function SettingsPage() {
  const { data: account, isLoading, error, refetch } = useMe();

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
        <div className="mt-3 max-w-sm">
          <Label htmlFor="timezone" className="text-xs">
            Часовий час
          </Label>
          <Select defaultValue="europe_kyiv">
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="europe_kyiv">(UTC+02:00) Київ, Європа</SelectItem>
              <SelectItem value="europe_london">(UTC+00:00) Лондон, Європа</SelectItem>
              <SelectItem value="us_eastern">(UTC-05:00) Нью-Йорк, США</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground mt-2 text-xs">
            Час у системі буде відображатися відповідно до обраного часового поясу
          </p>
        </div>
      </section>

      <BusinessSection initialCompany={account?.company ?? ""} />
      <ProfileSection initialName={account?.name ?? ""} initialEmail={account?.email ?? ""} />
      <PasswordSection />
    </div>
  );
}
