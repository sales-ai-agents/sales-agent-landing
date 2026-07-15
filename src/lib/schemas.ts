import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email").or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const agentStepNameSchema = z.object({
  name: z.string().min(2, "Agent name must be at least 2 characters"),
});

export const agentStepVoiceSchema = z.object({
  voice: z.string().min(1, "Please select a voice"),
});

export const agentStepInstructionsSchema = z.object({
  instructions: z.string().min(10, "Instructions must be at least 10 characters"),
});

export const agentStepTestSchema = z.object({
  testPhone: z.string().optional(),
});

export type AgentNameFormData = z.infer<typeof agentStepNameSchema>;
export type AgentVoiceFormData = z.infer<typeof agentStepVoiceSchema>;
export type AgentInstructionsFormData = z.infer<typeof agentStepInstructionsSchema>;
export type AgentTestFormData = z.infer<typeof agentStepTestSchema>;
