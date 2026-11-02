import { animate, scroll } from "framer-motion";
import { noop, type Cleanup } from "./shared";

const PIN_QUERY = "(min-width: 1000px) and (min-height: 640px)";
const SCRUB_RATE = 4.3;
const SETTLE_THRESHOLD = 0.0005;

interface ScenarioParts {
  section: HTMLElement;
  pin: HTMLElement;
  view: HTMLElement;
  track: HTMLElement;
  setProgress: (progress: number) => void;
}

export function parallaxRibbon(root: HTMLElement): Cleanup {
  const ribbon = root.querySelector<HTMLElement>(".slab-ribbon");
  const slab = root.querySelector<HTMLElement>(".slab");
  if (!ribbon || !slab) return noop;
  const animation = animate(ribbon, { y: ["14%", "-10%"] }, { ease: "linear" });
  return scroll(animation, { target: slab, offset: ["start end", "end start"] });
}

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

function pinScenarios({ section, pin, view, track, setProgress }: ScenarioParts): Cleanup {
  let distance = 0;
  let current = 0;
  let target = 0;
  let frame = 0;
  let last = 0;

  const tick = (now: number): void => {
    const delta = Math.min(0.064, (now - last) / 1000);
    last = now;
    current += (target - current) * (1 - Math.exp(-delta * SCRUB_RATE));
    if (Math.abs(target - current) < SETTLE_THRESHOLD) current = target;
    track.style.transform = `translate3d(${-current * distance}px,0,0)`;
    frame = current === target ? 0 : requestAnimationFrame(tick);
  };

  const update = (): void => {
    target = distance ? clamp01(-section.getBoundingClientRect().top / distance) : 0;
    setProgress(target);
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };

  const measure = (): void => {
    distance = Math.max(0, track.scrollWidth - view.clientWidth);
    section.style.height = `${window.innerHeight + distance}px`;
    update();
  };

  section.classList.add("hs--pinned");
  Object.assign(pin.style, { position: "sticky", top: "0px" });
  const observer = new ResizeObserver(measure);
  observer.observe(track);
  observer.observe(view);
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", measure);
  measure();
  current = target;

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", measure);
    section.classList.remove("hs--pinned");
    pin.style.removeProperty("position");
    pin.style.removeProperty("top");
    section.style.removeProperty("height");
    track.style.removeProperty("transform");
  };
}

const findScenarioParts = (root: HTMLElement): ScenarioParts | null => {
  const section = root.querySelector<HTMLElement>(".hs");
  const pin = section?.querySelector<HTMLElement>(".hs-pin");
  const view = section?.querySelector<HTMLElement>(".hs-view");
  const track = section?.querySelector<HTMLElement>(".hs-track");
  const bar = section?.querySelector<HTMLElement>(".hs-progress i");
  const counter = section?.querySelector<HTMLElement>(".hs-count b");
  if (!section || !pin || !view || !track || !bar || !counter) return null;
  const total = track.querySelectorAll(".sc").length;

  const setProgress = (progress: number): void => {
    bar.style.transform = `scaleX(${progress})`;
    counter.textContent = String(Math.min(total, 1 + Math.floor(progress * total))).padStart(
      2,
      "0"
    );
  };
  return { section, pin, view, track, setProgress };
};

export function setupScenarios(root: HTMLElement, reduce: boolean): Cleanup {
  const parts = findScenarioParts(root);
  if (!parts) return noop;
  const { view, setProgress } = parts;

  const onViewScroll = (): void =>
    setProgress(view.scrollLeft / Math.max(1, view.scrollWidth - view.clientWidth));
  view.addEventListener("scroll", onViewScroll, { passive: true });

  const media = window.matchMedia(PIN_QUERY);
  let disposePin: Cleanup | null = null;
  const sync = (): void => {
    disposePin?.();
    disposePin = !reduce && media.matches ? pinScenarios(parts) : null;
  };
  sync();
  media.addEventListener("change", sync);

  return () => {
    view.removeEventListener("scroll", onViewScroll);
    media.removeEventListener("change", sync);
    disposePin?.();
  };
}
