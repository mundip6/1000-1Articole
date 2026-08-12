"use client";

import { ChevronDown, MapPin, Truck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CITIES_BY_COUNTY, CITY_SCHEDULE } from "@/lib/deliverySchedule";

const STORAGE_KEY = "1001-delivery-city";

export default function DeliveryInfo({ minBM, minOther }: { minBM: string; minOther: string }) {
  const [city, setCity] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setCity(saved);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectCity(c: string) {
    setCity(c);
    localStorage.setItem(STORAGE_KEY, c);
    setOpen(false);
  }

  function resetCity() {
    setCity(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const info = city ? CITY_SCHEDULE[city] : null;
  const min = info?.isMaramures ? minBM : minOther;

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm">
      <div className="flex items-start gap-3">
        <Truck size={15} className="mt-0.5 shrink-0 text-brand" />
        <div className="flex-1">
          {info ? (
            <div className="flex items-center justify-between gap-2">
              <span>
                Livrare <strong className="text-neutral-900">{info.day}</strong>
                <span className="text-neutral-400"> · {city} · </span>
                minim <strong className="text-neutral-900">{min} lei</strong>
              </span>
              <button
                onClick={resetCity}
                className="shrink-0 text-neutral-400 hover:text-neutral-700"
                aria-label="Schimba orasul"
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <div ref={ref} className="relative">
              <p className="mb-2 text-neutral-500">Alege orasul tau pentru a vedea ziua de livrare:</p>
              <button
                onClick={() => setOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold hover:border-brand hover:text-brand"
              >
                <MapPin size={12} /> Alege orasul{" "}
                <ChevronDown size={12} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
              </button>
              {open && (
                <div className="absolute left-0 top-full z-20 mt-1 w-64 rounded-lg border border-neutral-200 bg-white py-2 shadow-xl">
                  {Object.entries(CITIES_BY_COUNTY).map(([county, cities]) => (
                    <div key={county}>
                      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                        {county}
                      </div>
                      {cities.map((c) => {
                        const s = CITY_SCHEDULE[c];
                        return (
                          <button
                            key={c}
                            onClick={() => selectCity(c)}
                            className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-50"
                          >
                            <span className="font-semibold">{c}</span>
                            <span className="text-neutral-400">{s.day}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
