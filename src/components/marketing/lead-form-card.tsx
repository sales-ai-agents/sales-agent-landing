"use client";

import { MousePointer2 } from "lucide-react";
import { toast } from "sonner";

import { buttonVariants } from "@/components/ui";
import { LeadDialogShell } from "@/components/marketing/lead-dialog-shell";
import { LeadForm } from "@/components/marketing/lead-form";
import { cn } from "@/lib/utils";

const TELEGRAM_LINK = "https://t.me/calls4u_ai";

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  sourcePage?: string;
}

export function LeadFormModal({ open, onClose, sourcePage }: LeadFormModalProps) {
  const handleSuccess = (): void => {
    onClose();
    toast.success("Дякуємо за заявку!", {
      description: "Менеджер зв'яжеться з вами найближчим часом.",
    });
  };

  return (
    <LeadDialogShell
      open={open}
      onClose={onClose}
      title="Отримайте розрахунок ШІ-агента"
      cta={
        <>
          <p className="mb-3 text-center text-base text-gray-500">Не хочете чекати на відповідь?</p>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "border-primary text-foreground h-12 w-full max-w-75 rounded-full border px-8 text-lg font-normal"
            )}
          >
            <MousePointer2 className="text-primary size-6 shrink-0 rotate-90" aria-hidden="true" />
            Напишіть в Telegram
          </a>
        </>
      }
    >
      <LeadForm sourcePage={sourcePage} onSuccess={handleSuccess} />
    </LeadDialogShell>
  );
}
