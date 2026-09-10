import type { PaymentStatus, PaymentHistoryStatus } from "@dashboard/types";

export const PaymentStatusLabel = ({
  status,
}: {
  status: PaymentStatus | PaymentHistoryStatus;
}) => {
  switch (status) {
    case "success":
      return <span className="text-xs font-medium text-green-600">Оплачено</span>;
    case "processing":
    case "hold":
    case "created":
      return <span className="text-xs font-medium text-amber-600">В процесі</span>;
    case "reversed":
      return <span className="text-xs font-medium text-blue-600">Повернено</span>;
    case "expired":
      return <span className="text-muted-foreground text-xs font-medium">Термін минув</span>;
    case "failure":
      return <span className="text-xs font-medium text-red-600">Невдалий</span>;
    default:
      return <span className="text-xs font-medium text-red-600">Невдалий</span>;
  }
};
