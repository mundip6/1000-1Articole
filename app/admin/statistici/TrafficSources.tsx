"use client";

import { useCallback, useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const PERIODS = [
  { label: "Azi", key: "day" },
  { label: "Saptamana", key: "week" },
  { label: "Luna", key: "month" },
  { label: "An", key: "year" },
  { label: "Custom", key: "custom" },
];

const COLORS = ["#c8102e", "#1d4ed8", "#16a34a", "#d97706", "#7c3aed", "#0891b2", "#db2777", "#65a30d", "#9ca3af"];

const SOURCE_ICONS: Record<string, string> = {
  Google: "🔍", Facebook: "📘", TikTok: "🎵", Instagram: "📸",
  YouTube: "▶️", Bing: "🔎", Yahoo: "🟣", Direct: "🔗", Altul: "🌐",
};

function toISO(d: Date) {
  return d.toISOString().split("T")[0];
}

function periodDates(key: string): { from: string; to: string } {
  const now = new Date();
  const to = toISO(now);
  if (key === "day") {
    const from = new Date(now);
    from.setHours(0, 0, 0, 0);
    return { from: toISO(from), to };
  }
  if (key === "week") return { from: toISO(new Date(now.getTime() - 7 * 86400000)), to };
  if (key === "month") return { from: toISO(new Date(now.getTime() - 30 * 86400000)), to };
  if (key === "year") return { from: toISO(new Date(now.getTime() - 365 * 86400000)), to };
  return { from: to, to };
}

type SourceRow = { source: string; count: number };

export default function TrafficSources() {
  const [period, setPeriod] = useState("month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (from: string, to: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/traffic?from=${from}&to=${to}`);
      const data = (await res.json()) as { ok: boolean; sources: SourceRow[]; total: number };
      if (data.ok) {
        setSources(data.sources);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (period === "custom") return;
    const { from, to } = periodDates(period);
    void fetchData(from, to);
  }, [period, fetchData]);

  function applyCustom() {
    if (customFrom && customTo) void fetchData(customFrom, customTo);
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      {/* Header + period buttons */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-wide text-neutral-500">Surse de trafic</h2>
        <div className="flex flex-wrap gap-1.5">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                period === p.key
                  ? "bg-brand text-white"
                  : "border border-neutral-200 hover:border-brand hover:text-brand"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom date range inputs */}
      {period === "custom" && (
        <div className="mb-5 flex flex-wrap items-end gap-3">
          <label className="text-xs font-semibold text-neutral-500">
            De la
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="mt-1 block rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-brand"
            />
          </label>
          <label className="text-xs font-semibold text-neutral-500">
            Pana la
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="mt-1 block rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-brand"
            />
          </label>
          <button
            onClick={applyCustom}
            disabled={!customFrom || !customTo}
            className="rounded-lg bg-brand px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-40"
          >
            Aplica
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="py-12 text-center text-sm text-neutral-400">Se incarca...</div>
      ) : sources.length === 0 ? (
        <div className="py-12 text-center text-sm text-neutral-400">Nu exista date pentru aceasta perioada.</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Donut chart */}
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={sources}
                dataKey="count"
                nameKey="source"
                cx="50%"
                cy="45%"
                outerRadius={100}
                innerRadius={55}
              >
                {sources.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [`${Number(v ?? 0).toLocaleString("ro-RO")} vizite`]}
                contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }}
              />
              <Legend
                formatter={(value: string) => `${SOURCE_ICONS[value] ?? "🌐"} ${value}`}
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Table */}
          <div className="self-center overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-left text-xs font-black uppercase tracking-wide text-neutral-400">
                  <th className="pb-2">Sursa</th>
                  <th className="pb-2 text-right">Vizite</th>
                  <th className="pb-2 text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {sources.map(({ source, count }, i) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <tr key={source} className="border-b border-neutral-50 last:border-0">
                      <td className="py-2 font-semibold">
                        <span
                          className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                          style={{ background: COLORS[i % COLORS.length] }}
                        />
                        {SOURCE_ICONS[source] ?? "🌐"} {source}
                      </td>
                      <td className="py-2 text-right font-black">{count.toLocaleString("ro-RO")}</td>
                      <td className="py-2 text-right text-neutral-400">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-neutral-200">
                  <td className="pt-2 text-xs font-black uppercase text-neutral-400">Total</td>
                  <td className="pt-2 text-right font-black">{total.toLocaleString("ro-RO")}</td>
                  <td className="pt-2 text-right text-neutral-400">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
