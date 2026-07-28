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
  Адміністратор:
    "Агент нагадає про запис, запитає підтвердження та передасть відповідь менеджеру",
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
    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-200">
      <Check className="size-3.5 text-black/70" strokeWidth={3} />
    </div>
  );
}

export function BuilderSection() {
  const [name, setName] = useState("Марія");
  const [voice, setVoice] = useState<VoiceOption>("Жіночий");
  const [role, setRole] = useState<RoleOption>("Логіст");

  const { startAgent, isLoading, isSuccess, session, errorMessage, reset } =
    useWebAgent();

  const scenario = SCENARIO_MAP[role];

  function handleStart(): void {
    startAgent({
      instruction: scenario,
      voice: VOICE_API_MAP[voice],
      agent_name: name,
    });
  }

  return (
    <section className="relative py-20">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/image/builder-line.svg"
          alt=""
          width={1400}
          height={600}
          className="absolute left-0 top-1/2 h-auto w-full -translate-y-1/2 opacity-60"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Left text column */}
          <div className="max-w-lg text-center lg:text-left">
            <h2 className="mb-6 font-display text-3xl uppercase sm:text-4xl md:text-5xl">
              <span className="text-black">Конструктор агента </span>
              <span className="text-primary">без коду</span>
            </h2>

            <p className="mx-auto mb-10 max-w-md text-base text-neutral-600 lg:mx-0 lg:text-lg">
              Дайте агенту імʼя, оберіть голос і опишіть задачу простими
              словами. Перед дзвінками клієнтам сценарій можна перевірити на
              собі.
            </p>

            {/* Checklist */}
            <ul className="space-y-5">
              {CHECKLIST_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <ChecklistIcon />
                  <span className="text-lg text-neutral-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right form card */}
          <div className="mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto mt-0 lg:-mt-20">
            {/* "Try for free" pill */}
            <div className="mb-6 flex justify-center">
              <div className="flex items-center gap-3 rounded-full border border-primary px-6 py-2">
                <div className="size-3 rounded-full bg-primary" aria-hidden="true" />
                <span className="text-lg font-bold text-neutral-700">
                  Спробуйте безкоштовно
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-gradient-to-br from-gray-100/15 to-primary/5 p-15 backdrop-blur-lg">
              <h3 className="mb-6 text-lg font-semibold text-black">
                Налаштування агента
              </h3>

              <div className="space-y-5">
                {/* Agent Name */}
                <div className="space-y-2">
                  <p className="text-base text-black">Імʼя агента</p>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      reset();
                    }}
                    className="h-9 rounded-lg border-gray-400 bg-white text-base"
                  />
                </div>

                {/* Voice */}
                <fieldset className="space-y-2">
                  <legend className="text-base text-black">Голос</legend>
                  <div className="flex gap-3">
                    {VOICE_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setVoice(option);
                          reset();
                        }}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-base text-neutral-600 transition-colors ${
                          voice === option
                            ? "border-gray-400 bg-white shadow-[0_0_12px_4px_rgba(0,91,255,0.2)]"
                            : "border-gray-400 bg-white"
                        }`}
                      >
                        <UserRound className="size-4" aria-hidden="true" />
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Scenario */}
                <div className="space-y-2">
                  <p className="text-base text-black">Вибрати сценарій</p>
                  <div className="flex items-start gap-3 rounded-2xl border border-gray-400 bg-white px-4 py-3">
                    <Headphones className="mt-0.5 size-5 shrink-0 text-neutral-600" aria-hidden="true" />
                    <p className="text-base text-black">{scenario}</p>
                  </div>
                </div>

                {/* Role selector pills */}
                <div className="flex gap-3">
                  {ROLE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setRole(option);
                        reset();
                      }}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                        role === option
                          ? "border-primary bg-primary text-white"
                          : "border-primary bg-white text-black"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Live call panel or button */}
                {isSuccess && session ? (
                  <LiveCallPanel session={session} agentName={name} />
                ) : (
                  <>
                    {errorMessage && (
                      <p
                        role="alert"
                        className="text-center text-sm text-red-600"
                      >
                        {errorMessage}
                      </p>
                    )}

                    <Button
                      type="button"
                      onClick={handleStart}
                      disabled={isLoading}
                      className="h-10 w-full rounded-lg bg-primary text-base text-white hover:bg-primary/90"
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
