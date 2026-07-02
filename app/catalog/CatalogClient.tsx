"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Plus, Search } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { categories, formatPrice, type Category, type Product } from "@/lib/data";

export default function CatalogClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const initialCat = (searchParams.get("cat") as Category | null) || "Toate";
  const [activeCat, setActiveCat] = useState<Category | "Toate">(initialCat);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [rawInputs, setRawInputs] = useState<Record<string, string>>({});
  const [added, setAdded] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const byCat = activeCat === "Toate" || product.category === activeCat;
      const bySearch = product.name.toLowerCase().includes(search.toLowerCase());
      return byCat && bySearch;
    });
  }, [activeCat, products, search]);

  const getQty = (product: Product) => quantities[product.id] ?? (product.unit === "kg" ? product.kgStep : 1);

  const applyQty = (product: Product, n: number) => {
    const step = product.unit === "kg" ? product.kgStep : 1;
    const min = product.unit === "kg" ? product.kgStep : 1;
    const clamped = parseFloat(Math.min(Math.max(min, n), product.stock).toFixed(2));
    setQuantities((prev) => ({ ...prev, [product.id]: clamped }));
    setRawInputs((prev) => ({ ...prev, [product.id]: String(clamped) }));
  };

  const handleBlur = (product: Product, raw: string) => {
    const val = product.unit === "kg" ? parseFloat(raw) : parseInt(raw, 10);
    applyQty(product, isNaN(val) ? 1 : val);
  };

  const handleAdd = (product: Product) => {
    addToCart(product, getQty(product));
    setAdded((prev) => ({ ...prev, [product.id]: true }));
    window.setTimeout(() => setAdded((prev) => ({ ...prev, [product.id]: false })), 1200);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Catalog Produse Engros — cauta produs..."
            className="w-full rounded-lg border border-neutral-200 bg-white py-4 pl-12 pr-4 text-base font-medium outline-none focus:border-brand"
          />
        </div>
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCat("Toate")}
            className={`rounded-lg border px-4 py-2 text-sm font-bold ${activeCat === "Toate" ? "border-brand bg-brand text-white" : "border-neutral-200 bg-white hover:border-brand"}`}
          >
            Toate
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCat(cat.name)}
              className={`rounded-lg border px-4 py-2 text-sm font-bold ${activeCat === cat.name ? "border-brand bg-brand text-white" : "border-neutral-200 bg-white hover:border-brand"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      {filtered.length === 0 && <div className="py-20 text-center text-neutral-500">Nu s-au gasit produse.</div>}

      {(() => {
        let imgIdx = 0;
        return categories.map((cat) => {
        const items = filtered.filter((product) => product.category === cat.name);
        if (!items.length) return null;
        return (
          <section key={cat.name} className="mb-12">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
              {cat.name}
              <span className="text-xs font-normal text-neutral-500">({items.length} produse)</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => {
                const qty = getQty(product);
                const step = product.unit === "kg" ? product.kgStep : 1;
                const raw = rawInputs[product.id] ?? String(qty);
                const priority = product.imageUrl ? imgIdx++ < 6 : false;
                return (
                  <article key={product.id} className="flex flex-col rounded-lg border border-neutral-200 bg-white shadow-sm">
                    <Link href={`/catalog/${product.id}`} className="block">
                    {product.imageUrl ? (
                      <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-neutral-100">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-200 hover:scale-105"
                          priority={priority}
                        />
                      </div>
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center rounded-t-lg bg-neutral-100 text-4xl text-neutral-300 hover:bg-neutral-200">
                        🧊
                      </div>
                    )}
                    </Link>
                    <div className="flex flex-1 flex-col p-4">
                    <Link href={`/catalog/${product.id}`} className="font-bold hover:text-brand">{product.name}</Link>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {product.stock > 0 ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-black text-green-700">În stoc</span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black text-red-600">Stoc epuizat</span>
                      )}
                      {product.packagedByUs && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">📦 Ambalat de noi</span>
                      )}
                      {product.unit === "kg" && (
                        <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-xs">⚖</span>
                      )}
                    </div>
                    {product.weight && <div className="mt-1 text-xs text-neutral-500">{product.weight}</div>}
                    <div className="mt-auto pt-5">
                      {product.discount > 0 ? (
                        <>
                          <span className="mb-1 inline-block rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black text-white">-{product.discount}% REDUCERE</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-brand">{formatPrice(product.price * (1 - product.discount / 100))} lei</span>
                            <span className="text-sm text-neutral-400 line-through">{formatPrice(product.price)} lei</span>
                          </div>
                          <span className="text-xs font-normal text-neutral-500">/{product.unit}</span>
                        </>
                      ) : (
                        <div className="text-xl font-black text-brand">
                          {formatPrice(product.price)} lei <span className="text-xs font-normal text-neutral-500">/{product.unit}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className={`flex items-center overflow-hidden rounded border border-neutral-200 ${product.stock === 0 ? "opacity-40" : ""}`}>
                        <button
                          aria-label="Scade cantitatea"
                          disabled={product.stock === 0}
                          onClick={() => applyQty(product, parseFloat((qty - step).toFixed(2)))}
                          className="px-3 py-1 font-black text-neutral-500 hover:text-neutral-900 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          disabled={product.stock === 0}
                          min={product.unit === "kg" ? product.kgStep : 1}
                          max={product.stock}
                          step={step}
                          value={raw}
                          onChange={(e) => setRawInputs((prev) => ({ ...prev, [product.id]: e.target.value }))}
                          onBlur={() => handleBlur(product, raw)}
                          className="w-12 border-none bg-transparent text-center text-sm font-bold outline-none disabled:cursor-not-allowed"
                        />
                        <button
                          aria-label="Creste cantitatea"
                          disabled={product.stock === 0 || qty >= product.stock}
                          onClick={() => applyQty(product, parseFloat((qty + step).toFixed(2)))}
                          className="px-3 py-1 font-black text-neutral-500 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <button
                        disabled={product.stock === 0}
                        onClick={() => handleAdd(product)}
                        className={`inline-flex flex-1 items-center justify-center gap-1 rounded px-3 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-50 ${added[product.id] ? "bg-green-600" : "bg-brand hover:bg-brand-dark"}`}
                      >
                        {added[product.id] ? <><Check size={13} /> Adaugat</> : <><Plus size={13} /> Adauga</>}
                      </button>
                    </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      });
      })()}
    </main>
  );
}
