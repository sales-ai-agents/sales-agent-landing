import { useState } from "react";
import { toast } from "sonner";

import { WEBHOOK_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import {
  useDeleteWebhook,
  useReissueWebhookSecret,
  useTestWebhook,
  useUpdateWebhook,
} from "@dashboard/hooks";
import type { TestWebhookResponse, Webhook } from "@dashboard/types";
import type { RevealedSecret } from "./webhook-secret-dialog";

const onActionError = (error: Error): void => handleMutationError(error, WEBHOOK_ERROR_MESSAGES);

export const useWebhookActions = (
  webhook: Webhook,
  onSecretRevealed: (revealed: RevealedSecret) => void
) => {
  const updateWebhook = useUpdateWebhook();
  const deleteWebhook = useDeleteWebhook();
  const testWebhook = useTestWebhook();
  const reissueSecret = useReissueWebhookSecret();

  const [testResult, setTestResult] = useState<TestWebhookResponse | null>(null);

  const toggleActive = (isActive: boolean): void => {
    updateWebhook.mutate(
      { id: webhook.id, is_active: isActive },
      {
        onSuccess: () => toast.success(isActive ? "Вебхук увімкнено" : "Вебхук вимкнено"),
        onError: onActionError,
      }
    );
  };

  const sendTest = (): void => {
    setTestResult(null);
    testWebhook.mutate(webhook.id, { onSuccess: setTestResult, onError: onActionError });
  };

  const reissue = (onDone: () => void): void => {
    reissueSecret.mutate(webhook.id, {
      onSuccess: ({ secret }) => {
        onSecretRevealed({ url: webhook.url, secret, isReissued: true });
        reissueSecret.reset();
        onDone();
      },
      onError: onActionError,
    });
  };

  const remove = (onDone: () => void): void => {
    deleteWebhook.mutate(webhook.id, {
      onSuccess: () => {
        toast.success("Вебхук видалено");
        onDone();
      },
      onError: onActionError,
    });
  };

  return {
    testResult,
    isToggling: updateWebhook.isPending,
    isTesting: testWebhook.isPending,
    isReissuing: reissueSecret.isPending,
    isDeleting: deleteWebhook.isPending,
    toggleActive,
    sendTest,
    reissue,
    remove,
  };
};
