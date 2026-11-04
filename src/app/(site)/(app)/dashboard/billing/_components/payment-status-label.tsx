import { cn } from "@/lib/utils";
import type { BillingState } from "@dashboard/types";

interface PaymentStatusLabelProps {
  state: BillingState;
}

const STATE_LABELS: Record<BillingState, string> = {
  paid: "Оплачено",
  pending: "В обробці",
  failed: "Не пройшов",
  refunded: "Повернено",
};

const STATE_STYLES: Record<BillingState, string> = {
  paid: "text-success",
  pending: "text-warning",
  failed: "text-destructive",
  refunded: "text-muted-foreground",
};

export const PaymentStatusLabel = ({ state }: PaymentStatusLabelProps) => (
  <span className={cn("text-xs font-medium", STATE_STYLES[state])}>{STATE_LABELS[state]}</span>
);
