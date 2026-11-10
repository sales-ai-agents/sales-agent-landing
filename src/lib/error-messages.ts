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
  too_many_requests: "Забагато спроб. Спробуйте через пару хв",
  bad_current_password: "Невірний поточний пароль.",
  no_password_login: "Цей акаунт використовує вхід через Google/Apple. Пароля немає.",
  nothing_to_update: "Нічого не змінено.",
  unknown_kind: "Невідомий тип сповіщення.",
  invalid_token: "Токен авторизації недійсний. Спробуйте ще раз.",
  email_not_verified: "Email не підтверджений у провайдера.",
  unknown_provider: "Невідомий спосіб входу.",
  provider_not_configured: "Цей спосіб входу тимчасово недоступний.",
  confirm_required: "Введіть DELETE для підтвердження.",
  invalid_json: "Некоректні дані запиту.",
  invalid_code: "Невірний або застарілий код.",
  bad_code: "Невірний код.",
  code_expired: "Код застарів. Запросіть новий.",
  no_code: "Код не знайдено. Запросіть новий лист.",
  too_many_attempts: "Занадто багато спроб — код заблоковано. Запросіть новий.",
  too_soon: "Зачекайте хвилину перед повторним надсиланням.",
  mail_failed: "Не вдалося надіслати лист. Спробуйте ще раз.",
  invalid_language: "Ця мова недоступна.",
  invalid_timezone: "Невідомий часовий пояс.",
  invalid_sla_minutes: "Некоректний строк реакції на дзвінок.",
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
  invalid_call_type: "Оберіть коректний тип дзвінка.",
  invalid_call_fields: "Перевірте поля для збору даних: назва кожного поля обов'язкова.",
  too_many_call_fields: "Забагато полів. Можна додати щонайбільше 15.",
  instructions_unfilled: "В інструкціях лишились незаповнені місця в [дужках]. Заповніть їх.",
  agent_not_found: "Агента не знайдено.",
  agent_has_no_instructions: "Додайте інструкції, щоб агент міг дзвонити.",
  invalid_phone: "Введіть коректний номер телефону.",
  do_not_call: "Цей номер є у списку «Не дзвонити» — зніміть позначку на картці контакту.",
  calls_blocked: "Дзвінки зупинені. Зверніться до підтримки.",
  number_not_yours: "Вказаний номер не належить вашому акаунту.",
  call_failed: "Не вдалося з'єднати дзвінок. Спробуйте ще раз.",
  minutes_exhausted: "Хвилини вичерпано — поповніть тариф.",
  plan_expired: "Строк тарифу вийшов — продовжіть підписку.",
  agent_in_use: "Агента тримає активний обдзвін. Спершу зупиніть його, потім видаляйте.",
  invalid_contact_ids: "Некоректний список контактів.",
  verification_required:
    "Обдзвін відкривається після підтвердження юрособи. Вхідні та тестові дзвінки працюють.",
};

export const CAMPAIGN_ERROR_MESSAGES: ErrorMessageMap = {
  agent_not_found: "Агента не знайдено.",
  agent_has_no_instructions: "Додайте агенту інструкції, щоб запустити обдзвін.",
  no_contacts: "Немає кому дзвонити: оберіть контакти для агента.",
  minutes_exhausted: "Хвилини вичерпано. Поповніть тариф, щоб запустити обдзвін.",
  plan_expired: "Строк тарифу вийшов. Продовжіть підписку, щоб запустити обдзвін.",
  calls_blocked: "Дзвінки зупинені. Зверніться до підтримки.",
  daily_limit: "Добовий ліміт вихідних дзвінків вичерпано. Спробуйте завтра.",
  verification_required:
    "Обдзвін відкривається після підтвердження юрособи. Вхідні та тестові дзвінки працюють.",
  bad_action: "Невідома дія.",
  not_found: "Обдзвін не знайдено.",
  invalid_json: "Некоректні дані запиту.",
};

export const VERIFICATION_ERROR_MESSAGES: ErrorMessageMap = {
  legal_name_required: "Вкажіть назву юрособи.",
  invalid_legal_code: "ЄДРПОУ складається з 8 цифр, ІПН з 10.",
  already_verified: "Акаунт уже підтверджено. Дані змінити не можна.",
  invalid_json: "Некоректні дані запиту.",
};

