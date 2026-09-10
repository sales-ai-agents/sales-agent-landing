"use client";

import Link from "next/link";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Info } from "lucide-react";

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
import {
  CALL_DIRECTION_OPTIONS,
  CONTACT_BASE_OPTIONS,
  type CreateAgentFormData,
  type CallDirection,
} from "@/lib/schemas";
import { DIRECTION_ICONS } from "../../_components/direction-icons";

interface StepCallTypeProps {
  form: UseFormReturn<CreateAgentFormData>;
}

export const StepCallType = ({ form }: StepCallTypeProps) => {
  const {
    control,
    watch,
    formState: { errors },
  } = form;

  const isOutbound = watch("callDirection") === "outbound";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">Тип дзвінка та база контактів</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Оберіть, які дзвінки буде здійснювати агент.
        </p>
      </div>

      {/* BE not ready: POST /app/agents accepts no call direction or contact base. */}
      <Controller
        control={control}
        name="callDirection"
        render={({ field }) => (
          <RadioGroup
            aria-label="Тип дзвінка"
            value={field.value}
            onValueChange={(value) => field.onChange(value as CallDirection)}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {CALL_DIRECTION_OPTIONS.map((option) => {
              const isSelected = field.value === option.value;
              const Icon = DIRECTION_ICONS[option.value];

              return (
                <Label
                  key={option.value}
                  htmlFor={`direction-${option.value}`}
                  className={cn(
                    "flex w-2xs cursor-pointer flex-col items-start gap-3 rounded-xl border p-5 transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
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
                  <p className="text-sm font-semibold">{option.title}</p>
                  <p className="text-muted-foreground w-fit text-xs">{option.description}</p>
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
            <div className="space-y-2">
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
              <div className="bg-primary/5 text-muted-foreground mt-5 flex items-center gap-2 rounded-lg p-3 text-xs">
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
  );
};
