import type { ConsentStatus } from "@dashboard/types";

export { getTagColor, type TagColor } from "@/app/(app)/_lib/tag-colors";

interface ConsentDisplay {
  label: string;
  color: string;
  dot: string;
}

export const formatConsentLabel = (consent: ConsentStatus): ConsentDisplay => {
  switch (consent) {
    case "granted":
      return { label: "Згода отримана", color: "text-success", dot: "bg-success" };
    case "pending":
      return { label: "Очікує", color: "text-warning", dot: "bg-warning" };
    default:
      return { label: "—", color: "text-muted-foreground", dot: "bg-muted" };
  }
};

export const formatLastCallResult = (result: string | null): string => {
  if (!result) return "";
  switch (result) {
    case "зустріч":
      return "Ціль досягнута";
    case "не відповів":
    case "немає часу":
    case "скинув":
    case "погано чути":
    case "не дійшли до людини":
      return "Не вдалося зв'язатися";
    case "відмова":
    case "не цікаво":
      return "Відмова";
    case "передзвонити":
      return "Передзвонити";
    default:
      return result;
  }
};
