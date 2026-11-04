import { animate, inView, stagger } from "framer-motion/dom";
import { clearTransform, EXPO_OUT, POWER3_OUT, queryAll, QUART_OUT, type Cleanup } from "./shared";

const BLOCK_STAGGER = 0.06;
const LINE_STAGGER = 0.09;
const COUNT_DURATION = 1.5;

const stopAll =
  (stops: readonly Cleanup[]): Cleanup =>
  () =>
    stops.forEach((stop) => stop());

function countUp(element: HTMLElement, reduce: boolean): void {
  if (element.dataset.done) return;
  element.dataset.done = "1";
  const target = Number(element.dataset.count);
  if (reduce) {
    element.textContent = String(target);
    return;
  }
  animate(0, target, {
    duration: COUNT_DURATION,
    ease: QUART_OUT,
    onUpdate: (value) => {
      element.textContent = String(Math.round(value));
    },
  });
}

export function revealBlocks(root: HTMLElement): Cleanup {
  let queue: HTMLElement[] = [];
  let frame = 0;

  const flush = (): void => {
    frame = 0;
    const batch = queue;
    queue = [];
    animate(
      batch,
      { opacity: [0, 1], y: [36, 0] },
      {
        duration: 0.8,
        ease: POWER3_OUT,
        delay: stagger(BLOCK_STAGGER),
      }
    ).then(() => clearTransform(batch));
  };

  const enqueue = (element: HTMLElement): void => {
    queue.push(element);
    if (!frame) frame = requestAnimationFrame(flush);
  };

  const stops = queryAll(root, "[data-r]").map((element) =>
    inView(element, () => enqueue(element), { margin: "0px 0px 60px 0px" })
  );
  return () => {
    cancelAnimationFrame(frame);
    stopAll(stops)();
  };
}

export function revealLines(root: HTMLElement): Cleanup {
  const stops = queryAll(root, "[data-lines]").map((heading) =>
    inView(
      heading,
      () => {
        animate(
          queryAll(heading, ".ln > span"),
          { y: ["115%", "0%"] },
          {
            duration: 1.15,
            ease: EXPO_OUT,
            delay: stagger(LINE_STAGGER),
          }
        );
      },
      { amount: 0 }
    )
  );
  return stopAll(stops);
}

export function watchCounters(root: HTMLElement, reduce: boolean): Cleanup {
  const stops = queryAll(root, "[data-count]").map((element) =>
    inView(element, () => countUp(element, reduce), { amount: 0.6 })
  );
  return stopAll(stops);
}

export function watchInClass(root: HTMLElement): Cleanup {
  const stops = queryAll(root, "[data-in]").map((element) =>
    inView(element, () => element.classList.add("in"), { amount: 0.25 })
  );
  return stopAll(stops);
}
