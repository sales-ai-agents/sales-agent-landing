import { z } from "zod";

import type {
  NotificationKind,
  NotificationSetting,
  UpdateNotificationItem,
} from "@dashboard/types";

export const VISIBLE_NOTIFICATION_KINDS = ["call_result", "limit_exhausted"] as const;

export type VisibleNotificationKind = (typeof VISIBLE_NOTIFICATION_KINDS)[number];

export const NOTIFICATION_EMAIL_MAX_LENGTH = 160;
export const NOTIFICATION_TELEGRAM_MAX_LENGTH = 120;

const TELEGRAM_CHAT_ID_PATTERN = /^-?\d+$/;

const channelsSchema = z.object({
  email_enabled: z.boolean(),
  telegram_enabled: z.boolean(),
});

export const notificationFormSchema = z
  .object({
    call_result: channelsSchema,
    limit_exhausted: channelsSchema,
    email: z.union([
      z.literal(""),
      z.email("Введіть коректну електронну адресу").max(NOTIFICATION_EMAIL_MAX_LENGTH),
    ]),
    telegram: z
      .string()
      .trim()
      .max(NOTIFICATION_TELEGRAM_MAX_LENGTH)
      .refine((value) => value === "" || TELEGRAM_CHAT_ID_PATTERN.test(value), {
        message: "Chat ID складається лише з цифр",
      }),
  })
  .refine(
    ({ telegram, call_result, limit_exhausted }) =>
      telegram !== "" || !(call_result.telegram_enabled || limit_exhausted.telegram_enabled),
    { path: ["telegram"], message: "Вкажіть chat ID, щоб отримувати сповіщення в Telegram" }
  );

export type NotificationFormData = z.infer<typeof notificationFormSchema>;

const findSetting = (
  settings: NotificationSetting[],
  kind: NotificationKind
): NotificationSetting | undefined => settings.find((setting) => setting.kind === kind);

const firstFilled = (settings: NotificationSetting[], field: "email" | "telegram"): string => {
  const visible = VISIBLE_NOTIFICATION_KINDS.map((kind) => findSetting(settings, kind));
  return visible.find((setting) => setting?.[field])?.[field] ?? "";
};

export const buildNotificationFormValues = (
  settings: NotificationSetting[]
): NotificationFormData => {
  const channelsOf = (kind: VisibleNotificationKind) => ({
    email_enabled: findSetting(settings, kind)?.email_enabled ?? false,
    telegram_enabled: findSetting(settings, kind)?.telegram_enabled ?? false,
  });

  return {
    call_result: channelsOf("call_result"),
    limit_exhausted: channelsOf("limit_exhausted"),
    email: firstFilled(settings, "email"),
    telegram: firstFilled(settings, "telegram"),
  };
};

const diffSetting = (
  setting: NotificationSetting | undefined,
  kind: VisibleNotificationKind,
  form: NotificationFormData
): UpdateNotificationItem | null => {
  const next = { ...form[kind], email: form.email, telegram: form.telegram.trim() };
  const changed = (Object.keys(next) as (keyof typeof next)[]).filter(
    (field) => setting?.[field] !== next[field]
  );
  if (changed.length === 0) return null;

  return changed.reduce<UpdateNotificationItem>(
    (item, field) => ({ ...item, [field]: next[field] }),
    { kind }
  );
};

export const buildNotificationChanges = (
  settings: NotificationSetting[],
  form: NotificationFormData
): UpdateNotificationItem[] =>
  VISIBLE_NOTIFICATION_KINDS.map((kind) =>
    diffSetting(findSetting(settings, kind), kind, form)
  ).filter((item): item is UpdateNotificationItem => item !== null);
