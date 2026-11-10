import type { DeliveryStatus, TestWebhookResponse } from "@dashboard/types";

type DeliveryBadgeVariant = "success" | "warning" | "destructive" | "secondary";

interface DeliveryStatusConfig {
  label: string;
  variant: DeliveryBadgeVariant;
}

export const DELIVERY_STATUS_CONFIG: Record<DeliveryStatus, DeliveryStatusConfig> = {
  delivered: { label: "Доставлено", variant: "success" },
  pending: { label: "В черзі", variant: "warning" },
  failed: { label: "Помилка", variant: "destructive" },
  cancelled: { label: "Скасовано", variant: "secondary" },
};

export interface TestResultMessage {
  tone: "success" | "destructive";
  title: string;
  description: string | null;
}

export const describeTestResult = ({
  ok,
  response_code: responseCode,
  error,
}: TestWebhookResponse): TestResultMessage => {
  if (ok) {
    return {
      tone: "success",
      title: `Тест успішний: сервер відповів ${responseCode}`,
      description: null,
    };
  }

  if (typeof responseCode !== "number") {
    return {
      tone: "destructive",
      title: "Не вдалося достукатись до сервера",
      description: error ?? null,
    };
  }

  return {
    tone: "destructive",
    title: `Сервер відповів помилкою ${responseCode}`,
    description: error ?? null,
  };
};
