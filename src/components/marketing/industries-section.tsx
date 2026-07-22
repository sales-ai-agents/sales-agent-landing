"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface IndustryCard {
  title: string;
  task: string;
  agentDoes: string;
  status: string;
  imageSrc: string;
}

const industries: IndustryCard[] = [
  {
    title: "ЛОГІСТИКА",
    task: "Клієнти залишають заявки на перевезення, але менеджери витрачають час на уточнення маршруту, вантажу, дати й деталей оплати.",
    agentDoes:
      "Дзвонить клієнту, уточнює маршрут, тип вантажу, дату відправки, контактну особу та передає готову заявку менеджеру",
    status: "Заявку уточнено / потрібен дзвінок менеджера",
    imageSrc: "/image/industries-logistics.jpg",
  },
  {
    title: "СЛУЖБА ДОСТАВКИ",
    task: "Оператори вручну підтверджують адресу, час отримання, зміни в замовленні й повторно дзвонять клієнтам.",
    agentDoes:
      "Підтверджує адресу, зручний час доставки, фіксує зміну даних і передає статус в кабінет.",
    status: "Доставку підтверджено / потрібно змінити час",
    imageSrc: "/image/industries-delivery.jpg",
  },
];

export function IndustriesSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="font-display mb-4 text-4xl font-bold md:text-5xl">
            Для яких бізнесів <span className="text-primary">це працює</span>
          </h2>
          <p className="text-text-secondary mx-auto max-w-2xl text-base md:text-lg">
            Подивіться, які <span className="font-semibold">дзвінки агент може забрати</span> у
            адміністратора: запис, нагадування, підтвердження замовлень і повторні звернення.
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 1,
            loop: false,
          }}
          className="relative"
          aria-label="Приклади бізнесів"
        >
          {/* Navigation arrows — visible on mobile, hidden on desktop */}
          <div className="mb-4 flex items-center justify-end gap-2 md:hidden">
            <CarouselPrevious
              variant="outline"
              className={cn(
                "border-border static h-10 w-10 translate-y-0 rounded-full border",
                "disabled:opacity-30"
              )}
              aria-label="Попередній слайд"
            />
            <CarouselNext
              variant="outline"
              className={cn(
                "border-border static h-10 w-10 translate-y-0 rounded-full border",
                "disabled:opacity-30"
              )}
              aria-label="Наступний слайд"
            />
          </div>

          <CarouselContent>
            {industries.map((industry) => (
              <CarouselItem key={industry.title} className="basis-full md:basis-1/2">
                <div
                  className={cn(
                    "flex h-full flex-col",
                    "rounded-card border-border bg-card-glass backdrop-blur-card border"
                  )}
                >
                  {/* Card content */}
                  <div className="flex flex-1 flex-col px-8 pt-9">
                    {/* Industry title */}
                    <h3 className="mb-7 text-2xl uppercase md:text-3xl">{industry.title}</h3>

                    {/* Завдання */}
                    <div className="mb-7">
                      <p className="mb-2 text-lg font-semibold md:text-xl">Завдання</p>
                      <p className="text-text-secondary text-base md:text-lg">{industry.task}</p>
                    </div>

                    {/* Що робить агент */}
                    <div className="mb-7">
                      <p className="mb-2 text-lg font-semibold md:text-xl">Що робить агент</p>
                      <p className="text-text-secondary text-base md:text-lg">
                        {industry.agentDoes}
                      </p>
                    </div>

                    {/* Статус */}
                    <div className="mb-7">
                      <p className="mb-2 text-lg font-semibold md:text-xl">Статус</p>
                      <p className="text-text-secondary text-base md:text-lg">{industry.status}</p>
                    </div>
                  </div>

                  {/* Photo */}
                  <div className="rounded-inner-card mx-4 mb-4 shrink-0 overflow-hidden md:mx-6 md:mb-6">
                    <Image
                      src={industry.imageSrc}
                      alt={`${industry.title} фото`}
                      width={473}
                      height={220}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
