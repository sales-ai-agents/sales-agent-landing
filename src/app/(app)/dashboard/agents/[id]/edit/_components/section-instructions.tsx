"use client";

import type { UseFormReturn } from "react-hook-form";

import { Textarea } from "@/components/ui";
import { INSTRUCTIONS_MAX_LENGTH, type EditAgentFormData } from "@/lib/schemas";

interface SectionInstructionsProps {
  form: UseFormReturn<EditAgentFormData>;
}

export const SectionInstructions = ({ form }: SectionInstructionsProps) => {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const instructions = watch("instructions");

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Інструкція для агента</h2>

      <div className="space-y-2">
        <Textarea
          id="instructions"
          rows={6}
          maxLength={INSTRUCTIONS_MAX_LENGTH}
          {...register("instructions")}
        />
        <div className="flex items-center justify-between">
          {errors.instructions ? (
            <p className="text-destructive text-sm">{errors.instructions.message}</p>
          ) : (
            <span />
          )}
          <span className="text-muted-foreground text-xs">
            {instructions.length}/{INSTRUCTIONS_MAX_LENGTH}
          </span>
        </div>
      </div>
    </section>
  );
};
