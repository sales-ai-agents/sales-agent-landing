import { Play, RefreshCw } from "lucide-react";
import { CALL_LOG_PREVIEW } from "@/lib/marketing-data";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { BadgeVariant } from "@/types";

const STATUS_STYLES: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-800",
  secondary: "bg-yellow-100 text-yellow-800",
  warning: "bg-red-100 text-red-800",
} as const;

export function CallLogsSection() {
  return (
    <section className="py-20">
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
          className="bg-primary/80 pointer-events-none absolute -bottom-20 -left-20 -z-20 size-72 rounded-full blur-2xl sm:top-20 sm:-right-20 sm:bottom-auto sm:left-auto"
          aria-hidden="true"
        />

        <div className="flex justify-end pb-2 sm:hidden">
          <Image src="/image/table-pointer.svg" alt="" width={35} height={35} aria-hidden="true" />
        </div>

        <div className="border-border relative rounded-2xl border bg-white shadow-sm">
          <div className="scrollbar-none overflow-x-auto">
            <table className="w-full min-w-2xl text-left text-base">
              <caption className="text-foreground px-4 pt-6 pb-4 text-left text-lg font-semibold">
                Журнал дзвінків · Сьогодні
              </caption>
              <thead>
                <tr className="border-border text-foreground border-b text-sm">
                  <th className="px-4 py-2 font-normal">Клієнт</th>
                  <th className="px-4 py-2 font-normal">Статус</th>
                  <th className="px-4 py-2 font-normal">Підсумок дзвінка</th>
                  <th className="px-4 py-2 font-normal">Аудіо</th>
                  <th className="px-4 py-2 font-normal">CRM</th>
                </tr>
              </thead>
              <tbody>
                {CALL_LOG_PREVIEW.map((row) => (
                  <tr key={row.id} className="border-border border-b last:border-0">
                    <td className="text-foreground px-4 py-4 whitespace-nowrap">
                      {row.customer} <span className="text-foreground font-light">{row.time}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={cn(
                          "inline-block rounded-full px-3 py-0.5 text-sm font-medium",
                          STATUS_STYLES[row.statusVariant]
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="text-foreground px-4 py-2">{row.summary}</td>
                    <td className="text-foreground px-4 py-2 whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <Play className="text-foreground size-3.5" aria-hidden="true" />
                        {row.duration}
                      </span>
                    </td>
                    <td className="text-foreground px-4 py-2 whitespace-nowrap">
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
