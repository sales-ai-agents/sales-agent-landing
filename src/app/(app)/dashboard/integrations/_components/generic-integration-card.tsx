"use client";

import { Blocks, Webhook } from "lucide-react";

import { Button } from "@/components/ui";
import type { AvailableIntegration } from "@dashboard/types";

interface GenericIntegrationCardProps {
  integration: AvailableIntegration;
}

const renderIntegrationLogo = (id: string) => {
  if (id === "bitrix24") {
    return (
      <div className="border-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-full border bg-blue-50 dark:bg-blue-950/40">
        <span className="text-primary text-xl font-bold">24</span>
      </div>
    );
  }

  if (id === "keycrm") {
    return (
      <div className="bg-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="24"
          viewBox="0 0 12 20"
          fill="none"
        >
          <path
            d="M6 0C9.31371 0 12 2.68629 12 6C12 8.26095 10.7485 10.2282 8.90137 11.251C8.96308 11.4907 9 11.741 9 12V17C9 18.6569 7.65685 20 6 20C4.34315 20 3 18.6569 3 17V12C3 11.7411 3.03598 11.4906 3.09766 11.251C1.25091 10.2281 0 8.26064 0 6C0 2.68629 2.68629 0 6 0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  }

  if (id === "pipedrive") {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-black text-white">
        <span className="text-xl font-bold">P</span>
      </div>
    );
  }

  if (id === "webhook" || id.includes("webhook")) {
    return (
      <div className="bg-primary/10 text-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-full">
        <Webhook className="h-7 w-7" />
      </div>
    );
  }

  return (
    <div className="bg-muted text-muted-foreground flex h-16 w-16 shrink-0 items-center justify-center rounded-full">
      <Blocks className="h-7 w-7" />
    </div>
  );
};

export const GenericIntegrationCard = ({ integration }: GenericIntegrationCardProps) => {
  const isError = integration.status === "error" || Boolean(integration.error);
  const displayEmail = integration.account_email || integration.email;

  return (
    <div className="border-border bg-background rounded-xl border p-5">
      <div className="flex items-start gap-4">
        {renderIntegrationLogo(integration.id)}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{integration.name}</p>
          {isError ? (
            <>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span className="text-xs font-medium text-red-600 dark:text-red-400">Помилка</span>
              </div>
              {integration.error && (
                <p className="text-muted-foreground mt-1 text-xs">{integration.error}</p>
              )}
            </>
          ) : integration.connected ? (
            <>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-muted-foreground text-xs">
                  {displayEmail ? "Підключено як" : "Підключено"}
                </span>
              </div>
              {displayEmail && (
                <p className="mt-0.5 truncate text-xs font-medium">{displayEmail}</p>
              )}
            </>
          ) : (
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={
                  integration.ready
                    ? "bg-primary h-1.5 w-1.5 rounded-full"
                    : "h-1.5 w-1.5 rounded-full bg-gray-400"
                }
              />
              <span className="text-muted-foreground text-xs">
                {integration.ready ? "Доступно для підключення" : "Не підключено"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div />
        <div className="flex items-center gap-2">
          {integration.connected ? (
            <Button variant="outline" size="sm" disabled>
              Підключено
            </Button>
          ) : integration.ready ? (
            <span className="border-primary/40 text-primary rounded-md border px-3 py-1.5 text-sm font-medium">
              Доступно
            </span>
          ) : (
            <Button variant="outline" size="sm" className="w-full" disabled>
              Незабаром
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
