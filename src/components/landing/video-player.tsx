"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { trackProps } from "@/components/landing/click-tracking";
import { SIGN_UP_URL, VIDEO_ID } from "@/components/landing/data";
import { useLandingCopy } from "@/components/landing/copy/provider";
import { CheckIcon, PlayIcon, StrokeIcon } from "@/components/landing/icons";
import { Arrow } from "@/components/landing/typography";

const formatChapter = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

const embedUrl = (startSeconds: number, language: string): string =>
  `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&hl=${language}&start=${startSeconds}`;

export function VideoPlayer() {
  const { locale, copy } = useLandingCopy();
  const video = copy.video;
  const [startAt, setStartAt] = useState<number | null>(null);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const isPlaying = startAt !== null;

  const play = (startSeconds: number): void => {
    setStartAt(startSeconds);
    trackEvent("video_play", { location: "landing_video", start: startSeconds });
  };

  const playChapter = (startSeconds: number): void => {
    setActiveChapter(startSeconds);
    play(startSeconds);
  };

  return (
    <div className="vid">
      <div className="vid-l" data-r="">
        <div className={cn("vid-player", isPlaying && "playing")}>
          {isPlaying ? (
            <iframe
              key={startAt}
              src={embedUrl(startAt, locale)}
              title={video.iframeTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button
              type="button"
              className="vid-start"
              aria-label={video.startLabel}
              onClick={() => play(0)}
            >
              <Image
                src="/image/landing/preview.webp"
                alt=""
                width={1280}
                height={720}
                sizes="(max-width: 1100px) 100vw, 56vw"
              />
              <span className="vid-play" aria-hidden="true">
                <PlayIcon />
              </span>
            </button>
          )}
        </div>
        <div className="vid-chip a">
          <i>
            <StrokeIcon name="phoneMissed" weight={2.2} />
          </i>
          <div>
            <b>{video.missedTitle}</b>
            <small>{video.missedTime}</small>
          </div>
        </div>
        <div className="vid-chip b">
          <i>
            <CheckIcon />
          </i>
          <div>
            <b>{video.callbackTitle}</b>
            <small>{video.callbackNote}</small>
          </div>
        </div>
      </div>

      <div className="vid-r" data-r="">
        <div className="chapters">
          {video.chapters.map((chapter) => (
            <button
              key={chapter.startSeconds}
              type="button"
              className={cn(activeChapter === chapter.startSeconds && "on")}
              onClick={() => playChapter(chapter.startSeconds)}
            >
              <span className="mono">{formatChapter(chapter.startSeconds)}</span>
              {chapter.label}
              {chapter.badge ? <em>{chapter.badge}</em> : <span />}
            </button>
          ))}
        </div>
        <a
          className="btn btn-blue"
          href={SIGN_UP_URL}
          {...trackProps("signup_click", { location: "landing_video" })}
        >
          {video.signUp} <Arrow />
        </a>
      </div>
    </div>
  );
}
