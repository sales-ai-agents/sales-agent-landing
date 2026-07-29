import Link from "next/link";
import Image from "next/image";
import { Clock, Link2, PhoneCall, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Navbar, MobileNavbar } from "@/components/marketing/navbar";
import { DynamicDemoCallCard as DemoCallCard } from "@/components/marketing/dynamic-sections";

export function HeroSection() {
  return (
    <section className="relative min-h-screen">
      <Navbar />
      <MobileNavbar />

      <div className="pointer-events-none absolute inset-0 -z-10 -mt-20" aria-hidden="true">
        <Image src="/image/hero-bg.jpg" alt="" fill className="object-cover" priority />
      </div>

      <div className="lg:pb:16 mx-auto px-6 pt-32 pb-0 lg:px-16 lg:pt-60">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl text-center lg:text-left">
            <p className="text-foreground mb-4 hidden text-lg lg:block">
              Голосовий <span className="font-semibold">ШІ-агент</span>
            </p>

            <h1 className="font-display text-foreground mb-6 text-3xl tracking-tight uppercase sm:text-4xl lg:text-5xl">
              ШІ-агент <span className="text-primary">телефонує за вас</span> – економить до 70%
              часу менеджера
            </h1>

            <p className="text-foreground mx-auto mb-10 max-w-md text-base lg:mx-0 lg:max-w-lg">
              ШI-агент телефонує клієнтам, уточнює деталі та передає результат у CRM. Без
              програмістів і зайвих ручних дзвінків.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4 lg:items-start lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-body h-12 w-full rounded-full px-8 text-lg font-normal sm:w-auto"
              >
                <Link href="/sign-up">Спробувати безкоштовно</Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="ghost"
                className="border-border text-foreground font-body h-12 w-full rounded-full border bg-white/45 px-8 text-lg font-normal backdrop-blur-xl sm:w-auto"
              >
                <a href="#audio-demo">
                  <Play className="size-4" aria-hidden="true" />
                  Прослухати демо
                </a>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Clock className="text-primary size-4" aria-hidden="true" />
                <span>Запуск за 1 день</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Link2 className="text-primary size-4" aria-hidden="true" />
                <span>Інтеграція з CRM</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <PhoneCall className="text-primary size-4" aria-hidden="true" />
                <span>Дзвінки 24/7</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm lg:max-w-md">
            <DemoCallCard />
          </div>
        </div>
      </div>
    </section>
  );
}
