"use client";

import { useId } from "react";
import { CITIES_BY_COUNTY, COUNTIES } from "@/lib/deliverySchedule";

type Props = {
  county: string;
  city: string;
  onCountyChange: (county: string) => void;
  onCityChange: (city: string) => void;
  selectClassName?: string;
};

const fieldBase =
  "mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand disabled:opacity-50 disabled:cursor-not-allowed";

export default function CountyCitySelect({
  county,
  city,
  onCountyChange,
  onCityChange,
  selectClassName,
}: Props) {
  const listId = useId();
  const suggestions = county ? (CITIES_BY_COUNTY[county] ?? []) : [];
  const cls = selectClassName ?? fieldBase;

  return (
    <>
      <label className="block text-xs font-semibold text-neutral-500">
        Județ livrare *
        <select
          value={county}
          onChange={(e) => {
            onCountyChange(e.target.value);
            onCityChange("");
          }}
          className={cls}
        >
          <option value="">Selectați județul</option>
          {COUNTIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <label className="block text-xs font-semibold text-neutral-500">
        Localitate *
        <input
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={!county}
          list={listId}
          autoComplete="address-level2"
          placeholder={county ? "Scrieți localitatea" : "Selectați mai întâi județul"}
          className={`${cls} normal-case`}
        />
        <datalist id={listId}>
          {suggestions.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {county && (
          <span className="mt-1 block text-[11px] font-normal text-neutral-400">
            Livrăm în orice localitate din județ — scrieți satul sau comuna dvs.
          </span>
        )}
      </label>
    </>
  );
}
