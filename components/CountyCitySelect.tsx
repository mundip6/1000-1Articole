"use client";

import { DELIVERY_ZONES } from "@/lib/deliveryZones";

type Props = {
  county: string;
  city: string;
  onCountyChange: (county: string) => void;
  onCityChange: (city: string) => void;
  selectClassName?: string;
};

const selectBase =
  "mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand disabled:opacity-50 disabled:cursor-not-allowed";

export default function CountyCitySelect({
  county,
  city,
  onCountyChange,
  onCityChange,
  selectClassName,
}: Props) {
  const cities = county ? (DELIVERY_ZONES[county] ?? []) : [];
  const cls = selectClassName ?? selectBase;

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
          {Object.keys(DELIVERY_ZONES).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <label className="block text-xs font-semibold text-neutral-500">
        Localitate *
        <select
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={!county}
          className={cls}
        >
          <option value="">
            {county ? "Selectați localitatea" : "Selectați mai întâi județul"}
          </option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
    </>
  );
}
