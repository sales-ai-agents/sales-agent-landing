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
  confirm_required: "Введіть DELETE для підтвердження.",
  invalid_json: "Некоректні дані запиту.",
};

export const AGENT_ERROR_MESSAGES: ErrorMessageMap = {
  too_soon: "Лише один тестовий дзвінок на хвилину. Спробуйте пізніше.",
  name_required: "Вкажіть назву агента.",
  invalid_call_direction: "Оберіть тип дзвінків.",
  contact_base_required: "Оберіть базу контактів для вихідних дзвінків.",
  invalid_schedule: "Некоректний час прозвону: початок має бути раніше за кінець.",
  invalid_working_days: "Оберіть коректні робочі дні.",
  invalid_calls_per_day: "Некоректна кількість дзвінків на день.",
  number_not_connected: "Обраний номер не підключено до вашого акаунта.",
  agent_not_found: "Агента не знайдено.",
  agent_has_no_instructions: "Додайте інструкції, щоб агент міг дзвонити.",
  invalid_phone: "Введіть коректний номер телефону.",
  do_not_call: "Цей номер просив більше не дзвонити.",
};

export const NUMBER_ERROR_MESSAGES: ErrorMessageMap = {
  number_unavailable:
    "Номер уже підключений або не схожий на телефонний. Перевірте написання або зверніться до підтримки.",
  number_limit: "Ваш тариф не дозволяє більше номерів. Оберіть вищий тариф.",
  pool_empty: "Зараз немає вільних номерів — ми вже замовляємо нові. Спробуйте переадресацію.",
  agent_not_found: "Агента не знайдено.",
  bad_source: "Невірний спосіб підключення номера.",
  bad_direction: "Невірний напрямок дзвінків.",
  bad_kind: "Невірний тип номера.",
  bad_hours: "Початок робочого часу має бути раніше за кінець.",
  bad_daily_cap: "Некоректна добова стеля дзвінків.",
  bad_working_days: "Оберіть коректні робочі дні.",
  inbound_required: "Цей номер не приймає вхідні дзвінки — увімкніть вхідні, щоб видати SIP-транк.",
  number_required: "Спершу додайте номер для вхідних дзвінків.",
  trunk_failed: "Не вдалося створити SIP-транк. Спробуйте ще раз.",
  sip_not_configured: "SIP тимчасово недоступний. Спробуйте пізніше.",
  not_found: "Номер не знайдено.",
  nothing_to_update: "Нічого не змінено.",
  invalid_json: "Некоректні дані запиту.",
};

export const GOOGLE_SHEETS_ERROR_MESSAGES: ErrorMessageMap = {
  spreadsheet_required: "Оберіть таблицю Google Sheets.",
  phone_column_required: "Вкажіть колонку з номером телефону.",
  empty_sheet: "Обраний аркуш порожній.",
  no_access: "Немає доступу до таблиці. Оберіть її ще раз через Google.",
  not_connected: "Google Sheets не підключено.",
  read_failed: "Не вдалося прочитати таблицю. Спробуйте ще раз.",
  invalid_json: "Некоректні дані запиту.",
};

export const CONTACTS_EXPORT_ERROR_MESSAGES: ErrorMessageMap = {
  export_failed: "Не вдалося сформувати експорт. Спробуйте ще раз.",
};

export const resolveErrorMessage = (code: string, domainMap?: ErrorMessageMap): string => {
  return domainMap?.[code] ?? "Щось пішло не так.";
};
