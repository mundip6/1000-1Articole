"use client";

import { useMemo, useState } from "react";
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
  const [added, setAdded] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const byCat = activeCat === "Toate" || product.category === activeCat;
      const bySearch = product.name.toLowerCase().includes(search.toLowerCase());
      return byCat && bySearch;
    });
  }, [activeCat, products, search]);

  const handleAdd = (product: Product) => {
    addToCart(product, quantities[product.id] || 1);
    setAdded((prev) => ({ ...prev, [product.id]: true }));
    window.setTimeout(() => setAdded((prev) => ({ ...prev, [product.id]: false })), 1200);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-black">Catalog Produse Engros</h1>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cauta produs..."
            className="w-full rounded-lg border border-neutral-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-brand"
          />
        </div>
        <div className="flex flex-wrap gap-2">
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
              <span className="mr-1">{cat.icon}</span> {cat.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && <div className="py-20 text-center text-neutral-500">Nu s-au gasit produse.</div>}

      {categories.map((cat) => {
        const items = filtered.filter((product) => product.category === cat.name);
        if (!items.length) return null;
        return (
          <section key={cat.name} className="mb-12">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
              <span>{cat.icon}</span> {cat.name}
              <span className="text-xs font-normal text-neutral-500">({items.length} produse)</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => {
                const qty = quantities[product.id] || 1;
                return (
                  <article key={product.id} className="flex flex-col rounded-lg border border-neutral-200 bg-white shadow-sm">
                    {product.imageUrl ? (
                      <div className="h-40 w-full overflow-hidden rounded-t-lg bg-neutral-100">
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center rounded-t-lg bg-neutral-100 text-4xl text-neutral-300">
                        🧊
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-4">
                    <div className="font-bold">{product.name}</div>
                    {product.weight && <div className="mt-1 text-xs text-neutral-500">{product.weight}</div>}
                    <div className="mt-auto pt-5 text-xl font-black text-brand">
                      {formatPrice(product.price)} lei <span className="text-xs font-normal text-neutral-500">/{product.unit}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center overflow-hidden rounded border border-neutral-200">
                        <button
                          aria-label="Scade cantitatea"
                          onClick={() => setQuantities((prev) => ({ ...prev, [product.id]: Math.max(1, qty - 1) }))}
                          className="px-3 py-1 font-black text-neutral-500 hover:text-neutral-900"
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center text-sm font-bold">{qty}</span>
                        <button
                          aria-label="Creste cantitatea"
                          onClick={() => setQuantities((prev) => ({ ...prev, [product.id]: qty + 1 }))}
                          className="px-3 py-1 font-black text-neutral-500 hover:text-neutral-900"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleAdd(product)}
                        className={`inline-flex flex-1 items-center justify-center gap-1 rounded px-3 py-2 text-xs font-black text-white ${added[product.id] ? "bg-green-600" : "bg-brand hover:bg-brand-dark"}`}
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
      })}
    </main>
  );
}
