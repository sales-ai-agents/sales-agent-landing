"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui";
import { LeadDialogShell } from "@/components/marketing/lead-dialog-shell";
import { FeedbackForm } from "@/components/marketing/feedback-form";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const SIGN_UP_LINK = "/sign-up";

interface FeedbackFormModalProps {
  open: boolean;
  onClose: () => void;
  sourcePage?: string;
}

export function FeedbackFormModal({ open, onClose, sourcePage }: FeedbackFormModalProps) {
  return (
    <LeadDialogShell
      open={open}
      onClose={onClose}
      title="Залиште зворотній зв'язок"
      cta={
        <>
          <p className="mb-3 text-center text-base text-gray-500">Готові почати вже зараз?</p>
          <Link
            href={SIGN_UP_LINK}
            onClick={() => trackEvent("signup_click", { location: "feedback_modal" })}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "border-primary text-foreground h-12 w-full max-w-75 rounded-full border px-8 text-lg font-normal"
            )}
          >
            Створити агента
          </Link>
        </>
      }
    >
      <FeedbackForm sourcePage={sourcePage} onSubmitted={onClose} />
    </LeadDialogShell>
  );
}
