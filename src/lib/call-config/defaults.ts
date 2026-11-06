import type { CallField, CallFieldType, CallTypeConfig, CallTypeId } from "./schema";

export interface CallTypeDefinition {
  id: CallTypeId;
  title: string;
  description: string;
  defaults: CallTypeConfig;
}

export const CALL_FIELD_TYPE_LABELS: Record<CallFieldType, string> = {
  text: "Текст",
  longText: "Довгий текст",
  phone: "Телефон",
  dateTime: "Дата і час",
};

const defaultField = (
  id: string,
  label: string,
  type: CallFieldType,
  required: boolean
): CallField => ({ id, label, type, required });

const BOOKING_DEFAULTS: CallTypeConfig = {
  instructions:
    "Ти - помічник, який приймає запити на бронювання. Привітайся, з'ясуй ім'я клієнта, бажані дату й час та мету візиту. Підтверди номер телефону для зв'язку. Говори коротко, дружньо та ввічливо. Наприкінці повтори зібрані дані й подякуй.",
  fields: [
    defaultField("booking-date-time", "Дата і час", "dateTime", true),
    defaultField("booking-phone", "Номер телефону абонента", "phone", true),
    defaultField("booking-name", "Ім'я", "text", true),
    defaultField("booking-purpose", "Завдання / мета", "text", true),
    defaultField("booking-notes", "Додаткова інформація", "longText", false),
  ],
};

const SUPPORT_DEFAULTS: CallTypeConfig = {
  instructions:
    "Ти - агент підтримки клієнтів. Уважно вислухай проблему, уточни ім'я та контактний номер, постав кілька коротких уточнювальних запитань. Не обіцяй того, чого не можеш гарантувати. Наприкінці коротко підсумуй звернення та поясни наступні кроки.",
  fields: [
    defaultField("support-name", "Ім'я", "text", true),
    defaultField("support-phone", "Номер телефону абонента", "phone", true),
    defaultField("support-issue", "Суть звернення", "longText", true),
    defaultField("support-order", "Номер замовлення", "text", false),
    defaultField("support-notes", "Додаткова інформація", "longText", false),
  ],
};

const SALES_DEFAULTS: CallTypeConfig = {
  instructions:
    "Ти - менеджер з продажів. Представся, коротко поясни мету дзвінка та дізнайся, що саме цікавить клієнта. Став відкриті запитання, не тисни. Якщо клієнт зацікавлений - домовся про зручний час для наступного контакту.",
  fields: [
    defaultField("sales-name", "Ім'я", "text", true),
    defaultField("sales-phone", "Номер телефону абонента", "phone", true),
    defaultField("sales-interest", "Що цікавить клієнта", "text", true),
    defaultField("sales-budget", "Орієнтовний бюджет", "text", false),
    defaultField("sales-callback", "Зручний час для зв'язку", "dateTime", false),
    defaultField("sales-notes", "Додаткова інформація", "longText", false),
  ],
};

export const CALL_TYPES: readonly CallTypeDefinition[] = [
  {
    id: "booking",
    title: "Бронювання",
    description: "Запис клієнта на зустріч або послугу",
    defaults: BOOKING_DEFAULTS,
  },
  {
    id: "support",
    title: "Підтримка",
    description: "Прийом звернень та вирішення питань",
    defaults: SUPPORT_DEFAULTS,
  },
  {
    id: "sales",
    title: "Продажі",
    description: "Кваліфікація лідів та пошук інтересу",
    defaults: SALES_DEFAULTS,
  },
];

export const DEFAULT_CALL_TYPE_ID: CallTypeId = "booking";

export const getCallTypeDefinition = (id: CallTypeId): CallTypeDefinition =>
  CALL_TYPES.find((callType) => callType.id === id) ?? CALL_TYPES[0];
