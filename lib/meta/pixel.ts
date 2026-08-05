import type { MetaEventData, MetaEventName } from "./types";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? "";

export function newEventId(): string {
  return crypto.randomUUID();
}

export function pageview(): void {
  window.fbq?.("track", "PageView");
}

export function track(
  name: MetaEventName,
  data: MetaEventData = {},
  eventId?: string,
): void {
  window.fbq?.("track", name, data, eventId ? { eventID: eventId } : undefined);
}
