import { toast } from "sonner";

import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage, type ErrorMessageMap } from "@/lib/error-messages";

const DEFAULT_MESSAGE = "Щось пішло не так.";

const buildApiErrorMessage = (error: ApiError, domainMap?: ErrorMessageMap): string => {
  const message = resolveErrorMessage(error.code, domainMap) ?? error.hint;
  if (!error.fields?.length) return message;

  return `${message} ${[...new Set(error.fields)].join(", ")}`;
};

export const handleMutationError = (error: unknown, domainMap?: ErrorMessageMap): void => {
  if (error instanceof ApiError) {
    toast.error(buildApiErrorMessage(error, domainMap));
  } else {
    toast.error(DEFAULT_MESSAGE);
  }
};
