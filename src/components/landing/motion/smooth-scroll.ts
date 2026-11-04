import Lenis from "lenis";
import type { Cleanup } from "./shared";

const NAV_OFFSET = -84;
const SCROLL_DURATION = 1.4;
const TOP_HASH = "#top";
const HERO_PHONE_SELECTOR = "#heroForm [data-phone]";

type ScrollTarget = HTMLElement | 0;

interface ScrollRequest {
  readonly hash: string;
  readonly target: ScrollTarget;
  readonly focusPhone: boolean;
}

const elementFromHash = (hash: string): HTMLElement | null => {
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
};

const focusHeroPhone = (): void => {
  document.querySelector<HTMLInputElement>(HERO_PHONE_SELECTOR)?.focus({ preventScroll: true });
};

const focusAnchorTarget = (hash: string): void => {
  const element = elementFromHash(hash);
  if (!element) return;
  if (!element.hasAttribute("tabindex")) element.setAttribute("tabindex", "-1");
  element.focus({ preventScroll: true });
};

const settle = ({ hash, focusPhone }: ScrollRequest): void => {
  if (focusPhone) focusHeroPhone();
  else focusAnchorTarget(hash);
};

const isModifiedClick = (event: MouseEvent): boolean =>
  event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

const isSamePageLink = (anchor: HTMLAnchorElement): boolean => {
  if (anchor.hasAttribute("download")) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  const url = new URL(anchor.href, window.location.href);
  return url.pathname === window.location.pathname && url.hash !== "";
};

const resolveRequest = (event: MouseEvent): ScrollRequest | null => {
  if (event.defaultPrevented || isModifiedClick(event)) return null;
  const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
  if (!anchor || !isSamePageLink(anchor)) return null;
  const { hash } = new URL(anchor.href, window.location.href);
  const target = hash === TOP_HASH ? 0 : elementFromHash(hash);
  if (target === null) return null;
  return { hash, target, focusPhone: anchor.hasAttribute("data-focus-phone") };
};

const scrollWithLenis = (lenis: Lenis, request: ScrollRequest): void => {
  lenis.scrollTo(request.target, {
    offset: request.target === 0 ? 0 : NAV_OFFSET,
    duration: SCROLL_DURATION,
    onComplete: () => settle(request),
  });
};

const scrollInstantly = (request: ScrollRequest): void => {
  const { target } = request;
  const top = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
  window.scrollTo({ top, behavior: "instant" });
  settle(request);
};

export function startSmoothScroll(reduce: boolean): Cleanup {
  const lenis = reduce ? null : new Lenis({ lerp: 0.1, autoRaf: true });

  const onClick = (event: MouseEvent): void => {
    const request = resolveRequest(event);
    if (!request) return;
    event.preventDefault();
    if (window.location.hash !== request.hash) window.history.pushState(null, "", request.hash);
    if (lenis) scrollWithLenis(lenis, request);
    else scrollInstantly(request);
  };

  document.addEventListener("click", onClick);
  return () => {
    document.removeEventListener("click", onClick);
    lenis?.destroy();
  };
}
