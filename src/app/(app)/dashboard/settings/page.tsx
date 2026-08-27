"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMe, useUpdateProfile, useChangePassword } from "@/lib/hooks/use-auth";
import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage, AUTH_ERROR_MESSAGES } from "@/lib/error-messages";
import { PageLoading } from "@/components/dashboard/page-states";

export default function SettingsPage() {
  const { data: account, isLoading } = useMe();

  if (isLoading) return <PageLoading />;

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

function BusinessSection({ initialCompany }: { initialCompany: string }) {
  const [company, setCompany] = useState(initialCompany);
  const [shortName, setShortName] = useState("");
  const updateProfile = useUpdateProfile();

  function handleSave(): void {
    updateProfile.mutate(
      { company },
      {
        onSuccess: () => toast.success("Дані бізнесу оновлено"),
        onError: (error) => {
          if (error instanceof ApiError) {
            toast.error(resolveErrorMessage(error.code, AUTH_ERROR_MESSAGES));
          } else {
            toast.error("Щось пішло не так.");
          }
        },
      }
    );
  }

  return (
    <section className="border-border bg-background rounded-2xl border p-5">
      <h2 className="text-base font-semibold">Дані бізнесу</h2>
      <p className="text-muted-foreground mt-1 text-xs">
        Інформація про ваш бізнес, яку агент використовує під час дзвінків
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="company-name" className="text-xs">
            Назва компанії (вимовляється агентом)
          </Label>
          <Input
            id="company-name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Calls4U"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="short-name" className="text-xs">
            Коротка назва для відображення
          </Label>
          <Input
            id="short-name"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            placeholder="Calls4U"
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="website" className="text-xs">
            Сайт компанії (необов&apos;язково)
          </Label>
          <Input id="website" placeholder="https://..." />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Мова спілкування агентів за замовчуванням</Label>
          <Select defaultValue="uk">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uk">Українська</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button size="sm" className="mt-4" onClick={handleSave} disabled={updateProfile.isPending}>
        {updateProfile.isPending ? "Збереження..." : "Зберегти зміни"}
      </Button>
    </section>
  );
}

function ProfileSection({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const updateProfile = useUpdateProfile();

  const hasChanges = name !== initialName || email !== initialEmail;

  function handleSave(): void {
    const params: Record<string, string> = {};
    if (name !== initialName) params.name = name;
    if (email !== initialEmail) params.email = email;

    updateProfile.mutate(params, {
      onSuccess: () => toast.success("Профіль оновлено"),
      onError: (error) => {
        if (error instanceof ApiError) {
          toast.error(resolveErrorMessage(error.code, AUTH_ERROR_MESSAGES));
        } else {
          toast.error("Щось пішло не так.");
        }
      },
    });
  }

  return (
    <section className="border-border bg-background rounded-2xl border p-5">
      <h2 className="text-base font-semibold">Інформація профілю</h2>
      <p className="text-muted-foreground mt-1 text-xs">Оновіть дані вашого акаунту</p>
      <div className="mt-4 space-y-4">
        <div className="space-y-1">
          <Label htmlFor="profile-name" className="text-xs">
            Повне ім&apos;я
          </Label>
          <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-email" className="text-xs">
            Електронна пошта
          </Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <Button
        size="sm"
        className="mt-4"
        onClick={handleSave}
        disabled={!hasChanges || updateProfile.isPending}
      >
        {updateProfile.isPending ? "Збереження..." : "Зберегти зміни"}
      </Button>
    </section>
  );
}

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const changePassword = useChangePassword();

  const canSubmit =
    currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  function handleChange(): void {
    changePassword.mutate(
      { current_password: currentPassword, new_password: newPassword },
      {
        onSuccess: () => {
          toast.success("Пароль змінено");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            toast.error(resolveErrorMessage(error.code, AUTH_ERROR_MESSAGES));
          } else {
            toast.error("Щось пішло не так.");
          }
        },
      }
    );
  }

  return (
    <section className="border-border bg-background rounded-2xl border p-5">
      <h2 className="text-base font-semibold">Змінити пароль</h2>
      <div className="mt-4 space-y-4">
        <div className="space-y-1">
          <Label htmlFor="current-password" className="text-xs">
            Поточний пароль
          </Label>
          <Input
            id="current-password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new-password" className="text-xs">
            Новий пароль
          </Label>
          <Input
            id="new-password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirm-password" className="text-xs">
            Підтвердити новий пароль
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>
      <Button
        size="sm"
        className="mt-4"
        onClick={handleChange}
        disabled={!canSubmit || changePassword.isPending}
      >
        {changePassword.isPending ? "Оновлення..." : "Оновити пароль"}
      </Button>
    </section>
  );
}