export const TEAM_ERROR_MESSAGES: ErrorMessageMap = {
  invalid_email: "Невірний формат email.",
  invalid_role: "Оберіть коректну роль.",
  already_invited: "Така пошта вже є в команді.",
  already_owner: "Це пошта власника кабінету.",
  invalid_json: "Некоректні дані запиту.",
};

export const CONTACT_ERROR_MESSAGES: ErrorMessageMap = {
  duplicate_phone: "Контакт із таким номером уже є.",
  invalid_json: "Некоректні дані запиту.",
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
  consent_source_required: "Вкажіть, звідки згода на дзвінки.",
  google_not_configured: "Інтеграція з Google тимчасово недоступна.",
  no_refresh_token: "Google не передав доступ. Підключіть інтеграцію ще раз.",
  create_failed: "Не вдалося створити таблицю. Спробуйте ще раз.",
  invalid_json: "Некоректні дані запиту.",
};

export const WEBHOOK_URL_ERROR_CODES: ReadonlySet<string> = new Set([
  "https_required",
  "port_not_allowed",
  "private_address",
  "host_not_resolved",
  "invalid_url",
]);

export const WEBHOOK_ERROR_MESSAGES: ErrorMessageMap = {
  https_required: "Адреса має починатися з https://",
  port_not_allowed: "Цей порт не підтримується. Використайте стандартний порт https.",
  private_address: "Адреса веде у внутрішню мережу. Вкажіть публічну адресу вашого сервера.",
  host_not_resolved: "Такого домену не знайдено. Перевірте написання адреси.",
  invalid_url: "Адреса вказана некоректно.",
  invalid_json: "Некоректні дані запиту.",
  nothing_to_update: "Нічого не змінено.",
  not_found: "Вебхук не знайдено. Можливо, його вже видалили.",
};

export const CRM_CREDENTIAL_ERROR_CODES: ReadonlySet<string> = new Set([
  "credentials_required",
  "invalid_url",
  "auth_failed",
  "no_access",
  "leads_disabled",
]);

export const CRM_ERROR_MESSAGES: ErrorMessageMap = {
  unknown_provider: "Невідомий тип CRM.",
  credentials_required: "Вставте ключ або адресу вебхука.",
  invalid_url: "Це не схоже на вхідний вебхук Bitrix24. Перевірте адресу.",
  auth_failed: "Ключ або вебхук не діє. Перевірте його й спробуйте ще раз.",
  no_access:
    "У цього вебхука немає прав CRM. Додайте право «CRM» у налаштуваннях вебхука й спробуйте ще раз.",
  leads_disabled: "У KeyCRM вимкнено розділ «Воронки». Увімкніть його й спробуйте ще раз.",
  invalid_push: "Оберіть, що надсилати в CRM.",
  unknown_pipeline_id: "Такої воронки немає в CRM.",
  unknown_source_id: "Такого джерела немає в CRM.",
  crm_not_configured: "CRM не підключена.",
  crm_not_connected: "CRM не підключена.",
  crm_unavailable: "CRM не відповіла. Спробуйте ще раз.",
  rate_limited: "CRM просить зачекати. Спробуйте за хвилину.",
  timeout: "CRM не відповіла вчасно. Спробуйте ще раз.",
  bad_request: "CRM відхилила запит.",
  call_in_progress: "Дзвінок ще триває. Надішлемо самі, щойно розмова закінчиться.",
  invalid_json: "Некоректні дані запиту.",
};

export const CONTACTS_IMPORT_ERROR_MESSAGES: ErrorMessageMap = {
  empty_file: "Файл порожній.",
  unreadable_file: "Не вдалося прочитати файл. Збережіть його як CSV і спробуйте ще раз.",
  no_valid_phones: "У файлі не знайдено жодного коректного номера телефону.",
  consent_source_required: "Вкажіть, звідки згода на дзвінки.",
  invalid_json: "Некоректні дані запиту.",
};

export const CONTACTS_EXPORT_ERROR_MESSAGES: ErrorMessageMap = {
  export_failed: "Не вдалося сформувати експорт. Спробуйте ще раз.",
};

export const resolveErrorMessage = (code: string, domainMap?: ErrorMessageMap): string => {
  return domainMap?.[code] ?? "Щось пішло не так.";
};
