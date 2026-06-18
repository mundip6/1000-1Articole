import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { business } from "@/lib/data";

const infoLinks = [
  { href: "/termeni-conditii", label: "Termeni și Condiții" },
  { href: "/politica-confidentialitate", label: "Politică de Confidențialitate" },
  { href: "/politica-retur", label: "Politică de Retur" },
  { href: "/modalitati-plata", label: "Modalități de Plată" },
  { href: "/informatii-companie", label: "Informații Companie" },
  { href: "/politica-livrare", label: "Politică Livrare" },
  { href: "/anpc", label: "ANPC" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-neutral-950 px-4 pt-12 text-neutral-300">
      <div className="mx-auto grid max-w-6xl gap-10 pb-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-xl font-black text-white">{business.name}</div>
          <div className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Distributie engros</div>
          <p className="text-sm leading-6">
            Distribuitor engros de produse din carne carne, peste si semipreparate pentru Maramures, Satu Mare si Salaj.
            Calitate garantata, livrare rapida.
          </p>
          <p className="mt-5 text-xs text-neutral-500">CUI: {business.cui}</p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-white">Contact</h3>
          <div className="space-y-3 text-sm">
            <p className="flex gap-2"><MapPin size={16} className="text-brand" /> {business.address}</p>
            <a className="flex gap-2 hover:text-white" href={business.phoneHref}><Phone size={16} className="text-brand" /> {business.phone}</a>
            <a className="flex gap-2 hover:text-white" href={business.phoneHref2}><Phone size={16} className="text-brand" /> {business.phone2}</a>
            <a className="flex gap-2 hover:text-white" href={`mailto:${business.email}`}><Mail size={16} className="text-brand" /> {business.email}</a>
            <p className="text-xs text-neutral-500">Zone de livrare: {business.delivery}</p>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-white">Program</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center justify-between gap-3"><span className="flex gap-2"><Clock size={16} className="text-brand" /> Luni - Vineri</span><strong>08:00 - 15:30</strong></p>
            <p className="flex items-center justify-between gap-3"><span>Sambata</span><strong className="text-brand">Inchis</strong></p>
            <p className="flex items-center justify-between gap-3"><span>Duminica</span><strong className="text-brand">Inchis</strong></p>
          </div>
          <div className="mt-5 border-t border-neutral-800 pt-5 text-sm">
            Comanda minima: <strong className="text-white">50 lei Baia Mare</strong> / <strong className="text-white">300 lei alte zone</strong>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-white">Informații utile</h3>
          <ul className="space-y-2.5 text-sm">
            {infoLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        © 2026 1000&1 Articole. Toate drepturile rezervate.
      </div>
    </footer>
  );
}
