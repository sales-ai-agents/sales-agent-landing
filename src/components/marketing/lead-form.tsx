"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input } from "@/components/ui";
import { useLeadForm } from "@marketing/hooks";
import {
  leadSchema,
  LEAD_FIELD_MAX_LENGTH,
  UA_SUBSCRIBER_DIGITS,
  type LeadFormData,
} from "@/lib/schemas";
import { cn, formatUaPhoneDigits } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const FIELD_CLASSES =
  "text-foreground border-primary h-auto rounded-none border-0 border-b bg-transparent px-0 py-2 text-lg font-normal shadow-none focus-visible:ring-0 focus-visible:ring-offset-0";

interface LeadFormProps {
  sourcePage?: string;
  onSuccess: () => void;
}

export function LeadForm({ sourcePage, onSuccess }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      niche: "",
      contact: "",
    },
  });

  const { submitLeadAsync, errorMessage, reset: resetMutation } = useLeadForm();

  const onSubmit = async (data: LeadFormData): Promise<void> => {
    trackEvent("lead_form_submit", sourcePage ? { location: sourcePage } : undefined);

    try {
      await submitLeadAsync({
        name: data.name,
        phone: `+380${data.phone}`,
        niche: data.niche || undefined,
        contact: data.contact || undefined,
        source_page: sourcePage,
      });
      reset();
      onSuccess();
    } catch {
      return;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onChange={() => {
        if (errorMessage) resetMutation();
      }}
      className="flex h-full flex-col justify-between"
      noValidate
    >
      <p className="text-foreground mb-8 text-center text-xl font-medium">Заповніть заявку</p>

      <div className="flex flex-col gap-1.5">
        <Input
          placeholder="Ім'я"
          aria-label="Ім'я"
          aria-invalid={errors.name ? true : undefined}
          disabled={isSubmitting}
          maxLength={LEAD_FIELD_MAX_LENGTH}
          className={FIELD_CLASSES}
          {...register("name")}
        />
        {errors.name && (
          <p role="alert" className="text-sm text-red-600">
            {errors.name.message}
          </p>
        )}

        <div className="border-primary flex items-center border-0 border-b">
          <span className="text-foreground shrink-0 py-2 text-lg font-normal">+380&nbsp;</span>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <Input
                placeholder="__ ___ __ __"
                type="tel"
                inputMode="numeric"
                aria-label="Номер телефону після +380"
                aria-invalid={errors.phone ? true : undefined}
                disabled={isSubmitting}
                value={field.value ? formatUaPhoneDigits(field.value) : ""}
                onChange={(event) =>
                  field.onChange(
                    event.target.value.replace(/\D/g, "").slice(0, UA_SUBSCRIBER_DIGITS)
                  )
                }
                className="text-foreground h-auto rounded-none border-0 bg-transparent px-0 py-2 text-lg font-normal shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            )}
          />
        </div>
        {errors.phone && (
          <p role="alert" className="text-sm text-red-600">
            {errors.phone.message}
          </p>
        )}

        <Input
          placeholder="Сфера діяльності / Ніша"
          aria-label="Сфера діяльності / Ніша"
          disabled={isSubmitting}
          maxLength={LEAD_FIELD_MAX_LENGTH}
          className={cn(FIELD_CLASSES, "mt-1.5")}
          {...register("niche")}
        />
        <Input
          placeholder="Telegram / email"
          aria-label="Telegram / email"
          disabled={isSubmitting}
          maxLength={LEAD_FIELD_MAX_LENGTH}
          className={FIELD_CLASSES}
          {...register("contact")}
        />
      </div>

      {errorMessage && (
        <p role="alert" className="mt-4 text-center text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary hover:bg-primary/90 shadow-primary/30 mt-8 h-12 w-full rounded-full text-lg font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? "Надсилаємо…" : "Отримати розрахунок"}
      </Button>
    </form>
  );
}
