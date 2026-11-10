"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import {
  WEBHOOK_ERROR_MESSAGES,
  WEBHOOK_URL_ERROR_CODES,
  resolveErrorMessage,
} from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { useCreateWebhook } from "@dashboard/hooks";
import type { CreateWebhookResponse } from "@dashboard/types";
import { webhookFormSchema, type WebhookFormData } from "../../_lib/webhook-schema";

interface WebhookAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (webhook: CreateWebhookResponse) => void;
}

const URL_INPUT_ID = "webhook-url";
const URL_ERROR_ID = "webhook-url-error";
const URL_HINT_ID = "webhook-url-hint";

export const WebhookAddDialog = ({ open, onOpenChange, onCreated }: WebhookAddDialogProps) => {
  const createWebhook = useCreateWebhook();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<WebhookFormData>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: { url: "" },
  });

  const handleOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  const handleCreateError = (error: Error): void => {
    if (error instanceof ApiError && WEBHOOK_URL_ERROR_CODES.has(error.code)) {
      setError("url", { message: resolveErrorMessage(error.code, WEBHOOK_ERROR_MESSAGES) });
      return;
    }

    handleMutationError(error, WEBHOOK_ERROR_MESSAGES);
  };

  const onSubmit = ({ url }: WebhookFormData): void => {
    createWebhook.mutate(
      { url },
      {
        onSuccess: (webhook) => {
          onCreated(webhook);
          createWebhook.reset();
          reset();
        },
        onError: handleCreateError,
      }
    );
  };

  const errorMessage = errors.url?.message;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Додати адресу вебхука</DialogTitle>
            <DialogDescription>
              Після кожного завершеного дзвінка ми надішлемо підсумок на цю адресу.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label htmlFor={URL_INPUT_ID}>Адреса вебхука</Label>
            <Input
              id={URL_INPUT_ID}
              type="url"
              inputMode="url"
              autoComplete="off"
              placeholder="https://your-server.com/calls4u"
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? URL_ERROR_ID : URL_HINT_ID}
              {...register("url")}
            />
            {errorMessage ? (
              <p id={URL_ERROR_ID} role="alert" className="text-destructive text-xs">
                {errorMessage}
              </p>
            ) : (
              <p id={URL_HINT_ID} className="text-muted-foreground text-xs">
                Лише https і публічна адреса: localhost та внутрішня мережа не підходять.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Скасувати
            </Button>
            <Button type="submit" disabled={createWebhook.isPending}>
              {createWebhook.isPending ? "Перевіряємо адресу..." : "Підключити"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
