export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  if (!("gtag" in window)) return;

  (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", eventName, params);
}
