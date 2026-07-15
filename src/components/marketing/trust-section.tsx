import { Lock, Pause, ScanLine, ScanFace } from "lucide-react";

const trustItems = [
  {
    icon: Lock,
    title: "Записи у вашому кабінеті",
    description:
      "Кожна розмова зберігається разом зі статусом, підсумком і записом дзвінка.",
  },
  {
    icon: Pause,
    title: "Пауза в один клік",
    description:
      "Дзвінки можна зупинити або поставити на паузу, якщо потрібно перевірити сценарій чи базу.",
  },
  {
    icon: ScanLine,
    title: "Контроль доступів",
    description:
      "Ви вирішуєте, хто з команди бачить базу клієнтів, записи розмов і результати дзвінків.",
  },
  {
    icon: ScanFace,
    title: "Дані під захистом",
    description:
      "Контакти клієнтів не передаються третім особам і не використовуються для сторонніх задач.",
  },
];

export function TrustSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Heading */}
        <div className="mb-6 text-center">
          <h2 className="text-4xl leading-tight tracking-normal md:text-5xl">
            <span className="font-semibold">Безпека</span>{" "}
            <span className="font-light">і контроль</span>
          </h2>
        </div>

        {/* Subtitle */}
        <p className="mx-auto mb-12 max-w-lg text-center text-lg leading-snug tracking-wide text-text-primary">
          Дані клієнтів залишаються у вашому кабінеті. Ви керуєте записами,
          доступами і запуском дзвінків.
        </p>

        {/* Separator line */}
        <div className="mb-12 h-px w-full bg-border" aria-hidden="true" />

        {/* Trust items row */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:justify-between">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex max-w-72 flex-col items-start">
                {/* Icon container - circle with blue border */}
                <div className="mb-6 flex size-16 items-center justify-center rounded-full border border-primary">
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold leading-snug tracking-wide text-text-primary">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-lg font-normal leading-snug tracking-wide text-text-primary">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
