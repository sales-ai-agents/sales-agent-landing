"use client";

import { useState } from "react";
import { ChevronDown, KeyRound, Send, Trash2 } from "lucide-react";

import { Badge, Button, Switch } from "@/components/ui";
import { cn, formatDateShort, formatDateTime } from "@/lib/utils";
import type { Webhook } from "@dashboard/types";
import { useWebhookActions } from "./use-webhook-actions";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { WebhookDeliveries } from "./webhook-deliveries";
import type { RevealedSecret } from "./webhook-secret-dialog";
import { WebhookTestResult } from "./webhook-test-result";

interface WebhookRowProps {
  webhook: Webhook;
  onSecretRevealed: (revealed: RevealedSecret) => void;
}

type ConfirmAction = "reissue" | "delete";

const NEVER_DELIVERED = "ще не було";

export const WebhookRow = ({ webhook, onSecretRevealed }: WebhookRowProps) => {
  const actions = useWebhookActions(webhook, onSecretRevealed);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [isLogOpen, setIsLogOpen] = useState(false);

  const deliveriesId = `webhook-deliveries-${webhook.id}`;
  const lastDelivery = webhook.last_delivered_at
    ? formatDateTime(webhook.last_delivered_at)
    : NEVER_DELIVERED;

  const closeConfirm = (): void => setConfirmAction(null);

  return (
    <li className="border-border space-y-3 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-medium" title={webhook.url}>
            {webhook.url}
          </p>
          <p className="text-muted-foreground text-xs">
            Додано {formatDateShort(webhook.created_at)} · Остання доставка: {lastDelivery}
          </p>
          {webhook.failed > 0 && (
            <Badge variant="warning">Невдалих доставок: {webhook.failed}</Badge>
          )}
        </div>

        <label className="flex shrink-0 items-center gap-2 text-xs">
          <Switch
            size="sm"
            checked={webhook.is_active}
            disabled={actions.isToggling}
            onCheckedChange={actions.toggleActive}
          />
          {webhook.is_active ? "Увімкнено" : "Вимкнено"}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={actions.isTesting}
          onClick={actions.sendTest}
        >
          <Send aria-hidden="true" />
          {actions.isTesting ? "Надсилаємо..." : "Надіслати тест"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setConfirmAction("reissue")}
        >
          <KeyRound aria-hidden="true" />
          Перевипустити секрет
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-expanded={isLogOpen}
          aria-controls={deliveriesId}
          onClick={() => setIsLogOpen((current) => !current)}
        >
          Журнал доставок
          <ChevronDown
            className={cn("transition-transform", isLogOpen && "rotate-180")}
            aria-hidden="true"
          />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive ml-auto"
          onClick={() => setConfirmAction("delete")}
        >
          <Trash2 aria-hidden="true" />
          Видалити
        </Button>
      </div>

      {actions.testResult && <WebhookTestResult result={actions.testResult} />}

      {isLogOpen && (
        <div id={deliveriesId}>
          <WebhookDeliveries webhookId={webhook.id} />
        </div>
      )}

      <ConfirmDialog
        open={confirmAction === "reissue"}
        title="Перевипустити секрет?"
        description="Старий секрет одразу перестане діяти. Новий ми покажемо лише раз: оновіть його на вашому сервері, інакше перевірка підпису не пройде."
        confirmLabel="Перевипустити"
        isPending={actions.isReissuing}
        onConfirm={() => actions.reissue(closeConfirm)}
        onOpenChange={(open) => !open && closeConfirm()}
      />
      <ConfirmDialog
        open={confirmAction === "delete"}
        title="Видалити вебхук?"
        description="Ми припинимо надсилати дзвінки на цю адресу. Щоб відновити, додайте її знову: секрет буде новий."
        confirmLabel="Видалити"
        isDestructive
        isPending={actions.isDeleting}
        onConfirm={() => actions.remove(closeConfirm)}
        onOpenChange={(open) => !open && closeConfirm()}
      />
    </li>
  );
};
