import { toast } from "sonner";
import type { UseFormSetError, FieldValues, Path } from "react-hook-form";

import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage, type ErrorMessageMap } from "@/lib/error-messages";

const DEFAULT_MESSAGE = "Щось пішло не так.";
const INAPPROPRIATE_CONTENT_CODE = "inappropriate_content";
const INAPPROPRIATE_CONTENT_MESSAGE = "Вміст не відповідає правилам — відредагуйте це поле.";

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

export const handleMutationErrorWithForm = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  domainMap?: ErrorMessageMap
): void => {
  if (error instanceof ApiError && error.code === INAPPROPRIATE_CONTENT_CODE && error.field) {
    setError(error.field as Path<T>, { message: INAPPROPRIATE_CONTENT_MESSAGE });
    return;
  }
  handleMutationError(error, domainMap);
};
