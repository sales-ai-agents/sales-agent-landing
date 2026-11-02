"use client";

import { useEffect, useLayoutEffect } from "react";
import { parallaxRibbon, setupScenarios } from "./scroll-effects";
import { playHeroIntro, revealBlocks, revealLines, watchCounters, watchInClass } from "./reveals";
import { startSmoothScroll } from "./smooth-scroll";
import { ANIM_ATTRIBUTE, ANIM_READY_ATTRIBUTE, prefersReducedMotion, type Cleanup } from "./shared";

const ROOT_SELECTOR = ".c4u";

const findRoot = (): HTMLElement | null => document.querySelector<HTMLElement>(ROOT_SELECTOR);

const startAnimations = (root: HTMLElement, reduce: boolean): Cleanup[] => {
  const always = [startSmoothScroll(reduce), watchCounters(root, reduce), watchInClass(root)];
  const scenarios = setupScenarios(root, reduce);
  if (reduce) return [...always, scenarios];
  return [
    ...always,
    scenarios,
    playHeroIntro(root),
    revealLines(root),
    revealBlocks(root),
    parallaxRibbon(root),
  ];
};

export function LandingMotion() {
  useLayoutEffect(() => {
    const root = findRoot();
    if (!root) return;
    if (prefersReducedMotion()) root.removeAttribute(ANIM_ATTRIBUTE);
    else root.setAttribute(ANIM_ATTRIBUTE, "");
    root.setAttribute(ANIM_READY_ATTRIBUTE, "");
  }, []);

  useEffect(() => {
    const root = findRoot();
    if (!root) return;
    const cleanups = startAnimations(root, prefersReducedMotion());
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
