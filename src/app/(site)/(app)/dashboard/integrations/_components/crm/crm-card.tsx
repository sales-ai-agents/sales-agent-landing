"use client";

import { useState } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useCrmIntegration } from "@dashboard/hooks";
import type { AvailableIntegration, CrmIntegration, CrmProvider } from "@dashboard/types";
import { CRM_PROVIDERS, describeCrmMode } from "../../_lib/crm-providers";
import { IntegrationLogo } from "../integration-logo";
import { CrmConnectDialog } from "./crm-connect-dialog";
import { CrmDisconnectButton } from "./crm-disconnect-button";
import { CrmSettings } from "./crm-settings";

interface CrmCardProps {
  integration: AvailableIntegration;
  provider: CrmProvider;
}

type CrmCardState = "idle" | "connected" | "error";

const ERROR_TITLES: Record<string, string> = {
  no_access: "немає прав CRM",
  leads_disabled: "вимкнено розділ «Воронки»",
};

const resolveState = (crm: CrmIntegration | undefined, provider: CrmProvider): CrmCardState => {
  if (!crm?.connected || crm.provider !== provider) return "idle";
  return crm.status === "error" ? "error" : "connected";
};

const resolveErrorTitle = (crm: CrmIntegration, provider: CrmProvider): string => {
  const fromCode = crm.error ? ERROR_TITLES[crm.error] : undefined;
  if (fromCode) return `Помилка: ${fromCode}`;

  const credential = CRM_PROVIDERS[provider].credential.isSecret ? "ключ" : "вебхук";
  return `Помилка: ${credential} перестав діяти`;
};

const resolveReplacedName = (crm: CrmIntegration | undefined, provider: CrmProvider) => {
  if (!crm?.connected || !crm.provider || crm.provider === provider) return null;
  return crm.provider_name ?? CRM_PROVIDERS[crm.provider].name;
};

const StatusLine = ({
  tone,
  children,
}: {
  tone: "success" | "error" | "idle";
  children: string;
}) => (
  <div className="mt-1 flex items-center gap-1.5">
    <span
      aria-hidden="true"
      className={cn(
        "h-1.5 w-1.5 rounded-full",
        tone === "success" && "bg-success",
        tone === "error" && "bg-destructive",
        tone === "idle" && "bg-primary"
      )}
    />
    <span
      className={cn(
        "text-xs",
        tone === "success" && "text-success",
        tone === "error" && "text-destructive font-medium",
        tone === "idle" && "text-primary"
      )}
    >
      {children}
    </span>
  </div>
);

export const CrmCard = ({ integration, provider }: CrmCardProps) => {
  const { data: crm } = useCrmIntegration();
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  const config = CRM_PROVIDERS[provider];
  const state = resolveState(crm, provider);
  const connectedCrm = state === "idle" ? undefined : crm;
  const modeHint = connectedCrm ? describeCrmMode(connectedCrm) : null;

  return (
    <section
      aria-label={config.name}
      className={cn(
        "bg-background rounded-xl border p-5",
        state === "error" ? "border-destructive/40" : "border-border"
      )}
    >
      <div className="flex items-start gap-4">
        <IntegrationLogo id={provider} />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-medium">{config.name}</h2>

          {state === "idle" && (
            <>
              <StatusLine tone="idle">
                {integration.ready ? "Доступно для підключення" : "Не підключено"}
              </StatusLine>
              <p className="text-muted-foreground mt-1 text-xs">{config.idleDescription}</p>
            </>
          )}

          {state === "connected" && connectedCrm && (
            <>
              <StatusLine tone="success">{`Підключено до ${connectedCrm.account ?? config.name}`}</StatusLine>
              {modeHint && <p className="text-muted-foreground mt-1 text-xs">{modeHint}</p>}
            </>
          )}

          {state === "error" && connectedCrm && (
            <>
              <StatusLine tone="error">{resolveErrorTitle(connectedCrm, provider)}</StatusLine>
              <p className="text-muted-foreground mt-1 text-xs">
                Нові дзвінки не надсилаються, доки не перепідключите.
              </p>
            </>
          )}
        </div>
      </div>

      {state === "connected" && connectedCrm && <CrmSettings crm={connectedCrm} />}

      {state === "error" && (
        <div className="mt-4 flex items-center justify-between gap-2">
          <CrmDisconnectButton providerName={config.name} />
          <Button type="button" size="sm" onClick={() => setIsConnectOpen(true)}>
            Перепідключити
          </Button>
        </div>
      )}

      {state === "idle" && (
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-primary border-primary/40"
            disabled={!integration.ready}
            onClick={() => setIsConnectOpen(true)}
          >
            {integration.ready ? "Підключити" : "Незабаром"}
          </Button>
        </div>
      )}

      <CrmConnectDialog
        provider={provider}
        open={isConnectOpen}
        replacedCrmName={resolveReplacedName(crm, provider)}
        onOpenChange={setIsConnectOpen}
      />
    </section>
  );
};
