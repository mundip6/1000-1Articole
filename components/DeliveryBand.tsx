"use client";

import Link from "next/link";
import { ChevronDown, MapPin, Truck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CITIES_BY_COUNTY, CITY_SCHEDULE } from "@/lib/deliverySchedule";

const STORAGE_KEY = "1001-delivery-city";

export default function DeliveryBand({
  minBM,
  minOther,
  feeBM = "0",
  feeOther = "0",
}: {
  minBM: string;
  minOther: string;
  feeBM?: string;
  feeOther?: string;
}) {
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
  const fee = info?.isMaramures ? Number(feeBM) : Number(feeOther);
  const hasFee = fee > 0;

  return (
    <div className="relative z-30 bg-neutral-900 px-4 py-2 text-xs text-neutral-300">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <Truck size={12} className="shrink-0 text-brand" />

        {info ? (
          <>
            <span>
              Livrare <strong className="text-white">{info.day}</strong>
              {" · "}
              <strong className="text-white">{city}</strong>
              {" · "}
              {hasFee
                ? <>livrare gratuita peste <strong className="text-white">{min} lei</strong></>
                : <>minim <strong className="text-white">{min} lei</strong></>}
            </span>
            <button
              onClick={resetCity}
              className="flex items-center gap-1 text-neutral-500 hover:text-white"
              aria-label="Schimba orasul"
            >
              <X size={11} />
            </button>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">
              {Number(feeBM) > 0
                ? <>Baia Mare — livrare gratuita peste <strong className="text-white">{minBM} lei</strong></>
                : <>Baia Mare — minim <strong className="text-white">{minBM} lei</strong></>}
              {" · "}
              {Number(feeOther) > 0
                ? <>alte localitati — livrare gratuita peste <strong className="text-white">{minOther} lei</strong></>
                : <>alte localitati — minim <strong className="text-white">{minOther} lei</strong></>}
              {" · "}
            </span>

            <div ref={ref} className="relative">
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1 font-semibold text-brand hover:text-red-400"
              >
                <MapPin size={11} /> Alege orasul tau <ChevronDown size={11} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
              </button>

              {open && (
                <div className="absolute left-1/2 top-full mt-1 w-64 -translate-x-1/2 rounded-lg border border-neutral-700 bg-neutral-800 py-2 shadow-xl">
                  {Object.entries(CITIES_BY_COUNTY).map(([county, cities]) => (
                    <div key={county}>
                      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-500">
                        {county}
                      </div>
                      {cities.map((c) => {
                        const s = CITY_SCHEDULE[c];
                        return (
                          <button
                            key={c}
                            onClick={() => selectCity(c)}
                            className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-700"
                          >
                            <span className="font-semibold text-white">{c}</span>
                            <span className="text-neutral-400">{s.day}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                  <div className="mt-1 border-t border-neutral-700 px-3 pt-2 pb-1">
                    <Link
                      href="/cum-comand"
                      onClick={() => setOpen(false)}
                      className="text-[10px] text-brand hover:underline"
                    >
                      Vezi toate rutele de livrare →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <Link
          href="/cum-comand"
          className="text-neutral-500 hover:text-white hover:underline underline-offset-2"
        >
          Vezi zilele →
        </Link>
      </div>
    </div>
  );
}
