import Link from "next/link";
import { LucideIcon } from "lucide-react";

export default function AuthShell({
  icon: Icon,
  title,
  subtitle,
  children,
  footer,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-12">
      <section className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <Link href="/" className="mb-8 block text-center">
          <div className="text-2xl font-black text-brand">1000&1</div>
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">Articole Engros</div>
        </Link>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-brand">
          <Icon size={22} />
        </div>
        <h1 className="text-center text-2xl font-black">{title}</h1>
        <p className="mb-8 mt-2 text-center text-sm text-neutral-500">{subtitle}</p>
        {children}
        <div className="mt-6 text-center text-sm text-neutral-500">{footer}</div>
      </section>
    </main>
  );
}
