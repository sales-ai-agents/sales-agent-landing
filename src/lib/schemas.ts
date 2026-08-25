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

export const createAgentSchema = z.object({
  name: z.string().min(1, "Назва агента обов'язкова"),
  voice: z.string().min(1, "Оберіть голос"),
  instructions: z.string().min(1, "Інструкції обов'язкові"),
  testPhone: z.string(),
});

export type CreateAgentFormData = z.infer<typeof createAgentSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Ім'я обов'язкове"),
  phone: z.string().min(7, "Введіть коректний номер телефону"),
  email: z.email("Введіть коректну електронну адресу").or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactSchema>;
