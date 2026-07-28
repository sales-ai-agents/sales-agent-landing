import Link from "next/link";
import Image from "next/image";
import { Play, Clock, Link2, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Navbar, MobileNavbar } from "@/components/marketing/navbar";
import { DynamicDemoCallCard as DemoCallCard } from "@/components/marketing/dynamic-sections";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <Navbar />
      <MobileNavbar />

      {/* Background image */}
      <div className="absolute -top-50 -right-50 inset-0 -z-10">
        <Image
          src="/image/hero-bg.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="mx-auto px-6 pt-24 lg:px-18 lg:pt-60">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:justify-between">
          {/* Left column */}
          <div className="max-w-3xl text-center lg:text-left">
            <p className="mb-4 hidden text-lg text-black lg:block">
              Голосовий <span className="font-semibold">ШІ-агент</span>
            </p>

            <h1 className="mb-6 font-display text-3xl tracking-tight text-black uppercase sm:text-4xl lg:text-5xl">
              ШІ-агент{" "}
              <span className="text-primary">телефонує за вас</span> –
              економить до 70% часу менеджера
            </h1>

            <p className="mx-auto mb-10 max-w-sm text-base text-black lg:mx-0 lg:max-w-lg">
              ШI-агент телефонує клієнтам, уточнює деталі та передає
              результат у CRM. Без програмістів і зайвих ручних дзвінків.
            </p>

            <div className="flex items-center justify-center gap-3 sm:gap-4 lg:justify-start">
              <Button
                asChild
                size="lg"
                className="h-10 rounded-full bg-primary px-5 text-sm text-white hover:bg-primary/90 sm:h-12 sm:px-8 sm:text-lg"
              >
                <Link href="/sign-up">Спробувати безкоштовно</Link>
              </Button>

              <Button
                asChild
                size="lg"
                className="h-10 rounded-full border border-border bg-white/40 px-5 text-sm text-black backdrop-blur-md hover:bg-white/50 sm:h-12 sm:px-8 sm:text-lg"
              >
                <a href="#audio-demo" aria-label="Прослухати демо дзвінок">
                  <Play className="size-3.5" aria-hidden="true" />
                  Прослухати демо
                </a>
              </Button>
            </div>

            {/* Feature badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Clock className="size-4 text-primary" aria-hidden="true" />
                <span>Запуск за 1 день</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Link2 className="size-4 text-primary" aria-hidden="true" />
                <span>Інтеграція з CRM</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <PhoneCall className="size-4 text-primary" aria-hidden="true" />
                <span>Дзвінки 24/7</span>
              </div>
            </div>
          </div>

          {/* Right column — Demo call card */}
          <div className="w-full max-w-sm lg:max-w-lg">
            <DemoCallCard />
          </div>
        </div>
      </div>
    </section>
  );
}
