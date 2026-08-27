// NOTE: This page displays placeholder/hardcoded data until the integrations API is available.
// All connection states, webhook logs, and CRM connectors are static UI mockups.

"use client";

import { FileSpreadsheet, Webhook, Key } from "lucide-react";

import { Button } from "@/components/ui";

const IntegrationsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Інтеграції</h1>
        <p className="text-muted-foreground text-sm">
          Підключайте сервіси для автоматизації та передачі даних
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="border-border bg-background rounded-2xl border p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
              <FileSpreadsheet className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Google Sheets</h3>
              <p className="text-xs text-green-600">● Підключено як</p>
              <p className="text-muted-foreground mt-1 text-xs">—</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              Відключити
            </Button>
          </div>
        </div>

        <div className="border-primary/30 bg-background rounded-2xl border p-5">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
              <Webhook className="text-primary h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Webhook URL</h3>
              <p className="text-xs text-green-600">● Підключено</p>
              <p className="text-muted-foreground mt-1 text-xs">URL</p>
              <p className="text-primary mt-0.5 text-xs">https://crm.example.com/webhook</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Тест
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                Відключити
              </Button>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-xs">
            <div className="text-muted-foreground flex items-center gap-2">
              <span className="text-green-600">◉</span>
              <span>07.05.2026 14:31:22</span>
              <span>Успіх</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2">
              <span className="text-red-500">◉</span>
              <span>07.05.2026 14:31:22</span>
              <span>Помилка</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2">
              <span className="text-green-600">◉</span>
              <span>07.05.2026 14:31:22</span>
              <span>Успіх</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold">CRM конектори</h2>
        <p className="text-muted-foreground text-sm">
          Підключайте популярні CRM-системи в один клік
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CrmCard name="Bitrix24" description="Автоматична передача лідів, угод та активностей" />
          <CrmCard name="KeyCRM" description="Передача заявок, контактів та історії дзвінків" />
          <CrmCard name="Pipedrive" description="Створення лідів та угод з історією взаємодії" />
        </div>
      </div>

      <div className="border-border bg-background rounded-2xl border p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
              <Key className="text-primary h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">API-ключі</h3>
              <p className="text-muted-foreground text-xs">
                Розділ для генерації та управління API-ключами для власних інтеграцій та розробки
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Відкрити
          </Button>
        </div>
      </div>
    </div>
  );
};

function CrmCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="border-border bg-background flex flex-col rounded-2xl border p-5">
      <div className="flex items-center gap-3">
        <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <h3 className="text-sm font-semibold">{name}</h3>
          <p className="text-muted-foreground text-xs">● Не підключено</p>
        </div>
      </div>
      <p className="text-muted-foreground mt-3 flex-1 text-xs">{description}</p>
      <Button variant="outline" size="sm" className="mt-4 w-full">
        Підключити
      </Button>
    </div>
  );
}

export default IntegrationsPage;
