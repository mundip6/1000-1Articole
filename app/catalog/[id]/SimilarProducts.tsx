"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice, type Product } from "@/lib/data";

const CARD_W = 216; // card width + gap (px) — scroll step per arrow click

export default function SimilarProducts({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // start scrolled to the middle third so both directions feel infinite
    el.scrollLeft = el.scrollWidth / 3;
  }, []);

  if (products.length < 2) return null;

  // Triple the array so left/right scrolling loops seamlessly
  const items = [...products, ...products, ...products];

  const scroll = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? CARD_W : -CARD_W, behavior: "smooth" });
    // After the smooth-scroll animation, silently jump back to the middle third
    setTimeout(() => {
      if (!el) return;
      const third = el.scrollWidth / 3;
      if (el.scrollLeft < third * 0.25) el.scrollLeft += third;
      else if (el.scrollLeft > third * 1.75) el.scrollLeft -= third;
    }, 350);
  };

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-black">Produse similare</h2>
      <div className="relative mx-5">
        {/* Left arrow */}
        <button
          aria-label="Inapoi"
          onClick={() => scroll("left")}
          className="absolute -left-5 top-1/2 z-10 -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-2 shadow-md transition-colors hover:border-brand hover:text-brand"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Scrollable track — scrollbar hidden */}
        <div
          ref={ref}
          className="flex gap-4 overflow-x-hidden"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {items.map((product, i) => (
            <Link
              key={i}
              href={`/catalog/${product.id}`}
              className="w-[200px] flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:border-brand hover:shadow-md"
            >
              {product.imageUrl ? (
                <div className="h-32 w-full overflow-hidden bg-neutral-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex h-32 w-full items-center justify-center bg-neutral-100 text-4xl text-neutral-300">
                  🧊
                </div>
              )}
              <div className="p-3">
                <p className="line-clamp-2 text-xs font-bold leading-snug text-neutral-800">{product.name}</p>
                <p className="mt-1.5 text-sm font-black text-brand">
                  {formatPrice(product.price)} lei{" "}
                  <span className="text-[11px] font-normal text-neutral-400">/{product.unit}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Right arrow */}
        <button
          aria-label="Inainte"
          onClick={() => scroll("right")}
          className="absolute -right-5 top-1/2 z-10 -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-2 shadow-md transition-colors hover:border-brand hover:text-brand"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
