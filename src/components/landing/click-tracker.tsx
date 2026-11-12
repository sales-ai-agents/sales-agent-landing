"use client";

import { useEffect } from "react";
import { isTrackedEvent } from "@/components/landing/click-tracking";
import { trackEvent, type AnalyticsEventParams } from "@/lib/analytics";

const PARAM_KEY_PREFIX = "track";

const readParams = (dataset: DOMStringMap): Record<string, string> =>
  Object.fromEntries(
    Object.entries(dataset)
      .filter(([key, value]) => key.startsWith(PARAM_KEY_PREFIX) && key.length > 5 && value)
      .map(([key, value]) => [key.slice(PARAM_KEY_PREFIX.length).toLowerCase(), value as string])
  );

export function ClickTracker(): null {
  useEffect(() => {
    const handleClick = (event: MouseEvent): void => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>("[data-track]");
      const eventName = element?.dataset.track;
      if (!element || !eventName || !isTrackedEvent(eventName)) return;

      trackEvent(eventName, readParams(element.dataset) as AnalyticsEventParams<typeof eventName>);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
