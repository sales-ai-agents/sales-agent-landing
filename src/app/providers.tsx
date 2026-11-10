"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import React, { useState } from "react";
import { toast } from "sonner";

import { ApiError, AUTH_FLOW_CODES } from "@/lib/api-client";

function isSessionExpired(error: unknown) {
  return error instanceof ApiError && error.status === 401 && !AUTH_FLOW_CODES.has(error.code);
}

const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

function handleSessionExpired(queryClient: QueryClient) {
  if (queryClient.getQueryData(AUTH_ME_QUERY_KEY) === null) return;

  toast.error("Сесія закінчилася. Увійдіть знову.", { id: "session-expired" });
  queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
}

function makeQueryClient(): QueryClient {
  const client = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.queryKey[0] === "auth" && query.queryKey[1] === "me") return;

        if (isSessionExpired(error)) {
          handleSessionExpired(client);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (isSessionExpired(error)) {
          handleSessionExpired(client);
        }
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
  });
  return client;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </QueryClientProvider>
  );
}
