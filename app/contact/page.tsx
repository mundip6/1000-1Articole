import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { business } from "@/lib/data";

const program = [
  ["Luni", "08:00 - 15:30"],
  ["Marti", "08:00 - 15:30"],
  ["Miercuri", "08:00 - 15:30"],
  ["Joi", "08:00 - 15:30"],
  ["Vineri", "08:00 - 15:30"],
  ["Sambata", "Inchis"],
  ["Duminica", "Inchis"],
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-black">Contact</h1>
        <p className="mt-2 mb-10 text-neutral-500">Suntem disponibili in timpul programului pentru orice intrebare sau comanda.</p>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <section className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="mb-4 font-black">Date de Contact</h2>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-brand" />
                  <div>
                    <div className="mb-1 text-xs font-black uppercase text-neutral-500">Adresa</div>
                    <div>{business.address}</div>
                    <div className="text-xs text-neutral-500">{business.region}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-brand" />
                  <div>
                    <div className="mb-1 text-xs font-black uppercase text-neutral-500">Telefon</div>
                    <a href={business.phoneHref} className="block font-bold hover:text-brand">{business.phone}</a>
                    <a href={business.phoneHref2} className="block font-bold hover:text-brand">{business.phone2}</a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail size={18} className="mt-0.5 shrink-0 text-brand" />
                  <div>
                    <div className="mb-1 text-xs font-black uppercase text-neutral-500">Email</div>
                    <a href={`mailto:${business.email}`} className="hover:text-brand">{business.email}</a>
                  </div>
                </div>
              </div>
              <div className="mt-5 border-t border-neutral-200 pt-4 text-xs text-neutral-500">CUI: {business.cui}</div>
            </section>
            <section className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 font-black"><Clock size={16} className="text-brand" /> Program de Lucru</h2>
              <div className="space-y-2 text-sm">
                {program.map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-neutral-500">{day}</span>
                    <strong className={hours === "Inchis" ? "text-brand" : "text-neutral-900"}>{hours}</strong>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <iframe
              title="Locatie 1000&1 Articole Baia Mare"
              src="https://maps.google.com/maps?q=47.6473448,23.5417647&z=18&output=embed"
              className="h-full min-h-[420px] w-full"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
