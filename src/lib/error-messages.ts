export type ApiErrorCode =
  | "bad_credentials"
  | "invalid_email"
  | "weak_password"
  | "email_taken"
  | "too_many_requests"
  | "too_soon"
  | "network_error"
  | "session_expired"
  | "unknown";

export type ErrorMessageMap = Readonly<Partial<Record<ApiErrorCode | string, string>>>;

export const AUTH_ERROR_MESSAGES: ErrorMessageMap = {
  bad_credentials: "Невірний email або пароль.",
  invalid_email: "Невірний формат email.",
  weak_password: "Пароль має містити мінімум 8 символів.",
  email_taken: "Цей email вже зареєстрований.",
  too_many_requests: "Забагато спроб. Спробуйте через хвилину.",
  bad_current_password: "Невірний поточний пароль.",
  no_password_login: "Цей акаунт використовує вхід через Google/Apple. Пароля немає.",
  nothing_to_update: "Нічого не змінено.",
  invalid_token: "Токен авторизації недійсний. Спробуйте ще раз.",
  email_not_verified: "Email не підтверджений у провайдера.",
  unknown_provider: "Невідомий спосіб входу.",
  provider_not_configured: "Цей спосіб входу тимчасово недоступний.",
};

export const AGENT_ERROR_MESSAGES: ErrorMessageMap = {
  too_soon: "Лише один тестовий дзвінок на хвилину. Спробуйте пізніше.",
};

export function resolveErrorMessage(code: string, domainMap?: ErrorMessageMap): string {
  return domainMap?.[code] ?? "Щось пішло не так.";
}
