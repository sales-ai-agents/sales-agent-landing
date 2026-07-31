import Image from "next/image";
import { Lock, Shield, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrustItem } from "@/types";

const trustItems: readonly TrustItem[] = [
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
] as const;

const complianceIndicators = [
  { icon: Lock, label: "GDPR Compliant" },
  { icon: Shield, label: "End-to-End Шифрування" },
  { icon: Globe, label: "Сервери зберігання в ЄС" },
] as const;

export function TrustSection() {
  return (
    <section className="relative py-20">
      <div
        className="bg-primary/50 pointer-events-none absolute -top-40 -left-20 -z-20 hidden size-72 rounded-full blur-2xl md:block"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">
            <span className="text-foreground">Безпека і </span>
            <span className="text-primary">контроль</span>
          </h2>
        </div>

        <p className="text-foreground mx-auto mb-14 max-w-lg text-center text-base md:text-lg">
          Дані клієнтів залишаються у вашому кабінеті. Ви керуєте записами, доступами і запуском
          дзвінків.
        </p>

        <div className="relative">
          <div className="hidden md:grid md:grid-cols-4 md:gap-8">
            {trustItems.map((item, index) => (
              <div key={item.title} className="relative flex flex-col items-start">
                {index < trustItems.length - 1 && (
                  <div
                    className="absolute top-8 -right-10 left-16 h-px bg-gray-300"
                    aria-hidden="true"
                  />
                )}
                <div className="bg-primary relative z-10 mb-6 flex size-16 items-center justify-center rounded-full">
                  <Image src={item.icon} alt="" width={32} height={32} aria-hidden="true" />
                </div>
                <h3 className="text-foreground font-body mb-2 text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="text-foreground text-base">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 md:hidden">
            {trustItems.map((item, index) => (
              <div
                key={item.title}
                className={cn(
                  "flex flex-col",
                  index % 2 === 0 ? "items-start" : "items-end text-left"
                )}
              >
                <div className="flex flex-col gap-2">
                  <div className="bg-primary flex size-14 items-center justify-center rounded-full">
                    <Image src={item.icon} alt="" width={28} height={28} aria-hidden="true" />
                  </div>
                  <h3 className="text-foreground font-body text-lg font-semibold">{item.title}</h3>
                  <p className="text-foreground max-w-xs text-base">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 hidden items-center justify-between pt-8 md:flex">
          {complianceIndicators.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="text-primary size-5" aria-hidden="true" />
              <span className="text-foreground text-base font-medium">{label}</span>
            </div>
          ))}
        </div>

        <div className="shadow-primary/30 -mx-6 w-screen scrollbar-none overflow-x-auto bg-white pt-12 shadow-md md:hidden">
          <div className="flex w-max gap-6 p-2 px-6">
            {complianceIndicators.map(({ icon: Icon, label }) => (
              <div key={label} className="flex shrink-0 items-center gap-2">
                <Icon className="text-primary size-4" aria-hidden="true" />
                <span className="text-foreground text-sm font-medium whitespace-nowrap">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
