"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { Phone } from "lucide-react";

import { Button } from "@/components/ui";
import type { CreateAgentFormData } from "@/lib/schemas";
import { PhoneField } from "@/app/(site)/(app)/dashboard/agents/_components/connect-number/phone-field";
import { InstructionFields } from "../../_components/instruction-fields";
import { CallConfigSection } from "../../_components/call-config/call-config-section";
import { useCallConfigForm } from "../../_components/call-config/use-call-config-form";

interface StepInstructionsProps {
  form: UseFormReturn<CreateAgentFormData>;
  isTesting: boolean;
  onTestCall: () => void;
}

export const StepInstructions = ({ form, isTesting, onTestCall }: StepInstructionsProps) => {
  const {
    setValue,
    watch,
    formState: { errors },
    control,
  } = form;

  const instructions = watch("instructions");
  const reportFields = watch("reportFields");
  const testPhone = watch("testPhone");

  const callConfig = useCallConfigForm(form);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">Інструкція для агента та тест</h2>
        <p className="text-muted-foreground mt-1 w-sm text-sm">
          Опишіть, як агент має спілкуватися, і перевірте, як він звучить в реальному дзвінку
        </p>
      </div>

      <InstructionFields
        showTemplates
        values={{ instructions, reportFields }}
        instructionsError={errors.instructions?.message}
        onChange={(next) => {
          setValue("instructions", next.instructions, { shouldValidate: true, shouldDirty: true });
          setValue("reportFields", next.reportFields, { shouldValidate: true, shouldDirty: true });
        }}
      />

      <CallConfigSection {...callConfig} />

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
