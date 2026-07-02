"use client";

import { useState } from "react";
import { ExternalLink, Search, TrendingDown, X } from "lucide-react";
import { checkCompetitorPrices, type PriceResult } from "@/app/admin/products/priceCheck";

export default function CompetitorPriceCheck({ defaultName = "" }: { defaultName?: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PriceResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    setSearched(false);
    try {
      const data = await checkCompetitorPrices(name.trim());
      setResults(data);
      setSearched(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eroare la cautare.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Verifica preturile concurentei"
        className="inline-flex items-center gap-1 rounded border border-neutral-200 px-2 py-1 text-xs font-semibold text-neutral-500 hover:border-brand hover:text-brand"
      >
        <TrendingDown size={12} /> Verifică prețuri
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-black uppercase text-blue-700">Prețuri concurență</span>
        <button type="button" onClick={() => { setOpen(false); setSearched(false); setResults([]); }} className="text-neutral-400 hover:text-neutral-700">
          <X size={14} />
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Nume produs..."
          className="flex-1 rounded border border-neutral-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-brand"
        />
        <button
          type="button"
          onClick={search}
          disabled={loading || !name.trim()}
          className="inline-flex items-center gap-1 rounded bg-neutral-900 px-3 py-1.5 text-xs font-black text-white hover:bg-brand disabled:opacity-50"
        >
          <Search size={11} /> {loading ? "Caut..." : "Cauta"}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {searched && results.length === 0 && !error && (
        <p className="mt-2 text-xs text-neutral-500">Nu s-au gasit preturi in rezultate pentru acest produs.</p>
      )}

      {results.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {results.map((r, i) => (
            <div key={i} className={`flex items-center justify-between gap-3 rounded border bg-white px-2.5 py-2 ${i === 0 ? "border-green-300" : "border-neutral-200"}`}>
              <div className="min-w-0 flex-1">
                <a href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-brand hover:underline">
                  {i === 0 && <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[9px] font-black text-green-700">CEL MAI IEFTIN</span>}
                  {r.store} <ExternalLink size={9} />
                </a>
                <p className="mt-0.5 truncate text-[10px] text-neutral-500">{r.snippet}</p>
              </div>
              <span className={`shrink-0 text-sm font-black ${i === 0 ? "text-green-700" : "text-neutral-700"}`}>
                {r.price.toFixed(2)} lei
              </span>
            </div>
          ))}
          <p className="pt-1 text-[10px] text-neutral-400">
            ⚠ Preturile sunt extrase automat din rezultate web si pot fi aproximative. Verifica intotdeauna link-ul sursa.
          </p>
        </div>
      )}
    </div>
  );
}
