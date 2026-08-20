export type AuthFlowCode =
  "bad_credentials" | "invalid_email" | "weak_password" | "email_taken" | "too_many_requests";

export const AUTH_FLOW_CODES: ReadonlySet<string> = new Set<AuthFlowCode>([
  "bad_credentials",
  "invalid_email",
  "weak_password",
  "email_taken",
  "too_many_requests",
]);

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly retryAfter?: number;

  constructor(status: number, code: string, message: string, retryAfter?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

interface ApiErrorBody {
  error?: string;
  message?: string;
  retry_after?: number;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  rawBody?: BodyInit;
}

async function request<T>(url: string, method: HttpMethod, options?: RequestOptions): Promise<T> {
  let response: Response;

  const headers: Record<string, string> = {
    ...options?.headers,
  };

  if (!options?.rawBody) {
    headers["Content-Type"] = "application/json";
  }

  try {
    response = await fetch(url, {
      method,
      credentials: "include",
      headers,
      body: options?.rawBody ?? (options?.body ? JSON.stringify(options.body) : undefined),
    });
  } catch {
    throw new ApiError(
      0,
      "network_error",
      "Не вдалося з'єднатися з сервером. Перевірте інтернет і спробуйте ще раз."
    );
  }

  if (!response.ok) {
    const body: ApiErrorBody = await response.json().catch(() => ({}));
    const code: string = body?.error ?? "unknown";
    const message: string = body?.message ?? "Щось пішло не так.";

    if (response.status === 429) {
      const retryAfter =
        body?.retry_after ?? (Number(response.headers.get("Retry-After")) || undefined);
      throw new ApiError(429, code, message, retryAfter);
    }

    if (response.status === 401 && !AUTH_FLOW_CODES.has(code)) {
      throw new ApiError(401, "session_expired", "Сесія закінчилася. Увійдіть знову.");
    }

    throw new ApiError(response.status, code, message);
  }

  return response.json();
}

export function apiGet<T>(url: string): Promise<T> {
  return request<T>(url, "GET");
}

export function apiPost<T>(url: string, body?: unknown): Promise<T> {
  return request<T>(url, "POST", { body });
}

export function apiPostFormData<T>(url: string, formData: FormData): Promise<T> {
  return request<T>(url, "POST", { rawBody: formData });
}

export function apiPut<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, "PUT", { body });
}

export function apiPatch<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, "PATCH", { body });
}

export function apiDelete<T>(url: string): Promise<T> {
  return request<T>(url, "DELETE");
}
