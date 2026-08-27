import type { ConsentStatus } from "@dashboard/types";

interface TagColor {
  bg: string;
  text: string;
}

const TAG_COLORS: Record<string, TagColor> = {
  VIP: { bg: "bg-orange-100", text: "text-orange-600" },
  Новий: { bg: "bg-green-100", text: "text-green-700" },
  "Прострочена оплата": { bg: "bg-red-100", text: "text-red-600" },
  "Постійний клієнт": { bg: "bg-blue-100", text: "text-blue-600" },
};

const DEFAULT_TAG_COLOR: TagColor = { bg: "bg-gray-100", text: "text-gray-700" };

export function getTagColor(tag: string): TagColor {
  return TAG_COLORS[tag] ?? DEFAULT_TAG_COLOR;
}

interface ConsentDisplay {
  label: string;
  color: string;
  dot: string;
}

export function formatConsentLabel(consent: ConsentStatus): ConsentDisplay {
  switch (consent) {
    case "granted":
      return { label: "Згода отримана", color: "text-green-600", dot: "bg-green-500" };
    case "pending":
      return { label: "Очікує", color: "text-orange-500", dot: "bg-orange-400" };
    default:
      return { label: "—", color: "text-muted-foreground", dot: "bg-gray-300" };
  }
}

export function formatLastCallResult(result: string | null): string {
  if (!result) return "";
  switch (result) {
    case "meeting":
      return "Ціль досягнута";
    case "не_відповів":
      return "Не вдалося зв'язатися";
    case "відмова":
    case "не_цікаво":
      return "Відмова";
    case "передзвонити":
      return "Передзвонити";
    default:
      return result;
  }
}
