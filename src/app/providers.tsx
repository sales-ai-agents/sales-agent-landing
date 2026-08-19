"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

import { ApiRequestError } from "@/lib/api-client";

const AUTH_FLOW_ERRORS = new Set([
  "bad_credentials",
  "invalid_email",
  "weak_password",
  "email_taken",
]);

let isRedirecting = false;

function handleGlobal401(error: Error): void {
  if (isRedirecting) return;
  if (
    error instanceof ApiRequestError &&
    error.status === 401 &&
    !AUTH_FLOW_ERRORS.has(error.code)
  ) {
    isRedirecting = true;
    toast.error("Сесія закінчилася. Увійдіть знову.");
    window.location.href = "/sign-in";
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.queryKey[0] === "auth") return;
            handleGlobal401(error);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            handleGlobal401(error);
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (error && "status" in error) {
                const status = (error as { status: number }).status;
                if (status === 401 || status === 403) return false;
              }
              return failureCount < 2;
            },
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
