import { CheckCircle, MapPin, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { business } from "@/lib/data";

const routes = [
  { day: "Marți", stops: "Jibou • Cehu Silvaniei • Ulmeni • Șomcuta • Borșa • Moisei • Valea Izei" },
  { day: "Miercuri", stops: "Seini • Negrești • Livada • Turț • Satu Mare • Vișeu • Valea Izei" },
  { day: "Joi", stops: "Zalău • Șimleul Silvaniei • Sighet • Ocna Șugatag • Cavnic" },
  { day: "Vineri", stops: "Dej • Beclean • Ileanda • Târgu Lăpuș • Copalnic" },
];

export default function PoliticaLivrarePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-black">Politică de Livrare</h1>
        <p className="mt-2 mb-10 text-neutral-500">Informații complete despre zonele și condițiile de livrare.</p>

        <div className="space-y-6">
          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
              <Truck size={20} className="text-brand" /> Livrare cu echipă proprie
            </h2>
            <p className="text-sm leading-7 text-neutral-600">
              {business.name} efectuează toate livrările cu <strong>mijloace de transport proprii</strong>, echipate cu sisteme de refrigerare
              pentru menținerea lanțului de frig. Nu folosim servicii de curierat terț, ceea ce garantează calitatea
              și integritatea produselor congelate la momentul recepției.
            </p>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
              <MapPin size={20} className="text-brand" /> Zone de livrare
            </h2>
            <div className="space-y-2 text-sm">
              {[
                { judet: "Maramureș", localitati: "Baia Mare, Sighetu Marmației, Vișeu de Sus, Valea Izei, Borșa, Moisei, Ocna Șugatag, Cavnic, Târgu Lăpuș, Copalnic, Seini, Șomcuta Mare" },
                { judet: "Satu Mare", localitati: "Satu Mare, Negrești-Oaș, Livada, Turț" },
                { judet: "Sălaj", localitati: "Zalău, Jibou, Cehu Silvaniei, Șimleul Silvaniei, Ileanda" },
                { judet: "Bistrița-Năsăud", localitati: "Beclean" },
                { judet: "Cluj", localitati: "Dej" },
                { judet: "Maramureș — Ulmeni", localitati: "Ulmeni și zona" },
              ].map(({ judet, localitati }) => (
                <div key={judet} className="flex gap-3 border-b border-neutral-100 pb-2 last:border-0 last:pb-0">
                  <CheckCircle size={16} className="mt-0.5 shrink-0 text-brand" />
                  <div>
                    <span className="font-bold">{judet}: </span>
                    <span className="text-neutral-600">{localitati}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-black">📅 Program de livrare</h2>
            <div className="space-y-3">
              {routes.map(({ day, stops }) => (
                <div key={day} className="flex gap-3 text-sm">
                  <span className="w-20 shrink-0 font-black text-brand">{day}</span>
                  <span className="text-neutral-600">{stops}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-neutral-500">
              Rutele și zilele de livrare pot varia. Data exactă a livrării se stabilește telefonic la confirmarea comenzii.
            </p>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-black">Condiții de livrare</h2>
            <div className="space-y-3 text-sm leading-7 text-neutral-600">
              <div className="flex gap-3">
                <CheckCircle size={16} className="mt-1 shrink-0 text-brand" />
                <p>Comandă minimă <strong>50 lei</strong> pentru Baia Mare și zona metropolitană.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle size={16} className="mt-1 shrink-0 text-brand" />
                <p>Comandă minimă <strong>300 lei</strong> pentru celelalte localități.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle size={16} className="mt-1 shrink-0 text-brand" />
                <p>Confirmarea telefonică a comenzii este obligatorie înainte de livrare. Nu livrăm fără confirmare.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle size={16} className="mt-1 shrink-0 text-brand" />
                <p>Plata se efectuează exclusiv în numerar, la livrare, către reprezentantul nostru.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle size={16} className="mt-1 shrink-0 text-brand" />
                <p>La livrare se emite factură fiscală pe datele firmei dumneavoastră.</p>
              </div>
            </div>
          </section>

          <div className="rounded-lg border border-neutral-200 bg-white p-5 text-sm">
            <p className="font-black">Întrebări despre livrare?</p>
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
