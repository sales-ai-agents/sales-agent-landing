"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Webhook } from "lucide-react";

import {
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";
import {
  useWebhooks,
  useCreateWebhook,
  useDeleteWebhook,
  useTestWebhook,
  useWebhookDeliveries,
} from "@dashboard/hooks";
import { handleMutationError } from "@/lib/mutation-error";
import type { WebhookDelivery } from "@dashboard/types";

const statusDot = (status: WebhookDelivery["status"]) => {
  if (status === "delivered") return "bg-green-500";
  if (status === "failed") return "bg-red-500";
  return "bg-gray-400";
};

const statusLabel = (status: WebhookDelivery["status"]) => {
  if (status === "delivered") return "Успіх";
  if (status === "failed") return "Помилка";
  if (status === "pending") return "В черзі";
  return "Скасовано";
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
};

export const WebhookCard = () => {
  const { data: webhooks = [] } = useWebhooks();
  const { data: deliveries = [] } = useWebhookDeliveries(webhooks[0]?.id, 3);

  const createWebhook = useCreateWebhook();
  const deleteWebhook = useDeleteWebhook();
  const testWebhook = useTestWebhook();

  const [showAdd, setShowAdd] = useState(false);
  const [url, setUrl] = useState("");

  const webhook = webhooks[0] ?? null;

  const handleCreate = () => {
    if (!url.trim()) return;
    createWebhook.mutate(
      { url: url.trim() },
      {
        onSuccess: () => {
          toast.success("Webhook підключено");
          setShowAdd(false);
          setUrl("");
        },
        onError: (err) => handleMutationError(err),
      }
    );
  };

  const handleTest = () => {
    if (!webhook) return;
    testWebhook.mutate(webhook.id, {
      onSuccess: (res) => {
        if (res.ok) toast.success(`Тест успішний (${res.response_code})`);
        else toast.error(res.error ?? "Помилка тесту");
      },
      onError: (err) => handleMutationError(err),
    });
  };

  const handleDisconnect = () => {
    if (!webhook) return;
    deleteWebhook.mutate(webhook.id, {
      onSuccess: () => toast.success("Webhook відключено"),
      onError: (err) => handleMutationError(err),
    });
  };

  return (
    <>
      <div className="border-border bg-background rounded-xl border p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-100">
            <Webhook className="h-8 w-8" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium">Webhook URL</p>
                {webhook ? (
                  <>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span className="text-muted-foreground text-xs">Підключено</span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs">URL</p>
                    <p className="text-primary mt-0.5 truncate text-xs">{webhook.url}</p>
                  </>
                ) : (
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    <span className="text-muted-foreground text-xs">Не підключено</span>
                  </div>
                )}
              </div>

              {webhook ? (
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTest}
                    disabled={testWebhook.isPending}
                  >
                    Тест
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={handleDisconnect}
                  >
                    Відключити
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowAdd(true)}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Додати
                </Button>
              )}
            </div>
          </div>
        </div>

        {webhook && deliveries.length > 0 && (
          <>
            <div className="border-border mt-4 border-t" />
            <div className="mt-3 space-y-1">
              {deliveries.map((d) => (
                <div key={d.id} className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span className={`h-2 w-2 rounded-full ${statusDot(d.status)}`} />
                  <span>{formatDate(d.created_at)}</span>
                  <span>{statusLabel(d.status)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Додати Webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="webhook-url">URL</Label>
            <Input
              id="webhook-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-server.com/webhook"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Скасувати
            </Button>
            <Button onClick={handleCreate} disabled={createWebhook.isPending || !url.trim()}>
              {createWebhook.isPending ? "Збереження..." : "Підключити"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
