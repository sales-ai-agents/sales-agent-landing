import Lenis from "lenis";
import type { Cleanup } from "./shared";

const NAV_OFFSET = -84;
const SCROLL_DURATION = 1.4;
const FOCUS_FALLBACK_DELAY_MS = 700;
const HERO_PHONE_SELECTOR = "#heroForm [data-phone]";

type ScrollTarget = HTMLElement | 0;

const focusHeroPhone = (): void => {
  document.querySelector<HTMLInputElement>(HERO_PHONE_SELECTOR)?.focus({ preventScroll: true });
};

const resolveTarget = (anchor: HTMLAnchorElement): ScrollTarget | null => {
  const url = new URL(anchor.href, window.location.href);
  if (url.pathname !== window.location.pathname || !url.hash) return null;
  if (url.hash === "#top") return 0;
  return document.querySelector<HTMLElement>(url.hash);
};

const nativeScroll = (target: ScrollTarget, reduce: boolean, focusPhone: boolean): void => {
  const top = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  if (focusPhone) setTimeout(focusHeroPhone, FOCUS_FALLBACK_DELAY_MS);
};

export function startSmoothScroll(reduce: boolean): Cleanup {
  const lenis = reduce ? null : new Lenis({ lerp: 0.1, autoRaf: true });

  const onClick = (event: MouseEvent): void => {
    const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
    if (!anchor) return;
    const target = resolveTarget(anchor);
    if (target === null) return;
    event.preventDefault();
    const focusPhone = anchor.hasAttribute("data-focus-phone");
    if (!lenis) {
      nativeScroll(target, reduce, focusPhone);
      return;
    }
    lenis.scrollTo(target, {
      offset: target === 0 ? 0 : NAV_OFFSET,
      duration: SCROLL_DURATION,
      onComplete: () => focusPhone && focusHeroPhone(),
    });
  };

  document.addEventListener("click", onClick);
  return () => {
    document.removeEventListener("click", onClick);
    lenis?.destroy();
  };
}
