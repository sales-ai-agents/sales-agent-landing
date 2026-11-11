"use client";

import { RefreshCw } from "lucide-react";

import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { useAccountTimeZone } from "@/lib/hooks";
import { cn, formatDateTime } from "@/lib/utils";
import { useWebhookDeliveries } from "@dashboard/hooks";
import { DELIVERY_STATUS_CONFIG } from "../../_lib/webhook-labels";

interface WebhookDeliveriesProps {
  webhookId: number;
}

const DELIVERIES_LIMIT = 20;
const EMPTY_VALUE = "—";

export const WebhookDeliveries = ({ webhookId }: WebhookDeliveriesProps) => {
  const timeZone = useAccountTimeZone();
  const {
    data: deliveries = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useWebhookDeliveries({ webhookId, limit: DELIVERIES_LIMIT });

  if (isLoading) {
    return <p className="text-muted-foreground py-4 text-sm">Завантажуємо журнал...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-wrap items-center gap-3 py-2">
        <p className="text-destructive text-sm">Не вдалося завантажити журнал доставок</p>
        <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
          Спробувати ще раз
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">Останні {DELIVERIES_LIMIT} доставок</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isFetching}
          onClick={() => refetch()}
        >
          <RefreshCw className={cn(isFetching && "animate-spin")} aria-hidden="true" />
          Оновити
        </Button>
      </div>

      {deliveries.length === 0 ? (
        <p className="text-muted-foreground border-border rounded-lg border border-dashed p-4 text-center text-sm">
          Доставок поки немає. Вони з&apos;являться після першого завершеного дзвінка.
        </p>
      ) : (
        <div className="border-border overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="px-3">Час</TableHead>
                <TableHead className="px-3">Подія</TableHead>
                <TableHead className="px-3">Статус</TableHead>
                <TableHead className="px-3">Спроби</TableHead>
                <TableHead className="px-3">Відповідь</TableHead>
                <TableHead className="px-3">Помилка</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => {
                const status = DELIVERY_STATUS_CONFIG[delivery.status];

                return (
                  <TableRow key={delivery.id}>
                    <TableCell className="px-3 py-2 text-xs whitespace-nowrap">
                      {formatDateTime(delivery.created_at, timeZone)}
                    </TableCell>
                    <TableCell className="px-3 py-2 font-mono text-xs">{delivery.event}</TableCell>
                    <TableCell className="px-3 py-2">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="px-3 py-2 text-xs">{delivery.attempts}</TableCell>
                    <TableCell className="px-3 py-2 text-xs">
                      {delivery.response_code ?? EMPTY_VALUE}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-48 truncate px-3 py-2 text-xs">
                      <span title={delivery.error ?? undefined}>
                        {delivery.error ?? EMPTY_VALUE}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
