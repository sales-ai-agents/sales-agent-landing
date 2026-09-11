"use client";

import Link from "next/link";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Info } from "lucide-react";

import { Label, RadioGroup, RadioGroupItem } from "@/components/ui";
import { cn } from "@/lib/utils";
import { CALL_DIRECTION_OPTIONS, type EditAgentFormData, type CallDirection } from "@/lib/schemas";
import type { ContactBase } from "@dashboard/types";
import { DIRECTION_ICONS } from "../../../_components/direction-icons";
import { ContactBaseSelect } from "../../../_components/contact-base-select";

interface SectionCallsProps {
  form: UseFormReturn<EditAgentFormData>;
  contactBases: ContactBase[];
}

export const SectionCalls = ({ form, contactBases }: SectionCallsProps) => {
  const {
    control,
    watch,
    formState: { errors },
  } = form;

  const isOutbound = watch("callDirection") === "outbound";

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-medium">Дзвінки</h2>
        <p className="mt-3 text-sm">Тип дзвінків</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <Controller
          control={control}
          name="callDirection"
          render={({ field }) => (
            <RadioGroup
              aria-label="Тип дзвінків"
              value={field.value}
              onValueChange={(value) => field.onChange(value as CallDirection)}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {CALL_DIRECTION_OPTIONS.map((option) => {
                const isSelected = field.value === option.value;
                const Icon = DIRECTION_ICONS[option.value];

                return (
                  <Label
                    key={option.value}
                    htmlFor={`direction-${option.value}`}
                    className={cn(
                      "flex cursor-pointer flex-col items-start gap-3 rounded-xl border p-5 transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <Icon className="h-6 w-6" />
                      <RadioGroupItem
                        id={`direction-${option.value}`}
                        value={option.value}
                        className="h-5 w-5"
                      />
                    </div>
                    <p className="text-base font-medium">{option.title}</p>
                    <p className="text-muted-foreground text-xs">{option.description}</p>
                  </Label>
                );
              })}
            </RadioGroup>
          )}
        />

        {isOutbound && (
          <Controller
            control={control}
            name="contactBaseId"
            render={({ field }) => (
              <div className="space-y-2 lg:w-56 lg:self-start">
                <Label htmlFor="contact-base">База контактів</Label>
                <ContactBaseSelect
                  id="contact-base"
                  value={field.value}
                  bases={contactBases}
                  onChange={field.onChange}
                />
                {errors.contactBaseId && (
                  <p className="text-destructive text-sm">{errors.contactBaseId.message}</p>
                )}
                <div className="bg-primary/5 text-muted-foreground flex items-center gap-2 rounded-lg p-3 text-xs">
                  <Info className="text-primary h-4 w-4 shrink-0" />
                  <span>
                    Бази контактів можна додати в розділі{" "}
                    <Link href="/dashboard/integrations" className="text-primary font-medium">
                      Інтеграції
                    </Link>
                  </span>
                </div>
              </div>
            )}
          />
        )}
      </div>
    </section>
  );
};
