import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from "@/components/ui/carousel";
import type { IndustryCard } from "@/types";
import { industries } from "@/lib/mock-data";

export function IndustriesSection() {
  return (
    <section className="px-6 py-20 md:px-0">
      <div className="mx-auto">
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
          }}
          aria-label="Галузі"
        >
          <div className="mb-4 flex items-center justify-end gap-3 sm:ml-auto sm:max-w-3xl sm:justify-center">
            <CarouselPrevious
              variant="ghost"
              className="static size-10 translate-y-0"
              aria-label="Попередній слайд"
            />
            <CarouselNext
              variant="ghost"
              className="static size-10 translate-y-0"
              aria-label="Наступний слайд"
            />
          </div>

          <CarouselContent className="xl:pl-60">
            {industries.map((industry, index) => (
              <CarouselItem key={index} className="basis-5/5 md:basis-2/5">
                <IndustryCardComponent industry={industry} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselDots className="mt-2 flex sm:hidden" />
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
          className="h-80 w-full object-cover"
        />
      </div>
    </div>
  );
}
