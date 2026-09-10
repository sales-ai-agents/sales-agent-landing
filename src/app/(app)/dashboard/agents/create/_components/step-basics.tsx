"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { Input, Label, RadioGroup, RadioGroupItem } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { CreateAgentFormData } from "@/lib/schemas";
import type { Voice } from "@dashboard/types";
import { VoiceSampleButton } from "../../_components/voice-sample-button";

interface StepBasicsProps {
  form: UseFormReturn<CreateAgentFormData>;
  voices: Voice[];
}

export const StepBasics = ({ form, voices }: StepBasicsProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">Назва агента та голос</h2>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          Вкажіть назву агенту та оберіть голос, який буде спілкуватися з клієнтами.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="agent-name">Назва агента</Label>
        <Input
          id="agent-name"
          placeholder="напр., Дмитро - бот нагадування про зустріч"
          {...register("name")}
        />
        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold">Оберіть голос</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Оберіть голос, який ваш агент використовуватиме під час дзвінків.
          </p>
        </div>

        <Controller
          control={control}
          name="voice"
          render={({ field }) => (
            <RadioGroup
              aria-label="Оберіть голос"
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? "")}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {voices.map((voice) => {
                const isSelected = field.value === voice.key;

                return (
                  <Label
                    key={voice.key}
                    htmlFor={`voice-${voice.key}`}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <RadioGroupItem
                        id={`voice-${voice.key}`}
                        value={voice.key}
                        className="hidden"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{voice.name}</p>
                        <p className="text-muted-foreground truncate text-xs">{voice.label}</p>
                      </div>
                    </div>
                    <VoiceSampleButton voice={voice} />
                  </Label>
                );
              })}
            </RadioGroup>
          )}
        />
        {errors.voice && <p className="text-destructive text-sm">{errors.voice.message}</p>}
      </div>
    </div>
  );
};
