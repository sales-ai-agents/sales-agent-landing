import { Play, RefreshCw } from "lucide-react";

const callLogs = [
  {
    id: "1",
    customer: "Олена К.",
    time: "10:24",
    status: "Підтверджено",
    statusColor: "bg-green-100 text-green-800",
    summary: "Буде завтра о 14:00",
    duration: "1:02",
    crm: "Оновлено",
  },
  {
    id: "2",
    customer: "Ігор М.",
    time: "10:31",
    status: "Перенесено",
    statusColor: "bg-yellow-100 text-yellow-800",
    summary: "Пʼятниця, 17:30",
    duration: "1:45",
    crm: "Оновлено",
  },
  {
    id: "3",
    customer: "Світлана Т.",
    time: "10:38",
    status: "Не відповіла",
    statusColor: "bg-red-100 text-red-800",
    summary: "Повторний дзвінок заплановано",
    duration: "0:15",
    crm: "Очікує",
  },
  {
    id: "4",
    customer: "Андрій В.",
    time: "10:45",
    status: "Нова заявка",
    statusColor: "bg-green-100 text-green-800",
    summary: "Хоче запис на ТО в суботу",
    duration: "2:55",
    crm: "Оновлено",
  },
] as const;

export function CallLogsSection() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="relative mx-auto max-w-5xl px-6">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="mb-4 font-display text-3xl sm:text-4xl md:text-5xl">
            <span className="text-primary">Повний контроль</span> <br />
            <span className="text-black">після кожного дзвінка</span>
          </h2>
          <p className="mx-auto max-w-lg text-base text-black md:text-lg">
            Бачите статус дзвінка, короткий підсумок розмови, запис і
            результат синхронізації з CRM.
          </p>
        </div>

        {/* Decorative blue glow — behind the table card */}
        <div
          className="pointer-events-none absolute -right-20 -top-10 size-72 rounded-full bg-primary/30 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm">

          <div className="overflow-x-auto">
            <table className="w-full min-w-175 text-left text-base">
              <caption className="px-6 pb-4 pt-6 text-left text-lg font-semibold text-black">
                Журнал дзвінків · Сьогодні
              </caption>
              <thead>
                <tr className="border-b border-gray-200 text-base text-black">
                  <th className="px-6 py-3 font-normal">Клієнт</th>
                  <th className="px-6 py-3 font-normal">Статус</th>
                  <th className="px-6 py-3 font-normal">Підсумок дзвінка</th>
                  <th className="px-6 py-3 font-normal">Аудіо</th>
                  <th className="px-6 py-3 font-normal">CRM</th>
                </tr>
              </thead>
              <tbody>
                {callLogs.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="whitespace-nowrap px-6 py-3 text-black">
                      {row.customer}{" "}
                      <span className="font-light">{row.time}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block rounded-full px-3 py-0.5 text-sm font-medium ${row.statusColor}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-black">{row.summary}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-black">
                      <span className="inline-flex items-center gap-2">
                        <Play
                          className="size-3.5 text-black"
                          aria-hidden="true"
                        />
                        {row.duration}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-black">
                      <span className="inline-flex items-center gap-2">
                        <RefreshCw
                          className="size-3.5 text-black"
                          aria-hidden="true"
                        />
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
