import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { isAdminPending } from "@/lib/adminAuth";
import { verifyAdminOtp } from "../actions";

export default async function AdminTwoFactorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await isAdminPending())) redirect("/admin");

  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-12">
      <section className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <Link href="/" className="mb-8 block text-center">
          <div className="text-2xl font-black text-brand">1000&amp;1</div>
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">Admin produse</div>
        </Link>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-brand">
          <ShieldCheck size={22} />
        </div>
        <h1 className="text-center text-2xl font-black">Verificare in 2 pasi</h1>
        <p className="mb-6 mt-2 text-center text-sm text-neutral-500">
          Am trimis un cod de 6 cifre pe adresa de email a adminului. Introdu-l mai jos.
        </p>
        {params.error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            Cod gresit sau expirat. Incearca din nou.
          </div>
        )}
        <form action={verifyAdminOtp} className="space-y-4">
          <label className="block text-sm font-semibold">
            Cod de verificare
            <input
              name="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              autoComplete="one-time-code"
              placeholder="000000"
              className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-3 text-center text-2xl font-black tracking-[0.5em] outline-none focus:border-brand"
            />
          </label>
          <button className="w-full rounded-lg bg-brand py-3 font-black text-white hover:bg-brand-dark">
            Verifica codul
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-neutral-500">Codul expira in 10 minute.</p>
      </section>
    </main>
  );
}
