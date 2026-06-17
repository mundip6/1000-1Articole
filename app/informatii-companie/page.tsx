import { Mail, MapPin, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { business } from "@/lib/data";

export default function InformatiiCompaniePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-black">Informații Companie</h1>
        <p className="mt-2 mb-10 text-neutral-500">Date de identificare și contact ale companiei.</p>

        <div className="space-y-6">
          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-black">Date de identificare</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-neutral-100 pb-3">
                <span className="font-semibold text-neutral-500">Denumire</span>
                <span className="font-black">{business.name}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-3">
                <span className="font-semibold text-neutral-500">Profil activitate</span>
                <span>Distribuție engros produse alimentare</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-3">
                <span className="font-semibold text-neutral-500">CUI</span>
                <span className="font-mono font-bold">{business.cui}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-3">
                <span className="font-semibold text-neutral-500">Sediu social</span>
                <span className="text-right">{business.address}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-3">
                <span className="font-semibold text-neutral-500">Județ</span>
                <span>Maramureș</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-3">
                <span className="font-semibold text-neutral-500">Țară</span>
                <span>România</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-500">Program</span>
                <span>Luni–Vineri 08:00–15:30</span>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-black">Contact</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-brand" />
                <div>
                  <div className="mb-1 text-xs font-black uppercase text-neutral-500">Telefon</div>
                  <a href={business.phoneHref} className="block font-bold hover:text-brand">{business.phone}</a>
                  <a href={business.phoneHref2} className="block font-bold hover:text-brand">{business.phone2}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-brand" />
                <div>
                  <div className="mb-1 text-xs font-black uppercase text-neutral-500">Email</div>
                  <a href={`mailto:${business.email}`} className="hover:text-brand">{business.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-brand" />
                <div>
                  <div className="mb-1 text-xs font-black uppercase text-neutral-500">Adresă</div>
                  <p>{business.address}</p>
                  <p className="text-neutral-500">{business.region}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-black">Despre noi</h2>
            <p className="text-sm leading-7 text-neutral-600">
              {business.name} este un distribuitor engros de produse alimentare congelate, specializat în carne de pasăre,
              pește, legume congelate, produse lactate, semipreparate și patiserie congelată.
              Deservim firme, restaurante, cantine, magazine și alte entități comerciale din județele Maramureș, Satu Mare, Sălaj, Bistrița-Năsăud și Cluj.
            </p>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Dispunem de logistică proprie cu vehicule echipate pentru transportul produselor congelate, garantând
              menținerea lanțului de frig pe toată durata transportului.
              Efectuăm livrări săptămânale pe rute fixe, cu confirmare telefonică prealabilă.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
