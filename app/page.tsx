import Link from "next/link";
import { ChevronRight, Clock, Phone, Shield, ShoppingCart, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { business, categories } from "@/lib/data";

const benefits = [
  { icon: Truck, title: "Livrare in 3 judete", desc: business.delivery },
  { icon: Shield, title: "Calitate garantata", desc: "Produse proaspete si conforme" },
  { icon: ShoppingCart, title: "Comenzi engros", desc: "Pentru firme, restaurante si magazine" },
  { icon: Clock, title: "Raspuns rapid", desc: "Confirmam in aceeasi zi" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section
        className="relative flex min-h-[560px] items-center text-white md:min-h-[640px]"
        style={{ backgroundImage: "url('/background_articole.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Mobile: full dark overlay */}
        <div className="absolute inset-0 bg-black/60 md:hidden" />
        {/* Desktop: left-side gradient ending at text edge */}
        <div className="absolute inset-y-0 left-0 hidden w-[860px] bg-gradient-to-r from-black/85 via-black/60 to-transparent md:block" />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="relative w-full px-6 text-center md:ml-[300px] md:max-w-lg md:px-0 md:pr-4 md:text-left">
          <div>

            {/* Location badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest backdrop-blur-sm">
              📍 Maramures · Satu Mare · Salaj
            </div>

            {/* Main heading */}
            <h1 className="text-4xl font-black leading-snug text-white md:text-5xl">
              Distribuitor engros de <span className="text-brand">carne</span>, peste si semipreparate
            </h1>

            {/* Divider */}
            <div className="mt-6 h-px w-16 bg-brand mx-auto md:mx-0" />

            {/* Description */}
            <p className="mt-5 text-sm leading-7 text-white/70">
              Produse congelate de calitate pentru firme, restaurante, cantine si magazine din nord-vestul Romaniei.
            </p>

            {/* Min order pills */}
            <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm md:justify-start">
              <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <span className="font-black text-white">50 lei</span>
                <span className="ml-1.5 text-white/60">min. Baia Mare</span>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <span className="font-black text-white">300 lei</span>
                <span className="ml-1.5 text-white/60">min. alte judete</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:items-start">
              <Link href="/catalog" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-8 py-4 font-black text-white hover:bg-brand-dark">
                <ShoppingCart size={18} /> Vezi Catalogul
              </Link>
              <a href={business.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm hover:bg-white/20">
                <Phone size={18} /> Suna Acum
              </a>
            </div>

          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white px-4 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {benefits.map((item) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-brand">
                <item.icon size={22} />
              </div>
              <div className="text-sm font-black">{item.title}</div>
              <div className="mt-1 text-xs text-neutral-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-3xl font-black">Categorii de Produse</h2>
        <p className="mt-2 text-neutral-500">Alegeti categoria dorita pentru a vedea produsele si preturile engros.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.name}
              href={`/catalog?cat=${encodeURIComponent(cat.name)}`}
              className="group flex items-start gap-4 rounded-lg border border-neutral-200 bg-white p-6 hover:border-brand hover:shadow-md"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-black group-hover:text-brand">{cat.name}</span>
                <span className="mt-1 block text-xs text-neutral-500">{cat.desc}</span>
              </span>
              <ChevronRight size={16} className="mt-1 text-neutral-400 group-hover:text-brand" />
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/catalog" className="inline-flex items-center gap-2 rounded-lg bg-brand px-8 py-3 font-black text-white hover:bg-brand-dark">
            Vezi toate produsele <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <section className="bg-neutral-100 px-4 py-12 text-center">
        <h2 className="text-2xl font-black">Cum plasezi o comanda?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-neutral-500">
          Simplu si rapid: adaugi produsele in cos, completezi datele firmei si noi confirmam in aceeasi zi.
        </p>
        <Link href="/cum-comand" className="mt-5 inline-flex items-center gap-2 font-bold text-brand hover:underline">
          Afla cum functioneaza <ChevronRight size={16} />
        </Link>
      </section>
      <Footer />
    </div>
  );
}
