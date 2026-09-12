"use client";

import { newEventId, track } from "./pixel";
import type { MetaEventData, MetaEventName, MetaUserData } from "./types";

const META_USER_KEY = "meta_user";

export function saveMetaUser(user: MetaUserData): void {
  try {
    localStorage.setItem(META_USER_KEY, JSON.stringify(user));
  } catch {}
}

function getStoredUserData(): MetaUserData | undefined {
  try {
    const raw = localStorage.getItem(META_USER_KEY);
    return raw ? (JSON.parse(raw) as MetaUserData) : undefined;
  } catch {
    return undefined;
  }
}

function roundData(customData: MetaEventData): MetaEventData {
  const data = { ...customData };
  if (typeof data.value === "number") {
    data.value = Math.round(data.value * 100) / 100;
  }
  if (data.contents) {
    data.contents = data.contents.map((c) => ({
      ...c,
      item_price: typeof c.item_price === "number" ? Math.round(c.item_price * 100) / 100 : c.item_price,
    }));
  }
  return data;
}

export async function sendMetaEvent(
  name: MetaEventName,
  customData: MetaEventData = {},
  userData?: MetaUserData,
): Promise<void> {
  const eventId = newEventId();
  const data = roundData(customData);
  const eventSourceUrl = window.location.origin + window.location.pathname;
  const resolvedUser = userData ?? getStoredUserData();

  track(name, data, eventId);

  try {
    await fetch("/api/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName: name, eventId, eventSourceUrl, customData: data, userData: resolvedUser }),
    });
  } catch (err) {
    console.error("CAPI send failed:", err);
  }
}
