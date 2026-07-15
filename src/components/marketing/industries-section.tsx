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
  imageSrc?: string;
}

const industries: IndustryCard[] = [
  {
    title: "Салон краси",
    task: "Клієнти забувають про запис або давно не повертались після послуги.",
    agentDoes:
      "Нагадує про візит, пропонує новий запис і передає результат адміністратору.",
    status: "Запис підтверджено / клієнт не відповів",
  },
  {
    title: "Стоматологія",
    task: "Пацієнти не підтверджують запис, адміністратор витрачає час на ручні дзвінки.",
    agentDoes: "Нагадує про візит, уточнює час і фіксує відповідь у кабінеті.",
    status: "Підтверджено / потрібен перенос",
  },
  {
    title: "Автосервіс",
    task: "Клієнти не забирають автомобілі вчасно, майстри простоюють без завантаження.",
    agentDoes:
      "Повідомляє про готовність авто, підтверджує час забору і нагадує про планове ТО.",
    status: "Авто забрано / перенесено на завтра",
  },
  {
    title: "Інтернет-магазин",
    task: "Кошик покинуто, деталі замовлення не уточнені, клієнти не повертаються.",
    agentDoes:
      "Уточнює деталі замовлення, підтверджує адресу доставки і пропонує супутні товари.",
    status: "Замовлення підтверджено / потрібна зміна",
  },
];

export function IndustriesSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-4xl font-light leading-tight md:text-5xl">
            Для яких бізнесів{" "}
            <span className="font-semibold">це працює</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-snug tracking-wide text-text-secondary md:text-lg">
            Подивіться, які{" "}
            <span className="font-semibold">дзвінки агент може забрати</span>{" "}
            у адміністратора: запис, нагадування, підтвердження замовлень і
            повторні звернення.
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
          {/* Navigation arrows */}
          <CarouselPrevious
            variant="ghost"
            className={cn(
              "absolute -left-4 top-1/2 z-10 size-11 -translate-y-1/2",
              "rounded-none border-0 bg-transparent hover:bg-transparent",
              "disabled:opacity-30",
              "min-[960px]:-left-14"
            )}
            aria-label="Попередній слайд"
          />
          <CarouselNext
            variant="ghost"
            className={cn(
              "absolute -right-4 top-1/2 z-10 size-11 -translate-y-1/2",
              "rounded-none border-0 bg-transparent hover:bg-transparent",
              "disabled:opacity-30",
              "min-[960px]:-right-14"
            )}
            aria-label="Наступний слайд"
          />

          <CarouselContent className="-ml-5">
            {industries.map((industry) => (
              <CarouselItem
                key={industry.title}
                className="basis-full pl-5 min-[960px]:basis-1/2"
              >
                <div
                  className={cn(
                    "flex min-h-[500px] flex-col overflow-hidden",
                    "rounded-2xl border border-white/95",
                    "bg-black/[0.04] backdrop-blur-lg",
                    "min-[960px]:min-h-[676px]"
                  )}
                >
                  {/* Card content */}
                  <div className="flex flex-1 flex-col px-6 pt-8 md:px-8">
                    {/* Industry title */}
                    <h3 className="mb-8 text-2xl font-normal uppercase leading-none tracking-wide md:text-3xl">
                      {industry.title}
                    </h3>

                    {/* Завдання */}
                    <div className="mb-5">
                      <p className="mb-1 text-lg font-semibold leading-snug tracking-wide md:text-xl">
                        Завдання
                      </p>
                      <p className="text-base leading-snug tracking-wide md:text-lg">
                        {industry.task}
                      </p>
                    </div>

                    {/* Що робить агент */}
                    <div className="mb-5">
                      <p className="mb-1 text-lg font-semibold leading-snug tracking-wide md:text-xl">
                        Що робить агент
                      </p>
                      <p className="text-base leading-snug tracking-wide md:text-lg">
                        {industry.agentDoes}
                      </p>
                    </div>

                    {/* Статус */}
                    <div className="mb-5">
                      <p className="mb-1 text-lg font-semibold leading-snug tracking-wide md:text-xl">
                        Статус
                      </p>
                      <p className="text-base leading-snug tracking-wide md:text-lg">
                        {industry.status}
                      </p>
                    </div>
                  </div>

                  {/* Photo placeholder */}
                  <div className="mx-4 mb-4 min-h-44 flex-shrink-0 overflow-hidden rounded-2xl bg-muted/60 md:mx-6 md:mb-6 md:min-h-56">
                    {industry.imageSrc && (
                      <Image
                        src={industry.imageSrc}
                        alt={`${industry.title} фото`}
                        width={473}
                        height={220}
                        className="h-full w-full object-cover"
                      />
                    )}
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
