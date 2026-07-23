import Image from "next/image";

const trustItems = [
  {
    icon: "/image/trust-lock.svg",
    title: "Записи у вашому кабінеті",
    description: "Кожна розмова зберігається разом зі статусом, підсумком і записом дзвінка.",
  },
  {
    icon: "/image/trust-pause.svg",
    title: "Пауза в один клік",
    description:
      "Дзвінки можна зупинити або поставити на паузу, якщо потрібно перевірити сценарій чи базу.",
  },
  {
    icon: "/image/trust-scan.svg",
    title: "Контроль доступів",
    description:
      "Ви вирішуєте, хто з команди бачить базу клієнтів, записи розмов і результати дзвінків.",
  },
  {
    icon: "/image/trust-face.svg",
    title: "Дані під захистом",
    description:
      "Контакти клієнтів не передаються третім особам і не використовуються для сторонніх задач.",
  },
];

export function TrustSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Heading */}
        <div className="mb-6 text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">
            Безпека і <span className="text-primary">контроль</span>
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-text-secondary mx-auto mb-12 max-w-lg text-center text-lg">
          Дані клієнтів залишаються у вашому кабінеті. Ви керуєте записами, доступами і запуском
          дзвінків.
        </p>

        {/* Trust items row with line through icon centers */}
        <div className="relative mt-12">
          {/* Horizontal line through center of icons — desktop only, spans from first to last icon center */}
          <div
            className="bg-border absolute top-7 right-[20%] left-7 hidden h-px lg:block"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item.title} className="flex flex-col items-start">
                {/* Icon container — solid blue circle with white icon */}
                <div className="bg-primary relative z-10 mb-6 flex size-14 items-center justify-center rounded-full">
                  <Image src={item.icon} alt="" width={24} height={24} aria-hidden="true" />
                </div>

                {/* Title */}
                <h3 className="text-text-primary mb-2 text-lg font-semibold">{item.title}</h3>

                {/* Description */}
                <p className="text-text-primary text-base font-normal">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
