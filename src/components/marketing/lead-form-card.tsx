"use client";

import { useState } from "react";
import { MousePointer2 } from "lucide-react";

import { Button, buttonVariants, Dialog, DialogContent, DialogTitle } from "@/components/ui";
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
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = (): void => {
    setIsSuccess(false);
    onClose();
  };

  if (isSuccess) {
    return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose();
        }}
      >
        <DialogContent className="border-border shadow-primary/30 rounded-none border bg-linear-to-br from-white to-gray-300 p-6 shadow-lg backdrop-blur-2xl sm:max-w-270 sm:rounded-2xl sm:p-10 lg:p-14">
          <DialogTitle className="sr-only">Заявку надіслано</DialogTitle>
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-foreground text-xl font-medium">Дякуємо за заявку!</p>
            <p className="text-muted-foreground text-base">
              Менеджер зв&#39;яжеться з вами найближчим часом.
            </p>
            <Button
              type="button"
              onClick={handleClose}
              className="bg-primary hover:bg-primary/90 mt-4 h-11 rounded-full px-8 text-base text-white"
            >
              Закрити
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <LeadDialogShell
      open={open}
      onClose={handleClose}
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
      <LeadForm sourcePage={sourcePage} onSuccess={() => setIsSuccess(true)} />
    </LeadDialogShell>
  );
}
