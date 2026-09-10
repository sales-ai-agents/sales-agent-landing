"use client";

import Link from "next/link";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Phone, ArrowRight, Info } from "lucide-react";

import {
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import type { EditAgentFormData, CallDirection } from "@/lib/schemas";
import { CONTACT_BASE_OPTIONS } from "./constants";

interface SectionCallsProps {
  form: UseFormReturn<EditAgentFormData>;
}

interface DirectionOption {
  value: CallDirection;
  title: string;
  description: string;
  icon: typeof Phone;
}

const DIRECTION_OPTIONS: DirectionOption[] = [
  {
    value: "inbound",
    title: "Вхідні дзвінки",
    description: "Агент приймає дзвінки від ваших клієнтів.",
    icon: Phone,
  },
  {
    value: "outbound",
    title: "Вихідні дзвінки",
    description: "Агент телефонує по вашій базі контактів.",
    icon: ArrowRight,
  },
];

export const SectionCalls = ({ form }: SectionCallsProps) => {
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

      {/* BE not ready: POST /app/agents accepts no call direction or contact base. */}
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
              {DIRECTION_OPTIONS.map((option) => {
                const isSelected = field.value === option.value;
                const Icon = option.icon;

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
            name="contactBase"
            render={({ field }) => (
              <div className="space-y-2 lg:w-56 lg:self-start">
                <Label htmlFor="contact-base">База контактів</Label>
                <Select
                  value={field.value || null}
                  onValueChange={(value) => field.onChange(value ?? "")}
                >
                  <SelectTrigger id="contact-base" className="w-full">
                    <SelectValue placeholder="Вибрати базу контактів" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_BASE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.contactBase && (
                  <p className="text-destructive text-sm">{errors.contactBase.message}</p>
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
