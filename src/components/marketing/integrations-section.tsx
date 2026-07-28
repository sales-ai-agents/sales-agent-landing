import { Users, Sheet, FileSpreadsheet, Code } from "lucide-react";
import type { Integration } from "@/types";

const integrations: readonly (Integration & { icon: React.ReactNode })[] = [
  {
    title: "CRM",
    icon: <Users className="size-7 text-black" />,
    description: (
      <>
        Результат дзвінка потрапляє в{" "}
        <span className="font-medium">картку клієнта</span>: статус,
        короткий підсумок і запис розмови
      </>
    ),
  },
  {
    title: "Google Sheets",
    icon: <Sheet className="size-7 text-black" />,
    description: (
      <>
        Журнал дзвінків оновлюється в{" "}
        <span className="font-medium">таблиці автоматично</span>: клієнт,
        статус, підсумок і наступна дія
      </>
    ),
  },
  {
    title: "CSV",
    icon: <FileSpreadsheet className="size-7 text-black" />,
    description: (
      <>
        Завантажуйте базу контактів і вивантажуйте{" "}
        <span className="font-medium">результати дзвінків</span> у зручному
        форматі
      </>
    ),
  },
  {
    title: "Webhooks",
    icon: <Code className="size-7 text-black" />,
    description: (
      <>
        Передавайте події після дзвінка у{" "}
        <span className="font-medium">вашу систему</span>: CRM, чат,
        аналітику або автоматизацію
      </>
    ),
  },
];

export function IntegrationsSection() {
  return (
    <section id="integrations" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl sm:text-4xl md:text-5xl">
            <span className="text-black">Працює з </span>
            <span className="text-primary">вашими </span>
            <span className="text-black">звичними </span>
            <span className="text-primary">інструментами</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-black md:text-lg">
            Після дзвінка агент передає статус, підсумок і запис у CRM,
            таблицю або вашу систему автоматизації.
          </p>
        </div>

        {/* Integration cards — 4 columns on lg, staggered 2-col on mobile */}
        <div className="hidden gap-5 lg:grid lg:grid-cols-4">
          {integrations.map((integration) => (
            <div
              key={integration.title}
              className="rounded-2xl border border-border bg-card-glass p-5 backdrop-blur-sm"
            >
              <div className="mb-4">
                {integration.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black">
                {integration.title}
              </h3>
              <p className="text-base text-black">
                {integration.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: staggered 2-column layout */}
        <div className="grid grid-cols-2 gap-4 lg:hidden">
          {/* Left column */}
          <div className="mt-12 flex flex-col gap-4">
            {integrations.filter((_, i) => i % 2 === 0).map((integration) => (
              <div
                key={integration.title}
                className="rounded-2xl border border-border bg-card-glass p-5 backdrop-blur-sm"
              >
                <div className="mb-4">{integration.icon}</div>
                <h3 className="mb-2 text-base font-semibold text-black">
                  {integration.title}
                </h3>
                <p className="text-sm text-black">{integration.description}</p>
              </div>
            ))}
          </div>
          {/* Right column — starts higher */}
          <div className="flex flex-col gap-4">
            {integrations.filter((_, i) => i % 2 !== 0).map((integration) => (
              <div
                key={integration.title}
                className="rounded-2xl border border-border bg-card-glass p-5 backdrop-blur-sm"
              >
                <div className="mb-4">{integration.icon}</div>
                <h3 className="mb-2 text-base font-semibold text-black">
                  {integration.title}
                </h3>
                <p className="text-sm text-black">{integration.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative line */}
        <div className="mt-12 h-px w-full bg-gray-200" aria-hidden="true" />
      </div>
    </section>
  );
}
