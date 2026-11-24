"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button, Separator, Skeleton } from "@/components/ui";
import { useConnections, useDisconnectConnection } from "@/lib/hooks";
import { SettingsSection } from "./settings-section";

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
};

export const ConnectedAssistants = () => {
  const { data, isLoading } = useConnections();
  const disconnect = useDisconnectConnection();

  const connections = data?.connections ?? [];

  const handleDisconnect = (id: string, name: string): void => {
    disconnect.mutate(id, {
      onSuccess: () => toast.success(`«${name}» відключено`),
      onError: () => toast.error("Не вдалося відключити. Спробуйте ще раз."),
    });
  };

  return (
    <SettingsSection
      title="Підключені асистенти"
      description="ШІ-асистенти, що мають доступ до вашого акаунта"
    >
      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {!isLoading && connections.length === 0 && (
        <p className="text-muted-foreground text-sm">Немає підключених асистентів.</p>
      )}

      {!isLoading &&
        connections.map((connection, index) => (
          <div key={connection.id}>
            {index > 0 && <Separator />}
            <div className="flex items-center justify-between gap-4 py-1">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">{connection.name}</p>
                <p className="text-muted-foreground text-xs">
                  Активний: {formatDate(connection.last_active_at)} · До:{" "}
                  {formatDate(connection.expires_at)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => handleDisconnect(connection.id, connection.name)}
                disabled={disconnect.isPending && disconnect.variables === connection.id}
                aria-busy={disconnect.isPending && disconnect.variables === connection.id}
              >
                {disconnect.isPending && disconnect.variables === connection.id && (
                  <Loader2 className="animate-spin" aria-hidden="true" />
                )}
                Відключити
              </Button>
            </div>
          </div>
        ))}
    </SettingsSection>
  );
};
