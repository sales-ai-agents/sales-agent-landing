"use client";

import { useState } from "react";

import { Label, Textarea } from "@/components/ui";
import { INSTRUCTIONS_MAX_LENGTH, REPORT_FIELDS_MAX_LENGTH } from "@/lib/schemas";
import { useAgentTemplates } from "@dashboard/hooks";
import type { AgentTemplate } from "@dashboard/types";
import type { CallTypeId } from "@/lib/call-config/schema";
import { CALL_TYPE_IDS } from "@/lib/call-config/schema";
import { TemplatePicker } from "./template-picker";

export interface InstructionValues {
  instructions: string;
  reportFields: string;
}

interface InstructionFieldsProps {
  values: InstructionValues;
  instructionsError?: string;
  showTemplates: boolean;
  onChange: (values: InstructionValues) => void;
  onCallTypeChange?: (callType: CallTypeId | null) => void;
}

const countPlaceholders = (text: string, pattern: string | undefined): number => {
  if (!pattern) return 0;
  try {
    return text.match(new RegExp(pattern, "g"))?.length ?? 0;
  } catch {
    return 0;
  }
};

export const InstructionFields = ({
  values,
  instructionsError,
  showTemplates,
  onChange,
  onCallTypeChange,
}: InstructionFieldsProps) => {
  const { data: templateData } = useAgentTemplates();
  const [templateId, setTemplateId] = useState<string | null>(null);

  const templates = templateData?.templates ?? [];
  const selectedTemplate = templates.find((template) => template.id === templateId);
  const instructionsMax = templateData?.instructions_max ?? INSTRUCTIONS_MAX_LENGTH;
  const reportFieldsMax = templateData?.report_fields_max ?? REPORT_FIELDS_MAX_LENGTH;
  const unfilled = countPlaceholders(values.instructions, templateData?.placeholder_pattern);

  const applyTemplate = (template: AgentTemplate): void => {
    setTemplateId(template.id);
    onChange({ instructions: template.instructions, reportFields: template.report_fields });
    if (onCallTypeChange) {
      const isKnownType = (CALL_TYPE_IDS as readonly string[]).includes(template.id);
      onCallTypeChange(isKnownType ? (template.id as CallTypeId) : null);
    }
  };

  return (
    <div className="space-y-5">
      {showTemplates && templates.length > 0 && (
        <div className="space-y-2">
          <Label>Почніть із шаблону</Label>
          <TemplatePicker templates={templates} selectedId={templateId} onSelect={applyTemplate} />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="instructions">Інструкції</Label>
        <Textarea
          id="instructions"
          rows={8}
          maxLength={instructionsMax}
          value={values.instructions}
          aria-invalid={Boolean(instructionsError)}
          onChange={(event) => onChange({ ...values, instructions: event.target.value })}
        />
        <div className="flex items-center justify-between gap-3">
          {instructionsError ? (
            <p className="text-destructive text-sm">{instructionsError}</p>
          ) : unfilled > 0 ? (
            <p className="text-warning text-sm" aria-live="polite">
              Заповніть поля в [дужках], залишилось {unfilled}
            </p>
          ) : (
            <span />
          )}
          <span className="text-muted-foreground shrink-0 text-xs">
            {values.instructions.length}/{instructionsMax}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="report-fields">
          {templateData?.report_fields_label ?? "Що має бути у звіті після дзвінка"}
        </Label>
        <Textarea
          id="report-fields"
          rows={2}
          maxLength={reportFieldsMax}
          value={values.reportFields}
          onChange={(event) => onChange({ ...values, reportFields: event.target.value })}
        />
        <div className="flex items-start justify-between gap-3">
          <p className="text-muted-foreground text-xs">{templateData?.report_fields_hint}</p>
          <span className="text-muted-foreground shrink-0 text-xs">
            {values.reportFields.length}/{reportFieldsMax}
          </span>
        </div>
      </div>

      {selectedTemplate && selectedTemplate.tips.length > 0 && (
        <div className="bg-primary/5 rounded-lg p-4">
          <p className="text-sm font-medium">Корисні підказки</p>
          <ul className="text-muted-foreground mt-1 list-inside list-disc space-y-0.5 text-xs">
            {selectedTemplate.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
