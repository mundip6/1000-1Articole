"use client";

import { newEventId, track } from "./pixel";
import type { MetaEventData, MetaEventName, MetaUserData } from "./types";

export async function sendMetaEvent(
  name: MetaEventName,
  customData: MetaEventData = {},
  userData?: MetaUserData,
): Promise<void> {
  const eventId = newEventId();

  track(name, customData, eventId);

  try {
    await fetch("/api/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: name,
        eventId,
        eventSourceUrl: window.location.href,
        customData,
        userData,
      }),
    });
  } catch (err) {
    console.error("CAPI send failed:", err);
  }
}
