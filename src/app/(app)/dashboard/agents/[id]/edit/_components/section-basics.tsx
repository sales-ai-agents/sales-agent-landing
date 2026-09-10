"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { EditAgentFormData } from "@/lib/schemas";
import type { Voice } from "@dashboard/types";

interface SectionBasicsProps {
  form: UseFormReturn<EditAgentFormData>;
  voices: Voice[];
}

export const SectionBasics = ({ form, voices }: SectionBasicsProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Основні налаштування</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="agent-name">Назва агента</Label>
          <Input id="agent-name" {...register("name")} />
          {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="agent-voice">Голос</Label>
          <Controller
            control={control}
            name="voice"
            render={({ field }) => {
              const selected = voices.find((voice) => voice.key === field.value);

              return (
                <Select
                  value={field.value || null}
                  onValueChange={(value) => field.onChange(value ?? "")}
                >
                  <SelectTrigger id="agent-voice" className="w-full">
                    <SelectValue placeholder="Оберіть голос">
                      {selected ? (
                        <span>
                          {selected.name}
                          <span className="text-muted-foreground"> — {selected.label}</span>
                        </span>
                      ) : (
                        field.value
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.key} value={voice.key}>
                        {voice.name}
                        <span className="text-muted-foreground"> — {voice.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.voice && <p className="text-destructive text-sm">{errors.voice.message}</p>}
        </div>
      </div>
    </section>
  );
};
