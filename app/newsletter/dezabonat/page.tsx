import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/FooterServer";

export default function DezabonatPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mb-6 text-5xl">📧</div>
        <h1 className="mb-3 text-2xl font-black">Te-ai dezabonat</h1>
        <p className="mb-8 text-neutral-500">
          Adresa ta de email a fost eliminata din lista noastra de newsletter.<br/>
          Nu vei mai primi oferte sau noutati de la noi.
        </p>
        <Link href="/catalog" className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-black text-white hover:bg-brand-dark">
          Inapoi la catalog
        </Link>
      </main>
      <Footer />
    </div>
  );
}
