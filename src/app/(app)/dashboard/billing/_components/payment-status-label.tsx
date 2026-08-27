export function PaymentStatusLabel({ status }: { status: string }) {
  switch (status) {
    case "success":
      return <span className="text-xs font-medium text-green-600">Оплачено</span>;
    case "processing":
    case "hold":
    case "created":
      return <span className="text-xs font-medium text-amber-600">В процесі</span>;
    default:
      return <span className="text-xs font-medium text-red-600">Невдалий</span>;
  }
}
