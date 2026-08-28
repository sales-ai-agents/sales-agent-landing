export interface ApiKey {
  id: number;
  name: string;
  prefix: string;
  created_at: string;
  last_used_at: string | null;
}

export interface ApiKeysResponse {
  ok: boolean;
  keys: ApiKey[];
}

export interface CreateApiKeyParams {
  name?: string;
}

export interface CreateApiKeyResponse {
  ok: boolean;
  id: number;
  key: string;
  prefix: string;
}
