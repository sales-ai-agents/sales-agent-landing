"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { DEFAULT_CALL_TYPE_ID, getCallTypeDefinition } from "@/lib/call-config/defaults";
import type { CallTypeId } from "@/lib/call-config/schema";
import {
  buildCallConfigValue,
  hasUnsavedCallConfigChanges,
  isCallConfigBlank,
  type CallConfigValue,
} from "@/lib/call-config/value";
import { CallFieldsEditor } from "./call-fields-editor";
import { CallTypeSelect } from "./call-type-select";
import { ResetCallTypeDialog } from "./reset-call-type-dialog";

interface CallConfigSectionProps {
  value: CallConfigValue;
  onChange: (value: CallConfigValue) => void;
}

export const CallConfigSection = ({ value, onChange }: CallConfigSectionProps) => {
  const hasInitialized = useRef(false);
  const { callType, callFields } = value;

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (isCallConfigBlank(value)) onChange(buildCallConfigValue(DEFAULT_CALL_TYPE_ID));
  }, [value, onChange]);

  const handleSelect = (nextType: CallTypeId): void => {
    if (nextType === callType) return;

    const previous = value;
    onChange(buildCallConfigValue(nextType));

    if (!hasUnsavedCallConfigChanges(previous)) return;

    toast("Тип дзвінка змінено: інструкції та поля замінено", {
      action: { label: "Скасувати", onClick: () => onChange(previous) },
    });
  };

  const handleReset = (): void => {
    if (!callType) return;

    onChange(buildCallConfigValue(callType));
    toast.success("Повернуто стандартні інструкції та поля");
  };

  return (
    <section className="space-y-4" aria-labelledby="call-config-title">
      <div>
        <h3 id="call-config-title" className="text-base font-semibold">
          Дані, які агент збирає після дзвінка
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Оберіть тип дзвінка, щоб завантажити інструкції та поля. Поля зберігаються разом з
          агентом.
        </p>
      </div>

      <CallTypeSelect value={callType} onChange={handleSelect} />

      <CallFieldsEditor
        fields={callFields}
        onChange={(fields) => onChange({ ...value, callFields: fields })}
      />

      {callType && (
        <div className="flex justify-end">
          <ResetCallTypeDialog
            callTypeTitle={getCallTypeDefinition(callType).title}
            onConfirm={handleReset}
          />
        </div>
      )}
    </section>
  );
};
