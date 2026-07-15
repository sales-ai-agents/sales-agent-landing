"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Howl } from "howler";
import { Square } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface DemoCard {
  id: string;
  label: string;
  description: string;
  scenario: string;
  result: string;
  src: string;
}

const demos: DemoCard[] = [
  {
    id: "dental",
    label: "Стоматологія",
    description: "Підтвердження запису на завтра",
    scenario:
      "Агент нагадує пацієнту про час візиту і фіксує відповідь: підтвердив, просить перенести або не відповів",
    result: "Результат: запис підтверджено",
    src: "/audio/audio.ogg",
  },
  {
    id: "salon",
    label: "Салон краси",
    description: "Нагадування та перенесення запису",
    scenario:
      "Агент нагадує клієнту про запис. Якщо час не підходить, фіксує запит на перенесення для менеджера.",
    result: "Результат: змінити час",
    src: "/audio/audio.ogg",
  },
  {
    id: "auto",
    label: "Автосервіс",
    description: "Повідомлення про готовність авто",
    scenario:
      "Агент повідомляє клієнту, що авто готове до видачі, та підтверджує зручний час для забору.",
    result: "Результат: час підтверджено",
    src: "/audio/audio.ogg",
  },
  {
    id: "store",
    label: "Інтернет-магазин",
    description: "Уточнення деталей замовлення",
    scenario:
      "Агент уточнює адресу доставки, спосіб оплати та підтверджує склад замовлення з клієнтом.",
    result: "Результат: замовлення підтверджено",
    src: "/audio/audio.ogg",
  },
];

export function AudioDemoSection() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [selectedSnap, setSelectedSnap] = useState(1);
  const howlsRef = useRef<Record<string, Howl>>({});

  useEffect(() => {
    demos.forEach((demo) => {
      if (!howlsRef.current[demo.id]) {
        const howl = new Howl({
          src: [demo.src],
          html5: true,
          preload: true,
          onend: () => {
            setPlaying((curr) => (curr === demo.id ? null : curr));
          },
        });
        howlsRef.current[demo.id] = howl;
      }
    });

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

  function handleSlideClick(index: number): void {
    if (!api) return;
    api.scrollTo(index);
  }

  const centerIndices = [selectedSnap, (selectedSnap + 1) % demos.length];

  return (
    <section id="audio-demo" className="overflow-hidden py-20">
      {/* Heading */}
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mx-auto mb-5 max-w-2xl text-center text-4xl leading-tight text-text-primary md:text-5xl">
          <span className="font-light">Не презентація.</span>
          <br />
          <span className="font-medium">Реальний тестовий дзвінок</span>{" "}
          <span className="font-light">агента</span>
        </h2>

        <p className="mx-auto mb-16 max-w-lg text-center text-lg font-normal tracking-wide text-text-secondary">
          Послухайте, як агент підтверджує запис, ставить уточнюючі питання і
          фіксує результат дзвінка в кабінеті.
        </p>
      </div>

      {/* Carousel */}
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
          startIndex: 1,
          containScroll: false,
        }}
        className="mx-auto w-full max-w-7xl overflow-hidden"
        aria-label="Демо дзвінки агента"
      >
        <CarouselContent className="-ml-6">
          {demos.map((demo, index) => {
            const isCenter = centerIndices.includes(index);

            return (
              <CarouselItem
                key={demo.id}
                className="basis-4/5 pl-6 sm:basis-5/12 md:basis-1/3 lg:basis-1/4"
                onClick={() => handleSlideClick(index)}
              >
                <div
                  className={cn(
                    "h-full transition-all duration-500 ease-out",
                    isCenter
                      ? "scale-100 opacity-100"
                      : "scale-90 cursor-pointer opacity-40 blur-px"
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
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card-glass px-8 py-7 backdrop-blur-sm">
      {/* Blue pill label */}
      <div className="mb-5 inline-flex h-9 w-fit items-center justify-center rounded-full bg-primary px-7 text-lg font-semibold text-white">
        {demo.label}
      </div>

      {/* Description */}
      <p className="mb-5 text-center text-base font-light tracking-wide text-text-primary">
        {demo.description}
      </p>

      {/* Player row */}
      <div className="mb-5 flex items-center gap-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay();
          }}
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center"
          aria-label={isPlaying ? `Стоп ${demo.label}` : `Грати ${demo.label}`}
        >
          {isPlaying ? (
            <div className="flex size-10 items-center justify-center rounded-full bg-primary">
              <Square className="size-3.5 fill-white text-white" />
            </div>
          ) : (
            <PlayIcon />
          )}
        </button>
        <WaveformSvg />
      </div>

      {/* Scenario white card */}
      <div className="mb-4 rounded-xl bg-white px-5 py-4">
        <div className="flex items-start gap-3">
          <CheckedIcon className="mt-0.5 shrink-0" />
          <p className="text-base font-light tracking-wide text-text-primary">
            {demo.scenario}
          </p>
        </div>
      </div>

      {/* Result row */}
      <div className="mt-auto flex items-center gap-3 rounded-xl bg-white px-5 py-3">
        <div className="size-2.5 shrink-0 rounded-full bg-primary" />
        <p className="text-base font-light tracking-wide text-text-primary">
          {demo.result}
        </p>
      </div>
    </div>
  );
}

/* ─── Icons ─── */

function PlayIcon() {
  return (
    <svg
      width="39"
      height="39"
      viewBox="0 0 39 39"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="19.5" cy="19.5" r="19.5" className="fill-primary" />
      <polygon points="16,11 16,28 29,19.5" fill="white" />
    </svg>
  );
}

function WaveformSvg() {
  return (
    <svg
      className="h-9 flex-1"
      viewBox="0 0 200 36"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {Array.from({ length: 40 }).map((_, i) => {
        const heights = [8, 14, 20, 28, 16, 24, 12, 30, 18, 10, 22, 26, 14, 32, 20, 8, 24, 16, 28, 12, 18, 30, 10, 22, 26, 14, 20, 32, 8, 16, 24, 28, 12, 18, 22, 30, 14, 10, 26, 20];
        const h = heights[i % heights.length];
        const y = (36 - h) / 2;
        return (
          <rect
            key={i}
            x={i * 5}
            y={y}
            width="2.5"
            height={h}
            rx="1.25"
            className="fill-primary/60"
          />
        );
      })}
    </svg>
  );
}

function CheckedIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="5"
        className="stroke-primary"
        strokeWidth="1.5"
      />
      <path
        d="M7 12l3.5 3.5L17 9"
        className="stroke-primary"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
