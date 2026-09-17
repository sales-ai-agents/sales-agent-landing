"use client";

import { useState } from "react";
import Image from "next/image";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Check, Copy, Info } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";
import type { CreateAgentFormData } from "@/lib/schemas";
import type { AgentNumber } from "@dashboard/types";
import { NumberPicker } from "../../_components/number-picker";

interface StepNumberProps {
  form: UseFormReturn<CreateAgentFormData>;
  numbers: AgentNumber[];
}

const SIP_HINTS = [
  "Скопіюйте SIP-адресу вище.",
  "Додайте її у своє АТС як напрямок для вихідних дзвінків.",
  "Збережіть налаштування.",
];

export const StepNumber = ({ form, numbers }: StepNumberProps) => {
  const [sipAddress, setSipAddress] = useState("");
  const [connectPhone, setConnectPhone] = useState("");
  const [isVerified, setIsVerified] = useState(false);

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
          {numbers.length === 0 ? (
            <div className="border-border text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
              Ще немає підключених номерів. Підключіть номер на вкладці «Підключити номер».
            </div>
          ) : (
            <Controller
              control={form.control}
              name="numberId"
              render={({ field }) => (
                <NumberPicker numbers={numbers} value={field.value} onChange={field.onChange} />
              )}
            />
          )}
        </TabsContent>

        <TabsContent value="connect" className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Підключення АТС (SIP)</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Після цього агент зможе телефонувати з вашого номера
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sip-address">SIP-адреса</Label>
              {isVerified && (
                <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                  <Check className="h-3.5 w-3.5" />
                  Підключення успішне
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                id="sip-address"
                className="h-9"
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
              <Button type="button" onClick={() => setIsVerified(true)} disabled={!sipAddress}>
                Перевірити
              </Button>
            </div>
          </div>

          <div className="text-muted-foreground space-y-1 text-sm">
            <p className="text-foreground flex items-center gap-1.5 font-medium">
              <Info className="text-primary h-4 w-4" />
              Як підключити номер
            </p>
            <ol className="list-inside list-decimal space-y-0.5 text-xs">
              {SIP_HINTS.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ol>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="connect-phone">Вкажіть номер, який підключаєте</Label>
            <InputGroup>
              <InputGroupAddon>
                <Image src="/image/ua-flag.svg" alt="" width={24} height={16} aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                id="connect-phone"
                inputMode="tel"
                value={connectPhone}
                onChange={(event) => setConnectPhone(event.target.value)}
                placeholder="+380 32 245 11 90"
              />
            </InputGroup>
            <p className="text-muted-foreground text-xs">Вводьте у форматі +380 XX XXX XX XX</p>
          </div>

          <div className="bg-primary/5 text-muted-foreground rounded-lg p-3 text-xs">
            <p className="text-foreground flex items-center gap-1.5 font-medium">
              <Info className="text-primary h-4 w-4" />
              Важливо
            </p>
            <p className="mt-1">
              Дані надає ваш оператор (Binotel, Ringostat, Phonet, Київстар тощо). Якщо виникнуть
              питання, зверніться до їхньої підтримки.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
