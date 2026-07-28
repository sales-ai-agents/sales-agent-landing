import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import type { IndustryCard } from "@/types";

const industries = [
  {
    title: "ЛОГІСТИКА",
    task: "Клієнти залишають заявки на перевезення, але менеджери витрачають час на уточнення маршруту, вантажу, дати й деталей оплати.",
    agentDoes:
      "Дзвонить клієнту, уточнює маршрут, тип вантажу, дату відправки, контактну особу та передає готову заявку менеджеру",
    status: "Заявку уточнено / потрібен дзвінок менеджера",
    imageSrc: "/image/industries-logistics.png",
  },
  {
    title: "СЛУЖБА ДОСТАВКИ",
    task: "Оператори вручну підтверджують адресу, час отримання, зміни в замовленні й повторно дзвонять клієнтам.",
    agentDoes:
      "Підтверджує адресу, зручний час доставки, фіксує зміну даних і передає статус в кабінет.",
    status: "Доставку підтверджено / потрібно змінити час",
    imageSrc: "/image/industries-delivery.png",
  },
  {
    title: "АВТОСЕРВІСИ ТА СТО",
    task: "Клієнти дзвонять дізнатися вартість ТО та наявність вільних підйомників. Адміністратор витрачає час на ручний запис.",
    agentDoes:
      "Звіряє вільні слоти в CRM, уточнює марку авто, записує на час і надсилає SMS.",
    status: "Запис підтверджено / Внесено в CRM",
    imageSrc: "/image/industries-cto.png",
  },
] as const satisfies readonly IndustryCard[];

export function IndustriesSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="mb-4 font-display text-3xl sm:text-4xl md:text-5xl">
            <span className="text-black">Для яких бізнесів </span>
            <span className="text-primary">це працює</span>
          </h2>
          <p className="mx-auto max-w-xl text-base text-black md:text-lg">
            Подивіться, які{" "}
            <span className="font-semibold">дзвінки агент може забрати</span>{" "}
            у адміністратора: запис, нагадування, підтвердження замовлень і
            повторні звернення.
          </p>
        </div>

        {/* Carousel for all screen sizes */}
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 1,
            loop: true,
          }}
          aria-label="Приклади бізнесів"
        >
          {/* Navigation arrows */}
          <div className="mb-6 flex items-center justify-center gap-3 md:justify-end">
            <CarouselPrevious
              variant="ghost"
              className="static size-8 translate-y-0 rounded-full border-0"
              aria-label="Попередній слайд"
            />
            <CarouselNext
              variant="ghost"
              className="static size-8 translate-y-0 rounded-full border-0"
              aria-label="Наступний слайд"
            />
          </div>

          <CarouselContent>
            {industries.map((industry, index) => (
              <CarouselItem
                key={index}
                className="basis-4/5 md:basis-1/2 lg:basis-2/5"
              >
                <IndustryCardComponent industry={industry} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

function IndustryCardComponent({ industry }: { industry: IndustryCard }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-gray-300 bg-black/5 backdrop-blur-lg">
      <div className="flex flex-1 flex-col px-8 pt-8">
        <h3 className="mb-6 text-2xl uppercase tracking-wide md:text-3xl">
          {industry.title}
        </h3>

        <div className="mb-5">
          <p className="mb-1 text-lg font-semibold text-black">Завдання</p>
          <p className="text-base text-black">{industry.task}</p>
        </div>

        <div className="mb-5">
          <p className="mb-1 text-lg font-semibold text-black">
            Що робить агент
          </p>
          <p className="text-base text-black">{industry.agentDoes}</p>
        </div>

        <div className="mb-6">
          <p className="mb-1 text-lg font-semibold text-black">Cтатус</p>
          <p className="text-base text-black">{industry.status}</p>
        </div>
      </div>

      <div className="mx-6 mb-6 shrink-0 overflow-hidden rounded-2xl">
        <Image
          src={industry.imageSrc}
          alt={`${industry.title} — приклад роботи агента`}
          width={473}
          height={273}
          className="h-auto w-full object-cover"
        />
      </div>
    </div>
  );
}
