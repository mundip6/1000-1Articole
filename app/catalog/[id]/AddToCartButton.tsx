"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { type Product } from "@/lib/data";
import { formatPrice } from "@/lib/data";

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(product.unit === "kg" ? 0.5 : 1);
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock === 0;

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
              onClick={() => setQty((q) => Math.max(product.unit === "kg" ? 0.5 : 1, parseFloat((q - (product.unit === "kg" ? 0.5 : 1)).toFixed(2))))}
              className="px-4 py-2 text-lg font-black text-neutral-500 hover:text-neutral-900"
            >
              −
            </button>
            <input
              type="number"
              min={product.unit === "kg" ? 0.5 : 1}
              max={product.stock}
              step={product.unit === "kg" ? 0.5 : 1}
              value={qty}
              onChange={(e) => {
                const val = product.unit === "kg" ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
                if (isNaN(val) || val <= 0) return;
                setQty(Math.min(val, product.stock));
              }}
              className="w-16 border-none bg-transparent text-center font-bold outline-none"
            />
            <button
              aria-label="Creste cantitatea"
              disabled={qty >= product.stock}
              onClick={() => setQty((q) => Math.min(product.stock, parseFloat((q + (product.unit === "kg" ? 0.5 : 1)).toFixed(2))))}
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
