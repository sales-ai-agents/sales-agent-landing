"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Play, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useWizardStore } from "@/lib/store";
import { useCreateAgent, useTestCall } from "@/hooks/use-agents";

const STEPS = ["Назва", "Голос", "Інструкції", "Тест"] as const;

interface VoiceOption {
  readonly id: string;
  readonly name: string;
  readonly type: string;
}

const VOICES = [
  { id: "sarah", name: "Sarah", type: "Професійний жіночий" },
  { id: "james", name: "James", type: "Професійний чоловічий" },
  { id: "emma", name: "Emma", type: "Дружній жіночий" },
  { id: "michael", name: "Michael", type: "Дружній чоловічий" },
] as const satisfies readonly VoiceOption[];

export default function CreateAgentPage() {
  const router = useRouter();
  const createAgent = useCreateAgent();
  const testCall = useTestCall();

  const {
    step,
    name,
    voice,
    instructions,
    testPhone,
    setStep,
    setName,
    setVoice,
    setInstructions,
    setTestPhone,
    reset,
  } = useWizardStore();

  function handleNext(): void {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  }

  function handleBack(): void {
    if (step > 0) {
      setStep(step - 1);
    }
  }

  async function handleCreate(): Promise<void> {
    try {
      await createAgent.mutateAsync({ name, voice, instructions });
      reset();
      router.push("/dashboard/agents");
    } catch {
      // error surfaced via toast
    }
  }

  async function handleTestCall(): Promise<void> {
    if (!testPhone) return;
    try {
      const agent = await createAgent.mutateAsync({ name, voice, instructions });
      await testCall.mutateAsync({ agent_id: agent.id, phone: testPhone });
    } catch {
      // error surfaced via toast
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold">Створити нового агента</h1>
          <p className="text-muted-foreground">
            Крок {step + 1} з {STEPS.length}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {STEPS.map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                index <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {index < step ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            {index < STEPS.length - 1 && (
              <div className={cn("h-0.5 w-8", index < step ? "bg-primary" : "bg-muted")} />
            )}
          </div>
        ))}
      </div>

      <Card className="border-border shadow-primary/30 rounded-2xl shadow-lg">
        <CardContent className="p-6">
          {step === 0 && (
            <div className="space-y-4">
              <CardHeader className="p-0 pb-4">
                <h2 className="font-display text-2xl font-semibold">Назвіть свого агента</h2>
                <CardDescription>
                  Оберіть описову назву для вашого AI голосового агента.
                </CardDescription>
              </CardHeader>
              <div className="space-y-2">
                <Label htmlFor="agent-name">Назва агента</Label>
                <Input
                  id="agent-name"
                  placeholder="напр., Бот нагадування про зустрічі"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <CardHeader className="p-0 pb-4">
                <h2 className="font-display text-2xl font-semibold">Оберіть голос</h2>
                <CardDescription>
                  Оберіть голос, який ваш агент використовуватиме під час дзвінків.
                </CardDescription>
              </CardHeader>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {VOICES.map((voiceOption) => (
                  <div
                    key={voiceOption.id}
                    onClick={() => setVoice(voiceOption.id)}
                    className={cn(
                      "cursor-pointer rounded-lg border p-4 transition-colors",
                      voice === voiceOption.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{voiceOption.name}</p>
                        <p className="text-muted-foreground text-sm">{voiceOption.type}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <CardHeader className="p-0 pb-4">
                <h2 className="font-display text-2xl font-semibold">Напишіть інструкції</h2>
                <CardDescription>
                  Розкажіть агенту, що робити, звичайною мовою. Код не потрібен.
                </CardDescription>
              </CardHeader>
              <div className="space-y-2">
                <Label htmlFor="instructions">Інструкції</Label>
                <Textarea
                  id="instructions"
                  rows={6}
                  placeholder="Зателефонуйте клієнту, щоб нагадати про зустріч завтра. Якщо підтвердить — скажіть 'Чудово, чекаємо на вас!' Якщо хоче перенести — запитайте бажану дату і час. Завжди будьте ввічливі та професійні."
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                />
                <p className="text-muted-foreground text-xs">
                  Пишіть так, ніби пояснюєте реальній людині, що говорити під час дзвінка.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <CardHeader className="p-0 pb-4">
                <h2 className="font-display text-2xl font-semibold">Протестуйте агента</h2>
                <CardDescription>
                  Введіть свій номер телефону і ми зателефонуємо вам, щоб ви могли почути агента в
                  дії.
                </CardDescription>
              </CardHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-phone">Ваш номер телефону</Label>
                  <Input
                    id="test-phone"
                    placeholder="+380 XX XXX XXXX"
                    value={testPhone}
                    onChange={(event) => setTestPhone(event.target.value)}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleTestCall}
                  disabled={testCall.isPending || createAgent.isPending}
                >
                  {testCall.isPending || createAgent.isPending ? (
                    <>
                      <Phone className="mr-2 h-4 w-4 animate-pulse" />
                      Дзвінок...
                    </>
                  ) : (
                    <>
                      <Phone className="mr-2 h-4 w-4" />
                      Тестовий дзвінок
                    </>
                  )}
                </Button>
                {testCall.isSuccess && (
                  <p className="text-center text-sm text-green-600">
                    Дзвінок ініційовано! Ваш телефон має зазвонити найближчим часом.
                  </p>
                )}

                <div className="bg-muted mt-6 space-y-2 rounded-lg p-4">
                  <h3 className="text-sm font-medium">Підсумок агента</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Назва:</span> {name || "—"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Голос:</span>{" "}
                      {VOICES.find((v) => v.id === voice)?.name || "—"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Інструкції:</span>{" "}
                      {instructions ? instructions.slice(0, 60) + "..." : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={step === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={handleNext}>
            Далі
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={createAgent.isPending}>
            <Check className="mr-2 h-4 w-4" />
            {createAgent.isPending ? "Створення..." : "Створити агента"}
          </Button>
        )}
      </div>
    </div>
  );
}
