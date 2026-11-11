"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleAlert, CircleCheck, Clock, ExternalLink, Loader2, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { CRM_ERROR_MESSAGES } from "@/lib/error-messages";
import { useAccountTimeZone } from "@/lib/hooks";
import { handleMutationError } from "@/lib/mutation-error";
import { cn } from "@/lib/utils";
import { useCrmRetry } from "@dashboard/hooks";
import type { CrmStatus } from "@dashboard/types";
import {
  CALL_IN_PROGRESS_VIEW,
  describeCrmStatus,
  type CrmStatusTone,
} from "../_lib/crm-status-view";

interface CrmStatusPanelProps {
  callId: string;
  crm: CrmStatus;
}

interface ToneStyle {
  icon: LucideIcon;
  iconClassName: string;
  wrapperClassName: string;
}

const CALL_IN_PROGRESS_CODE = "call_in_progress";

const TONE_STYLES: Record<CrmStatusTone, ToneStyle> = {
  success: { icon: CircleCheck, iconClassName: "text-success", wrapperClassName: "bg-success/15" },
  pending: {
    icon: Loader2,
    iconClassName: "text-primary animate-spin",
    wrapperClassName: "bg-primary/10",
  },
  warning: { icon: Clock, iconClassName: "text-warning", wrapperClassName: "bg-warning/15" },
  error: {
    icon: CircleAlert,
    iconClassName: "text-destructive",
    wrapperClassName: "bg-destructive/10",
  },
  neutral: { icon: Minus, iconClassName: "text-muted-foreground", wrapperClassName: "bg-muted" },
};

export const CrmStatusPanel = ({ callId, crm }: CrmStatusPanelProps) => {
  const crmRetry = useCrmRetry();
  const timeZone = useAccountTimeZone();
  const [isCallInProgress, setIsCallInProgress] = useState(false);

  const view = isCallInProgress ? CALL_IN_PROGRESS_VIEW : describeCrmStatus(crm, timeZone);
  if (!view) return null;

  const { icon: Icon, iconClassName, wrapperClassName } = TONE_STYLES[view.tone];
  const providerName = crm.provider_name ?? "CRM";

  const handleRetry = (): void => {
    crmRetry.mutate(callId, {
      onError: (error) => {
        if (error instanceof ApiError && error.code === CALL_IN_PROGRESS_CODE) {
          setIsCallInProgress(true);
          return;
        }
        handleMutationError(error, CRM_ERROR_MESSAGES);
      },
      onSuccess: () => toast.success("Поставлено в чергу"),
    });
  };

  return (
    <section
      aria-labelledby="crm-status-title"
      className="border-border bg-background space-y-4 rounded-2xl border p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id="crm-status-title" className="text-sm font-semibold">
          CRM
        </h3>
        <span className="text-muted-foreground text-xs">{providerName}</span>
      </div>

      <div className="flex items-start gap-3" aria-live="polite">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            wrapperClassName
          )}
        >
          <Icon className={cn("h-4 w-4", iconClassName)} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{view.title}</p>
          {view.description && (
            <p className="text-muted-foreground mt-0.5 text-xs">{view.description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {crm.state === "synced" && crm.external_url && !isCallInProgress && (
          <a
            href={crm.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "text-primary border-primary/40"
            )}
          >
            Відкрити в {providerName}
            <ExternalLink aria-hidden="true" />
          </a>
        )}

        {view.needsReconnect && (
          <Link href="/dashboard/integrations" className={buttonVariants({ size: "sm" })}>
            Перепідключити
          </Link>
        )}

        {view.retryLabel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-primary border-primary/40"
            disabled={crmRetry.isPending || isCallInProgress}
            onClick={handleRetry}
          >
            {view.retryLabel}
          </Button>
        )}
      </div>
    </section>
  );
};
