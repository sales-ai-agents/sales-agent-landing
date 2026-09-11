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
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const INSTRUCTIONS_MAX_LENGTH = 2000;

export const CALL_DIRECTIONS = ["inbound", "outbound"] as const;
export type CallDirection = (typeof CALL_DIRECTIONS)[number];

export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

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

export const UNSET_CONTACT_BASE_ID = -1;
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
  contactBaseId: z.number(),
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

export const contactBaseIsProvided = (data: {
  callDirection?: CallDirection;
  contactBaseId?: number;
}): boolean =>
  data.callDirection === "inbound" || (data.contactBaseId ?? UNSET_CONTACT_BASE_ID) >= 0;

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

export const createAgentSchema = createAgentBaseSchema.refine(contactBaseIsProvided, {
  path: ["contactBaseId"],
  message: "Оберіть базу контактів",
});

export type CreateAgentFormData = z.infer<typeof createAgentBaseSchema>;

export const editAgentBaseSchema = z.object(agentConfigShape);

export const editAgentSchema = editAgentBaseSchema.refine(contactBaseIsProvided, {
  path: ["contactBaseId"],
  message: "Оберіть базу контактів",
});

export type EditAgentFormData = z.infer<typeof editAgentBaseSchema>;

export interface AgentApiPayload {
  name: string;
  voice: string;
  instructions: string;
  call_direction: CallDirection;
  contact_base_id?: number;
  schedule_start: string;
  schedule_end: string;
  working_days: Weekday[];
  calls_per_day: number;
  number_id: number;
}

export const toAgentApiPayload = (
  data: CreateAgentFormData | EditAgentFormData
): AgentApiPayload => {
  const payload: AgentApiPayload = {
    name: data.name,
    voice: data.voice,
    instructions: data.instructions,
    call_direction: data.callDirection,
    schedule_start: data.scheduleStart,
    schedule_end: data.scheduleEnd,
    working_days: data.workingDays,
    calls_per_day: data.callsPerDay,
    number_id: data.numberId,
  };

  if (data.callDirection === "outbound" && data.contactBaseId >= 0) {
    payload.contact_base_id = data.contactBaseId;
  }

  return payload;
};

export const contactSchema = z.object({
  name: z.string().min(2, "Ім'я обов'язкове"),
  phone: z.string().min(7, "Введіть коректний номер телефону"),
  email: z.email("Введіть коректну електронну адресу").or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactSchema>;
