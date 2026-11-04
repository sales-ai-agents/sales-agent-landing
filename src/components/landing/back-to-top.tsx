"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { StrokeIcon } from "@/components/landing/icons";

const REVEAL_VIEWPORTS = 1;
const FOCUS_TARGET_SELECTOR = "main";

const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = (): void => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * REVEAL_VIEWPORTS);
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

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "instant" : "smooth" });
    const main = document.querySelector<HTMLElement>(FOCUS_TARGET_SELECTOR);
    if (!main) return;
    if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      className={cn("to-top", visible && "show")}
      aria-label="Повернутися нагору"
      title="Нагору"
      onClick={scrollToTop}
    >
      <StrokeIcon name="arrowUp" weight={2.4} />
    </button>
  );
}
