import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiPost, apiGet, apiPatch, ApiError } from "@/lib/api-client";
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
} from "@/lib/types";

const AUTH_QUERY_KEY = ["auth", "me"] as const;

export function useAuthProviders() {
  return useQuery<AuthProvidersResponse>({
    queryKey: ["auth", "providers"],
    queryFn: () => apiGet<AuthProvidersResponse>(API_ENDPOINTS.AUTH_PROVIDERS),
    staleTime: 10 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, LoginParams>({
    mutationFn: (params) => apiPost<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, params),
    onSuccess: (data) => {
      if (data.token) setAuthToken(data.token);
      queryClient.setQueryData<Account>(AUTH_QUERY_KEY, data.account);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, RegisterParams>({
    mutationFn: (params) => apiPost<AuthResponse>(API_ENDPOINTS.AUTH_REGISTER, params),
    onSuccess: (data) => {
      if (data.token) setAuthToken(data.token);
      queryClient.setQueryData<Account>(AUTH_QUERY_KEY, data.account);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, void>({
    mutationFn: () => apiPost(API_ENDPOINTS.AUTH_LOGOUT),
    onSettled: () => {
      clearAuthToken();
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
    },
  });
}

export function useSocialLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, SocialLoginParams>({
    mutationFn: (params) => apiPost<AuthResponse>(API_ENDPOINTS.AUTH_SOCIAL, params),
    onSuccess: (data) => {
      if (data.token) setAuthToken(data.token);
      queryClient.setQueryData<Account>(AUTH_QUERY_KEY, data.account);
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
        if (error instanceof ApiError && error.status === 401) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<UpdateProfileResponse, ApiError, UpdateProfileParams>({
    mutationFn: (params) => apiPatch<UpdateProfileResponse>(API_ENDPOINTS.AUTH_ME, params),
    onSuccess: (data) => {
      queryClient.setQueryData<Account>(AUTH_QUERY_KEY, data.account);
    },
  });
}

export function useChangePassword() {
  return useMutation<ChangePasswordResponse, ApiError, ChangePasswordParams>({
    mutationFn: (params) => apiPost<ChangePasswordResponse>(API_ENDPOINTS.AUTH_PASSWORD, params),
  });
}
