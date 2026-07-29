"use client";

import React, { useState } from "react";
import { Cog, BarChart3, FileText } from "lucide-react";
import Image from "next/image";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLeadForm } from "@/hooks/use-lead-form";

const TELEGRAM_LINK = "https://t.me/calls4u_ai";

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

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    submitLead({
      name: name.trim(),
      phone: phone.trim(),
      niche: niche.trim() || undefined,
      contact: contact.trim() || undefined,
      source_page: sourcePage,
    });
  }

  function handleChange(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <DialogContent className="border-border max-w-270 rounded-[20px] border-[1.5px] bg-[linear-gradient(136deg,rgba(255,255,255,0.42)_1.6%,rgba(217,217,217,0.42)_119%)] p-8 backdrop-blur-[34px] sm:p-10 lg:p-14">
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
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            {/* Left — value proposition */}
            <div className="flex flex-col gap-8">
              <h3 className="font-display text-foreground text-[26px] leading-[1.2] font-bold tracking-[0.3px] sm:text-[30px]">
                Отримайте <span className="text-primary">розрахунок</span>
                <br />
                ШІ-агента під <span className="text-primary">ваш бізнес</span>
              </h3>

              <ul className="space-y-6">
                <li className="flex items-center gap-4">
                  <Cog className="text-foreground size-6 shrink-0" aria-hidden="true" />
                  <p className="text-foreground text-lg tracking-[0.36px]">
                    Покажемо, які <span className="font-semibold">процеси автоматизуємо</span>
                  </p>
                </li>
                <li className="flex items-center gap-4">
                  <BarChart3 className="text-foreground size-6 shrink-0" aria-hidden="true" />
                  <p className="text-foreground text-lg tracking-[0.36px]">
                    Порахуємо <span className="font-semibold">економію часу</span> та{" "}
                    <span className="font-semibold">бюджету</span>
                  </p>
                </li>
                <li className="flex items-center gap-4">
                  <FileText className="text-foreground size-6 shrink-0" aria-hidden="true" />
                  <p className="text-foreground text-lg tracking-[0.36px]">
                    Запропонуємо <span className="font-semibold">простий сценарій</span>
                  </p>
                </li>
              </ul>

              <div className="mt-auto pt-4">
                <p className="mb-3 text-base tracking-[0.32px] text-[#727272]">
                  Не хочете чекати на відповідь?
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary text-foreground h-12 w-full max-w-75 rounded-full text-lg font-normal"
                >
                  <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer">
                    <Image
                      src="/image/hero-tg.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="mr-2"
                      aria-hidden="true"
                    />
                    Напишіть в Telegram
                  </a>
                </Button>
              </div>
            </div>

            {/* Right — form */}
            <form onSubmit={handleSubmit} className="flex flex-col">
              <p className="text-foreground mb-8 text-center text-xl font-medium tracking-[0.4px]">
                Заповніть заявку
              </p>

              <Input
                placeholder="Ім'я"
                value={name}
                onChange={handleChange(setName)}
                required
                disabled={isLoading}
                maxLength={500}
                aria-label="Ім'я"
                className="text-foreground h-auto rounded-none border-0 border-b border-border bg-transparent px-0 py-4 text-lg font-normal tracking-[0.02em] shadow-none placeholder:text-[#3e3d3d] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Input
                placeholder="Номер телефону"
                type="tel"
                value={phone}
                onChange={handleChange(setPhone)}
                required
                disabled={isLoading}
                maxLength={500}
                aria-label="Номер телефону"
                className="text-foreground h-auto rounded-none border-0 border-b border-border bg-transparent px-0 py-4 text-lg font-normal tracking-[0.02em] shadow-none placeholder:text-[#3e3d3d] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Input
                placeholder="Сфера діяльності / Ніша"
                value={niche}
                onChange={handleChange(setNiche)}
                disabled={isLoading}
                maxLength={500}
                aria-label="Сфера діяльності / Ніша"
                className="text-foreground h-auto rounded-none border-0 border-b border-border bg-transparent px-0 py-4 text-lg font-normal tracking-[0.02em] shadow-none placeholder:text-[#3e3d3d] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Input
                placeholder="Telegram / email"
                value={contact}
                onChange={handleChange(setContact)}
                disabled={isLoading}
                maxLength={500}
                aria-label="Telegram / email"
                className="text-foreground h-auto rounded-none border-0 bg-transparent px-0 py-4 text-lg font-normal tracking-[0.02em] shadow-none placeholder:text-[#3e3d3d] focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              {errorMessage && (
                <p role="alert" className="mt-3 text-center text-sm text-red-600">
                  {errorMessage}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading || !name.trim() || !phone.trim()}
                className="bg-primary hover:bg-primary/90 mt-8 h-12 w-full rounded-[25px] text-lg font-medium text-white shadow-[1px_4px_4.5px_0px_rgba(0,91,255,0.25)] disabled:opacity-50"
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
