export interface Account {
  id: number;
  email: string;
  name?: string;
  company?: string;
  plan?: string;
}

export interface AuthResponse {
  ok: boolean;
  token: string;
  account: Account;
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
