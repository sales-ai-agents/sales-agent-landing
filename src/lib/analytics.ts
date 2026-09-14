export type AnalyticsEvent =
  | "signup_click"
  | "lead_modal_open"
  | "lead_form_submit"
  | "feedback_form_submit"
  | "test_call_start"
  | "test_call_start_click"
  | "demo_audio_play"
  | "calculator_calculate"
  | "pricing_plan_click";

type AnalyticsEventParams = Record<string, string | number | boolean>;

export function trackEvent(eventName: AnalyticsEvent, params?: AnalyticsEventParams): void {
  if (typeof window === "undefined") return;
  if (!("gtag" in window)) return;

  (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", eventName, params);
}
