import Image from "next/image";
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
    statusVariant: "success" as BadgeVariant,
    summary: "Хоче запис на ТО в суботу",
    duration: "2:55",
    crm: "Оновлено",
  },
];

export function CallLogsSection() {
  return (
    <section className="relative py-20">
      {/* Decorative background circle */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/image/builder-circle.jpg"
          alt=""
          width={400}
          height={400}
          className="absolute top-1/4 right-0 size-72 rounded-full opacity-40 blur-xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Section header */}
        <div className="mb-10 text-center">
          <h2 className="font-display mb-4 text-4xl font-bold md:text-5xl">
            <span className="text-primary">Повний контроль</span> після кожного дзвінка
          </h2>
          <p className="text-text-secondary mx-auto max-w-md text-lg">
            Бачите статус дзвінка, короткий підсумок розмови, запис і результат синхронізації з CRM.
          </p>
        </div>

        {/* Table card */}
        <div className="rounded-card border-border-table w-full overflow-x-auto border-2 bg-white">
          <table className="w-full min-w-full">
            {/* Title */}
            <caption className="border-border-table text-text-primary border-b px-6 py-5 text-left text-lg font-semibold">
              Журнал дзвінків · Сьогодні
            </caption>

            {/* Column headers */}
            <thead>
              <tr className="border-border-table border-b">
                <th className="text-text-primary w-2/12 px-6 py-3 text-left text-base font-normal">
                  Клієнт
                </th>
                <th className="text-text-primary w-2/12 px-4 py-3 text-left text-base font-normal">
                  Статус
                </th>
                <th className="text-text-primary w-4/12 px-4 py-3 text-left text-base font-normal">
                  Підсумок дзвінка
                </th>
                <th className="text-text-primary w-2/12 px-4 py-3 text-left text-base font-normal">
                  Аудіо
                </th>
                <th className="text-text-primary w-2/12 px-4 py-3 text-left text-base font-normal">
                  CRM
                </th>
              </tr>
            </thead>

            {/* Data rows */}
            <tbody>
              {mockLogs.map((log, index) => (
                <tr
                  key={log.id}
                  className={cn(index < mockLogs.length - 1 && "border-border-table border-b")}
                >
                  {/* Client */}
                  <td className="text-text-primary px-6 py-4 text-base">
                    <span className="font-normal">{log.customer}</span>{" "}
                    <span className="text-text-secondary font-light">{log.time}</span>
                  </td>

                  {/* Status badge */}
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
                        badgeStyles[log.statusVariant]
                      )}
                    >
                      {log.status}
                    </span>
                  </td>

                  {/* Summary */}
                  <td className="text-text-primary px-4 py-4 text-base font-normal">
                    {log.summary}
                  </td>

                  {/* Audio */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Play className="text-text-secondary size-3.5" aria-hidden="true" />
                      <span className="text-text-primary text-base font-normal">
                        {log.duration}
                      </span>
                    </div>
                  </td>

                  {/* CRM */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="text-text-secondary size-3.5" aria-hidden="true" />
                      <span className="text-text-primary text-base font-normal">{log.crm}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
