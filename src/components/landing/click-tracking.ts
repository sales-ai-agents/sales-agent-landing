import type { AnalyticsEvent } from "@/lib/analytics";

export const TRACKED_EVENTS = [
  "signup_click",
  "pricing_plan_click",
  "test_call_start_click",
  "blog_cta_click",
  "contact_click",
] as const satisfies readonly AnalyticsEvent[];

export type TrackedEvent = (typeof TRACKED_EVENTS)[number];

export type TrackParams = Readonly<Record<string, string | undefined>>;

const PARAM_ATTRIBUTE_PREFIX = "data-track-";

export const isTrackedEvent = (value: string): value is TrackedEvent =>
  (TRACKED_EVENTS as readonly string[]).includes(value);

export const trackProps = (event: TrackedEvent, params: TrackParams = {}) => ({
  "data-track": event,
  ...Object.fromEntries(
    Object.entries(params).map(([name, value]) => [`${PARAM_ATTRIBUTE_PREFIX}${name}`, value])
  ),
});
