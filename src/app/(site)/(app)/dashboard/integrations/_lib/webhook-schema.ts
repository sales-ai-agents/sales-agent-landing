import { z } from "zod";

import { WEBHOOK_ERROR_MESSAGES, resolveErrorMessage } from "@/lib/error-messages";

export const WEBHOOK_URL_MAX_LENGTH = 500;

const HTTPS_PROTOCOL = "https:";

const parseUrl = (value: string): URL | null => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

export const webhookFormSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Вкажіть адресу вебхука")
    .max(WEBHOOK_URL_MAX_LENGTH, `Максимум ${WEBHOOK_URL_MAX_LENGTH} символів`)
    .refine((value) => parseUrl(value) !== null, {
      message: resolveErrorMessage("invalid_url", WEBHOOK_ERROR_MESSAGES),
    })
    .refine((value) => parseUrl(value)?.protocol === HTTPS_PROTOCOL, {
      message: resolveErrorMessage("https_required", WEBHOOK_ERROR_MESSAGES),
    }),
});

export type WebhookFormData = z.infer<typeof webhookFormSchema>;
