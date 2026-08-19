"use client";

import { PageError } from "@/components/dashboard/page-states";

export default function CallLogsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <PageError message={error.message} onRetry={reset} />;
}
