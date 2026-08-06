"use client";

import Image from "next/image";
import { Check, Headset } from "lucide-react";

import { useWebAgent } from "@/hooks/use-web-agent";
import { usePresets } from "@/hooks/use-presets";
import { useBuilderForm, VOICE_OPTIONS } from "@/hooks/use-builder-form";
import { LiveCallPanel } from "@/components/marketing/live-call-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { ScrollReveal, ScaleReveal } from "@/components/marketing/scroll-reveal";
import { BUILDER_CHECKLIST } from "@/lib/content";

export function BuilderSection() {
  const { presets, isLoading: presetsLoading } = usePresets();
  const { startAgent, isLoading, isSuccess, session, errorMessage, reset } = useWebAgent();
  const form = useBuilderForm(presets);

  function handleStart(): void {
    if (!form.isValid) return;
    trackEvent("builder_start_call", {
      voice: form.voiceApiValue,
      preset: form.activePreset?.id ?? "custom",
    });
    startAgent({
      instruction: form.instruction,
      voice: form.voiceApiValue,
      agent_name: form.name,
      ...(form.activePreset ? { preset: form.activePreset.id } : {}),
    });
  }

  return (
    <section id="builder" className="relative py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/image/builder-line.svg"
          alt=""
          fill
          className="absolute top-1/2! left-0 -z-20 w-full -translate-y-1/2! object-cover"
        />
        <div
          className="bg-primary/80 pointer-events-none absolute top-0 -right-40 -z-20 size-72 rounded-full blur-2xl"
          aria-hidden="true"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <ScrollReveal
            direction="left"
            distance={35}
            className="max-w-lg text-center lg:text-left"
          >
            <h2 className="font-display mb-6 text-3xl sm:text-4xl md:text-5xl">
              <span className="text-foreground">Конструктор агента </span>
              <span className="text-primary">без коду</span>
            </h2>

            <p className="text-muted-foreground mx-auto mb-10 max-w-md text-base lg:mx-0 lg:text-lg">
              Дайте агенту імʼя, оберіть голос і опишіть задачу простими словами. Перед дзвінками
              клієнтам сценарій можна перевірити на собі.
            </p>

            <ul className="space-y-5">
              {BUILDER_CHECKLIST.map((item) => (
                <li key={item} className="relative flex gap-4">
                  <div
                    className="bg-primary/80 pointer-events-none absolute top-1 left-4 -z-20 size-6 rounded-full blur-xs"
                    aria-hidden="true"
                  />
                  <div className="bg-card-glass flex size-8 shrink-0 items-center justify-center rounded-full border border-white">
                    <Check className="size-4" strokeWidth={3} />
                  </div>
                  <span className="text-foreground text-left text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScaleReveal
            delay={0.2}
            duration={0.7}
            className="mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto"
          >
            <div className="mb-6 flex justify-center">
              <div className="border-primary flex items-center gap-3 rounded-full border px-6 py-2">
                <div className="bg-primary size-3 rounded-full" aria-hidden="true" />
                <span className="text-lg font-bold text-neutral-700">Спробуйте безкоштовно</span>
              </div>
            </div>

            <div className="border-border shadow-primary/30 rounded-2xl border p-6 shadow-lg backdrop-blur-lg sm:p-10">
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
                    value={form.name}
                    maxLength={50}
                    onChange={(e) => {
                      form.setName(e.target.value);
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
                        aria-pressed={form.voice === option}
                        onClick={() => {
                          form.setVoice(option);
                          reset();
                        }}
                        className={cn(
                          "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border py-2 text-base",
                          form.voice === option
                            ? "border-input-border shadow-primary/30 bg-white shadow-md"
                            : "border-input-border bg-white"
                        )}
                      >
                        {option === "Жіночий" ? (
                          <Image
                            src="/image/woman.svg"
                            alt=""
                            aria-hidden="true"
                            width={10}
                            height={16}
                            style={{ width: "10px", height: "16px" }}
                          />
                        ) : (
                          <Image
                            src="/image/man.svg"
                            alt=""
                            aria-hidden="true"
                            width={10}
                            height={16}
                            style={{ width: "10px", height: "16px" }}
                          />
                        )}
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="space-y-2">
                  <legend className="text-foreground text-base">Вибрати сценарій</legend>

                  <div className="relative">
                    <Headset
                      className="text-muted-foreground absolute top-6 left-4 size-8 shrink-0"
                      aria-hidden="true"
                    />
                    <Textarea
                      id="agent-instruction"
                      value={form.instruction}
                      onChange={(e) => {
                        form.updateInstruction(e.target.value);
                        reset();
                      }}
                      placeholder="Опишіть, що має робити агент під час дзвінка…"
                      className="border-input-border text-foreground placeholder:text-muted-foreground focus:ring-primary/30 h-40 w-full rounded-2xl border bg-white py-3 pr-4 pl-16 text-base focus:ring-2 focus:outline-none"
                      aria-label="Інструкція для агента"
                    />
                  </div>

                  {presetsLoading ? (
                    <div className="flex gap-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="border-input-border h-10 flex-1 animate-pulse rounded-lg border bg-gray-100"
                        />
                      ))}
                    </div>
                  ) : presets.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      <div className="flex flex-wrap gap-3">
                        {presets.map((preset) => {
                          const isActive = form.activePreset?.id === preset.id;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              aria-pressed={isActive}
                              onClick={() => {
                                form.selectPreset(preset);
                                reset();
                              }}
                              title={preset.description}
                              className={cn(
                                "focus-visible:ring-primary flex-1 cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                                isActive
                                  ? "border-primary bg-primary text-white"
                                  : "border-primary text-foreground bg-white"
                              )}
                            >
                              {preset.label}
                            </button>
                          );
                        })}
                      </div>
                      {form.activePreset && (
                        <p className="text-muted-foreground text-sm">
                          {form.activePreset.description}
                        </p>
                      )}
                    </div>
                  ) : null}
                </fieldset>

                {isSuccess && session ? (
                  <LiveCallPanel session={session} agentName={form.name} />
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
                      disabled={isLoading || !form.isValid}
                      className="bg-primary hover:bg-primary/90 h-10 w-full rounded-lg text-base text-white disabled:opacity-50"
                      size="lg"
                    >
                      {isLoading ? "Запускаємо…" : "Перевірити дзвінок"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </ScaleReveal>
        </div>
      </div>
    </section>
  );
}
