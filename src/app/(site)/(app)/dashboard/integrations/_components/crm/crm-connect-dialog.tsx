"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import {
  Alert,
  AlertDescription,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import {
  CRM_CREDENTIAL_ERROR_CODES,
  CRM_ERROR_MESSAGES,
  resolveErrorMessage,
} from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { useConnectCrm } from "@dashboard/hooks";
import { CRM_PROVIDERS } from "../../_lib/crm-providers";
import type { CrmProvider } from "@dashboard/types";
import { IntegrationLogo } from "../integration-logo";

interface CrmConnectDialogProps {
  provider: CrmProvider;
  open: boolean;
  replacedCrmName: string | null;
  onOpenChange: (open: boolean) => void;
}

const credentialSchema = z.object({
  credential: z
    .string()
    .trim()
    .min(1, resolveErrorMessage("credentials_required", CRM_ERROR_MESSAGES)),
});

type CredentialFormData = z.infer<typeof credentialSchema>;

const CREDENTIAL_INPUT_ID = "crm-credential";
const CREDENTIAL_ERROR_ID = "crm-credential-error";
const CREDENTIAL_NOTE_ID = "crm-credential-note";

export const CrmConnectDialog = ({
  provider,
  open,
  replacedCrmName,
  onOpenChange,
}: CrmConnectDialogProps) => {
  const config = CRM_PROVIDERS[provider];
  const { credential } = config;
  const connectCrm = useConnectCrm();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CredentialFormData>({
    resolver: zodResolver(credentialSchema),
    defaultValues: { credential: "" },
  });

  const handleOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  const handleConnectError = (error: Error): void => {
    if (error instanceof ApiError && CRM_CREDENTIAL_ERROR_CODES.has(error.code)) {
      setError("credential", { message: resolveErrorMessage(error.code, CRM_ERROR_MESSAGES) });
      return;
    }

    handleMutationError(error, CRM_ERROR_MESSAGES);
  };

  const onSubmit = (data: CredentialFormData): void => {
    connectCrm.mutate(
      { provider, [credential.name]: data.credential },
      {
        onSuccess: () => {
          toast.success(`${config.name} підключено`);
          handleOpenChange(false);
        },
        onError: handleConnectError,
      }
    );
  };

  const errorMessage = errors.credential?.message;
  const pendingLabel = credential.isSecret ? "Перевіряємо ключ..." : "Перевіряємо вебхук...";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
          <DialogHeader className="flex-row items-center gap-3 pr-8">
            <IntegrationLogo id={provider} size="sm" />
            <DialogTitle className="text-lg font-semibold">Підключити {config.name}</DialogTitle>
          </DialogHeader>

          {replacedCrmName && (
            <Alert variant="warning">
              <TriangleAlert aria-hidden="true" />
              <AlertDescription>
                <p>
                  Зараз підключено <strong>{replacedCrmName}</strong>. Після підключення{" "}
                  {config.name} нові дзвінки підуть у {config.name}, а {replacedCrmName} буде
                  відключено. Те, що вже є в {replacedCrmName}, там і лишиться.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <ol className="list-inside list-decimal space-y-1.5 text-sm">
            {config.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div className="space-y-1.5">
            <Label htmlFor={CREDENTIAL_INPUT_ID}>{credential.label}</Label>
            <Input
              id={CREDENTIAL_INPUT_ID}
              type={credential.isSecret ? "password" : "url"}
              autoComplete="off"
              spellCheck={false}
              placeholder={credential.placeholder}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? CREDENTIAL_ERROR_ID : CREDENTIAL_NOTE_ID}
              {...register("credential")}
            />
            {errorMessage && (
              <p id={CREDENTIAL_ERROR_ID} role="alert" className="text-destructive text-xs">
                {errorMessage}
              </p>
            )}
            {!errorMessage && credential.note && (
              <p id={CREDENTIAL_NOTE_ID} className="text-muted-foreground text-xs">
                {credential.note}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Скасувати
            </Button>
            <Button type="submit" disabled={connectCrm.isPending}>
              {connectCrm.isPending ? pendingLabel : "Підключити"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
