import { CircleAlert, CircleCheck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui";
import type { TestWebhookResponse } from "@dashboard/types";
import { describeTestResult } from "../../_lib/webhook-labels";

interface WebhookTestResultProps {
  result: TestWebhookResponse;
}

export const WebhookTestResult = ({ result }: WebhookTestResultProps) => {
  const { tone, title, description } = describeTestResult(result);
  const Icon = tone === "success" ? CircleCheck : CircleAlert;

  return (
    <Alert variant={tone}>
      <Icon aria-hidden="true" />
      <AlertTitle className="line-clamp-none">{title}</AlertTitle>
      {description && <AlertDescription className="break-words">{description}</AlertDescription>}
    </Alert>
  );
};
