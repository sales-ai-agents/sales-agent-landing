"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Headphones, UserRound } from "lucide-react";

import { useWebAgent } from "@/hooks/use-web-agent";
import { LiveCallPanel } from "@/components/marketing/live-call-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VOICE_OPTIONS = ["Жіночий", "Чоловічий"] as const;
type VoiceOption = (typeof VOICE_OPTIONS)[number];

const ROLE_OPTIONS = ["Адміністратор", "Логіст", "Замовлення"] as const;
type RoleOption = (typeof ROLE_OPTIONS)[number];

const SCENARIO_MAP: Record<RoleOption, string> = {
  Адміністратор: "Агент нагадає про запис, запитає підтвердження та передасть відповідь менеджеру",
  Логіст:
    "Агент уточнить маршрут, тип вантажу, дату, контактну особу та передасть заявку менеджеру",
  Замовлення:
    "Агент підтвердить адресу, час отримання, контактний номер і зафіксує результат дзвінка",
} as const;

const VOICE_API_MAP: Record<VoiceOption, string> = {
  Жіночий: "жіночий",
  Чоловічий: "чоловічий",
} as const;

const CHECKLIST_ITEMS = [
  "Голос: жіночий або чоловічий",
  "Інструкція звичайною мовою",
  "Готові шаблони під вашу нішу",
  "Миттєва інтеграція з CRM",
  "Тестовий дзвінок перед запуском",
] as const;

function ChecklistIcon() {
  return (
    <div className="from-primary flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br to-sky-200">
      <Check className="size-3.5 text-black/70" strokeWidth={3} />
    </div>
  );
}

export function BuilderSection() {
  const [name, setName] = useState("Марія");
  const [voice, setVoice] = useState<VoiceOption>("Жіночий");
  const [role, setRole] = useState<RoleOption>("Логіст");

  const { startAgent, isLoading, isSuccess, session, errorMessage, reset } = useWebAgent();

  const scenario = SCENARIO_MAP[role];
  const isNameEmpty = name.trim().length === 0;

  function handleStart(): void {
    if (isNameEmpty) return;
    startAgent({
      instruction: scenario,
      voice: VOICE_API_MAP[voice],
      agent_name: name,
    });
  }

  return (
    <section id="builder" className="relative py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/image/builder-line.svg"
          alt=""
          width={1400}
          height={600}
          className="absolute top-1/2 left-0 h-auto w-full -translate-y-1/2 opacity-60"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="max-w-lg text-center lg:text-left">
            <h2 className="font-display mb-6 text-3xl sm:text-4xl md:text-5xl">
              <span className="text-foreground">Конструктор агента </span>
              <span className="text-primary">без коду</span>
            </h2>

            <p className="text-muted-foreground mx-auto mb-10 max-w-md text-base lg:mx-0 lg:text-lg">
              Дайте агенту імʼя, оберіть голос і опишіть задачу простими словами. Перед дзвінками
              клієнтам сценарій можна перевірити на собі.
            </p>

            <ul className="space-y-5">
              {CHECKLIST_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <ChecklistIcon />
                  <span className="text-muted-foreground text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
            <div className="mb-6 flex justify-center">
              <div className="border-primary flex items-center gap-3 rounded-full border px-6 py-2">
                <div className="bg-primary size-3 rounded-full" aria-hidden="true" />
                <span className="text-lg font-bold text-neutral-700">Спробуйте безкоштовно</span>
              </div>
            </div>

            <div className="border-border shadow-primary/30 rounded-2xl border p-6 shadow-lg backdrop-blur-lg sm:p-8 md:p-10 lg:p-15">
              <h3 className="text-foreground font-body mb-6 text-xl font-semibold">
                Налаштування агента
              </h3>

              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="agent-name" className="text-foreground text-base">
                    Імʼя агента
                  </label>
                  <Input
                    id="agent-name"
                    type="text"
                    value={name}
                    maxLength={50}
                    onChange={(e) => {
                      setName(e.target.value);
                      reset();
                    }}
                    className="border-input-border h-9 rounded-lg bg-white text-base"
                  />
                </div>

                <fieldset className="space-y-2">
                  <legend className="text-foreground text-base">Голос</legend>
                  <div className="flex gap-3">
                    {VOICE_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={voice === option}
                        onClick={() => {
                          setVoice(option);
                          reset();
                        }}
                        className={`focus-visible:ring-primary flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border py-2 text-base transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                          voice === option
                            ? "border-input-border shadow-primary/30 bg-white shadow-md"
                            : "border-input-border bg-white"
                        }`}
                      >
                        <UserRound className="size-4" aria-hidden="true" />
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="space-y-2">
                  <legend className="text-foreground text-base">Вибрати сценарій</legend>
                  <div className="border-input-border flex min-h-25 items-start gap-3 rounded-2xl border bg-white px-4 py-3">
                    <Headphones
                      className="text-muted-foreground mt-0.5 size-5 shrink-0"
                      aria-hidden="true"
                    />
                    <p className="text-foreground text-base" aria-live="polite">
                      {scenario}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {ROLE_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={role === option}
                        onClick={() => {
                          setRole(option);
                          reset();
                        }}
                        className={`focus-visible:ring-primary flex-1 cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                          role === option
                            ? "border-primary bg-primary text-white"
                            : "border-primary text-foreground bg-white"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {isSuccess && session ? (
                  <LiveCallPanel session={session} agentName={name} />
                ) : (
                  <>
                    {errorMessage && (
                      <p role="alert" className="text-center text-sm text-red-600">
                        {errorMessage}
                      </p>
                    )}

                    <Button
                      type="button"
                      onClick={handleStart}
                      disabled={isLoading || isNameEmpty}
                      className="bg-primary hover:bg-primary/90 h-10 w-full rounded-lg text-base text-white disabled:opacity-50"
                      size="lg"
                    >
                      {isLoading ? "Запускаємо…" : "Перевірити дзвінок"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
