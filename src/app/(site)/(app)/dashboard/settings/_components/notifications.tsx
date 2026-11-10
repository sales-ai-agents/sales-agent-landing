"use client";

import { Controller, useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button, Input, Label, Skeleton, Switch } from "@/components/ui";
import { AUTH_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { useNotifications, useUpdateNotifications } from "@dashboard/hooks";
import type { NotificationSetting } from "@dashboard/types";
import {
  NOTIFICATION_EMAIL_MAX_LENGTH,
  NOTIFICATION_TELEGRAM_MAX_LENGTH,
  VISIBLE_NOTIFICATION_KINDS,
  buildNotificationChanges,
  buildNotificationFormValues,
  notificationFormSchema,
  type NotificationFormData,
  type VisibleNotificationKind,
} from "../_lib/notification-form";

interface NotificationKindCopy {
  title: string;
  description: string;
}

const KIND_COPY: Record<VisibleNotificationKind, NotificationKindCopy> = {
  call_result: {
    title: "Результати дзвінків",
    description:
      "Новий запис, просить передзвонити, заявка, оплата, зірваний запис. Відмови й недозвони лише в кабінеті.",
  },
  limit_exhausted: {
    title: "Хвилини закінчуються",
    description: "Лист, коли витрачено 80 % хвилин, і ще один, коли вони скінчились.",
  },
};

const EMAIL_FIELD_ID = "notification-email";
const TELEGRAM_FIELD_ID = "notification-telegram";

interface KindRowProps {
  kind: VisibleNotificationKind;
  control: Control<NotificationFormData>;
}

const KindRow = ({ kind, control }: KindRowProps) => {
  const { title, description } = KIND_COPY[kind];

  return (
    <div className="border-border grid grid-cols-[1fr_4.5rem_4.5rem] items-center gap-4 border-b py-4 sm:grid-cols-[1fr_6rem_6rem]">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
      </div>
      <div className="flex justify-center">
        <Controller
          control={control}
          name={`${kind}.email_enabled`}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-label={`Пошта: ${title}`}
            />
          )}
        />
      </div>
      <div className="flex justify-center">
        <Controller
          control={control}
          name={`${kind}.telegram_enabled`}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-label={`Telegram: ${title}`}
            />
          )}
        />
      </div>
    </div>
  );
};

interface NotificationsFormProps {
  settings: NotificationSetting[];
}

const NotificationsForm = ({ settings }: NotificationsFormProps) => {
  const updateNotifications = useUpdateNotifications();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: buildNotificationFormValues(settings),
  });

  const onSubmit = (data: NotificationFormData): void => {
    const changes = buildNotificationChanges(settings, data);
    if (changes.length === 0) {
      reset(data);
      return;
    }

    updateNotifications.mutate(
      { notifications: changes },
      {
        onSuccess: (response) => {
          toast.success("Сповіщення збережено");
          reset(buildNotificationFormValues(response.notifications));
        },
        onError: (error) => handleMutationError(error, AUTH_ERROR_MESSAGES),
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="border-border bg-background rounded-2xl border p-5 sm:p-6"
    >
      <h2 className="text-xl font-bold">Сповіщення</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Куди писати, коли після дзвінка треба щось зробити
      </p>

      <div className="mt-5">
        <div className="text-muted-foreground border-border grid grid-cols-[1fr_4.5rem_4.5rem] gap-4 border-b pb-2 text-sm sm:grid-cols-[1fr_6rem_6rem]">
          <span>Подія</span>
          <span className="text-center">Пошта</span>
          <span className="text-center">Telegram</span>
        </div>
        {VISIBLE_NOTIFICATION_KINDS.map((kind) => (
          <KindRow key={kind} kind={kind} control={control} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={EMAIL_FIELD_ID}>Пошта</Label>
          <Input
            id={EMAIL_FIELD_ID}
            type="email"
            autoComplete="off"
            maxLength={NOTIFICATION_EMAIL_MAX_LENGTH}
            placeholder="Порожньо: на пошту акаунта"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <p role="alert" className="text-destructive text-xs">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={TELEGRAM_FIELD_ID}>Telegram chat ID</Label>
          <Input
            id={TELEGRAM_FIELD_ID}
            inputMode="numeric"
            autoComplete="off"
            maxLength={NOTIFICATION_TELEGRAM_MAX_LENGTH}
            placeholder="Наприклад, 123456789"
            aria-invalid={Boolean(errors.telegram)}
            {...register("telegram")}
          />
          {errors.telegram ? (
            <p role="alert" className="text-destructive text-xs">
              {errors.telegram.message}
            </p>
          ) : (
            <p className="text-muted-foreground text-xs">
              Лише цифри. Спершу натисніть /start у боті Calls4U.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Button type="submit" disabled={!isDirty || updateNotifications.isPending}>
          {updateNotifications.isPending ? "Збереження..." : "Зберегти"}
        </Button>
      </div>
    </form>
  );
};

export const Notifications = () => {
  const { data: settings, isLoading } = useNotifications();

  if (isLoading) return <Skeleton className="h-96 w-full rounded-2xl" />;
  if (!settings?.length) return null;

  return <NotificationsForm settings={settings} />;
};
