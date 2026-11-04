"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";

const DEFAULT_MARGIN = "600px 0px";

export function useNearViewport(
  targetRef: RefObject<Element | null>,
  rootMargin: string = DEFAULT_MARGIN
): boolean {
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || isNear) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsNear(true);
      },
      { rootMargin }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef, rootMargin, isNear]);

  return isNear;
}
