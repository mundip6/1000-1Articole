"use client";

import { useState } from "react";

type Props = {
  nutritionInfo?: string;
  specifications?: string;
};

function NutritionTable({ text }: { text: string }) {
  const rows = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return { label: line, value: "" };
      return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    });

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-red-50" : "bg-white"}>
              <td className="px-4 py-2.5 font-semibold text-neutral-700">{row.label}</td>
              <td className="px-4 py-2.5 text-right text-neutral-900">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProductTabs({ nutritionInfo, specifications }: Props) {
  const hasNutrition = Boolean(nutritionInfo);
  const hasSpecs = Boolean(specifications);

  const [tab, setTab] = useState<"nutritie" | "specificatii">(hasNutrition ? "nutritie" : "specificatii");

  if (!hasNutrition && !hasSpecs) return null;

  return (
    <section className="mt-10 overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="flex border-b border-neutral-200">
        {hasNutrition && (
          <button
            onClick={() => setTab("nutritie")}
            className={`border-b-2 px-6 py-4 text-sm font-black transition-colors -mb-px ${
              tab === "nutritie"
                ? "border-brand text-brand"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Valori nutritionale 100g
          </button>
        )}
        {hasSpecs && (
          <button
            onClick={() => setTab("specificatii")}
            className={`border-b-2 px-6 py-4 text-sm font-black transition-colors -mb-px ${
              tab === "specificatii"
                ? "border-brand text-brand"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Specificatii
          </button>
        )}
      </div>

      <div className="p-6">
        {tab === "nutritie" && hasNutrition && <NutritionTable text={nutritionInfo!} />}
        {tab === "specificatii" && hasSpecs && (
          <p className="whitespace-pre-line text-sm leading-7 text-neutral-600">{specifications}</p>
        )}
      </div>
    </section>
  );
}
