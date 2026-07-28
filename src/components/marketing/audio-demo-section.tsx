"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Howl } from "howler";
import { ChevronLeft, ChevronRight, Square } from "lucide-react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DemoCard } from "@/types";

const demos: readonly DemoCard[] = [
  {
    id: "delivery",
    category: "Служба доставки",
    description: "Підтвердження доставки",
    scenario:
      "Агент підтверджує адресу, зручний час отримання та фіксує статус для оператора",
    result: "Результат:",
    resultBold: "доставку підтверджено",
    src: "/audio/audio.ogg",
  },
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
    id: "warehouse",
    category: "Склад / B2B-постачання",
    description: "Уточнення замовлення",
    scenario:
      "Агент перевіряє позиції в замовленні, кількість, дату відвантаження та передає зміни в кабінет",
    result: "Результат:",
    resultBold: "замовлення оновлено",
    src: "/audio/audio.ogg",
  },
  {
    id: "service",
    category: "Сервісна компанія",
    description: "Запис на виїзд спеціаліста",
    scenario:
      "Агент уточнює проблему, адресу, зручний час візиту та створює заявку для майстра",
    result: "Результат:",
    resultBold: "візит заплановано",
    src: "/audio/audio.ogg",
  },
] as const;

export function AudioDemoSection() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [selectedSnap, setSelectedSnap] = useState(1);
  const howlRef = useRef<Howl | null>(null);
  const playingIdRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      howlRef.current?.unload();
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
      if (playing === id) {
        howlRef.current?.stop();
        howlRef.current?.unload();
        howlRef.current = null;
        playingIdRef.current = null;
        setPlaying(null);
        return;
      }

      if (howlRef.current) {
        howlRef.current.stop();
        howlRef.current.unload();
        howlRef.current = null;
      }

      const demo = demos.find((d) => d.id === id);
      if (!demo) return;

      const howl = new Howl({
        src: [demo.src],
        html5: true,
        onend: () => {
          if (playingIdRef.current === id) {
            howlRef.current = null;
            playingIdRef.current = null;
            setPlaying(null);
          }
        },
      });

      howlRef.current = howl;
      playingIdRef.current = id;
      howl.play();
      setPlaying(id);
    },
    [playing]
  );

  const handleSlideClick = (index: number) => {
    if (!api) return;
    api.scrollTo(index);
  };

  const scrollPrev = () => api?.scrollPrev();
  const scrollNext = () => api?.scrollNext();

  return (
    <section id="audio-demo" className="relative px-4 py-20 md:px-8">
      {/* Background waveform decorations */}
      <div className="pointer-events-none absolute top-1/8 left-0 hidden -translate-y-1/8 opacity-50 lg:block">
        <Image
          src="/image/audio-demo-waveform.jpg"
          alt=""
          width={400}
          height={200}
          aria-hidden="true"
        />
      </div>
      <div className="pointer-events-none absolute top-1/8 right-0 hidden -translate-y-1/8 opacity-50 lg:block">
        <Image
          src="/image/audio-demo-waveform.jpg"
          alt=""
          width={400}
          height={200}
          aria-hidden="true"
        />
      </div>

      {/* Heading */}
      <h2 className="font-display mx-auto mb-5 max-w-4xl text-center text-3xl sm:text-4xl md:text-5xl">
        <span className="text-black">Не презентація. </span>
        <span className="text-primary">Реальний</span> <span className="text-black">тестовий </span>
        <span className="text-primary">дзвінок</span> <span className="text-black">агента</span>
      </h2>

      <p className="mx-auto mb-16 max-w-lg text-center text-base font-normal text-neutral-600 md:text-lg">
        Послухайте, як агент підтверджує запис, ставить уточнюючі питання і фіксує результат дзвінка
        в кабінеті.
      </p>

      {/* Carousel with arrows */}
      <div className="relative mx-auto max-w-6xl">
        {/* Left arrow */}
        <button
          onClick={scrollPrev}
          aria-label="Попередній слайд"
          className="absolute top-1/2 -left-12 z-10 hidden -translate-y-1/2 items-center justify-center md:flex"
        >
          <ChevronLeft className="size-8 text-gray-400" />
        </button>

        {/* Right arrow */}
        <button
          onClick={scrollNext}
          aria-label="Наступний слайд"
          className="absolute top-1/2 -right-12 z-10 hidden -translate-y-1/2 items-center justify-center md:flex"
        >
          <ChevronRight className="size-8 text-gray-400" />
        </button>

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
              const isCenter = selectedSnap === index;

              return (
                <CarouselItem key={demo.id} className="p-2 sm:basis-1/2 lg:basis-1/3">
                  <div
                    role={!isCenter ? "button" : undefined}
                    tabIndex={!isCenter ? 0 : undefined}
                    aria-label={!isCenter ? `Перейти до ${demo.category}` : undefined}
                    onClick={() => handleSlideClick(index)}
                    onKeyDown={(e) => {
                      if (!isCenter && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        handleSlideClick(index);
                      }
                    }}
                    className={cn(
                      "h-full rounded-2xl transition-all duration-500 ease-out",
                      isCenter
                        ? "scale-100 opacity-100 shadow-md shadow-primary/30"
                        : "scale-90 cursor-pointer opacity-60"
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

        {/* Mobile arrows */}
        <div className="mt-4 flex items-center justify-between px-2 md:hidden">
          <button onClick={scrollPrev} aria-label="Попередній слайд">
            <ChevronLeft className="size-6 text-gray-400" />
          </button>
          <button onClick={scrollNext} aria-label="Наступний слайд">
            <ChevronRight className="size-6 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="mt-8 flex items-center justify-center gap-4">
        {demos.map((demo, index) => (
          <button
            key={demo.id}
            onClick={() => handleSlideClick(index)}
            aria-label={`Слайд ${index + 1}`}
            className={cn(
              "size-3 rounded-full transition-colors",
              selectedSnap === index ? "bg-primary" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── Demo Player Card ─── */

interface DemoPlayerCardProps {
  demo: DemoCard;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

function DemoPlayerCard({
  demo,
  isPlaying,
  onTogglePlay,
}: DemoPlayerCardProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card-glass p-6 backdrop-blur-sm">
      {/* Blue pill category badge */}
      <div className="mb-4 inline-flex h-9 w-3xs items-center justify-center rounded-full bg-primary px-7 text-base font-semibold text-white">
        {demo.category}
      </div>

      {/* Description */}
      <p className="mb-6 text-sm font-medium text-black md:text-base">
        {demo.description}
      </p>

      {/* Player row */}
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay();
          }}
          aria-label={
            isPlaying ? `Стоп ${demo.category}` : `Грати ${demo.category}`
          }
          className="shrink-0"
        >
          {isPlaying ? (
            <div className="flex size-9 items-center justify-center rounded-full bg-primary">
              <Square
                className="size-3.5 fill-white text-white"
                aria-hidden="true"
              />
            </div>
          ) : (
            <Image
              src="/image/audio-play.svg"
              alt=""
              width={42}
              height={42}
              aria-hidden="true"
            />
          )}
        </Button>
        <Image
          src="/image/audio-wave.svg"
          alt=""
          width={200}
          height={32}
          className="h-10 flex-1"
          aria-hidden="true"
        />
      </div>

      {/* Scenario white card */}
      <div className="mb-4 rounded-2xl bg-white px-4 py-4">
        <div className="flex items-start gap-3">
          <Image
            src="/image/audio-tick.svg"
            alt=""
            width={22}
            height={22}
            className="mt-0.5 size-5 shrink-0 md:size-6"
            aria-hidden="true"
          />
          <p className="text-sm font-light text-black md:text-base">
            {demo.scenario}
          </p>
        </div>
      </div>

      {/* Result row */}
      <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
        <div className="size-2.5 shrink-0 rounded-full bg-primary" />
        <p className="text-sm font-light text-black md:text-base">
          {demo.result}{" "}
          <span className="font-medium">{demo.resultBold}</span>
        </p>
      </div>
    </div>
  );
}
