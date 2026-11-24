"use client";

import { useState } from "react";
import { toast } from "sonner";

import { getCallTypeDefinition } from "@/lib/call-config/defaults";
import type { CallTypeId } from "@/lib/call-config/schema";
import {
  buildCallConfigValue,
  hasUnsavedCallConfigChanges,
  type CallConfigValue,
} from "@/lib/call-config/value";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { CallFieldsEditor } from "./call-fields-editor";
import { CallTypeSelect } from "./call-type-select";
import { ResetCallTypeDialog } from "./reset-call-type-dialog";

interface CallConfigSectionProps {
  value: CallConfigValue;
  onChange: (value: CallConfigValue) => void;
}

export const CallConfigSection = ({ value, onChange }: CallConfigSectionProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingType, setPendingType] = useState<CallTypeId | null>(null);
  const { callType, callFields } = value;

  const applyType = (nextType: CallTypeId | null): void => {
    if (nextType === null) {
      onChange({ ...value, callType: null });
    } else {
      onChange(buildCallConfigValue(nextType));
    }
  };

  const handleSelect = (nextType: CallTypeId | null): void => {
    if (nextType === callType) return;

    if (nextType !== null && hasUnsavedCallConfigChanges(value)) {
      setPendingType(nextType);
      setConfirmOpen(true);
      return;
    }

    applyType(nextType);
  };

  const handleConfirm = (): void => {
    applyType(pendingType);
    setPendingType(null);
    setConfirmOpen(false);
  };

  const handleCancel = (): void => {
    setPendingType(null);
    setConfirmOpen(false);
  };

  const handleReset = (): void => {
    if (!callType) return;
    onChange(buildCallConfigValue(callType));
    toast.success("Повернуто стандартні інструкції та поля");
  };

  const pendingTitle = pendingType ? getCallTypeDefinition(pendingType).title : "";

  return (
    <section className="space-y-4" aria-labelledby="call-config-title">
      <div>
        <h3 id="call-config-title" className="text-base font-semibold">
          Дані, які агент збирає після дзвінка
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Оберіть тип дзвінка, щоб завантажити поля збору. «Інше» — зберігає ваші інструкції та поля
          без шаблону.
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

      <Dialog open={confirmOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Замінити інструкцію шаблоном?</DialogTitle>
            <DialogDescription>
              Поточна інструкція та поля будуть замінені стандартними для типу «{pendingTitle}».
              Ваші зміни буде втрачено.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Скасувати
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Замінити
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
