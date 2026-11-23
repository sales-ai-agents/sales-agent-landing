"use client";

import { Button, Card } from "@/components/ui";
import type { AvailableIntegration } from "@dashboard/types";
import { IntegrationLogo } from "./integration-logo";

interface GenericIntegrationCardProps {
  integration: AvailableIntegration;
}

export const GenericIntegrationCard = ({ integration }: GenericIntegrationCardProps) => {
  const isError = integration.status === "error" || Boolean(integration.error);

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <IntegrationLogo id={integration.id} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{integration.name}</p>
          {isError ? (
            <>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="bg-destructive h-1.5 w-1.5 rounded-full" />
                <span className="text-destructive text-xs font-medium">Помилка</span>
              </div>
              {integration.error && (
                <p className="text-muted-foreground mt-1 text-xs">{integration.error}</p>
              )}
            </>
          ) : integration.connected ? (
            <>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="bg-success h-1.5 w-1.5 rounded-full" />
                <span className="text-muted-foreground text-xs">
                  {integration.account_email ? "Підключено як" : "Підключено"}
                </span>
              </div>
              {integration.account_email && (
                <p className="mt-0.5 truncate text-xs font-medium">{integration.account_email}</p>
              )}
            </>
          ) : (
            <div className="mt-1 flex items-center gap-1.5">
              <span className="bg-muted-foreground h-1.5 w-1.5 rounded-full" />
              <span className="text-muted-foreground text-xs">Незабаром</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        {integration.connected ? (
          <Button variant="outline" size="sm" disabled>
            Підключено
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Незабаром
          </Button>
        )}
      </div>
    </Card>
  );
};
