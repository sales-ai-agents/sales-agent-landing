import { Play, RefreshCw } from "lucide-react";
import { callLogs } from "@/lib/mock-data";

const statusStyles = {
  success: "bg-green-100 text-green-800",
  secondary: "bg-yellow-100 text-yellow-800",
  warning: "bg-red-100 text-red-800",
} as const;

export function CallLogsSection() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <h2 className="font-display mb-4 text-3xl sm:text-4xl md:text-5xl">
            <span className="text-primary">Повний контроль</span> <br />
            <span className="text-foreground">після кожного дзвінка</span>
          </h2>
          <p className="text-foreground mx-auto max-w-lg text-base md:text-lg">
            Бачите статус дзвінка, короткий підсумок розмови, запис і результат синхронізації з CRM.
          </p>
        </div>

        <div
          className="bg-primary/80 pointer-events-none absolute top-20 -right-20 -z-20 size-72 rounded-full blur-2xl"
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
