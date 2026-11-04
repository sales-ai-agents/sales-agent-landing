"use client";

import type { ReactNode } from "react";
import { useFormDialog, type FormDialogKind } from "@/components/landing/use-form-dialog";

interface FormDialogTriggerProps {
  kind: FormDialogKind;
  source: string;
  className?: string;
  children: ReactNode;
}

export function FormDialogTrigger({ kind, source, className, children }: FormDialogTriggerProps) {
  const { show, dialog } = useFormDialog(kind, source);

  return (
    <>
      <button type="button" className={className} onClick={show}>
        {children}
      </button>
      {dialog}
    </>
  );
}
