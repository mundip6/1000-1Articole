import Link from "next/link";
import { ChevronRight, ClipboardList, Phone, ShoppingCart, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  { icon: ShoppingCart, num: "01", title: "Alegeti produsele", desc: "Navigati prin catalog, selectati cantitatile dorite si adaugati produsele in cos." },
  { icon: ClipboardList, num: "02", title: "Completati datele firmei", desc: "Introduceti denumirea firmei, persoana de contact, telefonul, emailul si adresa de livrare." },
  { icon: Phone, num: "03", title: "Confirmam comanda", desc: "Va contactam in aceeasi zi, in timpul programului, pentru disponibilitate si data livrarii." },
  { icon: Truck, num: "04", title: "Livram la sediul dvs.", desc: "Livram in Maramures, Satu Mare si Salaj. Produsele ajung proaspete si conforme." },
];

const faq = [
  ["Care este comanda minima?", "Comanda minima este 50 lei pentru Baia Mare si 300 lei pentru celelalte zone de livrare."],
  ["Unde livrati?", "Livram in:\n Satu Mare: Satu Mare, Negrești, Livada, Turț\n Maramureș: Ulmeni, Șomcuta, Borșa, Moisei, Seini, Vișeu, Valea Izei, Sighet, Ocna Șugatag, Cavnic, Tg Lăpuș, Copalnic\n Sălaj: Jibou, Cehu Silvaniei, Zalău, Șimleul Silvaniei, Ileanda\n Bistrița-Năsăud: Beclean\n Cluj: Dej"],
  ["Cand se efectueaza livrarile?", "🗓️ Marți\n Traseul Principal 1: Jibou • Cehu Silvaniei • Ulmeni • Șomcuta\n Traseul Principal 2: Borșa ➔ Moisei ➔ Valea Izei\n\n 🗓️ Miercuri\n Traseul Principal 1: Seini ➔ Negrești • Livada • Turț • Satu Mare\n Traseul Principal 2: Vișeu ➔ Valea Izei\n\n 🗓️ Joi\n Traseul Principal: Zalău • Șimleul Silvaniei\n Traseul Principal 2: Sighet ➔ Ocna Șugatag ➔ Cavnic\n\n 🗓️ Vineri\n Traseul Principal 1: Dej • Beclean • Ileanda\n Traseul Principal 2: Târgu Lăpuș ➔ Copalnic"],
  ["Pot plasa comanda telefonic?", "Da, ne puteti contacta la +40 750 266 304 in timpul programului."],
  ["Care este programul de lucru?", "Luni-Vineri: 08:00-15:30. Sambata si duminica: inchis."],
];

export default function OrderGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-black">Cum plasezi o comanda</h1>
        <p className="mt-2 text-neutral-500">Procesul nostru este simplu si rapid. Urmati pasii de mai jos.</p>
        <div className="my-12 grid gap-6 md:grid-cols-2">
          {steps.map((step) => (
            <article key={step.num} className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-brand">
                <step.icon size={22} />
              </div>
              <div>
                <div className="mb-1 text-xs font-black text-brand">Pasul {step.num}</div>
                <h2 className="mb-2 font-black">{step.title}</h2>
                <p className="text-sm leading-6 text-neutral-500">{step.desc}</p>
              </div>
            </article>
          ))}
        </div>
        <section className="mb-12 rounded-lg border border-red-100 bg-red-50 p-6">
          <h2 className="mb-4 text-xl font-black">Conditii de comanda</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><ChevronRight size={16} className="text-brand" /> Comanda minima: <strong>50 lei Baia Mare / 300 lei alte zone</strong></li>
            <li className="flex gap-2"><ChevronRight size={16} className="text-brand" /> Zone de livrare: <strong>Maramures, Satu Mare, Salaj</strong></li>
            <li className="flex gap-2"><ChevronRight size={16} className="text-brand" /> Preturile includ TVA si pot fi confirmate telefonic.</li>
            <li className="flex gap-2"><ChevronRight size={16} className="text-brand" /> Confirmare telefonica obligatorie inainte de livrare.</li>
          </ul>
        </section>
        <h2 className="mb-6 text-2xl font-black">Intrebari frecvente</h2>
        <div className="mb-12 space-y-4">
          {faq.map(([q, a]) => (
            <article key={q} className="rounded-lg border border-neutral-200 bg-white p-5">
              <h3 className="mb-2 font-black">{q}</h3>
              <p className="text-sm text-neutral-500 whitespace-pre-line">{a}</p>
            </article>
          ))}
        </div>
        <div className="text-center">
          <Link href="/catalog" className="inline-flex items-center gap-2 rounded-lg bg-brand px-8 py-3 font-black text-white hover:bg-brand-dark">
            <ShoppingCart size={16} /> Incepe sa comanzi
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
