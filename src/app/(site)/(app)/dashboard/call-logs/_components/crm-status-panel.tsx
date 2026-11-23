"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { ExternalLink, RotateCcw, TriangleAlert } from "lucide-react";
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  buttonVariants,
  Card,
  CardTitle,
  type BadgeProps,
} from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { CRM_ERROR_MESSAGES } from "@/lib/error-messages";
import { useAccountTimeZone } from "@/lib/hooks";
import { handleMutationError } from "@/lib/mutation-error";
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

const CALL_IN_PROGRESS_CODE = "call_in_progress";

const TONE_VARIANTS: Record<CrmStatusTone, BadgeProps["variant"]> = {
  success: "success",
  pending: "warning",
  warning: "warning",
  error: "destructive",
  neutral: "muted",
};

export const CrmStatusPanel = ({ callId, crm }: CrmStatusPanelProps) => {
  const crmRetry = useCrmRetry();
  const timeZone = useAccountTimeZone();
  const [isCallInProgress, setIsCallInProgress] = useState(false);

  const view = isCallInProgress ? CALL_IN_PROGRESS_VIEW : describeCrmStatus(crm, timeZone);
  if (!view) return null;

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
    <Card role="region" aria-labelledby="crm-status-title" className="flex flex-col gap-3 p-6">
      <CardTitle id="crm-status-title" className="text-lg">
        CRM синхронізація
      </CardTitle>
      <div className="flex flex-col items-start gap-1.5">
        <Badge
          variant={TONE_VARIANTS[view.tone]}
          dot={view.tone === "success" || view.tone === "error"}
          aria-live="polite"
        >
          {view.title}
        </Badge>
        <p className="text-muted-foreground text-xs">{providerName}</p>
      </div>
      {view.description &&
        (view.tone === "error" ? (
          <Alert variant="destructive">
            <TriangleAlert aria-hidden="true" />
            <AlertDescription className="text-destructive">{view.description}</AlertDescription>
          </Alert>
        ) : (
          <p className="text-muted-foreground text-sm">{view.description}</p>
        ))}
      <div className="grid gap-2">
        {crm.state === "synced" && crm.external_url && !isCallInProgress && (
          <a
            className={buttonVariants({ variant: "outline", size: "sm" })}
            href={crm.external_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Відкрити в {providerName}
            <ExternalLink aria-hidden="true" />
          </a>
        )}
        {view.needsReconnect && (
          <Link className={buttonVariants({ size: "sm" })} href="/dashboard/integrations">
            Перепідключити
          </Link>
        )}
        {view.retryLabel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={crmRetry.isPending || isCallInProgress}
            onClick={handleRetry}
          >
            <RotateCcw aria-hidden="true" />
            {view.retryLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};
