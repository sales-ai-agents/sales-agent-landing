"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Input,
  Label,
  Skeleton,
} from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { VERIFICATION_ERROR_MESSAGES, resolveErrorMessage } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { formatNumber } from "@/lib/utils";
import { useSubmitVerification, useVerification } from "@dashboard/hooks";
import type { Verification, VerificationLevel } from "@dashboard/types";

const LEGAL_NAME_MIN_LENGTH = 3;
const LEGAL_NAME_MAX_LENGTH = 200;
const LEGAL_CODE_PATTERN = /^(\d{8}|\d{10})$/;

const verificationFormSchema = z.object({
  legal_name: z
    .string()
    .trim()
    .min(LEGAL_NAME_MIN_LENGTH, `Щонайменше ${LEGAL_NAME_MIN_LENGTH} символи`)
    .max(LEGAL_NAME_MAX_LENGTH, `Максимум ${LEGAL_NAME_MAX_LENGTH} символів`),
  legal_code: z
    .string()
    .trim()
    .regex(
      LEGAL_CODE_PATTERN,
      resolveErrorMessage("invalid_legal_code", VERIFICATION_ERROR_MESSAGES)
    ),
});

type VerificationFormData = z.infer<typeof verificationFormSchema>;

interface LevelView {
  label: string;
  variant: "success" | "warning" | "secondary";
  description: string;
}

const LEVEL_VIEWS: Record<VerificationLevel, LevelView> = {
  unverified: {
    label: "Не підтверджено",
    variant: "secondary",
    description:
      "Вхідні дзвінки працюють повністю, вихідних кілька на добу, щоб почути свого агента. Обдзвін відкривається після підтвердження юрособи.",
  },
  pending: {
    label: "На розгляді",
    variant: "warning",
    description: "Дані подано, їх перевіряє людина. Права поки ті самі, що й до подачі.",
  },
  verified: {
    label: "Підтверджено",
    variant: "success",
    description: "Обдзвін відкрито.",
  },
  trusted: {
    label: "Підтверджено",
    variant: "success",
    description: "Обдзвін відкрито, добові стелі зняті.",
  },
};

const NAME_FIELD_ID = "verification-legal-name";
const CODE_FIELD_ID = "verification-legal-code";

const VerificationForm = () => {
  const submitVerification = useSubmitVerification();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: { legal_name: "", legal_code: "" },
  });

  const handleSubmitError = (error: Error): void => {
    if (error instanceof ApiError && error.code === "invalid_legal_code") {
      setError("legal_code", {
        message: error.hint ?? resolveErrorMessage(error.code, VERIFICATION_ERROR_MESSAGES),
      });
      return;
    }

    handleMutationError(error, VERIFICATION_ERROR_MESSAGES);
  };

  const onSubmit = (data: VerificationFormData): void => {
    submitVerification.mutate(data, {
      onSuccess: () => toast.success("Дані подано. Ми перевіримо їх і повідомимо про результат."),
      onError: handleSubmitError,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={NAME_FIELD_ID}>Назва юрособи або ФОП</Label>
          <Input
            id={NAME_FIELD_ID}
            autoComplete="organization"
            maxLength={LEGAL_NAME_MAX_LENGTH}
            aria-invalid={Boolean(errors.legal_name)}
            {...register("legal_name")}
          />
          {errors.legal_name && (
            <p role="alert" className="text-destructive text-xs">
              {errors.legal_name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={CODE_FIELD_ID}>ЄДРПОУ (8 цифр) або ІПН (10)</Label>
          <Input
            id={CODE_FIELD_ID}
            inputMode="numeric"
            autoComplete="off"
            maxLength={10}
            aria-invalid={Boolean(errors.legal_code)}
            {...register("legal_code")}
          />
          {errors.legal_code && (
            <p role="alert" className="text-destructive text-xs">
              {errors.legal_code.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitVerification.isPending}>
          {submitVerification.isPending ? "Надсилаємо..." : "Подати на підтвердження"}
        </Button>
      </div>
    </form>
  );
};

const VerificationDetails = ({ verification }: { verification: Verification }) => (
  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
    <div>
      <dt className="text-muted-foreground text-xs">Юрособа</dt>
      <dd className="font-medium">{verification.legal_name}</dd>
    </div>
    <div>
      <dt className="text-muted-foreground text-xs">Код</dt>
      <dd className="font-medium">{verification.legal_code}</dd>
    </div>
    {verification.daily_outbound_limit > 0 && (
      <div>
        <dt className="text-muted-foreground text-xs">Вихідних на добу</dt>
        <dd className="font-medium">до {formatNumber(verification.daily_outbound_limit)}</dd>
      </div>
    )}
  </dl>
);

export const VerificationSection = () => {
  const { data: verification, isLoading } = useVerification();

  if (isLoading) return <Skeleton className="h-40 w-full rounded-2xl" />;
  if (!verification) return null;

  const view = LEVEL_VIEWS[verification.level];
  const canSubmit = verification.level === "unverified";

  return (
    <section id="verification" className="border-border bg-background rounded-2xl border p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Підтвердження юрособи</h2>
        <Badge variant={view.variant}>{view.label}</Badge>
      </div>
      <p className="text-muted-foreground mt-1 text-xs">{view.description}</p>

      {canSubmit && verification.note && (
        <Alert variant="warning" className="mt-4">
          <AlertTitle>Попередню заявку не підтверджено</AlertTitle>
          <AlertDescription>{verification.note}</AlertDescription>
        </Alert>
      )}

      {canSubmit ? <VerificationForm /> : <VerificationDetails verification={verification} />}
    </section>
  );
};
