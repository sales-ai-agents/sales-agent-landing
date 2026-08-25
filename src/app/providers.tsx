"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { useState } from "react";
import { toast } from "sonner";

import { ApiError, AUTH_FLOW_CODES } from "@/lib/api-client";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

function isSessionExpired(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401 && !AUTH_FLOW_CODES.has(error.code);
}

function handleSessionExpired(queryClient: QueryClient) {
  toast.error("Сесія закінчилася. Увійдіть знову.", { id: "session-expired" });
  queryClient.setQueryData(["auth", "me"], null);
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
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
