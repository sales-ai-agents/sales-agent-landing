import type { IconBadge, NavLink } from "@/types";
import { Clock, Globe, Link2, Lock, PhoneCall, Shield } from "lucide-react";

// --- Navigation ---

export const NAV_LINKS: readonly NavLink[] = [
  { href: "#features", label: "Продукт" },
  { href: "#pricing", label: "Тарифи" },
] as const;

// --- Hero Section ---

export const HERO_BADGES: readonly IconBadge[] = [
  { icon: Clock, label: "Запуск за 1 день" },
  { icon: Link2, label: "Інтеграція з CRM" },
  { icon: PhoneCall, label: "Дзвінки 24/7" },
] as const;

// --- Builder Section ---

export const BUILDER_CHECKLIST = [
  "Голос: жіночий або чоловічий",
  "Інструкція звичайною мовою",
  "Готові шаблони під вашу нішу",
  "Миттєва інтеграція з CRM",
  "Тестовий дзвінок перед запуском",
] as const;

// --- Handoff Section ---

export const HANDOFF_CHECKLIST = [
  "Розпізнає нестандартні запити",
  "Реагує на прохання поговорити з людиною",
  "Передає менеджеру дзвінок і короткий підсумок",
] as const;

// --- Trust Section ---

export const COMPLIANCE_INDICATORS: readonly IconBadge[] = [
  { icon: Lock, label: "GDPR Compliant" },
  { icon: Shield, label: "End-to-End Шифрування" },
  { icon: Globe, label: "Сервери зберігання в ЄС" },
] as const;
