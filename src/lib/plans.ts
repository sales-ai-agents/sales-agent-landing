export type PlanId = "starter" | "pro" | "business" | "enterprise";

export interface Plan {
  readonly id: PlanId;
  readonly name: string;
  readonly price: string;
  readonly period: string;
  readonly calls: string;
  readonly features: readonly string[];
  readonly highlighted?: boolean;
  readonly tier: "basic" | "popular" | "premium" | "enterprise";
}

export const PLANS: readonly Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$19",
    period: "/місяць",
    calls: "500 дзвінків",
    tier: "basic",
    features: ["1 AI-агент", "Базова аналітика", "Email підтримка"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    period: "/місяць",
    calls: "2 000 дзвінків",
    highlighted: true,
    tier: "popular",
    features: ["5 AI-агентів", "Розширена аналітика", "Пріоритетна підтримка", "CRM інтеграція"],
  },
  {
    id: "business",
    name: "Business",
    price: "$99",
    period: "/місяць",
    calls: "5 000 дзвінків",
    tier: "premium",
    features: [
      "Необмежено агентів",
      "Повна аналітика",
      "Виділений менеджер",
      "CRM + API доступ",
      "Пріоритетна черга",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    calls: "Необмежено",
    tier: "enterprise",
    features: [
      "Все з Business",
      "SLA гарантія",
      "On-premise опція",
      "Індивідуальна інтеграція",
      "Виділена інфраструктура",
    ],
  },
] as const;
