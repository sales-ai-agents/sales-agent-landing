"use client";

import type { UseFormReturn } from "react-hook-form";

import type { EditAgentFormData } from "@/lib/schemas";
import { InstructionFields } from "../../../_components/instruction-fields";
import { CallConfigSection } from "../../../_components/call-config/call-config-section";
import { useCallConfigForm } from "../../../_components/call-config/use-call-config-form";

interface SectionInstructionsProps {
  form: UseFormReturn<EditAgentFormData>;
}

export const SectionInstructions = ({ form }: SectionInstructionsProps) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const instructions = watch("instructions");
  const reportFields = watch("reportFields");
  const callConfig = useCallConfigForm(form);

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Інструкція для агента</h2>
      <InstructionFields
        showTemplates={false}
        values={{ instructions, reportFields }}
        instructionsError={errors.instructions?.message}
        onChange={(next) => {
          setValue("instructions", next.instructions, { shouldValidate: true, shouldDirty: true });
          setValue("reportFields", next.reportFields, { shouldValidate: true, shouldDirty: true });
        }}
      />
      <CallConfigSection {...callConfig} />
    </section>
  );
};
