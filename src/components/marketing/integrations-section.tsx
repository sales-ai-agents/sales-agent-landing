import { Database, Sheet, FileDown, Webhook } from "lucide-react";

const integrations = [
  {
    icon: Database,
    title: "CRM",
    description: (
      <>
        Результат дзвінка потрапляє в{" "}
        <span className="font-medium">картку клієнта</span>: статус, короткий
        підсумок і запис розмови
      </>
    ),
  },
  {
    icon: Sheet,
    title: "Google Sheets",
    description: (
      <>
        Журнал дзвінків оновлюється в{" "}
        <span className="font-medium">таблиці автоматично</span>: клієнт,
        статус, підсумок і наступна дія
      </>
    ),
  },
  {
    icon: FileDown,
    title: "CSV",
    description: (
      <>
        Завантажуйте базу контактів і вивантажуйте{" "}
        <span className="font-medium">результати дзвінків</span> у зручному
        форматі
      </>
    ),
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: (
      <>
        Передавайте події після дзвінка у{" "}
        <span className="font-medium">вашу систему</span>: CRM, чат, аналітику
        або автоматизацію
      </>
    ),
  },
];

export function IntegrationsSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl leading-tight tracking-tight md:text-5xl">
            <span className="font-light">Працює з</span>{" "}
            <span className="font-semibold">вашими</span>{" "}
            <span className="font-light">звичними</span>{" "}
            <span className="font-semibold">інструментами</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-tight tracking-wide text-text-primary">
            Після дзвінка агент передає статус, підсумок і запис у CRM, таблицю
            або вашу систему автоматизації.
          </p>
        </div>

        {/* Integration cards — 4 horizontal row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <div
                key={integration.title}
                className="h-52 w-full rounded-2xl border border-border bg-card-glass p-5 backdrop-blur-sm"
              >
                {/* Icon */}
                <div className="mb-3 flex size-8 items-center justify-center">
                  <Icon
                    className="size-8 text-text-primary"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold leading-tight tracking-wide text-text-primary">
                  {integration.title}
                </h3>

                {/* Description */}
                <p className="text-lg font-normal leading-snug tracking-wide text-text-primary">
                  {integration.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Decorative horizontal line — full container width */}
        <div
          className="mt-10 w-full border-t border-border"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
