export type AgentLanguage = "uk" | "ru" | "en";

export interface Account {
  id: number;
  email: string;
  name?: string;
  company?: string;
  plan?: string;
  sla_minutes?: number;
  timezone?: string;
  short_name?: string;
  website?: string;
  agent_language?: AgentLanguage;
  marketing_consent?: boolean;
  email_verified?: boolean;
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
  marketing_consent?: boolean;
}

export interface DeleteAccountParams {
  password: string;
  confirm: "DELETE";
}

export interface DeleteAccountResponse {
  ok: boolean;
  deleted: boolean;
}

export interface MarketingConsentParams {
  granted: boolean;
}

export interface MarketingConsentResponse {
  ok: boolean;
  granted: boolean;
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
  sla_minutes?: number;
  timezone?: string;
  short_name?: string;
  website?: string;
  agent_language?: AgentLanguage;
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

export interface PasswordResetParams {
  email: string;
}

export interface PasswordResetResponse {
  ok: boolean;
  sent: boolean;
  hint?: string;
}

export interface PasswordResetConfirmParams {
  email: string;
  code: string;
  password: string;
}

export interface PasswordResetConfirmResponse {
  ok: boolean;
  sessions_closed: number;
}

export interface EmailCodeResponse {
  ok: boolean;
  already_verified: boolean;
}

export interface EmailConfirmParams {
  code: string;
}

export interface EmailConfirmResponse {
  ok: boolean;
  verified: boolean;
  already_verified: boolean;
}
