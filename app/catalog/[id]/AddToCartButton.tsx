"use client";

import { useState } from "react";
import { Check, Info, Plus } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { type Product, formatPrice } from "@/lib/data";

export default function AddToCartButton({ product }: { product: Product }) {
  const defaultQty = product.unit === "kg" ? product.kgStep : 1;
  const [qty, setQty] = useState(defaultQty);
  const [raw, setRaw] = useState(String(defaultQty));
  const [added, setAdded] = useState(false);

  const step = product.unit === "kg" ? product.kgStep : 1;
  const min = product.unit === "kg" ? product.kgStep : 1;
  const outOfStock = product.stock === 0;

  const applyQty = (n: number) => {
    const clamped = Math.min(Math.max(min, n), product.stock);
    const rounded = parseFloat(clamped.toFixed(2));
    setQty(rounded);
    setRaw(String(rounded));
  };

  const handleBlur = () => {
    const val = product.unit === "kg" ? parseFloat(raw) : parseInt(raw, 10);
    applyQty(isNaN(val) ? min : val);
  };

  function handleAdd() {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <div className="mb-4 text-3xl font-black text-brand">
        {formatPrice(product.price)} lei{" "}
        <span className="text-base font-normal text-neutral-500">/ {product.unit}</span>
      </div>

      {product.unit === "kg" && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>Cantitatea si pretul sunt <strong>estimate</strong>. Pretul final va fi calculat in functie de greutatea exacta la cantarire.</span>
        </div>
      )}

      <div className="mb-4 flex items-center gap-2">
        {outOfStock ? (
          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-black text-red-600">Stoc epuizat</span>
        ) : (
          <>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-black text-green-700">În stoc</span>
            <span className="text-sm text-neutral-500">{product.stock} {product.unit === "buc" ? "bucăți" : "kg"} disponibile</span>
          </>
        )}
      </div>

      {!outOfStock && (
        <div className="flex items-center gap-3">
          <div className="flex items-center overflow-hidden rounded-lg border border-neutral-200">
            <button
              aria-label="Scade cantitatea"
              onClick={() => applyQty(parseFloat((qty - step).toFixed(2)))}
              className="px-4 py-2 text-lg font-black text-neutral-500 hover:text-neutral-900"
            >
              −
            </button>
            <input
              type="number"
              min={min}
              max={product.stock}
              step={step}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              onBlur={handleBlur}
              className="w-16 border-none bg-transparent text-center font-bold outline-none"
            />
            <button
              aria-label="Creste cantitatea"
              disabled={qty >= product.stock}
              onClick={() => applyQty(parseFloat((qty + step).toFixed(2)))}
              className="px-4 py-2 text-lg font-black text-neutral-500 hover:text-neutral-900 disabled:opacity-40"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAdd}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-black text-white transition-colors ${added ? "bg-green-600" : "bg-brand hover:bg-brand-dark"}`}
          >
            {added ? <><Check size={18} /> Adăugat în coș!</> : <><Plus size={18} /> Adaugă în coș</>}
          </button>
        </div>
      )}
    </div>
  );
}
