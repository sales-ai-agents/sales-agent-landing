"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

import { ApiError, AUTH_FLOW_CODES } from "@/lib/api-client";

let isRedirecting = false;

function handleGlobal401(error: Error): void {
  if (isRedirecting) return;
  if (error instanceof ApiError && error.status === 401 && !AUTH_FLOW_CODES.has(error.code)) {
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
            if (query.queryKey[0] === "auth" && query.queryKey[1] === "me") return;
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
              if (error instanceof ApiError) {
                if (error.status === 401 || error.status === 403) return false;
              }
              return failureCount < 2;
            },
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
