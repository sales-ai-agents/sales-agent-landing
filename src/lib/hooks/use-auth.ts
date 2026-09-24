import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiPost, apiGet, apiPatch, apiDelete, ApiError } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import { setAuthToken, clearAuthToken } from "@/lib/auth-token";
import type {
  Account,
  AuthResponse,
  LoginParams,
  RegisterParams,
  MeResponse,
  AuthProvidersResponse,
  SocialLoginParams,
  UpdateProfileParams,
  UpdateProfileResponse,
  ChangePasswordParams,
  ChangePasswordResponse,
  DeleteAccountParams,
  DeleteAccountResponse,
  MarketingConsentParams,
  MarketingConsentResponse,
  PasswordResetParams,
  PasswordResetResponse,
  PasswordResetConfirmParams,
  PasswordResetConfirmResponse,
  EmailCodeResponse,
  EmailConfirmParams,
  EmailConfirmResponse,
} from "@/lib/types";

const AUTH_QUERY_KEY = ["auth", "me"] as const;
const AUTH_PROVIDERS_QUERY_KEY = ["auth", "providers"] as const;

export const useAuthProviders = () => {
  return useQuery<AuthProvidersResponse>({
    queryKey: AUTH_PROVIDERS_QUERY_KEY,
    queryFn: () => apiGet<AuthProvidersResponse>(API_ENDPOINTS.AUTH_PROVIDERS),
    staleTime: 10 * 60 * 1000,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, LoginParams>({
    mutationFn: (params) => apiPost<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, params),
    onSuccess: (data) => {
      if (data.token) setAuthToken(data.token);
      queryClient.setQueryData<Account>(AUTH_QUERY_KEY, data.account);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, RegisterParams>({
    mutationFn: (params) => apiPost<AuthResponse>(API_ENDPOINTS.AUTH_REGISTER, params),
    onSuccess: (data) => {
      if (data.token) setAuthToken(data.token);
      queryClient.setQueryData<Account>(AUTH_QUERY_KEY, data.account);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, void>({
    mutationFn: () => apiPost(API_ENDPOINTS.AUTH_LOGOUT),
    onSettled: () => {
      clearAuthToken();
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "auth" || query.queryKey[1] === "me",
      });
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    },
  });
};

export const useSocialLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, SocialLoginParams>({
    mutationFn: (params) => apiPost<AuthResponse>(API_ENDPOINTS.AUTH_SOCIAL, params),
    onSuccess: (data) => {
      if (data.token) setAuthToken(data.token);
      queryClient.setQueryData<Account>(AUTH_QUERY_KEY, data.account);
    },
  });
};

export const useMe = () => {
  return useQuery<Account | null, ApiError>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        const data = await apiGet<MeResponse>(API_ENDPOINTS.AUTH_ME);
        return data.account;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateProfileResponse, ApiError, UpdateProfileParams>({
    mutationFn: (params) => apiPatch<UpdateProfileResponse>(API_ENDPOINTS.AUTH_ME, params),
    onSuccess: (data) => {
      queryClient.setQueryData<Account>(AUTH_QUERY_KEY, data.account);
    },
  });
};

export const useChangePassword = () => {
  return useMutation<ChangePasswordResponse, ApiError, ChangePasswordParams>({
    mutationFn: (params) => apiPost<ChangePasswordResponse>(API_ENDPOINTS.AUTH_PASSWORD, params),
  });
};

export const useUpdateMarketingConsent = () => {
  const queryClient = useQueryClient();

  return useMutation<MarketingConsentResponse, ApiError, MarketingConsentParams>({
    mutationFn: (params) =>
      apiPost<MarketingConsentResponse>(API_ENDPOINTS.APP_ACCOUNT_MARKETING_CONSENT, params),
    onSuccess: (data) => {
      queryClient.setQueryData<Account | null>(AUTH_QUERY_KEY, (previous) =>
        previous ? { ...previous, marketing_consent: data.granted } : previous
      );
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteAccountResponse, ApiError, DeleteAccountParams>({
    mutationFn: (params) => apiDelete<DeleteAccountResponse>(API_ENDPOINTS.APP_ACCOUNT, params),
    onSuccess: () => {
      clearAuthToken();
      queryClient.clear();
    },
  });
};

export const usePasswordReset = () => {
  return useMutation<PasswordResetResponse, ApiError, PasswordResetParams>({
    mutationFn: (params) =>
      apiPost<PasswordResetResponse>(API_ENDPOINTS.AUTH_PASSWORD_RESET, params),
  });
};

export const usePasswordResetConfirm = () => {
  return useMutation<PasswordResetConfirmResponse, ApiError, PasswordResetConfirmParams>({
    mutationFn: (params) =>
      apiPost<PasswordResetConfirmResponse>(API_ENDPOINTS.AUTH_PASSWORD_RESET_CONFIRM, params),
  });
};

export const useEmailCode = () => {
  return useMutation<EmailCodeResponse, ApiError, void>({
    mutationFn: () => apiPost<EmailCodeResponse>(API_ENDPOINTS.AUTH_EMAIL_CODE),
  });
};

export const useEmailConfirm = () => {
  const queryClient = useQueryClient();

  return useMutation<EmailConfirmResponse, ApiError, EmailConfirmParams>({
    mutationFn: (params) => apiPost<EmailConfirmResponse>(API_ENDPOINTS.AUTH_EMAIL_CONFIRM, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};
