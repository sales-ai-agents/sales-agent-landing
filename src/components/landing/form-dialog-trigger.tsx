"use client";

import type { ReactNode } from "react";
import { useFormDialog, type FormDialogKind } from "@/components/landing/form-dialog-provider";

interface FormDialogTriggerProps {
  kind: FormDialogKind;
  source: string;
  className?: string;
  children: ReactNode;
}

export function FormDialogTrigger({ kind, source, className, children }: FormDialogTriggerProps) {
  const show = useFormDialog(kind, source);

  return (
    <button type="button" className={className} onClick={show}>
      {children}
    </button>
  );
}
