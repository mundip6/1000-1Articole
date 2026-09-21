"use client";

import Link from "next/link";
import { ChevronDown, MapPin, Truck, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { CITIES_BY_COUNTY, COUNTIES, formatDays, isBaiaMare } from "@/lib/deliverySchedule";
import { useDeliveryCity } from "@/components/useDeliveryCity";

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
  const { selection, select, clear, match } = useDeliveryCity();
  const [open, setOpen] = useState(false);
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function confirm() {
    if (!county || !city.trim()) return;
    select({ city: city.trim(), county });
    setOpen(false);
    setCounty("");
    setCity("");
  }

  const isBM = isBaiaMare(selection?.city ?? "");
  const min = isBM ? minBM : minOther;
  const hasFee = (isBM ? Number(feeBM) : Number(feeOther)) > 0;

  const minText = hasFee
    ? <>livrare gratuita peste <strong className="text-white">{min} lei</strong></>
    : <>minim <strong className="text-white">{min} lei</strong></>;

  return (
    <div className="relative z-30 bg-neutral-900 px-4 py-2 text-xs text-neutral-300">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <Truck size={12} className="shrink-0 text-brand" />

        {selection && match.kind !== "none" ? (
          <>
            <span>
              {match.kind === "route" ? (
                <>Livrare <strong className="text-white">{match.day}</strong></>
              ) : (
                <>Estimativ <strong className="text-white">{formatDays(match.days)}</strong></>
              )}
              {" · "}
              <strong className="text-white">{selection.city}</strong>
              {" · "}
              {minText}
              {match.kind === "estimate" && <span className="text-neutral-500"> · confirmam telefonic</span>}
            </span>
            <button
              onClick={clear}
              className="flex items-center gap-1 text-neutral-500 hover:text-white"
              aria-label="Schimba localitatea"
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
                <MapPin size={11} /> Alege localitatea ta{" "}
                <ChevronDown size={11} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
              </button>

              {open && (
                <div className="absolute left-1/2 top-full mt-1 w-64 -translate-x-1/2 space-y-2 rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-left shadow-xl">
                  <select
                    value={county}
                    onChange={(e) => { setCounty(e.target.value); setCity(""); }}
                    className="w-full rounded border border-neutral-600 bg-neutral-900 px-2 py-1.5 text-xs text-white outline-none focus:border-brand"
                  >
                    <option value="">Alege judetul</option>
                    {COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>

                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && confirm()}
                    disabled={!county}
                    list={listId}
                    placeholder={county ? "Scrie localitatea" : "Alege intai judetul"}
                    className="w-full rounded border border-neutral-600 bg-neutral-900 px-2 py-1.5 text-xs text-white outline-none focus:border-brand disabled:opacity-40"
                  />
                  <datalist id={listId}>
                    {(CITIES_BY_COUNTY[county] ?? []).map((c) => <option key={c} value={c} />)}
                  </datalist>

                  <button
                    onClick={confirm}
                    disabled={!county || !city.trim()}
                    className="w-full rounded bg-brand px-2 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-40"
                  >
                    Vezi ziua de livrare
                  </button>

                  <Link
                    href="/cum-comand"
                    onClick={() => setOpen(false)}
                    className="block pt-1 text-[10px] text-brand hover:underline"
                  >
                    Vezi toate rutele de livrare →
                  </Link>
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
