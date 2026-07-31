import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Clock, Link2, PhoneCall, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Navbar, MobileNavbar } from "@/components/marketing/navbar";
import { DynamicDemoCallCard as DemoCallCard } from "@/components/marketing/dynamic-sections";

const HERO_BADGES: { icon: LucideIcon; label: string }[] = [
  { icon: Clock, label: "Запуск за 1 день" },
  { icon: Link2, label: "Інтеграція з CRM" },
  { icon: PhoneCall, label: "Дзвінки 24/7" },
];

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen">
      <Navbar />
      <MobileNavbar />

      <div className="pointer-events-none absolute inset-0 -z-10 -mt-20" aria-hidden="true">
        <Image src="/image/hero-bg.jpg" alt="" fill className="object-cover" priority />
      </div>

      <div className="mx-auto px-6 pt-32 pb-16 lg:px-16 lg:pt-60">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl text-center lg:text-left">
            <p className="text-foreground mb-4 hidden text-lg lg:block">
              Голосовий <span className="font-semibold">ШІ-агент</span>
            </p>

            <h1 className="font-display text-foreground mb-6 text-3xl uppercase sm:text-4xl lg:text-5xl">
              ШІ-агент <span className="text-primary">телефонує за вас</span> – економить до 70%
              часу менеджера
            </h1>

            <p className="text-foreground mx-auto mb-10 max-w-md text-base lg:mx-0 lg:max-w-lg">
              ШI-агент телефонує клієнтам, уточнює деталі та передає результат у CRM. Без
              програмістів і зайвих ручних дзвінків.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:items-start lg:justify-start">
              <a
                href="#builder"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-primary text-primary-foreground hover:bg-primary/90 font-body h-12 w-full rounded-full px-8 text-lg font-normal sm:w-auto"
                )}
              >
                Спробувати безкоштовно
              </a>

              <a
                href="#audio-demo"
                className={cn(
                  buttonVariants({ size: "lg", variant: "ghost" }),
                  "border-border text-foreground font-body h-12 w-full rounded-full border bg-white/45 px-8 text-lg font-normal backdrop-blur-xl sm:w-auto"
                )}
              >
                <Play className="size-4" aria-hidden="true" />
                Прослухати демо
              </a>
            </div>

            <div className="mt-10 hidden flex-wrap items-center justify-center gap-6 md:flex lg:justify-start">
              {HERO_BADGES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-neutral-700">
                  <Icon className="text-primary size-4" aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="shadow-primary/30 -mx-6 w-screen scrollbar-none overflow-x-auto bg-white shadow-md md:hidden">
            <div className="flex w-max gap-6 px-6 py-2">
              {HERO_BADGES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm whitespace-nowrap text-neutral-700"
                >
                  <Icon className="text-primary size-4 shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-sm lg:max-w-lg">
            <DemoCallCard />
          </div>
        </div>
      </div>
    </section>
  );
}
