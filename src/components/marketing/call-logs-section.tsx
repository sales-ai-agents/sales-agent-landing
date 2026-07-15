import { Play, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "secondary" | "warning" | "default";

const badgeStyles: Record<BadgeVariant, string> = {
  success: "bg-badge-success text-green-800",
  secondary: "bg-badge-secondary text-text-secondary",
  warning: "bg-badge-warning text-yellow-800",
  default: "bg-badge-warning text-yellow-800",
};

const mockLogs = [
  {
    id: "1",
    customer: "Олена К.",
    time: "10:24",
    status: "Підтверджено",
    statusVariant: "success" as BadgeVariant,
    summary: "Буде завтра о 14:00",
    duration: "1:02",
    crm: "Оновлено",
  },
  {
    id: "2",
    customer: "Ігор М.",
    time: "10:31",
    status: "Перенесено",
    statusVariant: "secondary" as BadgeVariant,
    summary: "Пʼятниця, 17:30",
    duration: "1:45",
    crm: "Оновлено",
  },
  {
    id: "3",
    customer: "Світлана Т.",
    time: "10:38",
    status: "Не відповіла",
    statusVariant: "warning" as BadgeVariant,
    summary: "Повторний дзвінок заплановано",
    duration: "0:15",
    crm: "Очікує",
  },
  {
    id: "4",
    customer: "Андрій В.",
    time: "10:45",
    status: "Нова заявка",
    statusVariant: "default" as BadgeVariant,
    summary: "Хоче запис на ТО в суботу",
    duration: "2:55",
    crm: "Оновлено",
  },
];

export function CallLogsSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Section header */}
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-4xl leading-tight md:text-5xl">
            <span className="font-semibold">Повний контроль</span>{" "}
            <span className="font-light">після кожного дзвінка</span>
          </h2>
          <p className="mx-auto max-w-md text-lg leading-snug tracking-wide">
            Бачите статус дзвінка, короткий підсумок розмови, запис і результат
            синхронізації з CRM.
          </p>
        </div>

        {/* Table card */}
        <div className="w-full overflow-hidden rounded-2xl border border-border bg-white shadow-card">
            {/* Title row */}
            <div className="border-b border-border px-6 py-6 md:px-14">
              <h3 className="text-lg font-semibold tracking-wide">
                Журнал дзвінків · Сьогодні
              </h3>
            </div>

            {/* Column headers */}
            <div className="hidden grid-cols-12 items-center border-b border-border px-6 py-3 md:grid md:px-14">
              <div className="col-span-2 text-lg font-normal tracking-wide">
                Клієнт
              </div>
              <div className="col-span-2 text-lg font-normal tracking-wide">
                Статус
              </div>
              <div className="col-span-4 text-lg font-normal tracking-wide">
                Підсумок дзвінка
              </div>
              <div className="col-span-2 text-lg font-normal tracking-wide">
                Аудіо
              </div>
              <div className="col-span-2 text-lg font-normal tracking-wide">
                CRM
              </div>
            </div>

            {/* Data rows */}
            {mockLogs.map((log, index) => (
              <div
                key={log.id}
                className={cn(
                  "flex flex-col gap-2 px-6 py-3 md:grid md:grid-cols-12 md:items-center md:px-14",
                  index < mockLogs.length - 1 && "border-b border-border"
                )}
              >
                {/* Client name + time */}
                <div className="col-span-2 text-lg tracking-wide">
                  <span className="font-normal">{log.customer} </span>
                  <span className="font-light">{log.time}</span>
                </div>

                {/* Status badge */}
                <div className="col-span-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-base font-normal tracking-wide",
                      badgeStyles[log.statusVariant]
                    )}
                  >
                    {log.status}
                  </span>
                </div>

                {/* Call summary */}
                <div className="col-span-4 text-base font-normal tracking-wide">
                  {log.summary}
                </div>

                {/* Audio */}
                <div className="col-span-2 flex items-center gap-2">
                  <Play className="size-3 text-text-secondary" aria-hidden="true" />
                  <span className="text-base font-normal tracking-wide">
                    {log.duration}
                  </span>
                </div>

                {/* CRM */}
                <div className="col-span-2 flex items-center gap-2">
                  <RefreshCw className="size-3 text-text-secondary" aria-hidden="true" />
                  <span className="text-base font-normal tracking-wide">
                    {log.crm}
                  </span>
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}
