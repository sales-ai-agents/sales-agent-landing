"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import dynamic from "next/dynamic";
import type { FormDialogProps } from "@/components/landing/dialog-types";
import { trackEvent } from "@/lib/analytics";

const LeadDialog = dynamic(
  () => import("@/components/landing/lead-dialog").then((module) => module.LeadDialog),
  { ssr: false }
);
const FeedbackDialog = dynamic(
  () => import("@/components/landing/feedback-dialog").then((module) => module.FeedbackDialog),
  { ssr: false }
);

export type FormDialogKind = "lead" | "feedback";

interface DialogState {
  open: boolean;
  source: string;
}

type DialogsState = Partial<Record<FormDialogKind, DialogState>>;
type ShowFormDialog = (kind: FormDialogKind, source: string) => void;

const DIALOGS: Record<FormDialogKind, ComponentType<FormDialogProps>> = {
  lead: LeadDialog,
  feedback: FeedbackDialog,
};
const DIALOG_KINDS = Object.keys(DIALOGS) as FormDialogKind[];

const FormDialogContext = createContext<ShowFormDialog | null>(null);

export function FormDialogProvider({ children }: { children: ReactNode }) {
  const [dialogs, setDialogs] = useState<DialogsState>({});

  const show = useCallback<ShowFormDialog>((kind, source) => {
    if (kind === "lead") trackEvent("lead_modal_open", { location: source });
    setDialogs((current) => ({ ...current, [kind]: { open: true, source } }));
  }, []);

  const close = useCallback((kind: FormDialogKind): void => {
    setDialogs((current) => {
      const dialog = current[kind];
      return dialog ? { ...current, [kind]: { ...dialog, open: false } } : current;
    });
  }, []);

  return (
    <FormDialogContext.Provider value={show}>
      {children}
      {DIALOG_KINDS.map((kind) => {
        const dialog = dialogs[kind];
        if (!dialog) return null;
        const Dialog = DIALOGS[kind];
        return (
          <Dialog
            key={kind}
            open={dialog.open}
            source={dialog.source}
            onClose={() => close(kind)}
          />
        );
      })}
    </FormDialogContext.Provider>
  );
}

export function useFormDialog(kind: FormDialogKind, source: string): () => void {
  const show = useContext(FormDialogContext);
  if (!show) throw new Error("useFormDialog must be used inside FormDialogProvider");

  return useCallback((): void => show(kind, source), [show, kind, source]);
}
