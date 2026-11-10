"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { CRM_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { useDisconnectCrm } from "@dashboard/hooks";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";

interface CrmDisconnectButtonProps {
  providerName: string;
}

export const CrmDisconnectButton = ({ providerName }: CrmDisconnectButtonProps) => {
  const disconnectCrm = useDisconnectCrm();
  const [isOpen, setIsOpen] = useState(false);

  const disconnect = (): void => {
    disconnectCrm.mutate(undefined, {
      onSuccess: () => {
        toast.success(`${providerName} відключено`);
        setIsOpen(false);
      },
      onError: (error) => handleMutationError(error, CRM_ERROR_MESSAGES),
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-destructive"
        onClick={() => setIsOpen(true)}
      >
        Відключити
      </Button>
      <ConfirmDialog
        open={isOpen}
        title={`Відключити ${providerName}?`}
        description={`Нові дзвінки більше не надсилатимуться в ${providerName}. Те, що вже там є, лишиться.`}
        confirmLabel="Відключити"
        isDestructive
        isPending={disconnectCrm.isPending}
        onConfirm={disconnect}
        onOpenChange={setIsOpen}
      />
    </>
  );
};
