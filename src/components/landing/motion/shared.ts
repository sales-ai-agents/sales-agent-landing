export type Cleanup = () => void;

export const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
export const POWER3_OUT = [0.215, 0.61, 0.355, 1] as const;
export const QUART_OUT = [0.25, 1, 0.5, 1] as const;

export const ANIM_ATTRIBUTE = "data-anim";
export const ANIM_READY_ATTRIBUTE = "data-anim-ready";

export const noop: Cleanup = () => undefined;

export const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const queryAll = <TElement extends Element = HTMLElement>(
  root: ParentNode,
  selector: string
): TElement[] => Array.from(root.querySelectorAll<TElement>(selector));

export const clearTransform = (elements: readonly HTMLElement[]): void => {
  elements.forEach((element) => element.style.removeProperty("transform"));
};

export const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
