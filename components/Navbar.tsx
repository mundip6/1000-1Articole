"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, ShoppingCart, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { business } from "@/lib/data";
import { getCart } from "@/lib/cart";

const nav = [
  { href: "/", label: "Acasa" },
  { href: "/catalog", label: "Catalog" },
  { href: "/cum-comand", label: "Cum comand" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(getCart().length);
    sync();
    window.addEventListener("cart:change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart:change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <div className="bg-brand px-4 py-1 text-[11px] font-semibold text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <span className="flex items-center gap-1 truncate">
            <MapPin size={12} /> {business.address} | CUI: {business.cui}
          </span>
          <a className="hidden items-center gap-1 sm:flex" href={business.phoneHref}>
            <Phone size={12} /> {business.phone}
          </a>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-3">
        <Link href="/" className="justify-self-start text-center">
          <div className="text-lg font-black leading-none text-brand">1000&1</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
            Articole Engros
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "text-brand underline underline-offset-4" : "text-neutral-700 hover:text-brand"}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 justify-self-end">
          <Link
            href="/cont"
            aria-label="Cont client"
            title="Cont client"
            className={`inline-flex h-9 w-9 items-center justify-center rounded border text-sm font-bold ${pathname === "/cont" ? "border-brand bg-red-50 text-brand" : "border-neutral-200 text-neutral-700 hover:border-brand hover:text-brand"}`}
          >
            <UserRound size={17} />
          </Link>
          <Link
            href="/cos"
            className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark"
          >
            <ShoppingCart size={16} /> Cos {count > 0 && <span>({count})</span>}
          </Link>
        </div>
      </div>
      <nav className="flex justify-center gap-5 border-t border-neutral-100 px-4 py-2 text-xs font-semibold md:hidden">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className={pathname === item.href ? "text-brand" : "text-neutral-700"}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
