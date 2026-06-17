import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { business } from "@/lib/data";

export default function PoliticaReturPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-black">Politică de Retur</h1>
        <p className="mt-2 mb-10 text-neutral-500">Ultima actualizare: Ianuarie 2026</p>

        <div className="space-y-8 text-sm leading-7 text-neutral-700">
          <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
            <p className="font-bold text-amber-800">
              Produsele comercializate de {business.name} sunt produse alimentare congelate cu lanț de frig controlat.
              Din motive de siguranță alimentară și igienă, returul produselor după acceptarea livrării nu este posibil,
              cu excepțiile menționate mai jos.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">1. Refuzul la livrare</h2>
            <p>
              Clientul are dreptul de a refuza integral sau parțial o livrare în momentul recepției, dacă constată:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Produse cu ambalaj deteriorat sau deschis</li>
              <li>Produse neconforme cu comanda confirmată (produs greșit, cantitate greșită)</li>
              <li>Produse cu semne vizibile de decongelare sau deteriorare</li>
              <li>Discrepanțe față de documentele de livrare</li>
            </ul>
            <p className="mt-2">
              Refuzul se face în prezența curierului, care va nota produsele refuzate. Nu se acceptă reclamații privind cantitățile sau produsele după plecarea curierului.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">2. Produse acceptate la livrare</h2>
            <p>
              Odată acceptate și semnate, produsele alimentare nu pot fi returnate. Aceasta este o cerință legală
              impusă de normele de siguranță alimentară în vigoare (Regulamentul CE 852/2004).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">3. Reclamații calitative</h2>
            <p>
              Dacă descoperiți un defect de calitate al produsului după desigilare (defect ascuns, corp străin, miros anormal),
              vă rugăm să ne contactați în cel mult <strong>24 de ore</strong> de la livrare, cu:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Fotografie clară a produsului și ambalajului</li>
              <li>Numărul comenzii sau data livrării</li>
              <li>Descrierea problemei</li>
            </ul>
            <p className="mt-2">
              Fiecare caz va fi analizat individual și soluționat prin înlocuirea produsului la următoarea livrare sau credit pe comanda viitoare.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">4. Anularea comenzii</h2>
            <p>
              O comandă poate fi anulată până în ziua anterioară livrării confirmate, prin contactarea noastră telefonică.
              Anulările în ziua livrării pot să nu fie posibile dacă produsele au fost deja pregătite și încărcate pentru transport.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-black text-neutral-900">5. Contact reclamații</h2>
            <ul className="space-y-1">
              <li>Telefon: <a href={business.phoneHref} className="font-bold text-brand hover:underline">{business.phone}</a> / <a href={business.phoneHref2} className="font-bold text-brand hover:underline">{business.phone2}</a></li>
              <li>Email: <a href={`mailto:${business.email}`} className="font-bold text-brand hover:underline">{business.email}</a></li>
              <li>Program: Luni–Vineri, 08:00–15:30</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
