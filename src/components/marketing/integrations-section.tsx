import Image from "next/image";

const integrations = [
  {
    title: "CRM",
    description: (
      <>
        Результат дзвінка потрапляє в <span className="font-medium">картку клієнта</span>: статус,
        короткий підсумок і запис розмови
      </>
    ),
  },
  {
    title: "Google Sheets",
    description: (
      <>
        Журнал дзвінків оновлюється в <span className="font-medium">таблиці автоматично</span>:
        клієнт, статус, підсумок і наступна дія
      </>
    ),
  },
  {
    title: "CSV",
    description: (
      <>
        Завантажуйте базу контактів і вивантажуйте{" "}
        <span className="font-medium">результати дзвінків</span> у зручному форматі
      </>
    ),
  },
  {
    title: "Webhooks",
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
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl tracking-tight md:text-5xl">
            Працює з <span className="text-primary">вашими</span> звичними{" "}
            <span className="text-primary">інструментами</span>
          </h2>
          <p className="text-text-secondary mx-auto mt-6 max-w-xl text-lg">
            Після дзвінка агент передає статус, підсумок і запис у CRM, таблицю або вашу систему
            автоматизації.
          </p>
        </div>

        {/* Integration cards — 4 horizontal row on desktop, 2x2 on mobile */}
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {integrations.map((integration) => (
            <div
              key={integration.title}
              className="rounded-card border-border w-full border bg-white p-5"
            >
              {/* Star icon */}
              <div className="mb-3">
                <Image
                  src="/image/integrations-star.svg"
                  alt=""
                  width={31}
                  height={30}
                  aria-hidden="true"
                />
              </div>

              {/* Title */}
              <h3 className="text-text-primary mb-2 text-lg font-semibold">{integration.title}</h3>

              {/* Description */}
              <p className="text-text-primary text-lg font-normal">{integration.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
