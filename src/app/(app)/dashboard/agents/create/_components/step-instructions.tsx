"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { Phone } from "lucide-react";

import { Button, Label, Textarea } from "@/components/ui";
import { INSTRUCTIONS_MAX_LENGTH, type CreateAgentFormData } from "@/lib/schemas";
import { PhoneField } from "@/app/(app)/dashboard/agents/_components/connect-number/phone-field";

interface StepInstructionsProps {
  form: UseFormReturn<CreateAgentFormData>;
  isTesting: boolean;
  onTestCall: () => void;
}

const INSTRUCTION_HINTS = [
  "Опишіть мету дзвінка",
  "Додайте можливі заперечення та відповіді",
  "Вкажіть, як завершувати розмову",
];

export const StepInstructions = ({ form, isTesting, onTestCall }: StepInstructionsProps) => {
  const {
    register,
    watch,
    formState: { errors },
    control,
  } = form;

  const instructions = watch("instructions");
  const testPhone = watch("testPhone");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">Інструкція для агента та тест</h2>
        <p className="text-muted-foreground mt-1 w-sm text-sm">
          Опишіть, як агент має спілкуватися, і перевірте, як він звучить в реальному дзвінку
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Інструкції</Label>
        <Textarea
          id="instructions"
          rows={6}
          maxLength={INSTRUCTIONS_MAX_LENGTH}
          placeholder="Ти - помічник, який нагадує клієнтам про заплановані зустрічі. Пояснюй коротко, дружньо та ввічливо. Якщо клієнт підтверджує - подякуй. Якщо хоче перенести - запропонуй новий час. Будь максимально лаконічним."
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

      <div className="bg-primary/5 rounded-lg p-4">
        <p className="text-sm font-medium">Корисні підказки</p>
        <ul className="text-muted-foreground mt-1 list-inside list-disc space-y-0.5 text-xs">
          {INSTRUCTION_HINTS.map((hint) => (
            <li className="pl-4" key={hint}>
              {hint}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-border space-y-3 rounded-lg border p-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
            <Phone className="text-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Тестовий дзвінок</p>
            <p className="text-muted-foreground w-xs text-xs">
              Перевірте, як агент звучить і відповідає. <br />
              Дзвінок на ваш номер надійде протягом 30 секунд.
            </p>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <Controller
            control={control}
            name="testPhone"
            render={({ field }) => (
              <PhoneField
                classname="w-full"
                id="sip-verify-phone"
                label="Номер телефону"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Button type="button" onClick={onTestCall} disabled={isTesting || !testPhone}>
            {isTesting ? "Дзвінок..." : "Подзвонити мені"}
          </Button>
        </div>
      </div>
    </div>
  );
};
