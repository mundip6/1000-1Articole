"use client";

import { useCallback, useEffect, useState } from "react";
import { ShoppingCart, Phone, Mail, MapPin, Clock, TrendingDown } from "lucide-react";
import { formatPrice } from "@/lib/data";

const DAYS_OPTIONS = [
  { label: "7 zile", value: 7 },
  { label: "14 zile", value: 14 },
  { label: "30 zile", value: 30 },
  { label: "90 zile", value: 90 },
];

type CartItem = { id: string; name: string; price: number; salePrice?: number; unit: string; qty: number };

type AbandonedCart = {
  id: string;
  items: CartItem[];
  total: number;
  email: string | null;
  phone: string | null;
  contact: string | null;
  county: string | null;
  city: string | null;
  createdAt: string;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "< 1 ora";
  if (h < 24) return `${h}h in urma`;
  const d = Math.floor(h / 24);
  return `${d} ${d === 1 ? "zi" : "zile"} in urma`;
}

export default function AbandonedCarts() {
  const [days, setDays] = useState(30);
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [totalLost, setTotalLost] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchData = useCallback(async (d: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/abandoned-carts?days=${d}`);
      const data = await res.json() as { ok: boolean; carts: AbandonedCart[]; totalRevenueLost: number };
      if (data.ok) {
        setCarts(data.carts);
        setTotalLost(data.totalRevenueLost);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(days); }, [days, fetchData]);

  const withContact = carts.filter((c) => c.email || c.phone).length;
  const avgValue = carts.length > 0 ? totalLost / carts.length : 0;

  // Aggregate products across all abandoned carts
  const productRanking = (() => {
    const map = new Map<string, { name: string; carts: number; totalQty: number; totalValue: number }>();
    for (const cart of carts) {
      for (const item of cart.items as CartItem[]) {
        const p = item.salePrice ?? item.price;
        const existing = map.get(item.id);
        if (existing) {
          existing.carts += 1;
          existing.totalQty += item.qty;
          existing.totalValue += p * item.qty;
        } else {
          map.set(item.id, { name: item.name, carts: 1, totalQty: item.qty, totalValue: p * item.qty });
        }
      }
    }
    return [...map.values()].sort((a, b) => b.carts - a.carts);
  })();

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShoppingCart size={16} className="text-brand" />
          <h2 className="text-sm font-black uppercase tracking-wide text-neutral-500">Cosuri abandonate</h2>
        </div>
        <div className="flex gap-1.5">
          {DAYS_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setDays(o.value)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${days === o.value ? "bg-brand text-white" : "border border-neutral-200 hover:border-brand hover:text-brand"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Cosuri abandonate", value: loading ? "…" : String(carts.length) },
          { label: "Valoare pierduta", value: loading ? "…" : `${formatPrice(totalLost)} lei` },
          { label: "Valoare medie", value: loading ? "…" : `${formatPrice(avgValue)} lei` },
          { label: "Cu date contact", value: loading ? "…" : String(withContact) },
        ].map((k) => (
          <div key={k.label} className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{k.label}</p>
            <p className="mt-0.5 text-xl font-black text-neutral-900">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Product tier list */}
      {!loading && productRanking.length > 0 && (
        <div className="mb-5 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
          <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-neutral-400">Produse cu potential</p>
          <div className="flex flex-wrap gap-2">
            {productRanking.map((p, i) => {
              const tier = i === 0 ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                : i < 3 ? "bg-orange-50 text-orange-700 border-orange-200"
                : i < 6 ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-neutral-500 border-neutral-200";
              return (
                <span key={p.name} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${tier}`}>
                  <span className="font-black">#{i + 1}</span>
                  {p.name}
                  <span className="opacity-60">· {p.carts}x</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Cart list */}
      {loading ? (
        <div className="py-10 text-center text-sm text-neutral-400">Se incarca...</div>
      ) : carts.length === 0 ? (
        <div className="py-10 text-center text-sm text-neutral-400">Nu exista cosuri abandonate in aceasta perioada.</div>
      ) : (
        <div className="space-y-2">
          {carts.map((cart) => {
            const isOpen = expanded === cart.id;
            const hasContact = cart.email || cart.phone;
            return (
              <div
                key={cart.id}
                className={`rounded-lg border transition-colors ${hasContact ? "border-amber-200 bg-amber-50" : "border-neutral-100 bg-white"}`}
              >
                {/* Row summary */}
                <button
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  onClick={() => setExpanded(isOpen ? null : cart.id)}
                >
                  <TrendingDown size={14} className="shrink-0 text-neutral-400" />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="text-sm font-black text-neutral-900">{formatPrice(cart.total)} lei</span>
                      <span className="text-xs text-neutral-400">{cart.items.length} {cart.items.length === 1 ? "produs" : "produse"}</span>
                      {cart.contact && <span className="text-xs font-semibold text-neutral-600">{cart.contact}</span>}
                      {cart.city && (
                        <span className="flex items-center gap-1 text-xs text-neutral-400">
                          <MapPin size={10} /> {cart.city}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                      {cart.email && (
                        <a href={`mailto:${cart.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                          <Mail size={10} /> {cart.email}
                        </a>
                      )}
                      {cart.phone && (
                        <a href={`tel:${cart.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-xs text-green-700 hover:underline">
                          <Phone size={10} /> {cart.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 text-xs text-neutral-400">
                    <Clock size={11} /> {timeAgo(cart.createdAt)}
                  </div>

                  <span className="text-xs text-neutral-400">{isOpen ? "▲" : "▼"}</span>
                </button>

                {/* Expanded product list */}
                {isOpen && (
                  <div className="border-t border-neutral-100 px-4 pb-3 pt-2">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left text-neutral-400">
                          <th className="pb-1 font-semibold">Produs</th>
                          <th className="pb-1 text-right font-semibold">Cant.</th>
                          <th className="pb-1 text-right font-semibold">Pret</th>
                          <th className="pb-1 text-right font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(cart.items as CartItem[]).map((item, i) => {
                          const p = item.salePrice ?? item.price;
                          return (
                            <tr key={i} className="border-t border-neutral-50">
                              <td className="py-1 font-semibold text-neutral-700">{item.name}</td>
                              <td className="py-1 text-right text-neutral-500">{item.qty} {item.unit}</td>
                              <td className="py-1 text-right text-neutral-500">{formatPrice(p)} lei</td>
                              <td className="py-1 text-right font-black text-neutral-900">{formatPrice(p * item.qty)} lei</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
