import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { business } from "@/lib/data";

export default function TermeniConditiiPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-black">Termeni și Condiții</h1>
        <p className="mt-2 mb-10 text-neutral-500">Ultima actualizare: Ianuarie 2026</p>

        <div className="space-y-8 text-sm leading-7 text-neutral-700">
          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">1. Informații generale</h2>
            <p>
              {business.name} este un distribuitor engros de produse alimentare congelate, cu sediul în {business.address}, {business.region}, CUI {business.cui}.
              Prin accesarea și utilizarea acestui site, confirmați că ați citit, înțeles și acceptat prezentele Termeni și Condiții.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">2. Destinatarii serviciilor</h2>
            <p>
              Serviciile noastre sunt destinate exclusiv persoanelor juridice (firme, restaurante, cantine, magazine, etc.).
              Efectuăm livrări către persoane fizice. Prin plasarea unei comenzi, confirmați că acționați în calitate de reprezentant al unei entități comerciale.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">3. Produse și prețuri</h2>
            <p>
              Toate prețurile afișate pe site sunt prețuri de catalog engros, exprimate în lei (RON) și includ TVA.
              Ne rezervăm dreptul de a modifica prețurile fără notificare prealabilă. Prețul final aplicat comenzii va fi cel confirmat telefonic de către reprezentantul nostru.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">4. Procesul de comandă</h2>
            <p>
              Comenzile plasate prin site au caracter de rezervare și nu sunt considerate confirmate până la contactul telefonic din partea reprezentantului {business.name}.
              Ne rezervăm dreptul de a refuza sau anula orice comandă din motive obiective (stoc insuficient, zonă de livrare neacoperită, comandă sub minimul admis etc.).
            </p>
            <p className="mt-2">Comanda minimă este de <strong>50 lei</strong> pentru Baia Mare și <strong>300 lei</strong> pentru celelalte zone de livrare.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">5. Livrare</h2>
            <p>
              Livrarea se efectuează exclusiv cu mijloacele de transport proprii ale {business.name}, pe rutele și în zilele stabilite.
              Data și ora livrării vor fi comunicate telefonic la confirmarea comenzii. Nu garantăm livrarea la o oră exactă, ci în cadrul zilei de livrare stabilite.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">6. Plata</h2>
            <p>
              Plata se efectuează la livrare, direct către reprezentantul nostru. Acceptăm numerar, transfer bancar
              și alte modalități electronice de plată, toate achitate în momentul livrării.
              Nu acceptăm plăți prin intermediul site-ului și nici plăți la termen.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">7. Proprietate intelectuală</h2>
            <p>
              Toate conținuturile acestui site (texte, imagini, logo, structură) sunt proprietatea {business.name} și sunt protejate de legile dreptului de autor.
              Reproducerea sau utilizarea fără acordul scris este interzisă.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">8. Contact</h2>
            <p>
              Pentru orice întrebări legate de prezentele Termeni și Condiții ne puteți contacta la:
            </p>
            <ul className="mt-2 space-y-1">
              <li>Telefon: <a href={business.phoneHref} className="font-bold text-brand hover:underline">{business.phone}</a> / <a href={business.phoneHref2} className="font-bold text-brand hover:underline">{business.phone2}</a></li>
              <li>Email: <a href={`mailto:${business.email}`} className="font-bold text-brand hover:underline">{business.email}</a></li>
              <li>Adresă: {business.address}</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
