"use client";

import { useState } from "react";
import { Plus, Webhook as WebhookIcon } from "lucide-react";

import { Button, Skeleton } from "@/components/ui";
import { cn, pluralizeUk } from "@/lib/utils";
import { useWebhooks } from "@dashboard/hooks";
import type { Webhook } from "@dashboard/types";
import { WebhookAddDialog } from "./webhook-add-dialog";
import { WebhookRow } from "./webhook-row";
import { WebhookSecretDialog, type RevealedSecret } from "./webhook-secret-dialog";

const DESCRIPTION =
  "Після кожного завершеного дзвінка ми надсилаємо його підсумок на вашу адресу. Підключіть Zapier, Make, n8n або власний сервер і передавайте дані у свою CRM.";

const resolveStatus = (webhooks: Webhook[]): string => {
  if (webhooks.length === 0) return "Не підключено";

  const count = webhooks.length;
  return `Підключено · ${count} ${pluralizeUk(count, ["адреса", "адреси", "адрес"])}`;
};

export const WebhookCard = () => {
  const { data: webhooks = [], isLoading, error, refetch } = useWebhooks();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [revealed, setRevealed] = useState<RevealedSecret | null>(null);

  const isConnected = webhooks.length > 0;

  return (
    <section
      aria-labelledby="webhook-card-title"
      className="border-border bg-background rounded-xl border p-5"
    >
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 text-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-full">
          <WebhookIcon className="h-7 w-7" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 id="webhook-card-title" className="text-sm font-medium">
            Свій сервер (вебхук)
          </h2>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isConnected ? "bg-success" : "bg-muted-foreground"
              )}
            />
            <span className="text-muted-foreground text-xs">{resolveStatus(webhooks)}</span>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">{DESCRIPTION}</p>
        </div>

        <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(true)}>
          <Plus aria-hidden="true" />
          Додати адресу
        </Button>
      </div>

      {isLoading && <Skeleton className="mt-4 h-24 w-full rounded-lg" />}

      {error && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-destructive text-sm">Не вдалося завантажити вебхуки</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Спробувати ще раз
          </Button>
        </div>
      )}

      {isConnected && (
        <ul className="mt-4 space-y-3" aria-label="Адреси вебхуків">
          {webhooks.map((webhook) => (
            <WebhookRow key={webhook.id} webhook={webhook} onSecretRevealed={setRevealed} />
          ))}
        </ul>
      )}

      <WebhookAddDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onCreated={({ url, secret }) => {
          setIsAddOpen(false);
          setRevealed({ url, secret, isReissued: false });
        }}
      />
      <WebhookSecretDialog revealed={revealed} onClose={() => setRevealed(null)} />
    </section>
  );
};
