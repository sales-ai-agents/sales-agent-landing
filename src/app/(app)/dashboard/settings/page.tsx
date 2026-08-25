"use client";

import { useState } from "react";
import { Save, Link2, FileSpreadsheet, Webhook } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
        <h1 className="font-display text-2xl font-bold">Налаштування</h1>
        <p className="text-muted-foreground">Керуйте акаунтом та інтеграціями</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Профіль</TabsTrigger>
          <TabsTrigger value="integrations">Інтеграції</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileSection initialName={account?.name ?? ""} initialEmail={account?.email ?? ""} />
          <PasswordSection />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <IntegrationsSection />
        </TabsContent>
      </Tabs>
    </div>
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

  function handleSaveProfile(): void {
    const params: Record<string, string> = {};
    if (name !== initialName) params.name = name;
    if (email !== initialEmail) params.email = email;

    updateProfile.mutate(params, {
      onSuccess: () => {
        toast.success("Профіль оновлено");
      },
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
    <Card className="border-border rounded-2xl">
      <CardHeader>
        <h2 className="font-display text-2xl font-semibold">Інформація профілю</h2>
        <CardDescription>Оновіть дані вашого акаунту</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-name">Повне ім&apos;я</Label>
          <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email">Електронна пошта</Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button onClick={handleSaveProfile} disabled={!hasChanges || updateProfile.isPending}>
          <Save className="mr-2 h-4 w-4" />
          {updateProfile.isPending ? "Збереження..." : "Зберегти зміни"}
        </Button>
      </CardContent>
    </Card>
  );
}

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const changePassword = useChangePassword();

  const canSubmit =
    currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  function handleChangePassword(): void {
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
    <Card className="border-border rounded-2xl">
      <CardHeader>
        <h2 className="font-display text-2xl font-semibold">Змінити пароль</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Поточний пароль</Label>
          <Input
            id="current-password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">Новий пароль</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Підтвердити новий пароль</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button onClick={handleChangePassword} disabled={!canSubmit || changePassword.isPending}>
          {changePassword.isPending ? "Оновлення..." : "Оновити пароль"}
        </Button>
      </CardContent>
    </Card>
  );
}

function IntegrationsSection() {
  return (
    <>
      <Card className="border-border rounded-2xl">
        <CardHeader>
          <h2 className="font-display flex items-center gap-2 text-2xl font-semibold">
            <Webhook className="h-5 w-5" />
            Webhook URL
          </h2>
          <CardDescription>
            Отримуйте сповіщення в реальному часі після завершення дзвінків
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="webhook-url" className="sr-only">
            Webhook URL
          </Label>
          <Input id="webhook-url" placeholder="https://your-app.com/webhooks/voiceagent" />
          <Button variant="outline" size="sm">
            Зберегти Webhook
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border rounded-2xl">
        <CardHeader>
          <h2 className="font-display flex items-center gap-2 text-2xl font-semibold">
            <Link2 className="h-5 w-5" />
            Google Sheets
          </h2>
          <CardDescription>
            Автоматично записуйте результати дзвінків у Google Sheet
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Badge variant="success">Підключено</Badge>
          <Button variant="outline" size="sm">
            Відключити
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border rounded-2xl">
        <CardHeader>
          <h2 className="font-display flex items-center gap-2 text-2xl font-semibold">
            <FileSpreadsheet className="h-5 w-5" />
            Експорт CSV
          </h2>
          <CardDescription>Завантажте журнал дзвінків та контакти у форматі CSV</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button variant="outline" size="sm">
            Експорт дзвінків
          </Button>
          <Button variant="outline" size="sm">
            Експорт контактів
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
