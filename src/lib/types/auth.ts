export interface Account {
  id: number;
  email: string;
  name?: string;
  company?: string;
  plan?: string;
}

export interface AuthResponse {
  ok: boolean;
  account: Account;
  token?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  name?: string;
  company?: string;
}

export interface MeResponse {
  ok: boolean;
  account: Account;
}

export interface AuthProvidersResponse {
  ok: boolean;
  password: boolean;
  google: boolean;
  apple: boolean;
  github: boolean;
}

export type SocialProvider = "google" | "apple" | "github";

export interface SocialLoginParams {
  provider: SocialProvider;
  id_token?: string;
  code?: string;
  name?: string;
}

export interface UpdateProfileParams {
  name?: string;
  company?: string;
  email?: string;
}

export interface UpdateProfileResponse {
  ok: boolean;
  account: Account;
}

export interface ChangePasswordParams {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  ok: boolean;
  sessions_closed: number;
}
