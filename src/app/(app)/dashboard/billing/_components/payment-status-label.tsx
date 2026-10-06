import { isFailedPaymentStatus } from "@dashboard/payment-status";
import type { PaymentStatus } from "@dashboard/types";

interface PaymentStatusLabelProps {
  status: PaymentStatus;
  paid: boolean;
}

export const PaymentStatusLabel = ({ status, paid }: PaymentStatusLabelProps) => {
  if (paid) {
    return <span className="text-success text-xs font-medium">Оплачено</span>;
  }

  if (isFailedPaymentStatus(status)) {
    return <span className="text-destructive text-xs font-medium">Не пройшов</span>;
  }

  return <span className="text-warning text-xs font-medium">В обробці</span>;
};
