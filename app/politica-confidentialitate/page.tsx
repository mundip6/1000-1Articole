import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { business } from "@/lib/data";

export default function PoliticaConfidentialitatePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-black">Politică de Confidențialitate</h1>
        <p className="mt-2 mb-10 text-neutral-500">Ultima actualizare: Ianuarie 2026</p>

        <div className="space-y-8 text-sm leading-7 text-neutral-700">
          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">1. Operatorul de date</h2>
            <p>
              {business.name}, cu sediul în {business.address}, {business.region}, CUI {business.cui},
              este operatorul datelor cu caracter personal colectate prin intermediul acestui site, în conformitate cu Regulamentul (UE) 2016/679 (GDPR).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">2. Ce date colectăm</h2>
            <p>Colectăm următoarele date în momentul plasării unei comenzi sau creării unui cont:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Denumirea firmei și CUI</li>
              <li>Numele persoanei de contact</li>
              <li>Număr de telefon</li>
              <li>Adresă de email</li>
              <li>Adresă de livrare (județ, localitate, stradă)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">3. Scopul prelucrării</h2>
            <p>Datele colectate sunt utilizate exclusiv pentru:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Procesarea și confirmarea comenzilor</li>
              <li>Comunicarea cu clientul privind livrarea</li>
              <li>Emiterea documentelor fiscale (facturi)</li>
              <li>Îmbunătățirea serviciilor noastre</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">4. Temeiul juridic</h2>
            <p>
              Prelucrarea datelor se realizează pe baza executării contractului (Art. 6(1)(b) GDPR) — procesarea comenzii dumneavoastră —
              și a obligațiilor legale (Art. 6(1)(c) GDPR) — emiterea documentelor contabile.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">5. Durata stocării</h2>
            <p>
              Datele aferente comenzilor sunt păstrate pe durata impusă de legislația fiscală în vigoare (10 ani pentru documentele contabile).
              Datele conturilor de client inactive pot fi șterse la cerere, cu excepția celor necesare pentru obligații legale.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">6. Drepturile dumneavoastră</h2>
            <p>Conform GDPR, aveți dreptul la:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Acces la datele personale stocate</li>
              <li>Rectificarea datelor incorecte</li>
              <li>Ștergerea datelor („dreptul de a fi uitat"), în limitele legii</li>
              <li>Portabilitatea datelor</li>
              <li>Opoziție față de prelucrare</li>
            </ul>
            <p className="mt-2">
              Pentru exercitarea acestor drepturi contactați-ne la <a href={`mailto:${business.email}`} className="font-bold text-brand hover:underline">{business.email}</a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">7. Securitatea datelor</h2>
            <p>
              Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele dumneavoastră împotriva accesului neautorizat, pierderii sau distrugerii.
              Nu vindem, închiriem sau transmitem datele dumneavoastră unor terți în scopuri comerciale.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">8. Contact și reclamații</h2>
            <p>
              Pentru orice întrebări legate de prelucrarea datelor personale, ne puteți contacta la {business.email}.
              Aveți de asemenea dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP) — <strong>anspdcp.eu</strong>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
