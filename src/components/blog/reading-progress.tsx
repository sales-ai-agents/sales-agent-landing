"use client";

import { useEffect, useRef } from "react";

const ARTICLE_SELECTOR = "[data-article-body]";
const TRIGGER_OFFSET = 0.3;

export function ReadingProgress() {
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const article = document.querySelector<HTMLElement>(ARTICLE_SELECTOR);
    if (!bar || !article) return;
    let frame = 0;

    const update = (): void => {
      frame = 0;
      const { top, height } = article.getBoundingClientRect();
      const ratio = (window.innerHeight * TRIGGER_OFFSET - top) / height;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    };
    const schedule = (): void => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div className="progress" aria-hidden="true">
      <i ref={barRef} />
    </div>
  );
}
