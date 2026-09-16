"use client";

import { Fragment, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";

type Item = { id: string; name: string; category: string; card: ReactNode };

// Strip diacritics so "gaina" matches "găină"
function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function ProductSearch({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");

  const q = norm(query.trim());
  const filtered = q
    ? items.filter((i) => norm(i.name).includes(q) || norm(i.category).includes(q))
    : items;

  return (
    <>
      <div className="relative mb-4">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cauta produs dupa nume sau categorie..."
          className="w-full rounded-lg border border-neutral-200 py-2.5 pl-9 pr-9 text-sm outline-none focus:border-brand"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {q && (
        <p className="mb-3 text-xs font-semibold text-neutral-500">
          {filtered.length} {filtered.length === 1 ? "rezultat" : "rezultate"}
        </p>
      )}

      <div className="space-y-3">
        {filtered.map((i) => (
          <Fragment key={i.id}>{i.card}</Fragment>
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-neutral-400">
            Niciun produs gasit pentru &laquo;{query}&raquo;.
          </p>
        )}
      </div>
    </>
  );
}
