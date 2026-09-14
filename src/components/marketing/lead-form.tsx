"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

import { Button, Input } from "@/components/ui";
import { useLeadForm } from "@marketing/hooks";
import { formatUaPhoneDigits } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const UA_SUBSCRIBER_DIGITS = 9;

const FIELD_CLASSES =
  "text-foreground border-primary h-auto rounded-none border-0 border-b bg-transparent px-0 py-2 text-lg font-normal shadow-none focus-visible:ring-0 focus-visible:ring-offset-0";

interface LeadFormProps {
  sourcePage?: string;
  onSuccess: () => void;
}

export function LeadForm({ sourcePage, onSuccess }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [niche, setNiche] = useState("");
  const [contact, setContact] = useState("");

  const { submitLead, isLoading, errorMessage, reset } = useLeadForm();

  const isValid = name.trim().length > 0 && phone.length === UA_SUBSCRIBER_DIGITS;

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    if (!isValid) return;

    trackEvent("lead_form_submit", sourcePage ? { location: sourcePage } : undefined);
    submitLead(
      {
        name: name.trim(),
        phone: `+380${phone}`,
        niche: niche.trim() || undefined,
        contact: contact.trim() || undefined,
        source_page: sourcePage,
      },
      { onSuccess }
    );
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPhone(event.target.value.replace(/\D/g, "").slice(0, UA_SUBSCRIBER_DIGITS));
    if (errorMessage) reset();
  };

  const handleChange =
    (setter: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
      if (errorMessage) reset();
    };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col justify-between">
      <p className="text-foreground mb-8 text-center text-xl font-medium">Заповніть заявку</p>

      <div>
        <Input
          placeholder="Ім'я"
          value={name}
          onChange={handleChange(setName)}
          required
          disabled={isLoading}
          maxLength={500}
          aria-label="Ім'я"
          className={FIELD_CLASSES}
        />
        <div className="border-primary flex items-center border-0 border-b">
          <span className="text-foreground shrink-0 py-2 text-lg font-normal">+380&nbsp;</span>
          <Input
            placeholder="__ ___ __ __"
            type="tel"
            inputMode="numeric"
            value={phone.length > 0 ? formatUaPhoneDigits(phone) : ""}
            onChange={handlePhoneChange}
            required
            disabled={isLoading}
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
          className={FIELD_CLASSES}
        />
        <Input
          placeholder="Telegram / email"
          value={contact}
          onChange={handleChange(setContact)}
          disabled={isLoading}
          maxLength={500}
          aria-label="Telegram / email"
          className={FIELD_CLASSES}
        />

        {errorMessage && (
          <p role="alert" className="mt-3 text-center text-sm text-red-600">
            {errorMessage}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading || !isValid}
        className="bg-primary hover:bg-primary/90 shadow-primary/30 mt-8 h-12 w-full rounded-full text-lg font-medium text-white disabled:opacity-50"
      >
        {isLoading ? "Надсилаємо…" : "Отримати розрахунок"}
      </Button>
    </form>
  );
}
