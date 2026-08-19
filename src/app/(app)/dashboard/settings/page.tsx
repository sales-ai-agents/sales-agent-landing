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
import { Progress } from "@/components/ui/progress";
import { useMe } from "@/lib/hooks/use-auth";
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
          <TabsTrigger value="billing">Тарифи</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileSection initialName={account?.name ?? ""} initialEmail={account?.email ?? ""} />
          <PasswordSection />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <IntegrationsSection />
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <BillingSection plan={account?.plan} />
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

  function handleSaveProfile(): void {
    toast.info("Збереження профілю ще не підключено");
  }

  return (
    <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
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
        <Button onClick={handleSaveProfile}>
          <Save className="mr-2 h-4 w-4" />
          Зберегти зміни
        </Button>
      </CardContent>
    </Card>
  );
}

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleChangePassword(): void {
    if (newPassword !== confirmPassword) {
      toast.error("Паролі не збігаються");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Пароль має містити щонайменше 8 символів");
      return;
    }
    toast.info("Зміна пароля ще не підключена");
  }

  return (
    <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
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
        <Button onClick={handleChangePassword}>Оновити пароль</Button>
      </CardContent>
    </Card>
  );
}

function IntegrationsSection() {
  return (
    <>
      <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
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

      <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
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

      <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
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

function BillingSection({ plan }: { plan?: string }) {
  const currentPlan = plan ?? "starter";

  return (
    <>
      <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
        <CardHeader>
          <h2 className="font-display text-2xl font-semibold">Поточний план</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold capitalize">{currentPlan}</p>
              <p className="text-muted-foreground text-sm">
                {currentPlan === "starter" && "$19/місяць • До 500 дзвінків"}
                {currentPlan === "pro" && "$49/місяць • До 2 000 дзвінків"}
                {currentPlan === "business" && "$99/місяць • До 5 000 дзвінків"}
                {currentPlan === "enterprise" && "Індивідуальна ціна"}
              </p>
            </div>
            <Badge variant="success">Активний</Badge>
          </div>
          <Button variant="outline">Змінити план</Button>
        </CardContent>
      </Card>

      <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
        <CardHeader>
          <h2 className="font-display text-2xl font-semibold">Використання за місяць</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span>Використано хвилин</span>
              <span className="text-muted-foreground">
                Дані з&apos;являться після першого дзвінка
              </span>
            </div>
            <Progress value={0} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
        <CardHeader>
          <h2 className="font-display text-2xl font-semibold">Тарифи</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div
              className={`flex justify-between border-b py-2 ${currentPlan === "starter" ? "bg-primary/5 -mx-2 rounded px-2" : ""}`}
            >
              <span className={currentPlan === "starter" ? "font-medium" : ""}>
                Starter {currentPlan === "starter" && "(Поточний)"}
              </span>
              <span className="font-medium">$19/міс — 500 дзвінків</span>
            </div>
            <div
              className={`flex justify-between border-b py-2 ${currentPlan === "pro" ? "bg-primary/5 -mx-2 rounded px-2" : ""}`}
            >
              <span className={currentPlan === "pro" ? "font-medium" : ""}>
                Pro {currentPlan === "pro" && "(Поточний)"}
              </span>
              <span className="font-medium">$49/міс — 2 000 дзвінків</span>
            </div>
            <div
              className={`flex justify-between border-b py-2 ${currentPlan === "business" ? "bg-primary/5 -mx-2 rounded px-2" : ""}`}
            >
              <span className={currentPlan === "business" ? "font-medium" : ""}>
                Business {currentPlan === "business" && "(Поточний)"}
              </span>
              <span className="font-medium">$99/міс — 5 000 дзвінків</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Enterprise</span>
              <span className="font-medium">Індивідуальна ціна</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
