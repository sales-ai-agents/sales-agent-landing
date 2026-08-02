import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from "@/components/ui/carousel";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import type { IndustryCard } from "@/types";
import { INDUSTRIES } from "@/lib/marketing-data";

export function IndustriesSection() {
  return (
    <section className="px-6 py-20 md:px-0">
      <div className="mx-auto">
        <ScrollReveal direction="up" distance={30}>
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
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15} distance={20} threshold={0.1}>
          <Carousel
            opts={{
              align: "start",
              slidesToScroll: 1,
            }}
            aria-label="Галузі"
          >
            <div className="mb-2 flex items-center justify-end gap-3 sm:ml-auto sm:max-w-3xl sm:justify-center">
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

            <CarouselContent className="xl:pl-40">
              {INDUSTRIES.map((industry, index) => (
                <CarouselItem key={index} className="md:basis-2/5">
                  <IndustryCardComponent industry={industry} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselDots className="mt-2 flex sm:hidden" />
          </Carousel>
        </ScrollReveal>
      </div>
    </section>
  );
}

function IndustryCardComponent({ industry }: { industry: IndustryCard }) {
  return (
    <div className="border-border bg-card-glass flex h-full flex-col rounded-3xl border shadow-md backdrop-blur-lg">
      <div className="flex flex-1 flex-col px-6 pt-6">
        <h3 className="font-body mb-6 text-xl uppercase md:text-2xl">{industry.title}</h3>

        <div className="mb-5">
          <p className="text-foreground mb-1 font-semibold">Завдання</p>
          <p className="text-foreground text-sm">{industry.task}</p>
        </div>

        <div className="mb-5">
          <p className="text-foreground mb-1 font-semibold">Що робить агент</p>
          <p className="text-foreground text-sm">{industry.agentDoes}</p>
        </div>

        <div className="mb-6">
          <p className="text-foreground mb-1 font-semibold">Cтатус</p>
          <p className="text-foreground text-sm">{industry.status}</p>
        </div>
      </div>

      <div className="mx-6 mb-6 shrink-0 overflow-hidden rounded-2xl">
        <Image
          src={industry.imageSrc}
          alt={`${industry.title} — приклад роботи агента`}
          width={400}
          height={200}
          className="h-50 w-full object-cover"
        />
      </div>
    </div>
  );
}
