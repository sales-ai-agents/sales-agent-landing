"use client";

import { useState } from "react";
import { Rocket } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { CAMPAIGN_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { formatNumber, pluralizeUk } from "@/lib/utils";
import { useStartCampaign } from "@dashboard/hooks";
import type { Agent } from "@dashboard/types";
import {
  CampaignBlockedAlert,
  isCampaignBlockCode,
  type CampaignBlockCode,
} from "./campaign-blocked-alert";

interface StartCampaignDialogProps {
  agent: Agent | null;
  onClose: () => void;
}

const NAME_MAX_LENGTH = 120;
const NAME_FIELD_ID = "campaign-name";

const formatContacts = (count: number): string =>
  `${formatNumber(count)} ${pluralizeUk(count, ["контакт", "контакти", "контактів"])}`;

export const StartCampaignDialog = ({ agent, onClose }: StartCampaignDialogProps) => {
  const startCampaign = useStartCampaign();
  const [name, setName] = useState("");
  const [blockCode, setBlockCode] = useState<CampaignBlockCode | null>(null);

  const close = (): void => {
    setName("");
    setBlockCode(null);
    onClose();
  };

  const handleError = (error: Error): void => {
    if (error instanceof ApiError && isCampaignBlockCode(error.code)) {
      setBlockCode(error.code);
      return;
    }

    handleMutationError(error, CAMPAIGN_ERROR_MESSAGES);
  };

  const handleStart = (): void => {
    if (!agent) return;
    setBlockCode(null);

    startCampaign.mutate(
      { agent_id: agent.id, ...(name.trim() && { name: name.trim() }) },
      {
        onSuccess: ({ targets }) => {
          toast.success(`Обдзвін запущено: ${formatContacts(targets)} у черзі`);
          close();
        },
        onError: handleError,
      }
    );
  };

  return (
    <Dialog
      open={agent !== null}
      disablePointerDismissal={startCampaign.isPending}
      onOpenChange={(open) => !open && !startCampaign.isPending && close()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Запустити обдзвін — {agent?.name}</DialogTitle>
          <DialogDescription>
            Агент зателефонує контактам зі свого списку:{" "}
            {formatContacts(agent?.contacts_count ?? 0)}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor={NAME_FIELD_ID}>Назва обдзвону</Label>
          <Input
            id={NAME_FIELD_ID}
            value={name}
            maxLength={NAME_MAX_LENGTH}
            placeholder={agent?.name}
            onChange={(event) => setName(event.target.value)}
          />
          <p className="text-muted-foreground text-xs">
            Обдзвін іде з 9:00 до 20:00 за Києвом у будні, з паузою 20 секунд між дзвінками. Поза
            цим часом він сам стає на паузу. Контакти без згоди пропускаються.
          </p>
        </div>

        {blockCode && <CampaignBlockedAlert code={blockCode} />}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={close}
            disabled={startCampaign.isPending}
          >
            Скасувати
          </Button>
          <Button type="button" onClick={handleStart} disabled={startCampaign.isPending}>
            <Rocket aria-hidden="true" />
            {startCampaign.isPending ? "Запускаємо..." : "Запустити"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
