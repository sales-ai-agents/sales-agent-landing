"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Checkbox, Input, Label, Textarea } from "@/components/ui";
import { useFeedbackForm } from "@marketing/hooks";
import { feedbackSchema, FEEDBACK_MESSAGE_MAX_LENGTH, type FeedbackFormData } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const FIELD_CLASSES =
  "text-foreground border-primary/40 focus-visible:border-primary rounded-xl border bg-white/70 px-4 text-base font-normal shadow-none transition-colors focus-visible:ring-0 focus-visible:ring-offset-0";

interface FeedbackFormProps {
  sourcePage?: string;
  onSubmitted: () => void;
}

export function FeedbackForm({ sourcePage, onSubmitted }: FeedbackFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      message: "",
      email: "",
      marketingConsent: false,
    },
  });

  const { submitFeedbackAsync, errorMessage, reset: resetMutation } = useFeedbackForm();

  const onSubmit = async (data: FeedbackFormData): Promise<void> => {
    trackEvent("feedback_form_submit", sourcePage ? { location: sourcePage } : undefined);

    try {
      await submitFeedbackAsync({ ...data, source_page: sourcePage });
      reset();
      onSubmitted();
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
      <p className="text-foreground mb-8 text-center text-xl font-medium">
        Залиште зворотній зв&#39;язок та отримайте знижку
      </p>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <Textarea
            id="feedback-message"
            placeholder="Зворотній зв'язок"
            rows={4}
            maxLength={FEEDBACK_MESSAGE_MAX_LENGTH}
            aria-label="Зворотній зв'язок"
            aria-invalid={errors.message ? true : undefined}
            disabled={isSubmitting}
            className={cn(FIELD_CLASSES, "h-30 resize-none py-3")}
            {...register("message")}
          />
          {errors.message && (
            <p role="alert" className="text-sm text-red-600">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Input
            id="feedback-email"
            type="email"
            placeholder="Email"
            aria-label="Email"
            aria-invalid={errors.email ? true : undefined}
            disabled={isSubmitting}
            className={cn(FIELD_CLASSES, "h-12")}
            {...register("email")}
          />
          {errors.email && (
            <p role="alert" className="text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="feedback-consent"
            className="group/field-label text-muted-foreground flex items-start gap-3 text-sm leading-relaxed font-normal"
          >
            <Controller
              control={control}
              name="marketingConsent"
              render={({ field }) => (
                <Checkbox
                  id="feedback-consent"
                  className="border-primary/60 mt-0.5 size-5 border-2 bg-white"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  aria-invalid={errors.marketingConsent ? true : undefined}
                  disabled={isSubmitting}
                />
              )}
            />
            <span>
              Я погоджуюсь отримувати інформаційні та рекламні повідомлення від calls4u.ai
            </span>
          </Label>
          {errors.marketingConsent && (
            <p role="alert" className="text-sm text-red-600">
              {errors.marketingConsent.message}
            </p>
          )}
        </div>
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
        {isSubmitting ? "Надсилаємо…" : "Надіслати"}
      </Button>
    </form>
  );
}
