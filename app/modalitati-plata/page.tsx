import { Banknote, ShieldCheck, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { business } from "@/lib/data";

export default function ModalitatiplataPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-black">Modalități de Plată</h1>
        <p className="mt-2 mb-10 text-neutral-500">Informații despre cum puteți achita comenzile dumneavoastră.</p>

        <div className="space-y-6">
          <div className="flex gap-5 rounded-lg border border-neutral-200 bg-white p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-brand">
              <Banknote size={24} />
            </div>
            <div>
              <h2 className="mb-2 text-lg font-black">Numerar la livrare (Ramburs)</h2>
              <p className="text-sm leading-7 text-neutral-600">
                Singura modalitate de plată acceptată este <strong>numerarul achitat curierului</strong> în momentul livrării.
                Vă rugăm să pregătiți suma exactă sau o sumă apropiată, deoarece curierul poate să nu aibă rest pentru sume mari.
              </p>
            </div>
          </div>

          <div className="flex gap-5 rounded-lg border border-neutral-200 bg-white p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-brand">
              <Truck size={24} />
            </div>
            <div>
              <h2 className="mb-2 text-lg font-black">Livrare cu echipă proprie</h2>
              <p className="text-sm leading-7 text-neutral-600">
                Toate livrările sunt efectuate de echipa noastră proprie de transport, cu vehicule echipate pentru produse congelate.
                Nu utilizăm servicii de curierat extern. Plata se face direct reprezentantului nostru care efectuează livrarea.
              </p>
            </div>
          </div>

          <div className="flex gap-5 rounded-lg border border-neutral-200 bg-white p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-brand">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="mb-2 text-lg font-black">Documente fiscale</h2>
              <p className="text-sm leading-7 text-neutral-600">
                La fiecare livrare emitem <strong>factură fiscală</strong> pe datele firmei dumneavoastră.
                Vă rugăm să furnizați CUI-ul firmei la plasarea comenzii pentru emiterea corectă a documentelor.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
            <p className="font-bold text-neutral-900">Nu acceptăm:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Plăți online (card, PayPal, etc.)</li>
              <li>Transfer bancar anticipat</li>
              <li>Plată la termen / pe credit comercial</li>
            </ul>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-5 text-sm">
            <p className="font-black text-neutral-900">Întrebări despre plată?</p>
            <p className="mt-2 text-neutral-600">
              Sunați-ne la <a href={business.phoneHref} className="font-bold text-brand hover:underline">{business.phone}</a> sau <a href={business.phoneHref2} className="font-bold text-brand hover:underline">{business.phone2}</a>, Luni–Vineri 08:00–15:30.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
