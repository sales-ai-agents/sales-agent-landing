export type AuthFlowCode = "bad_credentials" | "invalid_email" | "weak_password" | "email_taken";

export const AUTH_FLOW_CODES: ReadonlySet<string> = new Set<AuthFlowCode>([
  "bad_credentials",
  "invalid_email",
  "weak_password",
  "email_taken",
]);

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

interface ApiErrorBody {
  error?: string;
  message?: string;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(url: string, method: HttpMethod, options?: RequestOptions): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
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

export function apiPut<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, "PUT", { body });
}

export function apiPatch<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, "PATCH", { body });
}

export function apiDelete<T>(url: string): Promise<T> {
  return request<T>(url, "DELETE");
}
