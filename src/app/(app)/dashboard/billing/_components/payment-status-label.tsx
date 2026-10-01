import type { PaymentStatus, PaymentHistoryStatus } from "@dashboard/types";

export const PaymentStatusLabel = ({
  status,
}: {
  status: PaymentStatus | PaymentHistoryStatus;
}) => {
  switch (status) {
    case "success":
      return <span className="text-success text-xs font-medium">Оплачено</span>;
    case "processing":
    case "hold":
    case "created":
      return <span className="text-warning text-xs font-medium">В процесі</span>;
    case "reversed":
      return <span className="text-primary text-xs font-medium">Повернено</span>;
    case "expired":
      return <span className="text-muted-foreground text-xs font-medium">Термін минув</span>;
    case "failure":
      return <span className="text-destructive text-xs font-medium">Невдалий</span>;
    default:
      return <span className="text-destructive text-xs font-medium">Невдалий</span>;
  }
};
