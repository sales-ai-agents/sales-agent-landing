"use client";

import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
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

const DIALOGS = { lead: LeadDialog, feedback: FeedbackDialog } as const;

interface FormDialogController {
  show: () => void;
  dialog: ReactNode;
}

export function useFormDialog(kind: FormDialogKind, source: string): FormDialogController {
  const [requested, setRequested] = useState(false);
  const [open, setOpen] = useState(false);

  const show = useCallback((): void => {
    if (kind === "lead") trackEvent("lead_modal_open", { location: source });
    setRequested(true);
    setOpen(true);
  }, [kind, source]);

  const Dialog = DIALOGS[kind];
  const dialog = requested ? (
    <Dialog open={open} source={source} onClose={() => setOpen(false)} />
  ) : null;

  return { show, dialog };
}
