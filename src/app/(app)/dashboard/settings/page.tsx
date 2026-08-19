"use client";

import { useState } from "react";
import { Save, Link2, FileSpreadsheet, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProfileData {
  name: string;
  email: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileData>({
    name: "John Smith",
    email: "demo@voiceagent.ai",
  });

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
          <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
            <CardHeader>
              <h2 className="font-display text-2xl font-semibold">Інформація профілю</h2>
              <CardDescription>Оновіть дані вашого акаунту</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Повне ім&apos;я</Label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Електронна пошта</Label>
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Save className="mr-2 h-4 w-4" />
                Зберегти зміни
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
            <CardHeader>
              <h2 className="font-display text-2xl font-semibold">Змінити пароль</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Поточний пароль</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Новий пароль</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Підтвердити новий пароль</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white">Оновити пароль</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
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
              <Input placeholder="https://your-app.com/webhooks/voiceagent" />
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
              <CardDescription>
                Завантажте журнал дзвінків та контакти у форматі CSV
              </CardDescription>
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
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
            <CardHeader>
              <h2 className="font-display text-2xl font-semibold">Поточний план</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold">Pro Plan</p>
                  <p className="text-muted-foreground text-sm">$49/місяць • До 2 000 дзвінків</p>
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
                  <span className="font-medium">847 / 2 000</span>
                </div>
                <Progress value={42} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-muted-foreground text-sm">Всього дзвінків</p>
                  <p className="text-lg font-semibold">1 247</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Середня за день</p>
                  <p className="text-lg font-semibold">42</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
            <CardHeader>
              <h2 className="font-display text-2xl font-semibold">Тарифи</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b py-2">
                  <span>Starter</span>
                  <span className="font-medium">$19/міс — 500 дзвінків</span>
                </div>
                <div className="bg-primary/5 -mx-2 flex justify-between rounded border-b px-2 py-2">
                  <span className="font-medium">Pro (Поточний)</span>
                  <span className="font-medium">$49/міс — 2 000 дзвінків</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span>Business</span>
                  <span className="font-medium">$99/міс — 5 000 дзвінків</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Enterprise</span>
                  <span className="font-medium">Індивідуальна ціна</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
