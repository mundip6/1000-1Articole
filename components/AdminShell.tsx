import Link from "next/link";
import { LogOut, MessageCircle, Package, ShoppingBag } from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";

export default function AdminShell({
  title,
  description,
  active,
  children,
}: {
  title: string;
  description: string;
  active: "products" | "orders" | "conversations";
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-neutral-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <Link href="/" className="text-sm font-bold text-brand hover:underline">Inapoi la site</Link>
              <h1 className="mt-2 text-3xl font-black">{title}</h1>
              <p className="text-sm text-neutral-500">{description}</p>
            </div>
            <form action={logoutAdmin}>
              <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-bold hover:border-brand hover:text-brand">
                <LogOut size={16} /> Iesire
              </button>
            </form>
          </div>
          <nav className="mt-5 flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
            <Link
              href="/admin/products"
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-black ${active === "products" ? "bg-brand text-white" : "border border-neutral-200 hover:border-brand hover:text-brand"}`}
            >
              <Package size={16} /> Produse
            </Link>
            <Link
              href="/admin/orders"
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-black ${active === "orders" ? "bg-brand text-white" : "border border-neutral-200 hover:border-brand hover:text-brand"}`}
            >
              <ShoppingBag size={16} /> Comenzi
            </Link>
            <Link
              href="/admin/conversations"
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-black ${active === "conversations" ? "bg-brand text-white" : "border border-neutral-200 hover:border-brand hover:text-brand"}`}
            >
              <MessageCircle size={16} /> Conversatii
            </Link>
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}
