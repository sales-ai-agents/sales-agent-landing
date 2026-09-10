"use client";

import { useState } from "react";
import { Copy, Info } from "lucide-react";
import { toast } from "sonner";

import { Button, Input, Label, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";

// BE not ready: no endpoints to list account numbers, connect a SIP trunk or
// verify it, and POST /app/agents accepts no number. This step is informational.

export const StepNumber = () => {
  const [sipAddress, setSipAddress] = useState("");

  const handleCopy = async () => {
    if (!sipAddress) return;
    try {
      await navigator.clipboard.writeText(sipAddress);
      toast.success("SIP-адресу скопійовано");
    } catch {
      toast.error("Не вдалося скопіювати");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">Вибір номера</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Оберіть номер, з якого буде телефонувати агент.
        </p>
      </div>

      <Tabs defaultValue="my-numbers">
        <TabsList className="w-full">
          <TabsTrigger value="my-numbers" className="flex-1">
            Мої номера
          </TabsTrigger>
          <TabsTrigger value="connect" className="flex-1">
            Підключити номер
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-numbers" className="mt-4">
          <div className="border-border text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
            Ще немає підключених номерів. Підключіть номер на вкладці «Підключити номер».
          </div>
        </TabsContent>

        <TabsContent value="connect" className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Підключення АТС (SIP)</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Після цього агент зможе телефонувати з вашого номера
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sip-address">SIP-адреса</Label>
            <div className="flex gap-2">
              <Input
                id="sip-address"
                className="h-8"
                placeholder="sip:example.sip.livekit.cloud"
                value={sipAddress}
                onChange={(event) => setSipAddress(event.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                aria-label="Скопіювати SIP-адресу"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button type="button">Перевірити</Button>
            </div>
          </div>

          <div className="text-muted-foreground space-y-1 text-sm">
            <p className="text-foreground flex items-center gap-1.5 font-medium">
              <Info className="text-primary h-4 w-4" />
              Як підключити номер
            </p>
            <ol className="list-inside list-decimal space-y-0.5 text-xs">
              <li>Скопіюйте SIP-адресу вище.</li>
              <li>Додайте її у своє АТС як напрямок для вихідних дзвінків.</li>
              <li>Збережіть налаштування.</li>
            </ol>
          </div>

          <div className="bg-primary/5 text-muted-foreground mt-5 rounded-lg p-3 text-xs">
            <p className="text-foreground flex items-center gap-1.5 font-medium">
              <Info className="text-primary h-4 w-4" />
              Важливо
            </p>
            <p className="mt-1 w-md">
              Дані надає ваш оператор (Binotel, Ringostat, Phonet, Київстар тощо). Якщо виникнуть
              питання, зверніться до їхньої підтримки.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
