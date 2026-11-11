"use client";

import { useState } from "react";
import { Pause, Play, Square } from "lucide-react";

import { Badge, Button, Progress } from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { CAMPAIGN_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useAccountTimeZone } from "@/lib/hooks";
import { formatDateShort, formatNumber } from "@/lib/utils";
import { useCampaigns, useControlCampaign } from "@dashboard/hooks";
import type { Campaign, CampaignAction, CampaignStatus } from "@dashboard/types";
import {
  CampaignBlockedAlert,
  isCampaignBlockCode,
  type CampaignBlockCode,
} from "./campaign-blocked-alert";

interface StatusView {
  label: string;
  variant: "success" | "warning" | "secondary";
}

const STATUS_VIEWS: Record<CampaignStatus, StatusView> = {
  running: { label: "Йде", variant: "success" },
  paused: { label: "Пауза", variant: "warning" },
  stopped: { label: "Зупинено", variant: "secondary" },
};

const CONTROLLABLE_STATUSES: ReadonlySet<string> = new Set<CampaignStatus>(["running", "paused"]);

const FINISHED_VIEW: StatusView = { label: "Завершено", variant: "secondary" };
const UNKNOWN_VIEW: StatusView = { label: "Статус невідомий", variant: "secondary" };

const isKnownStatus = (status: string): status is CampaignStatus => status in STATUS_VIEWS;

const resolveStatusView = ({ status, finished_at: finishedAt }: Campaign): StatusView => {
  if (isKnownStatus(status)) return STATUS_VIEWS[status];
  return finishedAt ? FINISHED_VIEW : UNKNOWN_VIEW;
};

const PERCENT = 100;

const calcProgress = ({ done, total }: Campaign): number =>
  total > 0 ? Math.min(PERCENT, (done / total) * PERCENT) : 0;

export const CampaignsSection = () => {
  const { data: campaigns = [] } = useCampaigns();
  const controlCampaign = useControlCampaign();
  const timeZone = useAccountTimeZone();

  const [stopTarget, setStopTarget] = useState<Campaign | null>(null);
  const [blockCode, setBlockCode] = useState<CampaignBlockCode | null>(null);

  if (campaigns.length === 0) return null;

  const pendingId = controlCampaign.isPending ? controlCampaign.variables?.campaign_id : null;

  const control = (campaign: Campaign, action: CampaignAction, onDone?: () => void): void => {
    setBlockCode(null);
    controlCampaign.mutate(
      { campaign_id: campaign.id, action },
      {
        onSuccess: onDone,
        onError: (error) => {
          if (error instanceof ApiError && isCampaignBlockCode(error.code)) {
            setBlockCode(error.code);
            return;
          }
          handleMutationError(error, CAMPAIGN_ERROR_MESSAGES);
        },
      }
    );
  };

  return (
    <section aria-labelledby="campaigns-title" className="space-y-3">
      <h2 id="campaigns-title" className="text-base font-semibold">
        Обдзвони
      </h2>

      {blockCode && <CampaignBlockedAlert code={blockCode} />}

      <ul className="space-y-3">
        {campaigns.map((campaign) => {
          const status = resolveStatusView(campaign);
          const isBusy = pendingId === campaign.id;

          return (
            <li
              key={campaign.id}
              className="border-border bg-background space-y-3 rounded-2xl border p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{campaign.name}</p>
                  <p className="text-muted-foreground text-xs">
                    Запущено {formatDateShort(campaign.created_at, timeZone)}
                  </p>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>

              <div className="flex items-center gap-3">
                <Progress value={calcProgress(campaign)} className="w-full" />
                <span className="shrink-0 text-xs">
                  {formatNumber(campaign.done)} / {formatNumber(campaign.total)}
                </span>
              </div>

              {CONTROLLABLE_STATUSES.has(campaign.status) && (
                <div className="flex flex-wrap gap-2">
                  {campaign.status === "running" ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => control(campaign, "pause")}
                    >
                      <Pause aria-hidden="true" />
                      Пауза
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => control(campaign, "resume")}
                    >
                      <Play aria-hidden="true" />
                      Продовжити
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    disabled={isBusy}
                    onClick={() => setStopTarget(campaign)}
                  >
                    <Square aria-hidden="true" />
                    Зупинити
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <ConfirmDialog
        open={stopTarget !== null}
        title="Зупинити обдзвін?"
        description="Зупинку не можна скасувати: ненабрані номери лишаться без дзвінка, а щоб продовжити, доведеться запускати новий обдзвін."
        confirmLabel="Зупинити"
        isDestructive
        isPending={controlCampaign.isPending}
        onConfirm={() => stopTarget && control(stopTarget, "stop", () => setStopTarget(null))}
        onOpenChange={(open) => !open && setStopTarget(null)}
      />
    </section>
  );
};
