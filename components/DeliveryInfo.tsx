"use client";

import { ChevronDown, MapPin, Truck, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { CITIES_BY_COUNTY, COUNTIES, formatDays, isBaiaMare } from "@/lib/deliverySchedule";
import { useDeliveryCity } from "@/components/useDeliveryCity";

export default function DeliveryInfo({
  minBM, minOther, feeBM = "0", feeOther = "0",
}: {
  minBM: string; minOther: string; feeBM?: string; feeOther?: string;
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
  const fee = isBM ? Number(feeBM) : Number(feeOther);
  const hasFee = fee > 0;

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm">
      <div className="flex items-start gap-3">
        <Truck size={15} className="mt-0.5 shrink-0 text-brand" />
        <div className="flex-1">
          {selection && match.kind !== "none" ? (
            <div>
              <div className="flex items-center justify-between gap-2">
                <span>
                  {match.kind === "route" ? (
                    <>Livrare <strong className="text-neutral-900">{match.day}</strong></>
                  ) : (
                    <>Estimativ <strong className="text-neutral-900">{formatDays(match.days)}</strong></>
                  )}
                  <span className="text-neutral-400"> · {selection.city} · </span>
                  {hasFee
                    ? <>livrare gratuita peste <strong className="text-neutral-900">{min} lei</strong></>
                    : <>minim <strong className="text-neutral-900">{min} lei</strong></>}
                </span>
                <button
                  onClick={clear}
                  className="shrink-0 text-neutral-400 hover:text-neutral-700"
                  aria-label="Schimba localitatea"
                >
                  <X size={13} />
                </button>
              </div>
              {match.kind === "estimate" && (
                <p className="mt-1 text-xs text-amber-700">
                  📞 Va contactam pentru a confirma ziua exacta de livrare.
                </p>
              )}
              {hasFee && (
                <p className="mt-1 text-xs text-neutral-400">
                  Taxa livrare <strong className="text-neutral-600">{fee} lei</strong> pentru comenzi sub {min} lei
                </p>
              )}
            </div>
          ) : (
            <div ref={ref} className="relative">
              <p className="mb-2 text-neutral-500">
                Alege localitatea ta pentru a vedea ziua de livrare
                {(Number(feeBM) > 0 || Number(feeOther) > 0) && <> si taxa de livrare aplicabila</>}:
              </p>
              <button
                onClick={() => setOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold hover:border-brand hover:text-brand"
              >
                <MapPin size={12} /> Alege localitatea{" "}
                <ChevronDown size={12} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
              </button>

              {open && (
                <div className="absolute left-0 top-full z-20 mt-1 w-64 space-y-2 rounded-lg border border-neutral-200 bg-white p-3 shadow-xl">
                  <select
                    value={county}
                    onChange={(e) => { setCounty(e.target.value); setCity(""); }}
                    className="w-full rounded border border-neutral-200 px-2 py-1.5 text-xs outline-none focus:border-brand"
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
                    className="w-full rounded border border-neutral-200 px-2 py-1.5 text-xs outline-none focus:border-brand disabled:opacity-40"
                  />
                  <datalist id={listId}>
                    {(CITIES_BY_COUNTY[county] ?? []).map((c) => <option key={c} value={c} />)}
                  </datalist>

                  <button
                    onClick={confirm}
                    disabled={!county || !city.trim()}
                    className="w-full rounded bg-brand px-2 py-1.5 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-40"
                  >
                    Vezi ziua de livrare
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
