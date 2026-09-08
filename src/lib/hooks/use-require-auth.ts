import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ApiError } from "@/lib/api-client";
import type { Account } from "@/lib/types";
import { useMe } from "./use-auth";

interface RequireAuthResult {
  account: Account | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  isUnauthenticated: boolean;
  error: ApiError | null;
  refetch: () => void;
}

const resolveUnauthenticated = (account: Account | null | undefined, error: ApiError | null) => {
  if (account === null) return true;
  return error instanceof ApiError && error.status === 401;
};

export const useRequireAuth = (): RequireAuthResult => {
  const router = useRouter();
  const { data: account, isLoading, error, refetch } = useMe();

  const isUnauthenticated = !isLoading && resolveUnauthenticated(account, error);

  useEffect(() => {
    if (isUnauthenticated) router.replace("/sign-in");
  }, [isUnauthenticated, router]);

  return {
    account,
    isLoading,
    isAuthenticated: !isLoading && !isUnauthenticated && Boolean(account),
    isUnauthenticated,
    error,
    refetch,
  };
};
