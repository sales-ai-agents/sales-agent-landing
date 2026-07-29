"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Howl } from "howler";
import { ChevronLeft, ChevronRight, Square, Play } from "lucide-react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DemoCard } from "@/types";
import { demos } from "@/lib/mock-data";

export function AudioDemoSection() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
      setError(null);

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
        onloaderror: () => {
          setError(id);
          howlRef.current = null;
          playingIdRef.current = null;
          setPlaying(null);
        },
        onplayerror: () => {
          setError(id);
          howlRef.current = null;
          playingIdRef.current = null;
          setPlaying(null);
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
    <section id="audio-demo" className="relative overflow-hidden px-4 py-20 md:px-8">
      <div
        className="pointer-events-none absolute top-1/10 left-0 hidden -translate-y-1/10 opacity-50 lg:block"
        aria-hidden="true"
      >
        <Image src="/image/audio-demo-waveform.jpg" alt="" width={400} height={200} />
      </div>
      <div
        className="pointer-events-none absolute top-1/8 right-0 hidden -translate-y-1/8 opacity-50 lg:block"
        aria-hidden="true"
      >
        <Image src="/image/audio-demo-waveform.jpg" alt="" width={400} height={200} />
      </div>

      <h2 className="font-display mx-auto mb-5 max-w-4xl text-center text-3xl sm:text-4xl md:text-5xl">
        <span className="text-foreground">Не презентація. </span>
        <span className="text-primary">Реальний</span>{" "}
        <span className="text-foreground">тестовий </span>
        <span className="text-primary">дзвінок</span>{" "}
        <span className="text-foreground">агента</span>
      </h2>

      <p className="text-muted-foreground mx-auto mb-16 max-w-lg text-center text-base font-normal md:text-lg">
        Послухайте, як агент підтверджує запис, ставить уточнюючі питання і фіксує результат дзвінка
        в кабінеті.
      </p>

      <div className="relative mx-auto max-w-6xl">
        <button
          onClick={scrollPrev}
          aria-label="Попередній слайд"
          className="focus-visible:ring-primary absolute top-1/2 -left-12 z-10 hidden size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:flex"
        >
          <ChevronLeft className="size-8 text-gray-400" aria-hidden="true" />
        </button>

        <button
          onClick={scrollNext}
          aria-label="Наступний слайд"
          className="focus-visible:ring-primary absolute top-1/2 -right-12 z-10 hidden size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:flex"
        >
          <ChevronRight className="size-8 text-gray-400" aria-hidden="true" />
        </button>

        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
            startIndex: 1,
            containScroll: "keepSnaps",
          }}
          aria-label="Демо дзвінки"
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
                        ? "shadow-primary/30 scale-100 opacity-100 shadow-md"
                        : "scale-90 cursor-pointer opacity-50"
                    )}
                  >
                    <DemoPlayerCard
                      demo={demo}
                      isPlaying={playing === demo.id}
                      hasError={error === demo.id}
                      onTogglePlay={() => togglePlay(demo.id)}
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        {demos.map((demo, index) => (
          <button
            key={demo.id}
            onClick={() => handleSlideClick(index)}
            aria-label={`Слайд ${index + 1}`}
            className="focus-visible:ring-primary flex size-5 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span
              className={cn(
                "block size-3 rounded-full transition-colors",
                selectedSnap === index ? "bg-primary" : "bg-gray-300"
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

interface DemoPlayerCardProps {
  demo: DemoCard;
  isPlaying: boolean;
  hasError: boolean;
  onTogglePlay: () => void;
}

function DemoPlayerCard({ demo, isPlaying, hasError, onTogglePlay }: DemoPlayerCardProps) {
  return (
    <div className="border-border bg-card-glass flex h-full flex-col rounded-2xl border p-6 backdrop-blur-lg">
      <div className="bg-primary text-primary-foreground mb-4 inline-flex h-9 w-fit min-w-3xs items-center justify-center rounded-full px-7 text-base font-semibold">
        {demo.category}
      </div>

      <p className="text-foreground mb-6 text-sm font-medium md:text-base">{demo.description}</p>

      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePlay}
          aria-label={isPlaying ? `Зупинити ${demo.category}` : `Грати ${demo.category}`}
          className="size-11 shrink-0"
          disabled={hasError}
        >
          {isPlaying ? (
            <div className="bg-primary flex size-9 items-center justify-center rounded-full">
              <Square
                className="fill-primary-foreground text-primary-foreground size-3.5"
                aria-hidden="true"
              />
            </div>
          ) : (
            <div className="bg-primary flex size-9 items-center justify-center rounded-full">
              <Play
                className="fill-primary-foreground text-primary-foreground size-3.5"
                aria-hidden="true"
              />
            </div>
          )}
        </Button>
        <Image
          src="/image/audio-wave.svg"
          alt=""
          width={200}
          height={32}
          className="h-12 flex-1"
          aria-hidden="true"
        />
      </div>

      {hasError && (
        <p className="mb-4 text-sm text-red-500" role="alert">
          Помилка завантаження аудіо
        </p>
      )}

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
          <p className="text-foreground text-sm font-light md:text-base">{demo.scenario}</p>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
        <div className="bg-primary size-2.5 shrink-0 rounded-full" aria-hidden="true" />
        <p className="text-foreground text-sm font-light md:text-base">
          {demo.result} <span className="font-medium">{demo.resultBold}</span>
        </p>
      </div>
    </div>
  );
}
