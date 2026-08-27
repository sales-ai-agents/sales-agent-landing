import { toast } from "sonner";

import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage, type ErrorMessageMap } from "@/lib/error-messages";

const DEFAULT_MESSAGE = "Щось пішло не так.";

export function handleMutationError(error: unknown, domainMap?: ErrorMessageMap): void {
  if (error instanceof ApiError) {
    toast.error(resolveErrorMessage(error.code, domainMap));
  } else {
    toast.error(DEFAULT_MESSAGE);
  }
}
