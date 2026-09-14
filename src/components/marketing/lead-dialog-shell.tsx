"use client";

import type { ReactNode } from "react";
import { BarChart3, Cog, FileText } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui";

interface LeadDialogShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  cta: ReactNode;
  children: ReactNode;
}

const VALUE_POINTS = [
  {
    icon: Cog,
    content: (
      <>
        Покажемо, які <span className="font-semibold">процеси автоматизуємо</span>
      </>
    ),
  },
  {
    icon: BarChart3,
    content: (
      <>
        Порахуємо <span className="font-semibold">економію часу</span> та{" "}
        <span className="font-semibold">бюджету</span>
      </>
    ),
  },
  {
    icon: FileText,
    content: (
      <>
        Запропонуємо <span className="font-semibold">простий сценарій</span>
      </>
    ),
  },
] as const;

export function LeadDialogShell({ open, onClose, title, cta, children }: LeadDialogShellProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="border-border shadow-primary/30 border bg-transparent bg-linear-to-r from-white p-6 shadow-lg backdrop-blur-3xl sm:max-w-270 sm:rounded-2xl sm:p-10 lg:p-14">
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col gap-2 md:gap-8">
              <h3 className="font-display text-foreground text-3xl font-bold">
                Отримайте <span className="text-primary">розрахунок</span>
                <br />
                ШІ-агента під <span className="text-primary">ваш бізнес</span>
              </h3>

              <ul className="space-y-4">
                {VALUE_POINTS.map(({ icon: Icon, content }, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <Icon className="text-primary size-6 shrink-0" aria-hidden="true" />
                    <p className="text-foreground text-lg">{content}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mx-auto mt-8">{cta}</div>
          </div>

          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
