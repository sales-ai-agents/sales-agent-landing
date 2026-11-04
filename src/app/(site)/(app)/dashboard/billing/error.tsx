"use client";

import { PageError } from "@/components/dashboard";

export default function BillingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <PageError message={error.message} onRetry={reset} />;
}
