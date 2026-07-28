import { Play, RefreshCw } from "lucide-react";

const callLogs = [
  {
    id: "1",
    customer: "Олена К.",
    time: "10:24",
    status: "Підтверджено",
    statusVariant: "green" as const,
    summary: "Буде завтра о 14:00",
    duration: "1:02",
    crm: "Оновлено",
    crmSynced: true,
  },
  {
    id: "2",
    customer: "Ігор М.",
    time: "10:31",
    status: "Перенесено",
    statusVariant: "yellow" as const,
    summary: "Пʼятниця, 17:30",
    duration: "1:45",
    crm: "Оновлено",
    crmSynced: true,
  },
  {
    id: "3",
    customer: "Світлана Т.",
    time: "10:38",
    status: "Не відповіла",
    statusVariant: "red" as const,
    summary: "Повторний дзвінок заплановано",
    duration: "0:15",
    crm: "Очікує",
    crmSynced: false,
  },
  {
    id: "4",
    customer: "Андрій В.",
    time: "10:45",
    status: "Нова заявка",
    statusVariant: "green" as const,
    summary: "Хоче запис на ТО в суботу",
    duration: "2:55",
    crm: "Оновлено",
    crmSynced: true,
  },
] as const;

const statusStyles = {
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
} as const;

export function CallLogsSection() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="mb-10 text-center">
          <h2 className="font-display mb-4 text-3xl leading-tight sm:text-4xl md:text-5xl">
            <span className="text-primary">Повний контроль</span>{" "}
            <span className="text-foreground">після кожного дзвінка</span>
          </h2>
          <p className="text-foreground mx-auto max-w-lg text-base md:text-lg">
            Бачите статус дзвінка, короткий підсумок розмови, запис і результат синхронізації з CRM.
          </p>
        </div>

        <div
          className="bg-primary/30 pointer-events-none absolute -top-10 -right-20 size-72 rounded-full blur-3xl"
          aria-hidden="true"
        />

        <div className="border-border relative overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-2xl text-left text-base">
              <caption className="text-foreground px-6 pt-6 pb-4 text-left text-lg font-semibold">
                Журнал дзвінків · Сьогодні
              </caption>
              <thead>
                <tr className="border-border text-foreground border-b text-sm">
                  <th className="px-6 py-3 font-normal">Клієнт</th>
                  <th className="px-6 py-3 font-normal">Статус</th>
                  <th className="px-6 py-3 font-normal">Підсумок дзвінка</th>
                  <th className="px-6 py-3 font-normal">Аудіо</th>
                  <th className="px-6 py-3 font-normal">CRM</th>
                </tr>
              </thead>
              <tbody>
                {callLogs.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 last:border-0">
                    <td className="text-foreground px-6 py-4 whitespace-nowrap">
                      {row.customer} <span className="text-foreground font-light">{row.time}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-0.5 text-sm font-medium ${statusStyles[row.statusVariant]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="text-foreground px-6 py-4">{row.summary}</td>
                    <td className="text-foreground px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <Play className="text-foreground size-3.5" aria-hidden="true" />
                        {row.duration}
                      </span>
                    </td>
                    <td className="text-foreground px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <RefreshCw className="text-foreground size-3.5" aria-hidden="true" />
                        {row.crm}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
