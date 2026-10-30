"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Phone, PhoneMissed, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { Badge, Button, Card } from "@/components/ui";
import { ScrollReveal, ScaleReveal } from "@/components/marketing/scroll-reveal";
import type { VideoChapter } from "@marketing/types";
import { VIDEO_CHAPTERS, VIDEO_ID } from "@marketing/data";

const SECONDS_PER_MINUTE = 60;
const LISTEN_BADGE = "Слухати";

function parseTimeToSeconds(time: string): number {
  const [minutes, seconds] = time.split(":").map(Number);
  return minutes * SECONDS_PER_MINUTE + seconds;
}

function buildEmbedSrc(startSeconds: number): string {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    start: String(startSeconds),
  });
  return `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?${params.toString()}`;
}

export function VideoSection() {
  const [startSeconds, setStartSeconds] = useState<number | null>(null);

  function playFrom(seconds: number): void {
    setStartSeconds(seconds);
    trackEvent("video_play", { video_id: VIDEO_ID, start: seconds });
  }

  return (
    <section id="video" className="relative overflow-hidden py-20">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up" distance={30}>
          <h2 className="font-display mx-auto mb-6 max-w-3xl text-center text-3xl sm:text-4xl md:text-5xl">
            <span className="text-foreground">Де ваш бізнес </span>
            <span className="text-primary">втрачає клієнтів</span>
            <span className="text-foreground"> на дзвінках</span>
          </h2>

          <p className="text-muted-foreground mx-auto mb-12 max-w-xl text-center text-base md:text-lg">
            Рахуємо, скільки коштують пропущені дзвінки,{" "}
            <span className="text-foreground font-semibold">до 60 000 ₴ на місяць</span>, і
            показуємо <span className="text-foreground font-semibold">реальний дзвінок</span>{" "}
            AI-агента.
          </p>
        </ScrollReveal>

        <ScaleReveal delay={0.15} duration={0.7} className="relative">
          <ChipMissedCall />
          <ChipAgentCalledBack />

          <div className="bg-primary shadow-primary/30 relative grid gap-6 rounded-3xl p-5 shadow-xl sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
            <VideoPlayer startSeconds={startSeconds} onPlay={() => playFrom(0)} />

            <div className="flex flex-col">
              <ChaptersList chapters={VIDEO_CHAPTERS} onSelect={playFrom} />

              <Button
                size="lg"
                render={
                  <Link
                    href="/sign-up"
                    onClick={() => trackEvent("signup_click", { location: "video_section" })}
                  />
                }
                className="text-primary mt-6 h-12 w-full gap-2 rounded-full bg-white text-base font-semibold hover:bg-white/90"
              >
                Спробувати безкоштовно
                <ArrowUpRight className="size-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </ScaleReveal>
      </div>
    </section>
  );
}

interface VideoPlayerProps {
  readonly startSeconds: number | null;
  readonly onPlay: () => void;
}

function VideoPlayer({ startSeconds, onPlay }: VideoPlayerProps) {
  if (startSeconds !== null) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
        <iframe
          key={startSeconds}
          src={buildEmbedSrc(startSeconds)}
          title="Де ваш бізнес втрачає клієнтів на дзвінках"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label="Відтворити відео"
      className="group focus-visible:ring-ring focus-visible:ring-offset-primary relative aspect-video w-full cursor-pointer overflow-hidden rounded-2xl bg-black focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Image
        src="/image/preview.png"
        alt="Прев'ю відео про втрачені дзвінки"
        fill
        sizes="(max-width: 1024px) 100vw, 60vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute inset-0 grid place-items-center">
        <span className="bg-primary/90 grid size-16 place-items-center rounded-full ring-8 ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 md:size-20">
          <Play className="size-7 fill-white text-white md:size-9" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}

interface ChaptersListProps {
  readonly chapters: readonly VideoChapter[];
  readonly onSelect: (seconds: number) => void;
}

function ChaptersList({ chapters, onSelect }: ChaptersListProps) {
  return (
    <div className="flex flex-col">
      <p className="mb-4 text-xl font-bold text-white">У відео</p>

      <ul className="flex flex-col divide-y divide-white/15">
        {chapters.map((chapter) => (
          <ChapterRow key={chapter.time} chapter={chapter} onSelect={onSelect} />
        ))}
      </ul>
    </div>
  );
}

interface ChapterRowProps {
  readonly chapter: VideoChapter;
  readonly onSelect: (seconds: number) => void;
}

function ChapterRow({ chapter, onSelect }: ChapterRowProps) {
  const { time, title, highlighted, badge } = chapter;

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(parseTimeToSeconds(time))}
        aria-label={`Перейти до ${time} — ${title}`}
        className="focus-visible:ring-ring focus-visible:ring-offset-primary flex w-full cursor-pointer items-center gap-3 rounded-lg py-2.5 text-left transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <span
          className={cn(
            "w-10 shrink-0 pl-2 text-sm font-bold tabular-nums",
            highlighted ? "text-white" : "text-white/65"
          )}
        >
          {time}
        </span>

        <span
          className={cn(
            "flex-1 text-sm",
            highlighted ? "font-bold text-white" : "font-normal text-white/80"
          )}
        >
          {title}
        </span>

        {badge && (
          <Badge
            className={cn(
              "mr-2 shrink-0",
              badge === LISTEN_BADGE ? "text-primary bg-white" : "bg-white/15 text-white"
            )}
          >
            {badge}
          </Badge>
        )}
      </button>
    </li>
  );
}

function ChipMissedCall() {
  return (
    <Card className="absolute -top-3 right-2 z-10 hidden items-center gap-3 rounded-2xl px-4 py-3 shadow-lg md:flex lg:right-8">
      <Badge
        variant="destructive"
        className="bg-destructive/10 text-destructive grid size-9 place-items-center p-0"
      >
        <PhoneMissed className="size-4" aria-hidden="true" />
      </Badge>
      <span className="flex flex-col">
        <span className="text-foreground text-sm font-bold">Пропущений дзвінок</span>
        <span className="text-muted-foreground text-xs">Сьогодні, 19:42</span>
      </span>
    </Card>
  );
}

function ChipAgentCalledBack() {
  return (
    <Card className="absolute -bottom-3 left-2 z-10 hidden items-center gap-3 rounded-2xl px-4 py-3 shadow-lg md:flex lg:left-8">
      <Badge variant="success" className="grid size-9 place-items-center p-0">
        <Phone className="size-4" aria-hidden="true" />
      </Badge>
      <span className="flex flex-col">
        <span className="text-foreground text-sm font-bold">AI-агент передзвонив</span>
        <span className="text-muted-foreground text-xs">через 30 секунд · запис підтверджено</span>
      </span>
    </Card>
  );
}
