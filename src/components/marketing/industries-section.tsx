import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import type { IndustryCard } from "@/types";

const industries: IndustryCard[] = [
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
    agentDoes: "Звіряє вільні слоти в CRM, уточнює марку авто, записує на час і надсилає SMS.",
    status: "Запис підтверджено / Внесено в CRM",
    imageSrc: "/image/industries-cto.png",
  },
];

export function IndustriesSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 text-center">
          <h2 className="font-display mb-4 text-3xl sm:text-4xl md:text-5xl">
            <span className="text-foreground">Для яких бізнесів </span>
            <span className="text-primary">це працює</span>
          </h2>
          <p className="text-foreground mx-auto max-w-xl text-base md:text-lg">
            Подивіться, які <span className="font-semibold">дзвінки агент може забрати</span> у
            адміністратора: запис, нагадування, підтвердження замовлень і повторні звернення.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 1,
            loop: true,
          }}
          aria-label="Галузі"
        >
          <div className="mb-6 flex items-center justify-center gap-3 md:justify-end">
            <CarouselPrevious
              variant="ghost"
              className="border-border static size-11 translate-y-0 rounded-full border"
              aria-label="Попередній слайд"
            />
            <CarouselNext
              variant="ghost"
              className="border-border static size-11 translate-y-0 rounded-full border"
              aria-label="Наступний слайд"
            />
          </div>

          <CarouselContent>
            {industries.map((industry, index) => (
              <CarouselItem key={index} className="basis-4/5 md:basis-2/5">
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
    <div className="border-border bg-card-glass flex h-full flex-col rounded-3xl border backdrop-blur-lg">
      <div className="flex flex-1 flex-col px-8 pt-8">
        <h3 className="mb-6 text-2xl tracking-wide uppercase md:text-3xl">{industry.title}</h3>

        <div className="mb-5">
          <p className="text-foreground mb-1 text-lg font-semibold">Завдання</p>
          <p className="text-foreground text-base">{industry.task}</p>
        </div>

        <div className="mb-5">
          <p className="text-foreground mb-1 text-lg font-semibold">Що робить агент</p>
          <p className="text-foreground text-base">{industry.agentDoes}</p>
        </div>

        <div className="mb-6">
          <p className="text-foreground mb-1 text-lg font-semibold">Cтатус</p>
          <p className="text-foreground text-base">{industry.status}</p>
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
