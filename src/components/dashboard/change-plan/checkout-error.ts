import { ApiError } from "@/lib/api-client";

const CHECKOUT_ERROR_MESSAGES: Record<string, string> = {
  unknown_plan: "Невідомий тариф. Оновіть сторінку та спробуйте ще.",
  payment_provider_error: "Не вдалося сформувати рахунок для оплати. Спробуйте пізніше.",
  payments_unavailable: "Оплата тимчасово недоступна.",
  rate_unavailable:
    "Курс НБУ зараз недоступний для розрахунку суми. Рахунок не створено, спробуйте пізніше.",
};

const GENERIC_ERROR_MESSAGE = "Щось пішло не так.";

export const resolveCheckoutErrorMessage = (error: unknown): string => {
  if (!(error instanceof ApiError)) {
    return GENERIC_ERROR_MESSAGE;
  }

  return CHECKOUT_ERROR_MESSAGES[error.code] ?? error.message ?? GENERIC_ERROR_MESSAGE;
};
