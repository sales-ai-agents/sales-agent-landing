import type { ApiErrors } from "@/components/landing/copy/client-types";

export const resolveApiError = (errors: ApiErrors, code: string | undefined): string =>
  (code ? errors.codes[code] : undefined) ?? errors.fallback;
