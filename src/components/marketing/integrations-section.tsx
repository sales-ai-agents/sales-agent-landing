import { Users, FileSpreadsheet, Code, Sheet } from "lucide-react";
import type { Integration } from "@/types";

const integrations: readonly (Integration & { icon: React.ReactNode })[] = [
  {
    title: "CRM",
    icon: <Users className="text-foreground size-8" aria-hidden="true" />,
    description: (
      <>
        Результат дзвінка потрапляє в <span className="font-medium">картку клієнта</span>: статус,
        короткий підсумок і запис розмови
      </>
    ),
  },
  {
    title: "Google Sheets",
    icon: <Sheet className="text-foreground size-8" aria-hidden="true" />,
    description: (
      <>
        Журнал дзвінків оновлюється в <span className="font-medium">таблиці автоматично</span>:
        клієнт, статус, підсумок і наступна дія
      </>
    ),
  },
  {
    title: "CSV",
    icon: <FileSpreadsheet className="text-foreground size-8" aria-hidden="true" />,
    description: (
      <>
        Завантажуйте базу контактів і вивантажуйте{" "}
        <span className="font-medium">результати дзвінків</span> у зручному форматі
      </>
    ),
  },
  {
    title: "Webhooks",
    icon: <Code className="text-foreground size-8" aria-hidden="true" />,
    description: (
      <>
        Передавайте події після дзвінка у <span className="font-medium">вашу систему</span>: CRM,
        чат, аналітику або автоматизацію
      </>
    ),
  },
];

export function IntegrationsSection() {
  return (
    <section id="integrations" className="pt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="font-display mx-auto max-w-3xl text-3xl sm:text-4xl md:text-5xl">
            <span className="text-foreground">Працює з </span>
            <span className="text-primary">вашими </span>
            <span className="text-foreground">звичними </span>
            <span className="text-primary">інструментами</span>
          </h2>
          <p className="text-foreground mx-auto mt-6 max-w-xl text-base md:text-lg">
            Після дзвінка агент передає статус, підсумок і запис у CRM, таблицю або вашу систему
            автоматизації.
          </p>
        </div>

        <div className="hidden gap-5 lg:grid lg:grid-cols-4">
          {integrations.map((integration) => (
            <div
              key={integration.title}
              className="border-border bg-card-glass rounded-2xl border p-4 backdrop-blur-sm"
            >
              <div className="mb-3">{integration.icon}</div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">{integration.title}</h3>
              <p className="text-foreground text-sm leading-relaxed tracking-wide">
                {integration.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
          <div className="flex flex-col gap-4 sm:mt-10">
            {integrations
              .filter((_, i) => i % 2 === 0)
              .map((integration) => (
                <div
                  key={integration.title}
                  className="border-border bg-card-glass rounded-2xl border p-4 backdrop-blur-sm"
                >
                  <div className="mb-3">{integration.icon}</div>
                  <h3 className="text-foreground mb-2 text-xl font-semibold">
                    {integration.title}
                  </h3>
                  <p className="text-foreground text-sm leading-relaxed tracking-wide">
                    {integration.description}
                  </p>
                </div>
              ))}
          </div>
          <div className="flex flex-col gap-4">
            {integrations
              .filter((_, i) => i % 2 !== 0)
              .map((integration) => (
                <div
                  key={integration.title}
                  className="border-border bg-card-glass rounded-2xl border p-4 backdrop-blur-sm"
                >
                  <div className="mb-3">{integration.icon}</div>
                  <h3 className="text-foreground mb-2 text-xl font-semibold">
                    {integration.title}
                  </h3>
                  <p className="text-foreground text-sm leading-relaxed tracking-wide">
                    {integration.description}
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-border mt-20 h-px w-full" aria-hidden="true" />
      </div>
    </section>
  );
}
