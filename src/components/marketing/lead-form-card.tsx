"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { Cog, BarChart3, FileText, MousePointer2 } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLeadForm } from "@/hooks/use-lead-form";
import { cn, formatUaPhoneDigits } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const TELEGRAM_LINK = "https://t.me/calls4u_ai";
const UA_SUBSCRIBER_DIGITS = 9;

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  sourcePage?: string;
}

export function LeadFormModal({ open, onClose, sourcePage }: LeadFormModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [niche, setNiche] = useState("");
  const [contact, setContact] = useState("");

  const { submitLead, isLoading, isSuccess, errorMessage, reset } = useLeadForm();

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    if (!name.trim() || phone.length !== UA_SUBSCRIBER_DIGITS) return;

    trackEvent("lead_form_submit", {
      name: name.trim(),
      source: sourcePage ?? "unknown",
    });

    submitLead({
      name: name.trim(),
      phone: `+380${phone}`,
      niche: niche.trim() || undefined,
      contact: contact.trim() || undefined,
      source_page: sourcePage,
    });
  }

  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>): void {
    const raw = e.target.value.replace(/\D/g, "").slice(0, UA_SUBSCRIBER_DIGITS);
    setPhone(raw);
    if (errorMessage) reset();
  }

  function handleChange(setter: (v: string) => void) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (errorMessage) reset();
    };
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="border-border shadow-primary/30 rounded-none border bg-linear-to-br from-white p-6 shadow-lg backdrop-blur-2xl sm:max-w-270 sm:rounded-2xl sm:p-10 lg:p-14">
        <DialogTitle className="sr-only">Отримайте розрахунок ШІ-агента</DialogTitle>

        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-foreground text-xl font-medium">Дякуємо за заявку!</p>
            <p className="text-muted-foreground text-base">
              Менеджер зв&#39;яжеться з вами найближчим часом.
            </p>
            <Button
              type="button"
              onClick={onClose}
              className="bg-primary hover:bg-primary/90 mt-4 h-11 rounded-full px-8 text-base text-white"
            >
              Закрити
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-12">
            {/* Left — value proposition */}
            <div className="flex flex-col gap-2 md:gap-8">
              <h3 className="font-display text-foreground text-3xl font-bold">
                Отримайте <span className="text-primary">розрахунок</span>
                <br />
                ШІ-агента під <span className="text-primary">ваш бізнес</span>
              </h3>

              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <Cog className="text-primary size-6 shrink-0" aria-hidden="true" />
                  <p className="text-foreground text-lg">
                    Покажемо, які <span className="font-semibold">процеси автоматизуємо</span>
                  </p>
                </li>
                <li className="flex items-center gap-4">
                  <BarChart3 className="text-primary size-6 shrink-0" aria-hidden="true" />
                  <p className="text-foreground text-lg">
                    Порахуємо <span className="font-semibold">економію часу</span> та{" "}
                    <span className="font-semibold">бюджету</span>
                  </p>
                </li>
                <li className="flex items-center gap-4">
                  <FileText className="text-primary size-6 shrink-0" aria-hidden="true" />
                  <p className="text-foreground text-lg">
                    Запропонуємо <span className="font-semibold">простий сценарій</span>
                  </p>
                </li>
              </ul>

              <div className="mx-auto mt-auto pt-4">
                <p className="mb-3 text-center text-base text-gray-500">
                  Не хочете чекати на відповідь?
                </p>
                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "border-primary text-foreground h-12 w-full max-w-75 rounded-full border px-8 text-lg font-normal"
                  )}
                >
                  <MousePointer2
                    className="text-primary size-6 shrink-0 rotate-90"
                    aria-hidden="true"
                  />
                  Напишіть в Telegram
                </a>
              </div>
            </div>

            {/* Right — form */}
            <form onSubmit={handleSubmit} className="flex h-full flex-col justify-between">
              <p className="text-foreground mb-8 text-center text-xl font-medium">
                Заповніть заявку
              </p>

              <div>
                <Input
                  placeholder="Ім'я"
                  value={name}
                  onChange={handleChange(setName)}
                  required
                  disabled={isLoading}
                  maxLength={500}
                  aria-label="Ім'я"
                  className="text-foreground border-primary h-auto rounded-none border-0 border-b bg-transparent px-0 py-2 text-lg font-normal shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="border-primary flex items-center border-0 border-b">
                  <span className="text-foreground shrink-0 py-2 text-lg font-normal">
                    +380&nbsp;
                  </span>
                  <Input
                    placeholder="__ ___ __ __"
                    type="tel"
                    inputMode="numeric"
                    value={phone.length > 0 ? formatUaPhoneDigits(phone) : ""}
                    onChange={handlePhoneChange}
                    required
                    disabled={isLoading}
                    maxLength={11}
                    aria-label="Номер телефону після +380"
                    className="text-foreground h-auto rounded-none border-0 bg-transparent px-0 py-2 text-lg font-normal shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Input
                  placeholder="Сфера діяльності / Ніша"
                  value={niche}
                  onChange={handleChange(setNiche)}
                  disabled={isLoading}
                  maxLength={500}
                  aria-label="Сфера діяльності / Ніша"
                  className="text-foreground border-primary h-auto rounded-none border-0 border-b bg-transparent px-0 py-2 text-lg font-normal shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Input
                  placeholder="Telegram / email"
                  value={contact}
                  onChange={handleChange(setContact)}
                  disabled={isLoading}
                  maxLength={500}
                  aria-label="Telegram / email"
                  className="text-foreground border-primary h-auto rounded-none border-0 border-b bg-transparent px-0 py-2 text-lg font-normal shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />

                {errorMessage && (
                  <p role="alert" className="mt-3 text-center text-sm text-red-600">
                    {errorMessage}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !name.trim() || phone.length !== UA_SUBSCRIBER_DIGITS}
                className="bg-primary hover:bg-primary/90 shadow-primary/30 mt-8 h-12 w-full rounded-full text-lg font-medium text-white disabled:opacity-50"
              >
                {isLoading ? "Надсилаємо…" : "Отримати розрахунок"}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
