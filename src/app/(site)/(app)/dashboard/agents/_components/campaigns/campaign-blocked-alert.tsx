import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, buttonVariants } from "@/components/ui";
import { CAMPAIGN_ERROR_MESSAGES, resolveErrorMessage } from "@/lib/error-messages";

export type CampaignBlockCode =
  "verification_required" | "minutes_exhausted" | "plan_expired" | "calls_blocked" | "daily_limit";

interface BlockAction {
  href: string;
  label: string;
}

const VERIFICATION_ACTION: BlockAction = {
  href: "/dashboard/settings#verification",
  label: "Підтвердити юрособу",
};

const BILLING_ACTION: BlockAction = { href: "/dashboard/billing", label: "Тарифи і оплата" };

const BLOCK_ACTIONS: Record<CampaignBlockCode, BlockAction | null> = {
  verification_required: VERIFICATION_ACTION,
  minutes_exhausted: BILLING_ACTION,
  plan_expired: BILLING_ACTION,
  calls_blocked: null,
  daily_limit: null,
};

const BLOCK_CODES: ReadonlySet<string> = new Set(Object.keys(BLOCK_ACTIONS));

export const isCampaignBlockCode = (code: string): code is CampaignBlockCode =>
  BLOCK_CODES.has(code);

interface CampaignBlockedAlertProps {
  code: CampaignBlockCode;
}

export const CampaignBlockedAlert = ({ code }: CampaignBlockedAlertProps) => {
  const action = BLOCK_ACTIONS[code];

  return (
    <Alert variant="warning">
      <TriangleAlert aria-hidden="true" />
      <AlertDescription className="gap-2">
        <p>{resolveErrorMessage(code, CAMPAIGN_ERROR_MESSAGES)}</p>
        {action && (
          <Link href={action.href} className={buttonVariants({ variant: "outline", size: "sm" })}>
            {action.label}
          </Link>
        )}
      </AlertDescription>
    </Alert>
  );
};
