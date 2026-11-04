import { z } from "zod";
import type { ValidationCopy } from "@/components/landing/copy/client-types";
import { formatMessage } from "@/lib/i18n/format";
import {
  FEEDBACK_MESSAGE_MAX_LENGTH,
  LEAD_FIELD_MAX_LENGTH,
  UA_SUBSCRIBER_DIGITS,
} from "@/lib/schemas";

const FEEDBACK_MESSAGE_MIN_LENGTH = 10;

export const buildLeadSchema = (messages: ValidationCopy) => {
  const tooLong = formatMessage(messages.maxLength, { max: LEAD_FIELD_MAX_LENGTH });

  return z.object({
    name: z.string().trim().min(1, messages.nameRequired).max(LEAD_FIELD_MAX_LENGTH, tooLong),
    phone: z
      .string()
      .length(UA_SUBSCRIBER_DIGITS, messages.phoneInvalid)
      .regex(/^\d+$/, messages.phoneInvalid),
    niche: z.string().trim().max(LEAD_FIELD_MAX_LENGTH).optional(),
    contact: z.string().trim().max(LEAD_FIELD_MAX_LENGTH).optional(),
  });
};

export const buildFeedbackSchema = (messages: ValidationCopy) =>
  z.object({
    message: z
      .string()
      .trim()
      .min(FEEDBACK_MESSAGE_MIN_LENGTH, messages.messageTooShort)
      .max(
        FEEDBACK_MESSAGE_MAX_LENGTH,
        formatMessage(messages.maxLength, { max: FEEDBACK_MESSAGE_MAX_LENGTH })
      ),
    email: z.email(messages.emailInvalid),
    marketingConsent: z.boolean().refine((value) => value, messages.consentRequired),
  });
