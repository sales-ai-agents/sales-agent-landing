import Image from "next/image";
import { Lock, Globe, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrustItem } from "@/types";

const trustItems: readonly TrustItem[] = [
  {
    icon: "/image/trust-lock.svg",
    title: "Записи у вашому кабінеті",
    description:
      "Кожна розмова зберігається разом зі статусом, підсумком і записом дзвінка.",
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

export function TrustSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">
            <span className="text-black">Безпека і </span>
            <span className="text-primary">контроль</span>
          </h2>
        </div>

        {/* Subtitle */}
        <p className="mx-auto mb-14 max-w-lg text-center text-base text-black md:text-lg">
          Дані клієнтів залишаються у вашому кабінеті. Ви керуєте записами,
          доступами і запуском дзвінків.
        </p>

        {/* Trust items — 4 columns on lg with connecting line */}
        <div className="relative">
          {/* Decorative horizontal connecting line — desktop only */}
          <div
            className="absolute inset-x-8 top-7 hidden h-px bg-gray-300 lg:block"
            aria-hidden="true"
          />

          {/* Desktop: 4 columns */}
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-8">
            {trustItems.map((item) => (
              <div key={item.title} className="flex flex-col items-start">
                <div className="relative z-10 mb-6 flex size-14 items-center justify-center rounded-full bg-primary">
                  <Image
                    src={item.icon}
                    alt=""
                    width={28}
                    height={28}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-black">
                  {item.title}
                </h3>
                <p className="text-base text-black">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Mobile: zigzag layout */}
          <div className="flex flex-col gap-10 lg:hidden">
            {trustItems.map((item, index) => (
              <div
                key={item.title}
                className={cn(
                  "flex flex-col",
                  index % 2 === 0 ? "items-start" : "items-end text-right"
                )}
              >
                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary">
                  <Image
                    src={item.icon}
                    alt=""
                    width={28}
                    height={28}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-black">
                  {item.title}
                </h3>
                <p className="max-w-xs text-base text-black">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance bar — desktop */}
        <div className="mt-16 hidden flex-wrap items-center justify-between gap-6 border-t border-gray-200 pt-8 lg:flex">
          <div className="flex items-center gap-3">
            <Lock className="size-5 text-primary" aria-hidden="true" />
            <span className="text-base font-medium text-black">GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="size-5 text-primary" aria-hidden="true" />
            <span className="text-base font-medium text-black">End-to-End Шифрування</span>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="size-5 text-primary" aria-hidden="true" />
            <span className="text-base font-medium text-black">Сервери зберігання в ЄС</span>
          </div>
        </div>

        {/* Compliance bar — mobile horizontal scroll */}
        <div className="mt-12 flex gap-6 overflow-x-auto pt-6 lg:hidden" style={{ scrollbarWidth: "none" }}>
          <div className="flex shrink-0 items-center gap-2">
            <Lock className="size-4 text-primary" aria-hidden="true" />
            <span className="whitespace-nowrap text-sm font-medium text-black">GDPR Compliant</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Shield className="size-4 text-primary" aria-hidden="true" />
            <span className="whitespace-nowrap text-sm font-medium text-black">End-to-End Шифрування</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Globe className="size-4 text-primary" aria-hidden="true" />
            <span className="whitespace-nowrap text-sm font-medium text-black">Сервери зберігання в ЄС</span>
          </div>
        </div>
      </div>
    </section>
  );
}
