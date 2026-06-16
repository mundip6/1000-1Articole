import Link from "next/link";
import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { loginAdmin } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect("/admin/products");
  }

  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-12">
      <section className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <Link href="/" className="mb-8 block text-center">
          <div className="text-2xl font-black text-brand">1000&1</div>
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">Admin produse</div>
        </Link>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-brand">
          <LockKeyhole size={22} />
        </div>
        <h1 className="text-center text-2xl font-black">Operator admin</h1>
        <p className="mb-6 mt-2 text-center text-sm text-neutral-500">Conectare pentru adaugare si modificare produse.</p>
        {params.error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            Parola este gresita.
          </div>
        )}
        <form action={loginAdmin} className="space-y-4">
          <label className="block text-sm font-semibold">
            Parola admin
            <input
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-3 outline-none focus:border-brand"
            />
          </label>
          <button className="w-full rounded-lg bg-brand py-3 font-black text-white hover:bg-brand-dark">
            Intra in admin
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-neutral-500">
          Parola implicita este <strong>admin123</strong>. Schimb-o cu variabila <strong>ADMIN_PASSWORD</strong>.
        </p>
      </section>
    </main>
  );
}
