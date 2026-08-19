const AUTH_FLOW_ERRORS = new Set([
  "bad_credentials",
  "invalid_email",
  "weak_password",
  "email_taken",
]);

export class ApiRequestError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "ApiRequestError";
  }
}

async function request<T>(url: string, method: "GET" | "POST", data?: unknown): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : undefined,
    });
  } catch {
    throw new ApiRequestError(
      0,
      "network_error",
      "Не вдалося з'єднатися з сервером. Перевірте інтернет і спробуйте ще раз."
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const code: string = body?.error ?? "unknown";
    const message: string = body?.message ?? "Щось пішло не так.";

    if (response.status === 401 && !AUTH_FLOW_ERRORS.has(code)) {
      throw new ApiRequestError(401, "session_expired", "Сесія закінчилася. Увійдіть знову.");
    }

    throw new ApiRequestError(response.status, code, message);
  }

  return response.json();
}

export function apiGet<T>(url: string): Promise<T> {
  return request<T>(url, "GET");
}

export function apiPost<T>(url: string, data?: unknown): Promise<T> {
  return request<T>(url, "POST", data);
}
