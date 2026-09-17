import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Введіть коректну електронну адресу"),
  password: z.string().min(8, "Пароль має містити щонайменше 8 символів"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: z.string().min(2, "Ім'я має містити щонайменше 2 символи"),
  email: z.email("Введіть коректну електронну адресу"),
  password: z
    .string()
    .min(8, "Пароль має містити щонайменше 8 символів")
    .regex(/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Має містити цифру або спецсимвол")
    .regex(/[A-ZА-ЯІЇЄҐ]/, "Має містити велику літеру"),
  termsAccepted: z
    .boolean()
    .refine((value) => value, "Щоб продовжити, підтвердіть згоду з умовами"),
  marketingConsent: z.boolean(),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const INSTRUCTIONS_MAX_LENGTH = 4000;

export const CALL_DIRECTIONS = ["inbound", "outbound"] as const;
export type CallDirection = (typeof CALL_DIRECTIONS)[number];

export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export const ALL_WEEKDAYS: Weekday[] = [...WEEKDAYS];

export const CALLS_PER_DAY_OPTIONS = [10, 20, 50, 100, 200] as const;

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: "Пн",
  tue: "Вт",
  wed: "Ср",
  thu: "Чт",
  fri: "Пт",
  sat: "Сб",
  sun: "Нд",
};

export const DEFAULT_SCHEDULE_START = "09:00";
export const DEFAULT_SCHEDULE_END = "18:00";

export const DEFAULT_NUMBER_ID = 0;

export interface CallDirectionOption {
  value: CallDirection;
  title: string;
  description: string;
}

export const CALL_DIRECTION_OPTIONS: CallDirectionOption[] = [
  {
    value: "inbound",
    title: "Вхідні дзвінки",
    description: "Агент приймає дзвінки від ваших клієнтів.",
  },
  {
    value: "outbound",
    title: "Вихідні дзвінки",
    description: "Агент телефонує по вашій базі контактів.",
  },
];

const agentConfigShape = {
  name: z.string().min(1, "Назва агента обов'язкова"),
  voice: z.string().min(1, "Оберіть голос"),
  callDirection: z.enum(CALL_DIRECTIONS),
  contactIds: z.array(z.number()),
  scheduleStart: z.string(),
  scheduleEnd: z.string(),
  workingDays: z.array(z.enum(WEEKDAYS)),
  callsPerDay: z.number(),
  numberId: z.number(),
  instructions: z
    .string()
    .min(1, "Інструкції обов'язкові")
    .max(INSTRUCTIONS_MAX_LENGTH, `Максимум ${INSTRUCTIONS_MAX_LENGTH} символів`),
};

export const contactSelectionIsValid = (data: {
  callDirection?: CallDirection;
  contactIds?: number[];
}): boolean => data.callDirection === "inbound" || (data.contactIds?.length ?? 0) > 0;

const isWeekday = (value: string): value is Weekday =>
  (WEEKDAYS as readonly string[]).includes(value);

export const parseWorkingDays = (value: string): Weekday[] =>
  value
    .split(",")
    .map((day) => day.trim())
    .filter(isWeekday);

export const createAgentBaseSchema = z.object({
  ...agentConfigShape,
  testPhone: z.string(),
});

export const createAgentSchema = createAgentBaseSchema.refine(contactSelectionIsValid, {
  path: ["contactIds"],
  message: "Оберіть щонайменше один контакт",
});

export type CreateAgentFormData = z.infer<typeof createAgentBaseSchema>;

export const editAgentBaseSchema = z.object(agentConfigShape);

export const editAgentSchema = editAgentBaseSchema.refine(contactSelectionIsValid, {
  path: ["contactIds"],
  message: "Оберіть щонайменше один контакт",
});

export type EditAgentFormData = z.infer<typeof editAgentBaseSchema>;

export interface AgentApiPayload {
  name: string;
  voice: string;
  instructions: string;
  call_direction: CallDirection;
  contact_ids: number[];
  schedule_start: string;
  schedule_end: string;
  working_days: Weekday[];
  calls_per_day: number;
  number_id: number;
}

export const toAgentApiPayload = (
  data: CreateAgentFormData | EditAgentFormData
): AgentApiPayload => {
  const isOutbound = data.callDirection === "outbound";

  return {
    name: data.name,
    voice: data.voice,
    instructions: data.instructions,
    call_direction: data.callDirection,
    contact_ids: isOutbound ? data.contactIds : [],
    schedule_start: data.scheduleStart,
    schedule_end: data.scheduleEnd,
    working_days: data.workingDays,
    calls_per_day: data.callsPerDay,
    number_id: data.numberId,
  };
};

export const contactSchema = z.object({
  name: z.string().min(2, "Ім'я обов'язкове"),
  phone: z.string().min(7, "Введіть коректний номер телефону"),
  email: z.email("Введіть коректну електронну адресу").or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const FEEDBACK_MESSAGE_MAX_LENGTH = 1000;

export const feedbackSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, "Опишіть детальніше, щонайменше 10 символів")
    .max(FEEDBACK_MESSAGE_MAX_LENGTH, `Максимум ${FEEDBACK_MESSAGE_MAX_LENGTH} символів`),
  email: z.email("Введіть коректну електронну адресу"),
  marketingConsent: z
    .boolean()
    .refine((value) => value, "Щоб продовжити, підтвердіть згоду на отримання повідомлень"),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;

export const LEAD_FIELD_MAX_LENGTH = 500;
export const UA_SUBSCRIBER_DIGITS = 9;

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Введіть ім'я")
    .max(LEAD_FIELD_MAX_LENGTH, `Максимум ${LEAD_FIELD_MAX_LENGTH} символів`),
  phone: z
    .string()
    .length(UA_SUBSCRIBER_DIGITS, "Введіть коректний номер телефону")
    .regex(/^\d+$/, "Введіть коректний номер телефону"),
  niche: z.string().trim().max(LEAD_FIELD_MAX_LENGTH).optional(),
  contact: z.string().trim().max(LEAD_FIELD_MAX_LENGTH).optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;
