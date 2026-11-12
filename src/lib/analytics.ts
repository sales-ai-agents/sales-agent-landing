interface AnalyticsEventMap {
  signup_click: { location: string };
  pricing_plan_click: { plan: string };
  lead_modal_open: { location: string };
  lead_form_submit: { location: string };
  feedback_form_submit: { location: string };
  test_call_start: { location: string };
  test_call_start_click: { location: string };
  demo_audio_play: { demo_id: string };
  video_play: { location: string; start: number };
  blog_cta_click: { location: string; slug?: string };
  contact_click: { method: "phone" | "email"; location: string };
  sign_up: { method: "email" };
  login: { method: "email" | "google" | "github" | "apple" };
}

export type AnalyticsEvent = keyof AnalyticsEventMap;

export type AnalyticsEventParams<TEvent extends AnalyticsEvent> = AnalyticsEventMap[TEvent];

type Gtag = (command: "event", eventName: string, params: object) => void;

export function trackEvent<TEvent extends AnalyticsEvent>(
  eventName: TEvent,
  params: AnalyticsEventParams<TEvent>
): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", eventName, params);
}
