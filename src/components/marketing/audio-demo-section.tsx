"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Howl } from "howler";
import { Square } from "lucide-react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface DemoCard {
  id: string;
  category: string;
  description: string;
  scenario: string;
  result: string;
  resultBold: string;
  src: string;
}

const demos: DemoCard[] = [
  {
    id: "logistics",
    category: "Логістика",
    description: "Уточнення заявки на перевезення",
    scenario:
      "Агент дзвонить клієнту, уточнює маршрут, тип вантажу, дату відправки та передає заявку менеджеру",
    result: "Результат:",
    resultBold: "заявку уточнено",
    src: "/audio/audio.ogg",
  },
  {
    id: "service",
    category: "Сервісна компанія",
    description: "Запис на виїзд спеціаліста",
    scenario: "Агент уточнює проблему, адресу, зручний час візиту та створює заявку для майстра",
    result: "Результат:",
    resultBold: "візит заплановано",
    src: "/audio/audio.ogg",
  },
  {
    id: "delivery",
    category: "Служба доставки",
    description: "Підтвердження доставки",
    scenario: "Агент підтверджує адресу, зручний час отримання та фіксує статус для оператора",
    result: "Результат:",
    resultBold: "доставку підтверджено",
    src: "/audio/audio.ogg",
  },
  {
    id: "warehouse",
    category: "Склад / B2B-постачання",
    description: "Уточнення замовлення",
    scenario:
      "Агент перевіряє позиції в замовленні, кількість, дату відвантаження та передає зміни в кабінет",
    result: "Результат:",
    resultBold: "замовлення оновлено",
    src: "/audio/audio.ogg",
  },
];

export function AudioDemoSection() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [selectedSnap, setSelectedSnap] = useState(1);
  const howlsRef = useRef<Record<string, Howl>>({});

  useEffect(() => {
    const howls = howlsRef.current;
    return () => {
      Object.values(howls).forEach((howl) => howl.unload());
    };
  }, []);

  useEffect(() => {
    if (!api) return;

    function updateSelected(): void {
      if (!api) return;
      setSelectedSnap(api.selectedScrollSnap());
    }

    updateSelected();
    api.on("select", updateSelected);

    return () => {
      api.off("select", updateSelected);
    };
  }, [api]);

  const togglePlay = useCallback(
    (id: string) => {
      if (playing && playing !== id) {
        howlsRef.current[playing]?.stop();
      }

      if (!howlsRef.current[id]) {
        const demo = demos.find((d) => d.id === id);
        if (!demo) return;
        howlsRef.current[id] = new Howl({
          src: [demo.src],
          html5: true,
          onend: () => {
            setPlaying((curr) => (curr === id ? null : curr));
          },
        });
      }

      const howl = howlsRef.current[id];
      if (!howl) return;

      if (playing === id) {
        howl.stop();
        setPlaying(null);
      } else {
        howl.play();
        setPlaying(id);
      }
    },
    [playing]
  );

  const handleSlideClick = (index: number) => {
    if (!api) return;
    api.scrollTo(index);
  };

  //const centerIndices = [selectedSnap, (selectedSnap + 1) % demos.length];
  const centerIndices = [selectedSnap];

  return (
    <section id="audio-demo" className="px-13 py-20">
      {/* Heading */}
      <h2 className="font-display mx-auto mb-5 max-w-3xl text-center text-4xl md:text-5xl">
        <span className="text-text-primary">Не презентація.</span>{" "}
        <span className="text-primary">Реальний</span>{" "}
        <span className="text-text-primary">тестовий</span>{" "}
        <span className="text-primary">дзвінок</span>{" "}
        <span className="text-text-primary">агента</span>
      </h2>

      <p className="text-text-secondary mx-auto mb-16 max-w-xl text-center text-lg font-normal">
        Послухайте, як агент підтверджує запис, ставить уточнюючі питання і фіксує результат дзвінка
        в кабінеті.
      </p>

      {/* Carousel */}
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
          startIndex: 1,
          containScroll: "keepSnaps",
        }}
        aria-label="Демо дзвінки агента"
      >
        <CarouselContent>
          {demos.map((demo, index) => {
            const isCenter = centerIndices.includes(index);

            return (
              <CarouselItem
                key={demo.id}
                className="pl-4 sm:basis-1/2 lg:basis-1/3"
                onClick={() => handleSlideClick(index)}
              >
                <div
                  className={cn(
                    "h-full transition-all duration-500 ease-out",
                    isCenter ? "scale-100 opacity-100" : "scale-85 cursor-pointer opacity-70"
                  )}
                >
                  <DemoPlayerCard
                    demo={demo}
                    isPlaying={playing === demo.id}
                    onTogglePlay={() => togglePlay(demo.id)}
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

/* ─── Demo Player Card ─── */

interface DemoPlayerCardProps {
  demo: DemoCard;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

function DemoPlayerCard({ demo, isPlaying, onTogglePlay }: DemoPlayerCardProps) {
  return (
    <div className="rounded-card border-border bg-card-glass backdrop-blur-card flex h-full flex-col border px-7 py-7">
      {/* Blue pill category badge */}
      <div className="rounded-badge bg-primary mb-6 inline-flex h-9 w-fit items-center justify-center px-7 text-base font-semibold text-white">
        {demo.category}
      </div>

      {/* Description */}
      <p className="text-text-primary mb-8 text-base font-medium">{demo.description}</p>

      {/* Player row */}
      <div className="mb-10 flex items-center gap-5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay();
          }}
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center"
          aria-label={isPlaying ? `Стоп ${demo.category}` : `Грати ${demo.category}`}
        >
          {isPlaying ? (
            <div className="bg-primary flex size-10 items-center justify-center rounded-full">
              <Square className="size-3.5 fill-white text-white" />
            </div>
          ) : (
            <Image src="/image/audio-play.svg" alt="" width={39} height={39} aria-hidden="true" />
          )}
        </button>
        <Image
          src="/image/audio-wave.svg"
          alt=""
          width={200}
          height={36}
          className="size-16 flex-1"
          aria-hidden="true"
        />
      </div>

      {/* Scenario white card */}
      <div className="rounded-inner-card mb-4 bg-white px-5 py-4">
        <div className="flex items-start gap-3">
          <Image
            src="/image/audio-tick.svg"
            alt=""
            width={24}
            height={24}
            className="mt-0.5 size-6 shrink-0"
            aria-hidden="true"
          />
          <p className="text-text-primary text-base font-light">{demo.scenario}</p>
        </div>
      </div>

      {/* Result row */}
      <div className="rounded-inner-card mt-auto flex items-center gap-3 bg-white px-5 py-3">
        <div className="bg-primary size-2.5 shrink-0 rounded-full" />
        <p className="text-text-primary text-base font-light">
          {demo.result} <span className="font-medium">{demo.resultBold}</span>
        </p>
      </div>
    </div>
  );
}
