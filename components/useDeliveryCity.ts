"use client";

import { useCallback, useEffect, useState } from "react";
import { CITY_SCHEDULE, resolveDelivery, type DeliveryMatch } from "@/lib/deliverySchedule";

const STORAGE_KEY = "1001-delivery-city";

export type CitySelection = { city: string; county: string };

function readStored(): CitySelection | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<CitySelection>;
    if (parsed && typeof parsed.city === "string" && parsed.city) {
      return { city: parsed.city, county: typeof parsed.county === "string" ? parsed.county : "" };
    }
    return null;
  } catch {
    // Legacy format stored the bare city name
    return { city: raw, county: CITY_SCHEDULE[raw]?.county ?? "" };
  }
}

/** Remembers the visitor's locality across the header band and product pages. */
export function useDeliveryCity() {
  const [selection, setSelection] = useState<CitySelection | null>(null);

  useEffect(() => {
    try {
      setSelection(readStored());
    } catch {
      // storage blocked — fall back to no saved city
    }
  }, []);

  const select = useCallback((next: CitySelection) => {
    setSelection(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage blocked — keep it in memory for this page view
    }
  }, []);

  const clear = useCallback(() => {
    setSelection(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // nothing to clear
    }
  }, []);

  const match: DeliveryMatch = selection
    ? resolveDelivery(selection.city, selection.county)
    : { kind: "none" };

  return { selection, select, clear, match };
}
