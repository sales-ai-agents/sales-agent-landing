import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { apiPost, apiGet, ApiRequestError } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { Account, AuthResponse, LoginParams, RegisterParams, MeResponse } from "@/types";

const AUTH_QUERY_KEY = ["auth", "me"] as const;

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  bad_credentials: "Невірний email або пароль.",
  too_many_requests: "Забагато спроб. Спробуйте через хвилину.",
};

const REGISTER_ERROR_MESSAGES: Record<string, string> = {
  invalid_email: "Невірний формат email.",
  weak_password: "Пароль має містити мінімум 8 символів.",
  email_taken: "Цей email вже зареєстрований.",
  too_many_requests: "Забагато спроб. Спробуйте пізніше.",
};

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiRequestError, LoginParams>({
    mutationFn: (params) => apiPost<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, params),
    onSuccess: (data) => {
      queryClient.setQueryData<Account>(AUTH_QUERY_KEY, data.account);
      toast.success("Вхід виконано успішно");
      router.push("/dashboard");
    },
    onError: (error) => {
      const message = LOGIN_ERROR_MESSAGES[error.code] ?? error.message;
      toast.error(message);
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiRequestError, RegisterParams>({
    mutationFn: (params) => apiPost<AuthResponse>(API_ENDPOINTS.AUTH_REGISTER, params),
    onSuccess: (data) => {
      queryClient.setQueryData<Account>(AUTH_QUERY_KEY, data.account);
      toast.success("Акаунт створено");
      router.push("/dashboard");
    },
    onError: (error) => {
      const message = REGISTER_ERROR_MESSAGES[error.code] ?? error.message;
      toast.error(message);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<void, ApiRequestError, void>({
    mutationFn: () => apiPost(API_ENDPOINTS.AUTH_LOGOUT),
    onSettled: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
      router.push("/sign-in");
    },
  });
}

export function useMe() {
  return useQuery<Account | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        const data = await apiGet<MeResponse>(API_ENDPOINTS.AUTH_ME);
        return data.account;
      } catch (error) {
        if (error instanceof ApiRequestError && error.status === 401) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: false,
  });
}
