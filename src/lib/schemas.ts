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

export const createAgentBaseSchema = z.object({
  name: z.string().min(1, "Назва агента обов'язкова"),
  voice: z.string().min(1, "Оберіть голос"),
  // BE not ready: no agent field for call direction, contact base, schedule or number.
  callDirection: z.enum(CALL_DIRECTIONS),
  contactBase: z.string(),
  scheduleStart: z.string(),
  scheduleEnd: z.string(),
  workingDays: z.array(z.enum(WEEKDAYS)),
  callsPerDay: z.number(),
  phoneNumber: z.string(),
  instructions: z
    .string()
    .min(1, "Інструкції обов'язкові")
    .max(INSTRUCTIONS_MAX_LENGTH, `Максимум ${INSTRUCTIONS_MAX_LENGTH} символів`),
  testPhone: z.string(),
});

export const contactBaseIsProvided = (data: {
  callDirection?: CallDirection;
  contactBase?: string;
}): boolean => data.callDirection === "inbound" || Boolean(data.contactBase);

export const createAgentSchema = createAgentBaseSchema.refine(contactBaseIsProvided, {
  path: ["contactBase"],
  message: "Оберіть базу контактів",
});

export type CreateAgentFormData = z.infer<typeof createAgentBaseSchema>;

export const editAgentBaseSchema = z.object({
  name: z.string().min(1, "Назва агента обов'язкова"),
  voice: z.string().min(1, "Оберіть голос"),
  // BE not ready: no agent field for call direction, contact base, schedule or number.
  callDirection: z.enum(CALL_DIRECTIONS),
  contactBase: z.string(),
  scheduleStart: z.string(),
  scheduleEnd: z.string(),
  workingDays: z.array(z.enum(WEEKDAYS)),
  callsPerDay: z.number(),
  connectedNumber: z.string(),
  instructions: z
    .string()
    .min(1, "Інструкції обов'язкові")
    .max(INSTRUCTIONS_MAX_LENGTH, `Максимум ${INSTRUCTIONS_MAX_LENGTH} символів`),
});

export const editAgentSchema = editAgentBaseSchema.refine(contactBaseIsProvided, {
  path: ["contactBase"],
  message: "Оберіть базу контактів",
});

export type EditAgentFormData = z.infer<typeof editAgentBaseSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Ім'я обов'язкове"),
  phone: z.string().min(7, "Введіть коректний номер телефону"),
  email: z.email("Введіть коректну електронну адресу").or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactSchema>;
