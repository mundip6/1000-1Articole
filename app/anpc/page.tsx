import { ExternalLink, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { business } from "@/lib/data";

export default function AnpcPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-black">ANPC — Protecția Consumatorilor</h1>
        <p className="mt-2 mb-10 text-neutral-500">Informații despre drepturile dumneavoastră și autoritățile de protecție a consumatorilor.</p>

        <div className="space-y-6">
          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-black">
              <ShieldCheck size={20} className="text-brand" /> Autoritatea Națională pentru Protecția Consumatorilor
            </h2>
            <p className="text-sm leading-7 text-neutral-600">
              ANPC este instituția publică ce are ca scop protejarea drepturilor și intereselor consumatorilor
              din România. Dacă aveți o problemă nerezolvată cu un comerciant, puteți depune o sesizare la ANPC.
            </p>
            <a
              href="https://anpc.ro"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
            >
              Vizitați anpc.ro <ExternalLink size={14} />
            </a>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-black">Soluționarea Online a Litigiilor (SOL)</h2>
            <p className="text-sm leading-7 text-neutral-600">
              Platforma europeană SOL (Online Dispute Resolution) permite soluționarea extrajudiciară a disputelor
              dintre consumatori și comercianți din Uniunea Europeană.
            </p>
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-bold hover:border-brand hover:text-brand"
            >
              Platforma SOL <ExternalLink size={14} />
            </a>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-black">Rezolvăm problemele direct</h2>
            <p className="text-sm leading-7 text-neutral-600">
              Înainte de a contacta ANPC, vă încurajăm să ne contactați direct. Depunem toate eforturile pentru
              a rezolva orice nemulțumire rapid și amiabil.
            </p>
            <div className="mt-4 space-y-1 text-sm">
              <p>Telefon: <a href={business.phoneHref} className="font-bold text-brand hover:underline">{business.phone}</a> / <a href={business.phoneHref2} className="font-bold text-brand hover:underline">{business.phone2}</a></p>
              <p>Email: <a href={`mailto:${business.email}`} className="font-bold text-brand hover:underline">{business.email}</a></p>
              <p>Program: Luni–Vineri, 08:00–15:30</p>
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-black">Date companie</h2>
            <div className="space-y-1 text-sm text-neutral-600">
              <p><strong>Denumire:</strong> {business.name}</p>
              <p><strong>CUI:</strong> {business.cui}</p>
              <p><strong>Sediu:</strong> {business.address}, {business.region}</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
